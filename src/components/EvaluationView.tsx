"use client";

import { formatScore } from "@/lib/format";
import { useSessions } from "@/lib/store";
import type { InterviewSession } from "@/lib/types";

function ScoreBar({ score }: { score: number }) {
  const width = `${Math.max(8, ((score - 1) / 3) * 100)}%`;
  return (
    <div className="h-[4px] bg-line">
      <div className="h-full bg-ink" style={{ width }} />
    </div>
  );
}

export function EvaluationView({ session }: { session: InterviewSession }) {
  const report = session.evaluation;
  const { practiceWeakness, openNewInterview } = useSessions();

  if (!report) {
    return (
      <div className="px-6 py-10 text-muted">
        Evaluation is unavailable for this session.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">
        Evaluator report
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-serif text-[56px] leading-none tracking-tight text-ink">
            {formatScore(report.overallScore)}
          </div>
          <div className="mt-2 text-[15px] text-muted">
            {report.overallLabel} · 1–4 hiring scale
          </div>
        </div>
      </div>
      <p className="mt-6 text-[15px] leading-7 text-ink">{report.narrative}</p>

      <section className="mt-12">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">
          Competency scores
        </h3>
        <ul className="mt-4 space-y-4">
          {report.competencyScores.map((item) => (
            <li key={item.competencyId}>
              <div className="flex items-baseline justify-between gap-4 text-[14px]">
                <span className="text-ink">{item.name}</span>
                <span className="tabular-nums text-muted">{formatScore(item.score)}</span>
              </div>
              <div className="mt-1.5">
                <ScoreBar score={item.score} />
              </div>
              <p className="mt-1.5 text-[13px] leading-5 text-muted">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">
          Strongest moments
        </h3>
        <ul className="mt-4 space-y-5">
          {report.strongestMoments.map((item) => (
            <li key={item.title}>
              <div className="text-[15px] font-medium text-ink">{item.title}</div>
              <p className="mt-1 text-[14px] leading-6 text-muted">{item.evidence}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">
          Biggest misses
        </h3>
        <ul className="mt-4 space-y-5">
          {report.biggestMisses.map((item) => (
            <li key={item.title}>
              <div className="text-[15px] font-medium text-ink">{item.title}</div>
              <p className="mt-1 text-[14px] leading-6 text-muted">{item.evidence}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">
          Interviewer assistance
        </h3>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {report.assistanceLog.map((entry) => (
            <li key={entry.questionId} className="flex items-start justify-between gap-4 py-3">
              <span className="text-[14px] text-ink">{entry.question}</span>
              <span className="shrink-0 text-[12px] uppercase tracking-[0.05em] text-muted">
                {entry.level}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">
          What would raise your score
        </h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[14px] leading-6 text-ink">
          {report.raiseScore.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">
          Next practice focus
        </h3>
        <p className="mt-3 text-[15px] leading-7 text-ink">{report.nextPracticeFocus}</p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => practiceWeakness(session.metadata.id)}
          className="rounded-md bg-ink px-4 py-2.5 text-[13px] font-medium text-panel hover:bg-[#2a2723]"
        >
          Practice Weakness
        </button>
        <button
          type="button"
          onClick={openNewInterview}
          className="rounded-md border border-line px-4 py-2.5 text-[13px] font-medium text-ink hover:border-line-strong"
        >
          Start Another Interview
        </button>
      </div>
    </div>
  );
}
