import { defaultBlueprint, defaultRubric, difficultyConfig, interviewerFor } from "../defaults";
import { createPrepSteps } from "../prep";
import type { PreparedPackage } from "../types";

const jd = `OpenAI is hiring Software Engineers to build and scale products, infrastructure, and internal tools around model deployment, evaluation, and reliable user-facing systems.

You will work on high-ambiguity problems, write production code, and partner with research and product. We look for people who can move from unclear problem statements to a testable plan, who are comfortable with incomplete information, and who can explain the risks in what they ship.`;

export const openaiPackage: PreparedPackage = {
  jobDescription: {
    raw: jd,
    identifiedRequirements: [
      "Production software engineering, not research-only",
      "Comfort with ambiguity and incomplete specifications",
      "Ability to partner across research, product, and infra",
      "Judgment about reliability and evaluation of model-backed systems",
    ],
    impliedExpectations: [
      "Candidates should reason about systems that are not fully deterministic",
      "Communication has to work with specialists who do not share your stack",
    ],
    senioritySignal: "Full-time software engineer — expected to drive a problem, not only complete a ticket.",
    ambiguities: [
      "The posting spans product, infra, and evaluation; team match is not specified in the email",
      "Bar on ML literacy vs general systems skill is not explicit",
    ],
  },
  company: {
    summary:
      "OpenAI builds and deploys frontier models and the products around them. Engineering work sits next to rapidly changing research, which raises the value of clear interfaces, evals, and operational discipline.",
    products: ["ChatGPT", "API platform", "Codex / developer tools", "Internal eval and deployment systems"],
    engineeringCulture: [
      "High ambiguity, high written context",
      "Ship behind measurements when the behavior is probabilistic",
      "Cross-functional pairing with research is normal, not ceremonial",
    ],
    recentSignals: [
      "Continued build-out of platform reliability and developer surfaces",
      "Email invite referenced a generalist SWE screen rather than a specialist ML role",
    ],
  },
  roleIndustry: {
    typicalLoop: [
      "Recruiter / hiring manager screen",
      "Coding and problem-solving",
      "System design or architecture conversation",
      "Behavioral / collaboration, sometimes with a research partner",
    ],
    marketExpectations: [
      "Engineers who can bound an unclear problem",
      "Willingness to talk about evaluation, not only features",
    ],
  },
  interviewIntelligence: {
    commonFormats: [
      "Practical coding with discussion of tests and failure",
      "Design of a user-facing or platform system with model components",
      "Behavioral questions about disagreement and prioritization",
    ],
    reportedEmphases: [
      "Dealing with non-determinism",
      "Making a plan when requirements are incomplete",
      "Clear communication under time pressure",
    ],
    pitfalls: [
      "Treating the model as a magic reliable dependency",
      "Over-indexing on architecture fashion instead of a testable slice",
    ],
  },
  sources: {
    official: 4,
    professional: 5,
    interviewReports: 7,
    entries: [
      { id: "o1", title: "OpenAI careers — software engineer", kind: "official", note: "Role family and expectations" },
      { id: "o2", title: "API platform documentation", kind: "official", note: "Product constraints" },
      { id: "o3", title: "Published reliability / safety notes", kind: "official", note: "Eval language" },
      { id: "o4", title: "Interview scheduling email", kind: "official", note: "Detected loop: 45m mixed" },
      { id: "o5", title: "Loop compilations — SWE 2025", kind: "professional", note: "Stage mix" },
      { id: "o6", title: "Platform engineering writeups", kind: "professional", note: "How teams talk about evals" },
      { id: "o7", title: "Industry comparison — AI lab SWE loops", kind: "professional", note: "Where this loop differs from FAANG" },
      { id: "o8", title: "Hiring manager AMAs", kind: "professional", note: "Ambiguity tolerance" },
      { id: "o9", title: "Compensation / level notes", kind: "professional", note: "Seniority calibration" },
      { id: "o10", title: "Candidate report — design a chat backend", kind: "interview_report", note: "Common design prompt family" },
      { id: "o11", title: "Candidate report — flaky evals", kind: "interview_report", note: "Non-determinism follow-up" },
      { id: "o12", title: "Behavioral disagreement notes", kind: "interview_report", note: "Research partner conflict" },
      { id: "o13", title: "Coding-with-discussion reports", kind: "interview_report", note: "Less leetcode, more reasoning" },
      { id: "o14", title: "Rejected themes", kind: "interview_report", note: "Unable to bound the problem" },
      { id: "o15", title: "Strong-hire themes", kind: "interview_report", note: "Testable milestones" },
      { id: "o16", title: "Recruiter clarifications", kind: "interview_report", note: "Generalist vs applied-research" },
    ],
  },
  competencies: [
    {
      id: "problem_solving",
      name: "Problem Solving",
      weight: 25,
      description: "Turn an under-specified prompt into a bounded, testable plan.",
      rationale: "Email and reports agree the screen rewards framing, not trivia.",
      priority: "High",
    },
    {
      id: "systems",
      name: "System Reasoning",
      weight: 25,
      description: "Design a slice of a model-backed product with explicit failure handling.",
      rationale: "Full-time SWE loops at AI labs keep a serious design conversation.",
      priority: "High",
    },
    {
      id: "backend",
      name: "Backend Engineering",
      weight: 20,
      description: "APIs, queues, storage, and operational sense.",
      rationale: "The posting is a software seat, not a research residency.",
      priority: "High",
    },
    {
      id: "communication",
      name: "Technical Communication",
      weight: 15,
      description: "Explain risk and plan to mixed audiences.",
      rationale: "The work is cross-functional by default.",
      priority: "Medium",
    },
    {
      id: "ownership",
      name: "Ownership",
      weight: 10,
      description: "Drive a problem when the spec will not arrive fully formed.",
      rationale: "Ambiguity is the environment, not an edge case.",
      priority: "Supporting",
    },
    {
      id: "collaboration",
      name: "Behavioral / Collaboration",
      weight: 5,
      description: "Disagree productively with research and product partners.",
      rationale: "Reports include a dedicated collaboration probe.",
      priority: "Supporting",
    },
  ],
  blueprint: defaultBlueprint(45),
  questions: [
    {
      id: "openai_intro",
      stage: "Introduction",
      competencyIds: ["communication", "ownership"],
      prompt:
        "Start with a recent piece of work where the goal was unclear at the beginning. How did you decide what 'done' meant?",
      guidedCue: "I am listening for how you bounded the problem, not for a company history.",
      barRaiserConstraint: "If you cannot name what you cut, we will stay there.",
      followUps: {
        short: "What did you explicitly decide not to do?",
        vague: "Who decided the success metric, and what would have made you change it?",
        assumption: "You treated the first request as the real requirement. When did that stop being true?",
        strong: "What measurement told you the unclear goal had actually been met?",
        solid: "How did you communicate the remaining risk to whoever owned the outcome?",
      },
    },
    {
      id: "openai_tech",
      stage: "Technical",
      competencyIds: ["backend", "problem_solving"],
      prompt:
        "You own an API that calls a model. p95 latency just doubled and 2% of requests now return empty. Walk me through how you investigate — in order.",
      guidedCue: "Think about what you look at first versus what you change first.",
      barRaiserConstraint: "Do not restart the service as step one. I want an investigation, not a ritual.",
      followUps: {
        short: "What are the first three signals you would pull, and why that order?",
        vague: "How do you tell a model-quality regression from an infra regression?",
        assumption: "You assumed the model is guilty. What would falsify that?",
        strong: "Good. How do you keep investigating without making the outage worse?",
        solid: "What would you ship in the first hour that is reversible?",
      },
    },
    {
      id: "openai_design",
      stage: "System Design",
      competencyIds: ["systems", "backend"],
      prompt:
        "Design a service that takes a user prompt, calls a model, and stores the conversation. I want the request path, what you persist, and how you handle a model that is slow or wrong.",
      guidedCue: "A first version can be small. Say what you are leaving out.",
      barRaiserConstraint:
        "I will hold you to evaluation: if you cannot say how you know the system is degrading, the design is incomplete.",
      followUps: {
        short: "Where does conversation state live, and what is the consistency requirement?",
        vague: "What do you do when the model times out after you have already streamed tokens to the user?",
        assumption: "You assumed one model, one region. What breaks first when that is false?",
        strong: "How would you compare two model versions without exposing users to a silent quality drop?",
        solid: "Which part of this would you implement first if you had a week?",
      },
    },
    {
      id: "openai_behavior",
      stage: "Behavioral",
      competencyIds: ["collaboration"],
      prompt:
        "Tell me about a time you disagreed with a researcher, PM, or tech lead about whether something was good enough to ship.",
      guidedCue: "I want the disagreement and the decision, not a morality play.",
      barRaiserConstraint: "If nobody changed their mind and nothing shipped differently, pick another story.",
      followUps: {
        short: "What evidence did you bring, and what evidence did they bring?",
        vague: "What did you actually do after the meeting?",
        assumption: "You assumed you were right. What would have convinced you otherwise?",
        strong: "How did the relationship work the following week?",
        solid: "Would you make the same call now?",
      },
    },
    {
      id: "openai_questions",
      stage: "Candidate Questions",
      competencyIds: ["communication"],
      prompt: "Your questions. Ask about the work, the team, or how engineering quality is judged here.",
      guidedCue: "Questions about evals, on-call, or how research and engineering share ownership are useful.",
      barRaiserConstraint: "Skip anything answered by a blog post.",
      followUps: {
        short: "Ask me one question about how this team knows a release is safe.",
        vague: "What decision are you trying to make?",
        assumption: "That assumes research sets the roadmap unilaterally. Why?",
        strong: "What answer would change whether you want the role?",
        solid: "Last question if you have one.",
      },
    },
  ],
  difficultyConfig: difficultyConfig("REALISTIC"),
  rubric: defaultRubric(),
  interviewer: interviewerFor("OpenAI", "Software Engineer"),
  evaluator: {
    stance: "Score a full-time SWE screen for an AI product/platform team. Reward bounded plans and operational honesty.",
    rules: [
      "Ambiguity handling is a first-class competency.",
      "Do not require ML publications.",
      "Penalize designs that ignore evaluation and latency.",
    ],
  },
  uncertainties: {
    items: [
      "Email did not name the team; session assumes a generalist product/platform seat.",
      "ML-depth expectation may be higher for some orgs than this package assumes.",
    ],
  },
  designRationale: [
    {
      title: "System Reasoning",
      priority: "High",
      explanation:
        "A full-time OpenAI SWE screen almost always includes a design conversation around a model-backed path. The session is built to watch how you bound that system.",
    },
    {
      title: "Problem Solving",
      priority: "High",
      explanation:
        "The scheduling email and reports emphasize incomplete problem statements. We will not over-specify the prompts.",
    },
    {
      title: "Backend Engineering",
      priority: "High",
      explanation:
        "This is a software role. Investigation order, state, and timeouts matter more than model trivia.",
    },
    {
      title: "Ownership under ambiguity",
      priority: "Medium",
      explanation:
        "The posting is explicit: unclear problems are the default. Behavioral time is reserved for that, not generic teamwork slogans.",
    },
  ],
  prepSteps: createPrepSteps(3),
};
