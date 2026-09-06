"use client";

import { DIFFICULTY_LABEL, formatDuration } from "@/lib/format";
import { useSessions } from "@/lib/store";
import type { Difficulty, InterviewSession } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

const OPTIONS: Difficulty[] = ["GUIDED", "REALISTIC", "BAR_RAISER"];

export function SessionHeader({ session }: { session: InterviewSession }) {
  const { setDifficulty } = useSessions();
  const locked =
    session.metadata.status === "IN_PROGRESS" ||
    session.metadata.status === "EVALUATING" ||
    session.metadata.status === "COMPLETED";

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h1 className="font-serif text-[26px] leading-none tracking-tight text-ink">
            {session.metadata.company}
          </h1>
          <span className="text-faint">·</span>
          <p className="text-[15px] text-muted">{session.metadata.role}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[13px]">
        {locked ? (
          <span className="rounded-sm border border-line bg-panel px-2 py-1 text-muted">
            {DIFFICULTY_LABEL[session.metadata.difficulty]}
          </span>
        ) : (
          <label className="flex items-center gap-2 text-muted">
            <span className="sr-only">Difficulty</span>
            <select
              value={session.metadata.difficulty}
              onChange={(event) => setDifficulty(session.metadata.id, event.target.value as Difficulty)}
              className="rounded-sm border border-line bg-input px-2 py-1 text-[13px] text-ink outline-none focus:border-line-strong"
            >
              {OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {DIFFICULTY_LABEL[option]}
                </option>
              ))}
            </select>
          </label>
        )}
        <span className="rounded-sm border border-line px-2 py-1 text-muted">
          {formatDuration(session.metadata.durationMinutes)}
        </span>
        <StatusBadge status={session.metadata.status} size="md" />
      </div>
    </header>
  );
}
