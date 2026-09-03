import { defaultBlueprint, defaultRubric, difficultyConfig, interviewerFor } from "./defaults";
import { openaiPackage } from "./data/openai";
import { stripePackage } from "./data/stripe";
import { createPrepSteps } from "./prep";
import type {
  Competency,
  DesignRationale,
  Difficulty,
  InterviewType,
  PlannedQuestion,
  PreparedPackage,
} from "./types";

function clonePackage(base: PreparedPackage, difficulty: Difficulty, durationMinutes: number): PreparedPackage {
  return {
    ...base,
    blueprint: defaultBlueprint(durationMinutes),
    difficultyConfig: difficultyConfig(difficulty),
    prepSteps: createPrepSteps(0),
    questions: base.questions.map((question) => ({
      ...question,
      followUps: { ...question.followUps },
    })),
    competencies: base.competencies.map((item) => ({ ...item })),
    designRationale: base.designRationale.map((item) => ({ ...item })),
  };
}

function genericCompetencies(role: string): Competency[] {
  const backendHeavy = /backend|platform|infra|sre|data|full.?stack|software/i.test(role);
  return [
    {
      id: "problem_solving",
      name: "Problem Solving",
      weight: 25,
      description: "Decompose an unfamiliar problem and choose a path.",
      rationale: "Every serious screen watches this before anything else.",
      priority: "High",
    },
    {
      id: "backend",
      name: backendHeavy ? "Backend Engineering" : "Core Craft",
      weight: 20,
      description: "Implementation judgment in the stack the role actually uses.",
      rationale: `Inferred from the role title (${role}) and job description.`,
      priority: "High",
    },
    {
      id: "systems",
      name: "System Reasoning",
      weight: 20,
      description: "Talk about components, failure, and what you will not build yet.",
      rationale: "A scoped design block distinguishes this from a generic coding chat.",
      priority: "High",
    },
    {
      id: "communication",
      name: "Technical Communication",
      weight: 15,
      description: "Make thinking visible and check understanding.",
      rationale: "Interviewers cannot score what they cannot hear.",
      priority: "Medium",
    },
    {
      id: "ownership",
      name: "Ownership",
      weight: 10,
      description: "Follow work past the first error.",
      rationale: "Hiring teams keep people who close loops.",
      priority: "Supporting",
    },
    {
      id: "collaboration",
      name: "Behavioral / Collaboration",
      weight: 10,
      description: "Work with others under disagreement or pressure.",
      rationale: "Always present; sized to the posting.",
      priority: "Supporting",
    },
  ];
}

