"use client";

import { DIFFICULTY_DETAIL, DIFFICULTY_LABEL, formatInterviewDate } from "@/lib/format";
import { useSessions } from "@/lib/store";
import type { InterviewSession } from "@/lib/types";

export function ReadyView({ session }: { session: InterviewSession }) {
  const { startInterview } = useSessions();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ready">Ready</p>
      <h2 className="mt-3 font-serif text-[34px] leading-[1.1] tracking-tight text-ink">
        Your interview is ready.
      </h2>
      <p className="mt-3 max-w-xl text-[15px] leading-6 text-muted">
        The session planner finished a competency model, question tree, and evaluation rubric for{" "}
        {session.metadata.company}. The interviewer will not coach, score, or show model answers
        during the session.
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-[14px] sm:grid-cols-4">
        <div>
          <dt className="text-[12px] uppercase tracking-[0.06em] text-faint">Difficulty</dt>
          <dd className="mt-1 text-ink">{DIFFICULTY_LABEL[session.metadata.difficulty]}</dd>
        </div>
        <div>
          <dt className="text-[12px] uppercase tracking-[0.06em] text-faint">Duration</dt>
          <dd className="mt-1 text-ink">{session.metadata.durationMinutes} minutes</dd>
        </div>
        <div>
          <dt className="text-[12px] uppercase tracking-[0.06em] text-faint">Type</dt>
          <dd className="mt-1 text-ink">{session.metadata.interviewType ?? "Mixed"}</dd>
        </div>
        <div>
          <dt className="text-[12px] uppercase tracking-[0.06em] text-faint">Interview date</dt>
          <dd className="mt-1 text-ink">
            {formatInterviewDate(session.metadata.interviewDate) ?? "Not set"}
          </dd>
        </div>
      </dl>
      <p className="mt-3 max-w-xl text-[13px] leading-5 text-faint">
        {DIFFICULTY_DETAIL[session.metadata.difficulty]} Change difficulty in the header before you
        start.
      </p>

      <section className="mt-10 border-t border-line pt-8">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">
          Competency mix
        </h3>
        <ul className="mt-4 space-y-3">
          {session.package.competencies.map((competency) => (
            <li key={competency.id}>
              <div className="flex items-baseline justify-between gap-4 text-[14px]">
                <span className="text-ink">{competency.name}</span>
                <span className="tabular-nums text-muted">{competency.weight}%</span>
              </div>
              <div className="mt-1.5 h-[3px] bg-line">
                <div className="h-full bg-ink/70" style={{ width: `${competency.weight * 2.2}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <button
          type="button"
          onClick={() => startInterview(session.metadata.id)}
          className="rounded-md bg-ink px-5 py-3 text-[14px] font-medium text-panel transition-colors hover:bg-[#2a2723]"
        >
          Start Interview
        </button>
        <p className="mt-3 text-[13px] text-faint">
          {session.package.interviewer.name} will interview you. A separate evaluator reviews the
          transcript afterward.
        </p>
      </div>
    </div>
  );
}
