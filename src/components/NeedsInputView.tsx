"use client";

import { useSessions } from "@/lib/store";
import type { InterviewSession } from "@/lib/types";

export function NeedsInputView({ session }: { session: InterviewSession }) {
  const { openNewInterview } = useSessions();

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-16">
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-live">Needs input</p>
      <h2 className="mt-3 font-serif text-[32px] leading-[1.15] tracking-tight text-ink">
        The planner cannot finish this session
      </h2>
      <p className="mt-4 text-[15px] leading-6 text-muted">
        {session.metadata.company} · {session.metadata.role} is missing a usable job description or
        interview constraint. Add detail in a new session — the planner will not invent a loop
        from a company name alone.
      </p>
      <button
        type="button"
        onClick={openNewInterview}
        className="mt-8 rounded-md bg-ink px-4 py-2.5 text-[13px] font-medium text-panel"
      >
        New Interview
      </button>
    </div>
  );
}
