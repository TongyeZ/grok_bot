"use client";

import { useEffect, useRef, useState } from "react";
import { formatTimeRemaining } from "@/lib/format";
import { STAGES } from "@/lib/defaults";
import { useSessions } from "@/lib/store";
import type { InterviewSession } from "@/lib/types";

export function InterviewView({ session }: { session: InterviewSession }) {
  const { sendAnswer, endInterview } = useSessions();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const interviewer = session.package.interviewer;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [session.runtime.messages.length, session.runtime.typing]);

  function submit() {
    if (!draft.trim() || session.runtime.typing) return;
    sendAnswer(session.metadata.id, draft);
    setDraft("");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[11px] font-medium text-panel">
            {interviewer.initials}
          </div>
          <div>
            <div className="text-[14px] font-medium text-ink">{interviewer.name}</div>
            <div className="text-[12px] text-muted">{interviewer.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[13px]">
          <span className="tabular-nums text-ink">
            {formatTimeRemaining(session.runtime.remainingSeconds)}
          </span>
          <button
            type="button"
            onClick={() => endInterview(session.metadata.id)}
            className="rounded-sm border border-line px-2.5 py-1 text-[12px] text-muted hover:border-line-strong hover:text-ink"
          >
            End Interview
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-line px-6 py-2">
        {STAGES.map((stage) => {
          const current = stage === session.runtime.currentStage;
          const seen = session.runtime.messages.some((message) => message.stage === stage);
          return (
            <span
              key={stage}
              className={`whitespace-nowrap text-[11px] uppercase tracking-[0.06em] ${
                current ? "text-ink" : seen ? "text-muted" : "text-faint"
              }`}
            >
              {current ? "→ " : ""}
              {stage}
            </span>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {session.runtime.messages.map((message) =>
            message.role === "interviewer" ? (
              <div key={message.id} className="max-w-[85%]">
                <div className="text-[11px] uppercase tracking-[0.06em] text-faint">
                  {interviewer.name}
                </div>
                <p className="mt-1 text-[15px] leading-7 text-ink">{message.text}</p>
              </div>
            ) : (
              <div key={message.id} className="ml-auto max-w-[80%]">
                <div className="text-right text-[11px] uppercase tracking-[0.06em] text-faint">
                  You
                </div>
                <p className="mt-1 text-[15px] leading-7 text-ink">{message.text}</p>
              </div>
            ),
          )}
          {session.runtime.typing ? (
            <div className="text-[13px] text-faint">
              {interviewer.name} is considering your answer…
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>
      </div>

      <form
        className="border-t border-line px-6 py-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            rows={3}
            disabled={session.runtime.typing}
            placeholder="Answer the current question. Shift+Enter for a new line."
            className="min-h-[84px] flex-1 resize-none rounded-md border border-line bg-input px-3 py-2 text-[14px] leading-6 text-ink outline-none placeholder:text-faint focus:border-line-strong disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={session.runtime.typing || !draft.trim()}
            className="rounded-md bg-ink px-4 py-2 text-[13px] font-medium text-panel disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
