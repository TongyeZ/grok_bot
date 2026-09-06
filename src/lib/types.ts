export type SessionStatus =
  | "DETECTED"
  | "PREPARING"
  | "NEEDS_INPUT"
  | "READY"
  | "IN_PROGRESS"
  | "EVALUATING"
  | "COMPLETED"
  | "FAILED";

export type Difficulty = "GUIDED" | "REALISTIC" | "BAR_RAISER";

export type InterviewType =
  | "Technical"
  | "System Design"
  | "Behavioral"
  | "Mixed"
  | "Phone Screen";

export type InterviewStage =
  | "Introduction"
  | "Technical"
  | "System Design"
  | "Behavioral"
  | "Candidate Questions";

export type AssistanceLevel = "Independent" | "Clarification only" | "Light hint";

export type PrepStepStatus = "done" | "active" | "pending";

export type AnswerSignal = "short" | "vague" | "assumption" | "strong" | "solid";

export interface PrepStep {
  id: string;
  label: string;
  status: PrepStepStatus;
}

export interface Competency {
  id: string;
  name: string;
  weight: number;
  description: string;
  rationale: string;
  priority: "High" | "Medium" | "Supporting";
}

export interface SourceEntry {
  id: string;
  title: string;
  kind: "official" | "professional" | "interview_report";
  note: string;
}

export interface SessionMetadata {
  id: string;
  company: string;
  role: string;
  status: SessionStatus;
  difficulty: Difficulty;
  durationMinutes: number;
  interviewDate?: string;
  interviewType?: InterviewType;
  createdFromEmail: boolean;
  createdAt: string;
  failedReason?: string;
}

export interface JobDescriptionAnalysis {
  raw: string;
  identifiedRequirements: string[];
  impliedExpectations: string[];
  senioritySignal: string;
  ambiguities: string[];
}

export interface CompanyIntelligence {
  summary: string;
  products: string[];
  engineeringCulture: string[];
  recentSignals: string[];
}

export interface RoleIndustryIntelligence {
  typicalLoop: string[];
  marketExpectations: string[];
  internVsFullTimeNotes?: string;
}

export interface InterviewIntelligence {
  commonFormats: string[];
  reportedEmphases: string[];
  pitfalls: string[];
}

export interface SourceLedger {
  official: number;
  professional: number;
  interviewReports: number;
  entries: SourceEntry[];
}

export interface InterviewBlueprint {
  stages: { stage: InterviewStage; minutes: number; intent: string }[];
  designNotes: string[];
}

export interface PlannedQuestion {
  id: string;
  stage: InterviewStage;
  competencyIds: string[];
  prompt: string;
  guidedCue?: string;
  barRaiserConstraint?: string;
  followUps: {
    short: string;
    vague: string;
    assumption: string;
    strong: string;
    solid: string;
  };
}

export interface DifficultyConfiguration {
  hints: "frequent" | "occasional" | "rare";
  probing: "light" | "moderate" | "deep";
  ambiguity: "low" | "moderate" | "high";
  independence: "supported" | "balanced" | "high";
}

export interface EvaluationRubric {
  scoringNotes: string[];
  evidenceRules: string[];
}

export interface InterviewerBrief {
  name: string;
  title: string;
  initials: string;
  persona: string;
  rules: string[];
}

export interface EvaluatorBrief {
  stance: string;
  rules: string[];
}

export interface ResearchUncertainties {
  items: string[];
}

export interface DesignRationale {
  title: string;
  priority: "High" | "Medium" | "Supporting";
  explanation: string;
}

export interface PreparedPackage {
  jobDescription: JobDescriptionAnalysis;
  company: CompanyIntelligence;
  roleIndustry: RoleIndustryIntelligence;
  interviewIntelligence: InterviewIntelligence;
  sources: SourceLedger;
  competencies: Competency[];
  blueprint: InterviewBlueprint;
  questions: PlannedQuestion[];
  difficultyConfig: DifficultyConfiguration;
  rubric: EvaluationRubric;
  interviewer: InterviewerBrief;
  evaluator: EvaluatorBrief;
  uncertainties: ResearchUncertainties;
  designRationale: DesignRationale[];
  prepSteps: PrepStep[];
}

export interface TranscriptMessage {
  id: string;
  role: "interviewer" | "candidate";
  text: string;
  stage: InterviewStage;
  questionId?: string;
  assistance?: AssistanceLevel;
  at: string;
}

export interface AssistanceLogEntry {
  questionId: string;
  question: string;
  level: AssistanceLevel;
}

export interface InterviewRuntime {
  startedAt?: string;
  endedAt?: string;
  remainingSeconds: number;
  currentStage: InterviewStage;
  currentQuestionIndex: number;
  awaitingFollowUp: boolean;
  lastSignal?: AnswerSignal;
  messages: TranscriptMessage[];
  assistanceLog: AssistanceLogEntry[];
  typing: boolean;
}

export interface CompetencyScore {
  competencyId: string;
  name: string;
  score: number;
  note: string;
}

export interface EvidenceItem {
  title: string;
  evidence: string;
}

export interface EvaluationReport {
  overallScore: number;
  overallLabel: string;
  narrative: string;
  competencyScores: CompetencyScore[];
  strongestMoments: EvidenceItem[];
  biggestMisses: EvidenceItem[];
  assistanceLog: AssistanceLogEntry[];
  raiseScore: string[];
  nextPracticeFocus: string;
  weakestCompetencyId?: string;
}

export interface InterviewSession {
  metadata: SessionMetadata;
  package: PreparedPackage;
  runtime: InterviewRuntime;
  evaluation?: EvaluationReport;
}

export interface NewInterviewInput {
  company: string;
  role: string;
  jobDescription: string;
  interviewDate?: string;
  interviewType?: InterviewType;
  durationMinutes?: number;
  difficulty: Difficulty;
}
