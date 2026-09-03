import { classifyAnswer } from "./interview-engine";
import { scoreLabel } from "./format";
import type {
  AssistanceLevel,
  CompetencyScore,
  EvaluationReport,
  InterviewSession,
} from "./types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function assistancePenalty(level: AssistanceLevel): number {
  if (level === "Light hint") return 0.08;
  if (level === "Clarification only") return 0.03;
  return 0;
}

export function buildEvaluation(session: InterviewSession): EvaluationReport {
  const answers = session.runtime.messages.filter((message) => message.role === "candidate");
  const signals = answers.map((message) => classifyAnswer(message.text));

  let score = 2.45;
  for (const signal of signals) {
    if (signal === "strong") score += 0.18;
    else if (signal === "solid") score += 0.08;
    else if (signal === "assumption") score -= 0.06;
    else if (signal === "vague") score -= 0.1;
    else if (signal === "short") score -= 0.16;
  }

  for (const entry of session.runtime.assistanceLog) {
    score -= assistancePenalty(entry.level);
  }

  if (answers.length < 3) score -= 0.25;
  score = round1(clamp(score, 1.6, 3.8));

  const excerpts = answers
    .map((message) => message.text.trim())
    .filter((text) => text.length > 0)
    .slice(0, 6);

  const strongest: EvaluationReport["strongestMoments"] = [];
  const misses: EvaluationReport["biggestMisses"] = [];

  answers.forEach((message, index) => {
    const signal = signals[index];
    const snippet = message.text.trim().replace(/\s+/g, " ");
    const clipped = snippet.length > 220 ? `${snippet.slice(0, 217)}…` : snippet;
    if (signal === "strong" && strongest.length < 3) {
      strongest.push({
        title: `Specific mechanism in ${message.stage.toLowerCase()}`,
        evidence: `The candidate said: “${clipped}” That is usable evidence — named constraints, not atmosphere.`,
      });
    }
    if ((signal === "short" || signal === "vague" || signal === "assumption") && misses.length < 3) {
      misses.push({
        title:
          signal === "assumption"
            ? "Uncosted guarantee"
            : `Thin ${message.stage.toLowerCase()} answer`,
        evidence:
          signal === "short"
            ? `Answer was too short to score: “${clipped || "(empty)"}” The interviewer had to pull.`
            : `“${clipped}” did not name a mechanism, an alternative, or a way to verify.`,
      });
    }
  });

  if (strongest.length === 0) {
    strongest.push({
      title: "Showed up and answered in sequence",
      evidence:
        "The candidate completed turns without abandoning the interview. That is not yet a hire signal; it is the floor.",
    });
  }
  if (misses.length === 0) {
    misses.push({
      title: "Limited depth on verification",
      evidence:
        excerpts[0]
          ? `Answers stayed plausible but rarely said how they would know it worked. First answer began: “${excerpts[0].slice(0, 160)}”`
          : "Not enough transcript to find a distinctive miss — itself a miss.",
    });
  }

  const competencyScores: CompetencyScore[] = session.package.competencies.map((competency, index) => {
    const drift = ((index % 3) - 1) * 0.12;
    const related = answers.filter((message) => {
      const question = session.package.questions.find((item) => item.id === message.questionId);
      return question?.competencyIds.includes(competency.id);
    });
    const relatedSignals = related.map((message) => classifyAnswer(message.text));
    let competencyScore = score + drift;
    if (relatedSignals.includes("strong")) competencyScore += 0.15;
    if (relatedSignals.includes("short")) competencyScore -= 0.2;
    competencyScore = round1(clamp(competencyScore, 1.5, 3.9));
    return {
      competencyId: competency.id,
      name: competency.name,
      score: competencyScore,
      note:
        related.length === 0
          ? "Little direct evidence in this transcript; inferred from adjacent answers."
          : relatedSignals.includes("strong")
            ? "Direct evidence in the transcript — named a mechanism or tradeoff."
            : relatedSignals.includes("short")
              ? "Prompted more than once; evidence remains thin."
              : "Adequate evidence; not yet distinctive.",
    };
  });

  const weakest = [...competencyScores].sort((a, b) => a.score - b.score)[0];
  const assistanceUsed = session.runtime.assistanceLog.filter((entry) => entry.level !== "Independent").length;

  const narrative = [
    `${session.metadata.company} ${session.metadata.role} — ${scoreLabel(score).toLowerCase()} at ${score.toFixed(1)}.`,
    answers.length < 3
      ? "The transcript is short; this evaluation is capped because there is not enough evidence to support a stronger read."
      : `The candidate answered ${answers.length} turns. ${signals.filter((item) => item === "strong").length} were specific enough to use as evidence.`,
    assistanceUsed
      ? `The interviewer provided assistance on ${assistanceUsed} question${assistanceUsed === 1 ? "" : "s"}; that is logged and prevents a clean 'independent' read.`
      : "Assistance was minimal; most questions were handled independently.",
    weakest
      ? `The weakest dimension is ${weakest.name}. That is the highest-leverage place to practice next.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    overallScore: score,
    overallLabel: scoreLabel(score),
    narrative,
    competencyScores,
    strongestMoments: strongest,
    biggestMisses: misses,
    assistanceLog: session.runtime.assistanceLog,
    raiseScore: [
      "Name the mechanism before the slogan — keys, state, and what you do when you cannot tell what happened.",
      "Say what you will not promise, and what that costs the customer.",
      "Close answers with how you would verify: a test, a metric, or a residual risk.",
      weakest
        ? `Rebuild one story or design specifically around ${weakest.name.toLowerCase()}.`
        : "Practice one complete design with failure modes before features.",
    ].slice(0, 4),
    nextPracticeFocus: weakest
      ? `${weakest.name}: run a shorter guided session that only stresses this dimension until answers include a mechanism and a check.`
      : "Run another realistic session and force every answer to include a verification step.",
    weakestCompetencyId: weakest?.competencyId,
  };
}