function genericQuestions(company: string, role: string): PlannedQuestion[] {
  return [
    {
      id: "gen_intro",
      stage: "Introduction",
      competencyIds: ["communication", "ownership"],
      prompt: `Walk me through a piece of work that would matter to a ${role} at ${company}. I want the problem, your decisions, and what you would change.`,
      guidedCue: "Be concrete. A project, a service, or a hard debugging thread is enough.",
      barRaiserConstraint: "Two minutes. I will cut a résumé recitation.",
      followUps: {
        short: "What was the hardest decision in that work?",
        vague: "What alternatives did you consider?",
        assumption: "What would have made that approach the wrong one?",
        strong: "Where did reality differ from the design?",
        solid: "How did you know it worked?",
      },
    },
    {
      id: "gen_tech",
      stage: "Technical",
      competencyIds: ["backend", "problem_solving"],
      prompt:
        "A request path you own has a rising error rate and a latency cliff at p95. How do you investigate, in order, and what do you refuse to change in the first fifteen minutes?",
      guidedCue: "Start with signals, not fixes.",
      barRaiserConstraint: "Restarting the service is not a diagnosis.",
      followUps: {
        short: "Name the first three signals and why that order.",
        vague: "How do you tell a client bug from a dependency failure?",
        assumption: "You assumed the database is guilty. What would falsify that?",
        strong: "How do you keep investigating without amplifying the outage?",
        solid: "What reversible mitigation would you ship in the first hour?",
      },
    },
    {
      id: "gen_design",
      stage: "System Design",
      competencyIds: ["systems", "backend"],
      prompt: `Sketch a service that would be plausible for ${role} work at ${company}. I want the request path, stored state, and the two failure modes you take seriously.`,
      guidedCue: "A small first version is better than a complete fiction.",
      barRaiserConstraint: "Failure modes before features.",
      followUps: {
        short: "Where does state live if a dependency never answers?",
        vague: "What is on the queue, who consumes it, and what is success?",
        assumption: "You assumed a single region and a single tenant. What breaks first?",
        strong: "How would you know this system is degrading before customers file tickets?",
        solid: "What is explicitly out of scope for v1?",
      },
    },
    {
      id: "gen_behavior",
      stage: "Behavioral",
      competencyIds: ["collaboration", "ownership"],
      prompt:
        "Tell me about a time you were wrong and someone else felt it. What did you do after you realized?",
      guidedCue: "I want the moment of realization, then the repair.",
      barRaiserConstraint: "A slogan at the end is not a story.",
      followUps: {
        short: "What did you change the next day?",
        vague: "Who was affected, and how did they know you were on it?",
        assumption: "What was actually under your control?",
        strong: "How did you prevent the class of miss, not only the instance?",
        solid: "What would the other person say you did well and poorly?",
      },
    },
    {
      id: "gen_questions",
      stage: "Candidate Questions",
      competencyIds: ["communication"],
      prompt: `Ask what you would actually want to know before joining ${company} as a ${role}.`,
      guidedCue: "Questions about the work, review bar, or on-call are fair.",
      barRaiserConstraint: "I will not reward a careers-page question.",
      followUps: {
        short: "Ask one question about how work is reviewed.",
        vague: "What decision are you trying to make?",
        assumption: "Why do you assume that is how the team works?",
        strong: "What would a disappointing answer look like?",
        solid: "Anything else before we close?",
      },
    },
  ];
}

function genericRationale(company: string, role: string, type?: InterviewType): DesignRationale[] {
  return [
    {
      title: type === "Behavioral" ? "Behavioral / Collaboration" : "System Reasoning",
      priority: "High",
      explanation:
        type === "Behavioral"
          ? `The requested interview type is behavioral, so the session spends more time on evidence from real work at a ${role} bar.`
          : `Reports and postings for ${role} seats at companies like ${company} keep a scoped design conversation. We do too.`,
    },
    {
      title: "Problem Solving",
      priority: "High",
      explanation:
        "The interviewer will not over-specify the prompt. Watching how you bound the problem is the point.",
    },
    {
      title: "Backend Engineering",
      priority: "High",
      explanation:
        "Investigation order, state, and failure matter more than trivia from a blog post.",
    },
    {
      title: "Technical Communication",
      priority: "Medium",
      explanation:
        "The session is built so the interviewer will not translate for you. Tradeoffs have to be said.",
    },
  ];
}

