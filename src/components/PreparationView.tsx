"use client";

import { sourceSummary } from "@/lib/format";
import { prepProgress } from "@/lib/prep";
import type { InterviewSession } from "@/lib/types";

function StepMark({ status }: { status: "done" | "active" | "pending" }) {
  if (status === "done") {
    return (
      <span className="mt-0.5 flex h-4 w-4 items-center justify-center text-ready" aria-hidden>
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
          <path d="M3.5 8.2 6.4 11.2 12.5 4.8" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="mt-0.5 flex h-4 w-4 items-center justify-center text-prep" aria-hidden>
        <span className="h-[7px] w-[7px] rounded-full bg-prep prep-pulse" />
      </span>
    );
  }
  return (
    <span className="mt-0.5 flex h-4 w-4 items-center justify-center text-faint" aria-hidden>
      <span className="h-[7px] w-[7px] rounded-full border border-line-strong" />
    </span>
  );
}

export function PreparationView({ session }: { session: InterviewSession }) {
  const { sources, prepSteps, designRationale } = session.package;
  const progress = prepProgress(prepSteps);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">Session planner</p>
      <h2 className="mt-3 font-serif text-[34px] leading-[1.1] tracking-tight text-ink">
        Preparing your interview…
      </h2>
      <p className="mt-3 max-w-xl text-[15px] leading-6 text-muted">
        Researching {session.metadata.company} and the {session.metadata.role} loop. Questions and
        scoring stay hidden until you start.
      </p>

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between text-[12px] text-faint">
          <span>Background work</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-[3px] overflow-hidden rounded-full bg-line">
          <div
            className="h-full bg-prep transition-[width] duration-500"
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
      </div>

      <ol className="mt-8 space-y-3">
        {prepSteps.map((step) => (
          <li key={step.id} className="flex items-start gap-3">
            <StepMark status={step.status} />
            <span
              className={`text-[15px] ${
                step.status === "done"
                  ? "text-ink"
                  : step.status === "active"
                    ? "text-prep"
                    : "text-faint"
              }`}
            >
              {step.label}
              {step.status === "active" ? (
                <span className="ml-2 text-[12px] uppercase tracking-[0.06em]">In progress</span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-[14px] leading-6 text-muted">
        {sourceSummary(sources.official, sources.professional, sources.interviewReports)}
      </p>

      <section className="mt-10 border-t border-line pt-8">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">
          Why this interview is being designed this way
        </h3>
        <ul className="mt-4 space-y-4">
          {designRationale.map((item) => (
            <li key={item.title}>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-[15px] font-medium text-ink">{item.title}</span>
                <span className="text-[11px] uppercase tracking-[0.06em] text-faint">
                  {item.priority} priority
                </span>
              </div>
              <p className="mt-1 text-[14px] leading-6 text-muted">{item.explanation}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
