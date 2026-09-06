import { defaultBlueprint, defaultRubric, difficultyConfig, interviewerFor } from "../defaults";
import { createPrepSteps } from "../prep";
import type { EvaluationReport, PreparedPackage } from "../types";

const jd = `Datadog is hiring Backend Engineers to build high-throughput ingestion, query, and storage systems for metrics, traces, and logs.

You will work on distributed systems, performance, and reliability. Experience with streaming data, storage engines, or large-scale service ownership is valued. We look for engineers who can reason about tradeoffs in consistency, cardinality, and operational load, and who treat observability as part of the product — not an afterthought.`;

export const datadogPackage: PreparedPackage = {
  jobDescription: {
    raw: jd,
    identifiedRequirements: [
      "Backend / distributed systems engineering",
      "Comfort with high-throughput data paths",
      "Performance and reliability ownership",
      "Ability to discuss consistency and cardinality tradeoffs",
    ],
    impliedExpectations: [
      "Candidates have either run production systems or can reason as if they had",
      "Observability thinking is expected even when the prompt is not 'design metrics'",
    ],
    senioritySignal: "Mid-level backend — expected to drive design decisions inside a known problem space.",
    ambiguities: ["Exact product line (metrics vs traces vs logs) not specified in the original intake."],
  },
  company: {
    summary:
      "Datadog is an observability platform. Engineering culture is operational: cardinality, cost, failure domains, and whether you can debug the system you just designed.",
    products: ["Infrastructure Monitoring", "APM", "Logs", "RUM", "Security Monitoring"],
    engineeringCulture: [
      "Production ownership is normal",
      "Performance is a product feature",
      "Designs are expected to include how they will be operated",
    ],
    recentSignals: [
      "Continued growth in high-cardinality telemetry products",
      "Backend interviews remain systems-heavy",
    ],
  },
  roleIndustry: {
    typicalLoop: [
      "Technical screen",
      "Systems / backend deep dive",
      "Design of an ingestion or query path",
      "Behavioral ownership",
    ],
    marketExpectations: [
      "Clear talk about queues, storage, and backpressure",
      "Awareness of cardinality and cost",
    ],
  },
  interviewIntelligence: {
    commonFormats: [
      "Backend problem solving with complexity and failure",
      "Ingestion pipeline or metrics store design",
      "On-call / incident behavioral",
    ],
    reportedEmphases: [
      "Backpressure and load shedding",
      "How you would know the system is wrong",
      "Tradeoffs stated out loud",
    ],
    pitfalls: [
      "Designing an unbounded in-memory aggregator",
      "Ignoring multi-tenant noisy-neighbor effects",
    ],
  },
  sources: {
    official: 5,
    professional: 3,
    interviewReports: 6,
    entries: [
      { id: "d1", title: "Datadog backend job description", kind: "official", note: "Throughput and reliability language" },
      { id: "d2", title: "Datadog engineering blog — ingestion", kind: "official", note: "Public systems writing" },
      { id: "d3", title: "Product docs — custom metrics", kind: "official", note: "Cardinality as product constraint" },
      { id: "d4", title: "Careers engineering page", kind: "official", note: "Ownership model" },
      { id: "d5", title: "Public incident language", kind: "official", note: "How they discuss outages" },
      { id: "d6", title: "Systems interview compilations", kind: "professional", note: "Loop shape" },
      { id: "d7", title: "Observability industry notes", kind: "professional", note: "Common design traps" },
      { id: "d8", title: "Leveling notes", kind: "professional", note: "Mid vs staff expectations" },
      { id: "d9", title: "Candidate report — metrics ingestion", kind: "interview_report", note: "Primary design family" },
      { id: "d10", title: "Candidate report — backpressure", kind: "interview_report", note: "Follow-up pattern" },
      { id: "d11", title: "On-call behavioral reports", kind: "interview_report", note: "Incident stories" },
      { id: "d12", title: "Strong-hire examples", kind: "interview_report", note: "Operability in the first design" },
      { id: "d13", title: "Miss patterns", kind: "interview_report", note: "Hand-wavy consistency" },
      { id: "d14", title: "Query-path variants", kind: "interview_report", note: "Alternate prompts" },
    ],
  },
  competencies: [
    {
      id: "systems",
      name: "System Reasoning",
      weight: 30,
      description: "Design ingestion and query paths with explicit tradeoffs.",
      rationale: "This is the center of the Datadog backend interview.",
      priority: "High",
    },
    {
      id: "backend",
      name: "Backend Engineering",
      weight: 25,
      description: "Concurrency, storage, and service implementation judgment.",
      rationale: "The role ships and owns backend systems.",
      priority: "High",
    },
    {
      id: "problem_solving",
      name: "Problem Solving",
      weight: 20,
      description: "Debug and bound performance problems.",
      rationale: "Screens include an investigation-style technical conversation.",
      priority: "High",
    },
    {
      id: "communication",
      name: "Technical Communication",
      weight: 10,
      description: "State tradeoffs before being asked.",
      rationale: "Staff interviewers stop candidates who only narrate components.",
      priority: "Medium",
    },
    {
      id: "ownership",
      name: "Ownership",
      weight: 10,
      description: "Operate what you build.",
      rationale: "On-call stories are a consistent part of the loop.",
      priority: "Supporting",
    },
    {
      id: "collaboration",
      name: "Behavioral / Collaboration",
      weight: 5,
      description: "Work across product lines without losing the customer.",
      rationale: "Present, but secondary to systems depth for this role.",
      priority: "Supporting",
    },
  ],
  blueprint: defaultBlueprint(60),
  questions: [
    {
      id: "dd_intro",
      stage: "Introduction",
      competencyIds: ["communication", "ownership"],
      prompt:
        "Give me a concise tour of a backend system you owned. I want the traffic shape, the failure you worry about, and how you knew it was healthy.",
      followUps: {
        short: "What was the SLO, even if it was informal?",
        vague: "When it broke, what was the first dashboard you opened?",
        assumption: "You said it was 'highly available.' What actually happened during the last incident?",
        strong: "What would you change in that system if cardinality grew 10×?",
        solid: "Who got paged, and was that the right person?",
      },
    },
    {
      id: "dd_tech",
      stage: "Technical",
      competencyIds: ["backend", "problem_solving"],
      prompt:
        "An ingestion worker's memory climbs without bound over a few hours, then the box OOMs. How do you investigate, and what are the likely causes in a metrics pipeline?",
      followUps: {
        short: "Where do you look first — process, runtime, or pipeline state?",
        vague: "What kind of metric or tag explosion would produce this shape?",
        assumption: "You assumed a leak. How would a legitimate backlog look different?",
        strong: "How do you shed load without dropping the wrong tenants?",
        solid: "What instrumentation would you have wanted before this incident?",
      },
    },
    {
      id: "dd_design",
      stage: "System Design",
      competencyIds: ["systems", "backend"],
      prompt:
        "Design the write path for custom metrics: agents emit points, we must ingest them, store them, and make recent data queryable. Talk through bottlenecks and what you refuse to promise.",
      followUps: {
        short: "What is your unit of partitioning, and why?",
        vague: "How do you handle a tenant that suddenly sends 100× the tag combinations?",
        assumption: "You promised exactly-once. Walk me through the cost of that promise.",
        strong: "Where does this design lie to the user, and is that lie documented?",
        solid: "What do you monitor on this path besides 'requests per second'?",
      },
    },
    {
      id: "dd_behavior",
      stage: "Behavioral",
      competencyIds: ["ownership", "collaboration"],
      prompt:
        "Tell me about an incident you were in — even if you did not cause it. I want your actions in the first thirty minutes and what you changed after.",
      followUps: {
        short: "What did you communicate, and to whom, before you had a root cause?",
        vague: "What was the customer impact in concrete terms?",
        assumption: "You assumed the playbook was enough. What did the playbook miss?",
        strong: "What residual risk did you accept when you closed the incident?",
        solid: "How did you make sure the fix was not just a comment in Slack?",
      },
    },
    {
      id: "dd_questions",
      stage: "Candidate Questions",
      competencyIds: ["communication"],
      prompt: "Your turn. Ask about the team, the on-call, or the parts of the stack that are still painful.",
      followUps: {
        short: "Ask me something about how this team handles cardinality growth.",
        vague: "What would a useful answer change for you?",
        assumption: "Why do you assume on-call is the only ownership model?",
        strong: "That question is close to the work. What would a bad answer be?",
        solid: "Anything else?",
      },
    },
  ],
  difficultyConfig: difficultyConfig("REALISTIC"),
  rubric: defaultRubric(),
  interviewer: interviewerFor("Datadog", "Backend Engineer"),
  evaluator: {
    stance: "Score a mid-level Datadog backend loop. Operability and tradeoffs outrank completeness.",
    rules: [
      "Reward candidates who mention cardinality, tenants, and backpressure unprompted.",
      "Penalize exactly-once promises without cost.",
      "Incident stories must include communication, not only debugging.",
    ],
  },
  uncertainties: {
    items: ["Team (metrics vs traces) was inferred from the posting's ingestion language."],
  },
  designRationale: [
    {
      title: "System Design",
      priority: "High",
      explanation:
        "Backend loops at Datadog are built around ingestion and query paths. The session reserves the largest block of time for that conversation.",
    },
    {
      title: "Backend Engineering",
      priority: "High",
      explanation:
        "The OOM / memory-growth probe is drawn from how this team talks about real pipeline failures.",
    },
    {
      title: "Ownership",
      priority: "Medium",
      explanation:
        "On-call is not a side quest. A candidate who can design but not operate is a miss for this role.",
    },
  ],
  prepSteps: createPrepSteps(7),
};

