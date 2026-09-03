import type { Difficulty, SessionStatus } from "./types";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  GUIDED: "Guided",
  REALISTIC: "Realistic",
  BAR_RAISER: "Bar Raiser",
};

export const DIFFICULTY_DETAIL: Record<Difficulty, string> = {
  GUIDED: "More clarification, occasional hints, lower ambiguity.",
  REALISTIC: "Balanced independence, realistic follow-ups, moderate ambiguity.",
  BAR_RAISER:
    "Minimal hints, deeper probing, stronger constraints, high expected independence.",
};

export const STATUS_LABEL: Record<SessionStatus, string> = {
  DETECTED: "Detected",
  PREPARING: "Preparing",
  NEEDS_INPUT: "Needs input",
  READY: "Ready",
  IN_PROGRESS: "In progress",
  EVALUATING: "Evaluating",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

export function formatInterviewDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDuration(minutes: number): string {
  return `${minutes} min`;
}

export function formatTimeRemaining(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function scoreLabel(score: number): string {
  if (score >= 3.5) return "Strong yes";
  if (score >= 3.0) return "Yes";
  if (score >= 2.5) return "Lean yes";
  if (score >= 2.0) return "Lean no";
  return "No";
}

export function sourceSummary(official: number, professional: number, reports: number): string {
  const total = official + professional + reports;
  return `Prepared from ${total} sources — ${official} official, ${professional} professional, ${reports} interview reports`;
}

export function initialsFromName(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function todayIso(): string {
  return new Date().toISOString();
}