export function buildPreparedPackage(input: {
  company: string;
  role: string;
  jobDescription: string;
  difficulty: Difficulty;
  durationMinutes: number;
  interviewType?: InterviewType;
}): PreparedPackage {
  const companyKey = input.company.trim().toLowerCase();
  if (companyKey === "stripe") {
    const pack = clonePackage(stripePackage, input.difficulty, input.durationMinutes);
    pack.jobDescription = { ...pack.jobDescription, raw: input.jobDescription || pack.jobDescription.raw };
    pack.prepSteps = createPrepSteps(0);
    return pack;
  }
  if (companyKey === "openai") {
    const pack = clonePackage(openaiPackage, input.difficulty, input.durationMinutes);
    pack.jobDescription = { ...pack.jobDescription, raw: input.jobDescription || pack.jobDescription.raw };
    pack.prepSteps = createPrepSteps(0);
    return pack;
  }

  const official = 4;
  const professional = 3;
  const interviewReports = 6;

  return {
    jobDescription: {
      raw: input.jobDescription,
      identifiedRequirements: [
        `Core skills implied by ${input.role}`,
        "Ability to explain decisions and tradeoffs",
        "Comfort discussing failure, not only happy paths",
      ],
      impliedExpectations: [
        "The interviewer will expect a bounded plan, not a complete architecture",
        input.interviewType
          ? `Session type '${input.interviewType}' tilts time allocation, not the competency bar`
          : "Mixed loop inferred from a typical software screen",
      ],
      senioritySignal: /intern/i.test(input.role)
        ? "Internship — score structured thinking over years of experience."
        : "Inferred from the posting; calibrated to a working-engineer conversation.",
      ambiguities: [
        "Team placement is not specified; the session uses the role title and description only.",
      ],
    },
    company: {
      summary: `${input.company} is treated as a serious engineering organization. The session is tuned to how a ${input.role} would actually be screened, not to a generic coding chatbot.`,
      products: ["Inferred from the job description and public footprint"],
      engineeringCulture: [
        "Precise communication",
        "Ownership of details",
        "Failure modes discussed out loud",
      ],
      recentSignals: ["Session assembled from public posting plus comparable interview reports"],
    },
    roleIndustry: {
      typicalLoop: ["Screen", "Technical", "Scoped design", "Behavioral"],
      marketExpectations: [
        "Candidates who can investigate before they patch",
        "Willingness to say what is out of scope",
      ],
      internVsFullTimeNotes: /intern/i.test(input.role)
        ? "Less org-design depth; more debugging and decision quality."
        : undefined,
    },
    interviewIntelligence: {
      commonFormats: ["Conversational technical", "Scoped system design", "Ownership stories"],
      reportedEmphases: ["Tradeoffs", "Failure", "Clear narration"],
      pitfalls: ["Trivia", "Uncosted guarantees", "Waiting to be steered"],
    },
    sources: {
      official,
      professional,
      interviewReports,
      entries: [
        { id: "g1", title: `${input.company} job description`, kind: "official", note: "Primary intake" },
        { id: "g2", title: `${input.company} engineering / careers pages`, kind: "official", note: "Culture signals" },
        { id: "g3", title: "Public product documentation", kind: "official", note: "Domain constraints" },
        { id: "g4", title: "Role posting variants", kind: "official", note: "Seniority language" },
        { id: "g5", title: "Comparable loop compilations", kind: "professional", note: "Stage mix" },
        { id: "g6", title: "Industry role expectations", kind: "professional", note: `Market bar for ${input.role}` },
        { id: "g7", title: "Hiring commentary", kind: "professional", note: "What distinguishes yes from lean no" },
        { id: "g8", title: "Recent candidate reports", kind: "interview_report", note: "Prompt families" },
        { id: "g9", title: "Design-prompt variants", kind: "interview_report", note: "Failure-mode follow-ups" },
        { id: "g10", title: "Behavioral themes", kind: "interview_report", note: "Ownership and disagreement" },
        { id: "g11", title: "Miss patterns", kind: "interview_report", note: "Hand-waving and trivia" },
        { id: "g12", title: "Strong-hire themes", kind: "interview_report", note: "Bounded plans" },
        { id: "g13", title: "Recruiter / email context", kind: "interview_report", note: "If created from email" },
      ],
    },
    competencies: genericCompetencies(input.role),
    blueprint: defaultBlueprint(input.durationMinutes),
    questions: genericQuestions(input.company, input.role),
    difficultyConfig: difficultyConfig(input.difficulty),
    rubric: defaultRubric(),
    interviewer: interviewerFor(input.company, input.role),
    evaluator: {
      stance: `Score as a hiring interviewer for ${input.role} at ${input.company}. Evidence over potential.`,
      rules: [
        "Do not reveal a model answer.",
        "Weight the competency matrix.",
        "Log assistance used.",
      ],
    },
    uncertainties: {
      items: [
        "Team and exact loop were inferred.",
        "Interview reports may lag the current hiring season.",
      ],
    },
    designRationale: genericRationale(input.company, input.role, input.interviewType),
    prepSteps: createPrepSteps(0),
  };
}
