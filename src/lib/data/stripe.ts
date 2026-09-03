import { defaultBlueprint, defaultRubric, difficultyConfig, interviewerFor } from "../defaults";
import { createPrepSteps } from "../prep";
import type { PreparedPackage } from "../types";

const jd = `Stripe is looking for Software Engineer Interns to join payments, billing, and developer-platform teams.

You will write production-adjacent code, review designs with your mentor, and ship scoped projects that touch APIs, data models, and reliability. We look for people who reason from first principles, communicate clearly, and take ownership of messy details — retries, idempotency, and what happens when money is involved.

Requirements: strong CS fundamentals, comfort with at least one backend language, curiosity about distributed systems, and the ability to explain tradeoffs. Internship experience is not required; evidence of building and debugging real software is.`;

export const stripePackage: PreparedPackage = {
  jobDescription: {
    raw: jd,
    identifiedRequirements: [
      "CS fundamentals and at least one backend language",
      "Ability to reason about APIs, data models, and failure",
      "Clear written and verbal technical communication",
      "Ownership of details when correctness has financial impact",
    ],
    impliedExpectations: [
      "Interns are expected to discuss real tradeoffs, not recite definitions",
      "Mentorship exists, but candidates should not wait to be steered",
      "Payments context raises the bar on idempotency and auditability",
    ],
    senioritySignal: "Internship — high potential, still scored on structured thinking and judgment.",
    ambiguities: [
      "Team placement (payments vs billing vs developer platform) is not fixed",
      "Exact language stack is left open on purpose",
    ],
  },
  company: {
    summary:
      "Stripe builds economic infrastructure for the internet. Engineering culture prizes precise written communication, careful API design, and systems that remain correct when money, time, and retries collide.",
    products: ["Payments APIs", "Billing", "Connect", "Radar", "Treasury"],
    engineeringCulture: [
      "Writing is a first-class engineering artifact",
      "API surfaces are treated as long-term contracts",
      "Incidents are discussed in terms of customer impact and residual risk",
    ],
    recentSignals: [
      "Continued investment in programmable money movement and platform APIs",
      "Intern programs place students on production teams with scoped ownership",
    ],
  },
  roleIndustry: {
    typicalLoop: [
      "Recruiter screen",
      "Technical interview (problem solving + implementation judgment)",
      "System or API design at intern depth",
      "Behavioral / collaboration",
    ],
    marketExpectations: [
      "Interns who can decompose a problem without being given the algorithm name",
      "Comfort talking about correctness, not only happy-path code",
    ],
    internVsFullTimeNotes:
      "Less depth on large-scale org design; more depth on how the candidate debugs, writes, and asks for help.",
  },
  interviewIntelligence: {
    commonFormats: [
      "Conversational coding with discussion of edge cases",
      "Lightweight API or workflow design",
      "Behavioral stories about ownership and feedback",
    ],
    reportedEmphases: [
      "Idempotency and retry safety",
      "Explaining a solution as you go",
      "Curiosity about how payments systems fail",
    ],
    pitfalls: [
      "Jumping to code before restating constraints",
      "Treating retries as 'just try again'",
      "Unable to describe how they would verify a change",
    ],
  },
  sources: {
    official: 5,
    professional: 4,
    interviewReports: 8,
    entries: [
      { id: "s1", title: "Stripe intern job description", kind: "official", note: "Primary requirements and team scope" },
      { id: "s2", title: "Stripe engineering blog — API design", kind: "official", note: "Public design values" },
      { id: "s3", title: "Stripe docs: idempotency keys", kind: "official", note: "Canonical retry guidance" },
      { id: "s4", title: "Stripe about engineering", kind: "official", note: "Culture and writing norms" },
      { id: "s5", title: "Intern program overview", kind: "official", note: "Placement and mentorship model" },
      { id: "s6", title: "Levels.fyi intern loop notes", kind: "professional", note: "Typical intern stages" },
      { id: "s7", title: "Hiring manager commentary on intern bar", kind: "professional", note: "Judgment vs trivia" },
      { id: "s8", title: "Payments engineering primer", kind: "professional", note: "Industry failure modes" },
      { id: "s9", title: "Public API critique writeups", kind: "professional", note: "How Stripe APIs are discussed externally" },
      { id: "s10", title: "Intern report — payments team 2024", kind: "interview_report", note: "Retry + API design prompt" },
      { id: "s11", title: "Intern report — billing 2023", kind: "interview_report", note: "Data model questions" },
      { id: "s12", title: "New grad loop comparison", kind: "interview_report", note: "Where intern bar differs" },
      { id: "s13", title: "Behavioral ownership stories", kind: "interview_report", note: "Common follow-ups" },
      { id: "s14", title: "System design lite — checkout", kind: "interview_report", note: "Scoped design prompt" },
      { id: "s15", title: "Debugging interview notes", kind: "interview_report", note: "Log-first vs guess-first" },
      { id: "s16", title: "Candidate questions that landed well", kind: "interview_report", note: "What strong interns ask" },
      { id: "s17", title: "Rejected-loop themes", kind: "interview_report", note: "Hand-waving on money movement" },
    ],
  },
  competencies: [
    {
      id: "problem_solving",
      name: "Problem Solving",
      weight: 25,
      description: "Decompose an unfamiliar problem and choose a path under incomplete information.",
      rationale: "Intern interviews fail most often when candidates thrash or wait to be steered.",
      priority: "High",
    },
    {
      id: "backend",
      name: "Backend Engineering",
      weight: 20,
      description: "APIs, data, retries, and correctness in a service-oriented setting.",
      rationale: "The role writes production-adjacent backend code from week one.",
      priority: "High",
    },
    {
      id: "systems",
      name: "System Reasoning",
      weight: 20,
      description: "Reason about components, failure, and scale at intern-appropriate depth.",
      rationale: "Stripe's intern loop includes a scoped design conversation, not a campus puzzle.",
      priority: "High",
    },
    {
      id: "communication",
      name: "Technical Communication",
      weight: 15,
      description: "Make thinking visible. Name tradeoffs. Check understanding.",
      rationale: "Stripe treats writing and precise speech as engineering work.",
      priority: "Medium",
    },
    {
      id: "ownership",
      name: "Ownership",
      weight: 10,
      description: "Follow a problem past the first error message.",
      rationale: "Interns who close the loop are the ones teams keep.",
      priority: "Supporting",
    },
    {
      id: "collaboration",
      name: "Behavioral / Collaboration",
      weight: 10,
      description: "Work with a mentor, take feedback, and handle disagreement.",
      rationale: "Placement is onto real teams; collaboration is not decorative.",
      priority: "Supporting",
    },
  ],
  blueprint: defaultBlueprint(45),
  questions: [
    {
      id: "stripe_intro",
      stage: "Introduction",
      competencyIds: ["communication", "ownership"],
      prompt:
        "To start: briefly walk me through a piece of software you built or substantially changed. I want the problem, your decisions, and what you would do differently.",
      guidedCue: "A class project is fine if you can be specific about your decisions.",
      barRaiserConstraint: "Keep it to two minutes. I will interrupt if this stays at the résumé level.",
      followUps: {
        short: "That is too thin. What was the hardest decision you actually made in that project?",
        vague: "I am missing the decision. What alternatives did you consider, and why did you reject them?",
        assumption: "You said that approach was obvious. What would have made it the wrong choice?",
        strong: "Good. Where did that system behave differently in reality than in your original design?",
        solid: "What would you measure to know that change actually worked?",
      },
    },
    {
      id: "stripe_tech_retry",
      stage: "Technical",
      competencyIds: ["backend", "problem_solving"],
      prompt:
        "A checkout request times out after we have already sent a charge to the card network. The customer retries. How do you keep them from being charged twice, and how do you know?",
      guidedCue: "If it helps, start with what must be unique, then what the client and server each remember.",
      barRaiserConstraint:
        "Assume the timeout happened after the network authorized the charge. 'Just check the customer' is not sufficient.",
      followUps: {
        short: "I need a mechanism, not a slogan. What identifier makes a retry the same charge?",
        vague: "Who generates the idempotency key, where is it stored, and what happens if two workers see the retry?",
        assumption: "You assumed the first request failed. How do you act when you cannot tell?",
        strong: "If the key store is briefly unavailable, do you fail open or closed — and what is the customer impact?",
        solid: "How would you test this without charging a real card twice?",
      },
    },
    {
      id: "stripe_tech_api",
      stage: "Technical",
      competencyIds: ["backend", "communication"],
      prompt:
        "Design the request and response for an endpoint that refunds a payment. I care about the fields, the error cases, and what you would refuse to support in v1.",
      guidedCue: "Talk through the happy path first, then the failures a support engineer will hit.",
      barRaiserConstraint: "Do not invent a kitchen-sink API. I will push on every optional field.",
      followUps: {
        short: "List the required fields and one error you would return as a 409 versus a 400.",
        vague: "What does a partial refund look like, and how do you prevent refunding more than was captured?",
        assumption: "You treated refund as always possible. When is it not?",
        strong: "How does this endpoint behave if it is called twice with the same refund request?",
        solid: "What would you log so a support agent can explain the refund to a user?",
      },
    },
    {
      id: "stripe_design",
      stage: "System Design",
      competencyIds: ["systems", "problem_solving"],
      prompt:
        "Sketch a checkout service that accepts a payment, talks to a processor, and tells the merchant the result. Stay intern-scoped: components, data, and the two failure modes you worry about most.",
      guidedCue: "Boxes and arrows are enough. Start with the client, your service, and the processor.",
      barRaiserConstraint:
        "I want failure modes before features. If your happy path is pretty and your failure story is vague, we will stay on failure.",
      followUps: {
        short: "Name the components. Where does state live if the processor never answers?",
        vague: "You mentioned a queue. What is on the message, who consumes it, and what does success look like?",
        assumption: "You assumed the processor is the source of truth. What if our record and theirs disagree?",
        strong: "How would you detect that authorization latency just doubled, before merchants file tickets?",
        solid: "What do you explicitly out of scope for an intern-owned first version?",
      },
    },
    {
      id: "stripe_behavior",
      stage: "Behavioral",
      competencyIds: ["collaboration", "ownership"],
      prompt:
        "Tell me about a time you were wrong — a bug, a bad assumption, or a missed deadline — and someone else felt the impact. What did you do after you realized?",
      guidedCue: "I want the moment you realized, not a polished lesson at the end.",
      barRaiserConstraint: "If the story ends with 'I learned to communicate better,' I will ask for the actual repair.",
      followUps: {
        short: "What specifically did you change the next day, not in general?",
        vague: "Who was affected, and how did they know you were handling it?",
        assumption: "You framed this as inevitable. What did you miss that was actually under your control?",
        strong: "How did you prevent the same class of miss, not just that instance?",
        solid: "What would your collaborator say you did well and poorly in that week?",
      },
    },
    {
      id: "stripe_questions",
      stage: "Candidate Questions",
      competencyIds: ["communication"],
      prompt:
        "I have time for your questions. Ask me what you would actually want to know before joining a Stripe intern team.",
      guidedCue: "Questions about the work, the team, or how interns get reviewed are all fair.",
      barRaiserConstraint: "I will not give much to a question you could have answered from the careers page.",
      followUps: {
        short: "Give me one question about how work is reviewed on the team.",
        vague: "What decision are you trying to make with that question?",
        assumption: "That assumes intern projects are disposable. Why do you think that?",
        strong: "That is a sharp question. What would a disappointing answer look like for you?",
        solid: "Anything else you would need before you accepted an offer?",
      },
    },
  ],
  difficultyConfig: difficultyConfig("REALISTIC"),
  rubric: defaultRubric(),
  interviewer: interviewerFor("Stripe", "Software Engineer Intern"),
  evaluator: {
    stance:
      "Score as a hiring interviewer for a Stripe intern role. Reward structured thinking and intellectual honesty over flashy completeness.",
    rules: [
      "Do not penalize missing industry jargon if the mechanism is correct.",
      "Do penalize indifference to double-charge and data disagreement.",
      "Separate communication from correctness.",
    ],
  },
  uncertainties: {
    items: [
      "Exact team placement is unknown; session is tuned to payments/API rather than frontend.",
      "Some interview reports are 18+ months old; loop length may have shifted.",
    ],
  },
  designRationale: [
    {
      title: "Problem Solving",
      priority: "High",
      explanation:
        "Intern loops collapse when candidates cannot decompose an unfamiliar payments failure. The session opens space to watch that happen in real time.",
    },
    {
      title: "Backend Engineering",
      priority: "High",
      explanation:
        "The job description is explicit about APIs, data models, and reliability. Idempotency is not a trick question here — it is the work.",
    },
    {
      title: "System Reasoning",
      priority: "High",
      explanation:
        "Reports consistently include a scoped design conversation. We keep it intern-sized and failure-first so it does not become a buzzword tour.",
    },
    {
      title: "Technical Communication",
      priority: "Medium",
      explanation:
        "Stripe's public engineering culture treats precise writing and speech as part of the job. The interviewer will not translate for the candidate.",
    },
  ],
  prepSteps: createPrepSteps(7),
};
