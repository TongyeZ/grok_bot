import type {
  AnswerSignal,
  AssistanceLevel,
  Difficulty,
  InterviewSession,
  PlannedQuestion,
  TranscriptMessage,
} from "./types";
import { uid } from "./format";

const STRONG_RE =
  /idempoten|retry|timeout|consistency|latency|throughput|backpressure|cardinality|slo|sla|queue|observab|metric|trade-?off|constraint|partition|tenant|falsif|reversible|residual|at-least-once|exactly-once|at-most-once/i;

const VAGUE_RE = /^(i think|maybe|not sure|something like|i guess|probably just)/i;
const ASSUMPTION_RE = /\b(always|never|obviously|just use|simply|guaranteed|exactly-once)\b/i;

export function classifyAnswer(text: string): AnswerSignal {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  if (words < 12) return "short";
  if (VAGUE_RE.test(trimmed) || words < 22) return "vague";
  if (ASSUMPTION_RE.test(trimmed) && !STRONG_RE.test(trimmed)) return "assumption";
  if (STRONG_RE.test(trimmed) && words > 36) return "strong";
  return "solid";
}

export function composePrompt(question: PlannedQuestion, difficulty: Difficulty): string {
  if (difficulty === "GUIDED" && question.guidedCue) {
    return `${question.prompt} ${question.guidedCue}`;
  }
  if (difficulty === "BAR_RAISER" && question.barRaiserConstraint) {
    return `${question.prompt} ${question.barRaiserConstraint}`;
  }
  return question.prompt;
}

export function followUpFor(question: PlannedQuestion, signal: AnswerSignal): string {
  return question.followUps[signal];
}

export function assistanceForTurn(args: {
  difficulty: Difficulty;
  signal?: AnswerSignal;
  isFollowUp: boolean;
  usedGuidedCue: boolean;
}): AssistanceLevel {
  if (args.difficulty === "GUIDED" && (args.usedGuidedCue || args.signal === "short" || args.signal === "vague")) {
    return "Light hint";
  }
  if (args.isFollowUp && (args.signal === "vague" || args.signal === "short")) {
    return "Clarification only";
  }
  if (args.difficulty === "BAR_RAISER") return "Independent";
  if (args.usedGuidedCue) return "Clarification only";
  return "Independent";
}

export function openingMessage(session: InterviewSession): TranscriptMessage {
  const question = session.package.questions[0];
  const text = question
    ? composePrompt(question, session.metadata.difficulty)
    : "Let’s begin. Tell me about a recent piece of work and the decisions you made.";
  return {
    id: uid("msg"),
    role: "interviewer",
    text,
    stage: question?.stage ?? "Introduction",
    questionId: question?.id,
    assistance: assistanceForTurn({
      difficulty: session.metadata.difficulty,
      isFollowUp: false,
      usedGuidedCue: session.metadata.difficulty === "GUIDED" && Boolean(question?.guidedCue),
    }),
    at: new Date().toISOString(),
  };
}

export function nextInterviewerMessage(
  session: InterviewSession,
  answer: string,
): { message: TranscriptMessage; done: boolean; questionIndex: number; awaitingFollowUp: boolean } {
  const questions = session.package.questions;
  const index = session.runtime.currentQuestionIndex;
  const current = questions[index];
  const signal = classifyAnswer(answer);

  if (current && !session.runtime.awaitingFollowUp) {
    const follow = followUpFor(current, signal);
    return {
      message: {
        id: uid("msg"),
        role: "interviewer",
        text: follow,
        stage: current.stage,
        questionId: current.id,
        assistance: assistanceForTurn({
          difficulty: session.metadata.difficulty,
          signal,
          isFollowUp: true,
          usedGuidedCue: false,
        }),
        at: new Date().toISOString(),
      },
      done: false,
      questionIndex: index,
      awaitingFollowUp: true,
    };
  }

  const nextIndex = index + 1;
  const next = questions[nextIndex];
  if (!next) {
    return {
      message: {
        id: uid("msg"),
        role: "interviewer",
        text: "That covers the ground I needed. We’ll stop here so the evaluator can review the transcript.",
        stage: "Candidate Questions",
        assistance: "Independent",
        at: new Date().toISOString(),
      },
      done: true,
      questionIndex: nextIndex,
      awaitingFollowUp: false,
    };
  }

  return {
    message: {
      id: uid("msg"),
      role: "interviewer",
      text: composePrompt(next, session.metadata.difficulty),
      stage: next.stage,
      questionId: next.id,
      assistance: assistanceForTurn({
        difficulty: session.metadata.difficulty,
        isFollowUp: false,
        usedGuidedCue: session.metadata.difficulty === "GUIDED" && Boolean(next.guidedCue),
      }),
      at: new Date().toISOString(),
    },
    done: false,
    questionIndex: nextIndex,
    awaitingFollowUp: false,
  };
}

export function displayQuestion(text: string): string {
  return text.length > 90 ? `${text.slice(0, 87).trim()}…` : text;
}