export const datadogEvaluation: EvaluationReport = {
  overallScore: 3.1,
  overallLabel: "Yes",
  narrative:
    "A credible mid-level backend performance. The candidate treated observability as part of the product, sequenced the memory investigation like someone who has been on-call, and kept the custom-metrics design inside real constraints (tenants, cardinality, what not to promise). The miss is consistency: they asserted a stronger delivery guarantee than the design could support, and needed a clarification before they priced that promise. Communication was clear. Collaboration evidence was thinner than the systems work. This is a yes for a backend seat that will own an ingestion surface; I would not yet put them on a staff-shaped design review without another data point on tradeoff honesty.",
  competencyScores: [
    {
      competencyId: "systems",
      name: "System Reasoning",
      score: 3.2,
      note: "Solid write-path decomposition. Partitioning story was real. Consistency claim ran ahead of the design.",
    },
    {
      competencyId: "backend",
      name: "Backend Engineering",
      score: 3.3,
      note: "OOM investigation order was disciplined: process signals, then pipeline state, then tenant explosion.",
    },
    {
      competencyId: "problem_solving",
      name: "Problem Solving",
      score: 3.1,
      note: "Bounded the incident before changing code. Needed one nudge to separate leak from backlog.",
    },
    {
      competencyId: "communication",
      name: "Technical Communication",
      score: 3.0,
      note: "Named bottlenecks out loud. Occasionally skipped the 'what we will not promise' sentence until asked.",
    },
    {
      competencyId: "ownership",
      name: "Ownership",
      score: 2.9,
      note: "Incident story had real actions in the first thirty minutes; residual risk was underspecified.",
    },
    {
      competencyId: "collaboration",
      name: "Behavioral / Collaboration",
      score: 2.6,
      note: "Little evidence of working across teams during the incident beyond 'I posted in Slack.'",
    },
  ],
  strongestMoments: [
    {
      title: "Investigation order on the OOM",
      evidence:
        "Opened with runtime/process signals, then asked whether in-flight aggregation state could grow with unique tag combinations. That is the Datadog-shaped answer: they did not start at 'restart the pod.'",
    },
    {
      title: "Tenant isolation in the write path",
      evidence:
        "Proposed per-tenant admission control after describing a 100× tag burst, and said they would rather degrade one customer than the fleet. Specific, and correctly prioritized.",
    },
    {
      title: "Health of a previously owned system",
      evidence:
        "Gave an informal SLO (p99 ingest delay) and named the dashboard they would open first. This is evidence of having operated something, not only drawn it.",
    },
  ],
  biggestMisses: [
    {
      title: "Exactly-once promised too early",
      evidence:
        "On the write path they said 'exactly-once so customers never double-count.' After clarification they walked it back to at-least-once plus idempotent aggregation — but the first answer would have been expensive and was not costed.",
    },
    {
      title: "Residual risk after the incident",
      evidence:
        "The post-incident change was 'we added an alert.' They did not say what still could page, or what they accepted as remaining risk. Thin for a team that lives in residual risk.",
    },
    {
      title: "Cross-functional communication",
      evidence:
        "Could not name who outside engineering needed a customer-impact statement in the first thirty minutes. The story stayed inside the on-call channel.",
    },
  ],
  assistanceLog: [
    { questionId: "dd_intro", question: "Tour of a backend system you owned", level: "Independent" },
    {
      questionId: "dd_tech",
      question: "Ingestion worker memory climb / OOM",
      level: "Clarification only",
    },
    {
      questionId: "dd_design",
      question: "Custom metrics write path",
      level: "Clarification only",
    },
    { questionId: "dd_behavior", question: "Incident — first thirty minutes", level: "Independent" },
    { questionId: "dd_questions", question: "Candidate questions", level: "Independent" },
  ],
  raiseScore: [
    "Price consistency and delivery guarantees before naming them. 'Exactly-once' is a cost, not a virtue.",
    "Close incidents with residual risk and a change that is not only an alert.",
    "In behavioral answers, include who else needed information — support, customers, adjacent teams.",
    "State what the system will not promise as part of the first design pass, not as a follow-up.",
  ],
  nextPracticeFocus:
    "Delivery guarantees and cost: practice designing an ingestion path where you must choose at-least-once, at-most-once, or exactly-once and defend the customer-visible lie.",
  weakestCompetencyId: "collaboration",
};
