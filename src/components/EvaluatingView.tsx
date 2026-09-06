export function EvaluatingView() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-16">
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-eval">Evaluator</p>
      <h2 className="mt-3 font-serif text-[32px] leading-[1.15] tracking-tight text-ink">
        Interview complete. Evaluator is reviewing…
      </h2>
      <p className="mt-4 text-[15px] leading-6 text-muted">
        A separate agent is reading the transcript against the rubric. No scores were shown during
        the interview.
      </p>
      <div className="mt-8 h-[3px] overflow-hidden rounded-full bg-line prep-shimmer">
        <div className="h-full w-1/3 bg-eval/70" />
      </div>
    </div>
  );
}
