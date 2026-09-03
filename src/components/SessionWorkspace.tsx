"use client";

import { useSessions } from "@/lib/store";
import { EvaluatingView } from "./EvaluatingView";
import { EvaluationView } from "./EvaluationView";
import { InterviewView } from "./InterviewView";
import { NeedsInputView } from "./NeedsInputView";
import { NewInterviewForm } from "./NewInterviewForm";
import { PreparationView } from "./PreparationView";
import { ReadyView } from "./ReadyView";
import { SessionHeader } from "./SessionHeader";

export function SessionWorkspace() {
  const { mode, selected } = useSessions();

  if (mode === "new" || !selected) {
    return (
      <main className="min-h-0 flex-1 overflow-y-auto bg-panel">
        <NewInterviewForm />
      </main>
    );
  }

  const status = selected.metadata.status;
  const interviewMode = status === "IN_PROGRESS";

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-panel">
      <SessionHeader session={selected} />
      {interviewMode ? (
        <InterviewView session={selected} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {status === "PREPARING" || status === "DETECTED" ? (
            <PreparationView session={selected} />
          ) : null}
          {status === "READY" ? <ReadyView session={selected} /> : null}
          {status === "NEEDS_INPUT" ? <NeedsInputView session={selected} /> : null}
          {status === "EVALUATING" ? <EvaluatingView /> : null}
          {status === "COMPLETED" ? <EvaluationView session={selected} /> : null}
          {status === "FAILED" ? (
            <div className="mx-auto max-w-xl px-6 py-16">
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-fail">Failed</p>
              <h2 className="mt-3 font-serif text-[32px] text-ink">Preparation could not finish</h2>
              <p className="mt-3 text-[15px] leading-6 text-muted">
                {selected.metadata.failedReason ??
                  "The session planner hit a gap it could not resolve. Create a new interview or add more job-description detail."}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </main>
  );
}
