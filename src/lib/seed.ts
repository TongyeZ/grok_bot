import { datadogEvaluation, datadogPackage } from "./data/datadog";
import { openaiPackage } from "./data/openai";
import { stripePackage } from "./data/stripe";
import { emptyRuntime } from "./defaults";
import type { InterviewSession } from "./types";

export const STRIPE_ID = "session_stripe";
export const OPENAI_ID = "session_openai";
export const DATADOG_ID = "session_datadog";

export function createSeedSessions(): InterviewSession[] {
  const stripe: InterviewSession = {
    metadata: {
      id: STRIPE_ID,
      company: "Stripe",
      role: "Software Engineer Intern",
      status: "READY",
      difficulty: "REALISTIC",
      durationMinutes: 45,
      interviewDate: "2026-09-10",
      interviewType: "Mixed",
      createdFromEmail: false,
      createdAt: "2026-09-01T15:04:00.000Z",
    },
    package: stripePackage,
    runtime: emptyRuntime(45),
  };

  const openai: InterviewSession = {
    metadata: {
      id: OPENAI_ID,
      company: "OpenAI",
      role: "Software Engineer",
      status: "PREPARING",
      difficulty: "REALISTIC",
      durationMinutes: 45,
      interviewDate: "2026-09-15",
      interviewType: "Mixed",
      createdFromEmail: true,
      createdAt: "2026-09-03T18:12:00.000Z",
    },
    package: {
      ...openaiPackage,
      questions: openaiPackage.questions.map((question) => ({
        ...question,
        followUps: { ...question.followUps },
      })),
    },
    runtime: emptyRuntime(45),
  };

  const datadog: InterviewSession = {
    metadata: {
      id: DATADOG_ID,
      company: "Datadog",
      role: "Backend Engineer",
      status: "COMPLETED",
      difficulty: "REALISTIC",
      durationMinutes: 60,
      interviewDate: "2026-08-28",
      interviewType: "Mixed",
      createdFromEmail: false,
      createdAt: "2026-08-20T11:00:00.000Z",
    },
    package: datadogPackage,
    runtime: {
      ...emptyRuntime(60),
      startedAt: "2026-08-28T16:00:00.000Z",
      endedAt: "2026-08-28T17:02:00.000Z",
      remainingSeconds: 0,
      currentStage: "Candidate Questions",
      currentQuestionIndex: datadogPackage.questions.length,
    },
    evaluation: datadogEvaluation,
  };

  return [openai, stripe, datadog];
}
