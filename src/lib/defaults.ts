import type {
  Difficulty,
  DifficultyConfiguration,
  EvaluationRubric,
  InterviewBlueprint,
  InterviewerBrief,
  InterviewRuntime,
  InterviewStage,
} from "./types";

export const STAGES: InterviewStage[] = [
  "Introduction",
  "Technical",
  "System Design",
  "Behavioral",
  "Candidate Questions",
];

export function difficultyConfig(difficulty: Difficulty): DifficultyConfiguration {
  if (difficulty === "GUIDED") {
    return {
      hints: "frequent",
      probing: "light",
      ambiguity: "low",
      independence: "supported",
    };
  }
  if (difficulty === "BAR_RAISER") {
    return {
      hints: "rare",
      probing: "deep",
      ambiguity: "high",
      independence: "high",
    };
  }
  return {
    hints: "occasional",
    probing: "moderate",
    ambiguity: "moderate",
    independence: "balanced",
  };
}

export function defaultBlueprint(durationMinutes: number): InterviewBlueprint {
  const intro = Math.max(4, Math.round(durationMinutes * 0.1));
  const technical = Math.round(durationMinutes * 0.28);
  const design = Math.round(durationMinutes * 0.28);
  const behavioral = Math.round(durationMinutes * 0.22);
  const questions = Math.max(4, durationMinutes - intro - technical - design - behavioral);

  return {
    stages: [
      {
        stage: "Introduction",
        minutes: intro,
        intent: "Establish context and how the candidate frames work.",
      },
      {
        stage: "Technical",
        minutes: technical,
        intent: "Probe concrete backend judgment under realistic constraints.",
      },
      {
        stage: "System Design",
        minutes: design,
        intent: "Test structured reasoning on a scoped production problem.",
      },
      {
        stage: "Behavioral",
        minutes: behavioral,
        intent: "Look for ownership, collaboration, and recovery from mistakes.",
      },
      {
        stage: "Candidate Questions",
        minutes: questions,
        intent: "See what the candidate chooses to inspect about the role.",
      },
    ],
    designNotes: [
      "Questions stay inside the target role. No trivia, no puzzle hunting.",
      "Follow-ups are earned: vague answers get clarification; strong answers get constraint.",
      "Scoring is withheld until a separate evaluator reviews the transcript.",
    ],
  };
}

export function defaultRubric(): EvaluationRubric {
  return {
    scoringNotes: [
      "Score 1–4 using evidence from the transcript, not inferred potential.",
      "Weight competencies according to the session matrix.",
      "Assistance used during the interview is logged and can cap a dimension.",
    ],
    evidenceRules: [
      "Quote or closely paraphrase the candidate’s words.",
      "Separate communication quality from technical correctness.",
      "Do not invent facts that were not said.",
    ],
  };
}

export function emptyRuntime(durationMinutes: number): InterviewRuntime {
  return {
    remainingSeconds: durationMinutes * 60,
    currentStage: "Introduction",
    currentQuestionIndex: 0,
    awaitingFollowUp: false,
    messages: [],
    assistanceLog: [],
    typing: false,
  };
}

export function interviewerFor(company: string, role: string): InterviewerBrief {
  const catalog: Record<string, InterviewerBrief> = {
    Stripe: {
      name: "Maya Chen",
      title: "Senior Engineer, Stripe",
      initials: "MC",
      persona:
        "Calm, precise, and allergic to hand-waving. Treats intern interviews as real engineering conversations.",
      rules: [
        "One question at a time.",
        "No coaching, no ideal answers, no scores during the session.",
        "Clarify vagueness. Challenge unsupported assumptions. Deepen strong answers.",
      ],
    },
    OpenAI: {
      name: "Jordan Hale",
      title: "Member of Technical Staff, OpenAI",
      initials: "JH",
      persona:
        "Direct and curious. Cares about how the candidate thinks when the problem is incompletely specified.",
      rules: [
        "Stay professional. Do not lecture.",
        "Prefer follow-ups over new topics when the last answer is thin.",
        "Never reveal the rubric or a model answer.",
      ],
    },
    Datadog: {
      name: "Priya Nair",
      title: "Staff Engineer, Datadog",
      initials: "PN",
      persona:
        "Operationally minded. Listens for observability, failure modes, and whether the candidate has run systems.",
      rules: [
        "Keep the conversation in production reality.",
        "Do not rescue the candidate unless difficulty is Guided.",
        "End cleanly when time or the blueprint is complete.",
      ],
    },
  };

  if (catalog[company]) return catalog[company];

  const last = company.replace(/[^A-Za-z]/g, " ").trim().split(/\s+/)[0] ?? "A";
  return {
    name: "Alex Romero",
    title: `Hiring interviewer, ${company}`,
    initials: `${last[0] ?? "A"}R`,
    persona: `A working engineer interviewing for ${role} at ${company}. Professional, specific, and uninterested in performance theater.`,
    rules: [
      "One question at a time.",
      "Adapt follow-ups to the answer just given.",
      "No coaching and no evaluation until the session ends.",
    ],
  };
}
