import type { PrepStep } from "./types";

export const PREP_STEP_LABELS = [
  "Job description identified",
  "Company research complete",
  "Role skills analyzed",
  "Interview reports gathered",
  "Building competency model",
  "Generating question tree",
  "Finalizing evaluation rubric",
] as const;

export function createPrepSteps(completedCount: number): PrepStep[] {
  return PREP_STEP_LABELS.map((label, index) => {
    let status: PrepStep["status"] = "pending";
    if (index < completedCount) status = "done";
    else if (index === completedCount) status = "active";
    return { id: `prep_${index}`, label, status };
  });
}

export function prepProgress(steps: PrepStep[]): number {
  if (steps.length === 0) return 0;
  const done = steps.filter((step) => step.status === "done").length;
  const active = steps.some((step) => step.status === "active") ? 0.45 : 0;
  return Math.min(1, (done + active) / steps.length);
}

export function advancePrepSteps(steps: PrepStep[]): {
  steps: PrepStep[];
  complete: boolean;
} {
  const activeIndex = steps.findIndex((step) => step.status === "active");
  if (activeIndex === -1) {
    const pendingIndex = steps.findIndex((step) => step.status === "pending");
    if (pendingIndex === -1) return { steps, complete: true };
    return {
      steps: steps.map((step, index) =>
        index === pendingIndex ? { ...step, status: "active" } : step,
      ),
      complete: false,
    };
  }

  const next = steps.map((step, index) => {
    if (index === activeIndex) return { ...step, status: "done" as const };
    if (index === activeIndex + 1) return { ...step, status: "active" as const };
    return step;
  });

  return {
    steps: next,
    complete: next.every((step) => step.status === "done"),
  };
}
