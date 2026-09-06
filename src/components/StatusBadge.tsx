import { STATUS_LABEL } from "@/lib/format";
import type { SessionStatus } from "@/lib/types";

const STYLES: Record<SessionStatus, string> = {
  DETECTED: "bg-[#e8e4db] text-[#4f4a43]",
  PREPARING: "bg-prep-soft text-prep prep-pulse",
  NEEDS_INPUT: "bg-live-soft text-live",
  READY: "bg-ready-soft text-ready",
  IN_PROGRESS: "bg-live-soft text-live",
  EVALUATING: "bg-eval-soft text-eval prep-pulse",
  COMPLETED: "bg-[#e4e0d7] text-[#3c3934]",
  FAILED: "bg-fail-soft text-fail",
};

export function StatusBadge({
  status,
  size = "sm",
}: {
  status: SessionStatus;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-sm font-medium uppercase tracking-[0.06em] ${STYLES[status]} ${
        size === "md" ? "px-2 py-1 text-[11px]" : "px-1.5 py-0.5 text-[10px]"
      }`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
