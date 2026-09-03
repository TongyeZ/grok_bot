"use client";

import { formatInterviewDate } from "@/lib/format";
import { useSessions } from "@/lib/store";
import { StatusBadge } from "./StatusBadge";

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const { sessions, selectedId, mode, selectSession, openNewInterview, simulateEmail } =
    useSessions();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sessions"
          className="fixed inset-0 z-20 bg-ink/20 md:hidden"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[292px] shrink-0 flex-col border-r border-line bg-sidebar md:static md:z-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-200`}
      >
        <div className="px-5 pb-4 pt-6">
          <div className="font-serif text-[28px] leading-none tracking-tight text-ink">Brief</div>
          <p className="mt-2 text-[12px] leading-5 text-muted">
            Prepared interviews. Separate evaluation.
          </p>
        </div>

        <div className="px-5 pb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
          Interview sessions
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {sessions.map((session) => {
            const active = mode === "session" && selectedId === session.metadata.id;
            return (
              <button
                key={session.metadata.id}
                type="button"
                onClick={() => {
                  selectSession(session.metadata.id);
                  onClose();
                }}
                className={`mb-1 w-full rounded-md px-3 py-3 text-left transition-colors ${
                  active ? "bg-panel shadow-[inset_0_0_0_1px_var(--line-strong)]" : "hover:bg-black/[0.04]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-ink">{session.metadata.company}</div>
                    <div className="mt-0.5 truncate text-[13px] text-muted">{session.metadata.role}</div>
                  </div>
                  <StatusBadge status={session.metadata.status} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-faint">
                  {session.metadata.interviewDate ? (
                    <span>{formatInterviewDate(session.metadata.interviewDate)}</span>
                  ) : (
                    <span>Date unset</span>
                  )}
                  {session.metadata.createdFromEmail ? (
                    <span className="rounded-sm bg-[#e0d8c8] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.05em] text-[#5b5348]">
                      Created from email
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          <button
            type="button"
            onClick={() => {
              openNewInterview();
              onClose();
            }}
            className={`mb-2 w-full rounded-md px-3 py-2.5 text-[13px] font-medium transition-colors ${
              mode === "new" ? "bg-ink text-panel" : "bg-ink text-panel hover:bg-[#2a2723]"
            }`}
          >
            New Interview
          </button>
          <button
            type="button"
            onClick={() => {
              simulateEmail();
              onClose();
            }}
            className="w-full rounded-md px-3 py-2 text-[12px] text-muted transition-colors hover:bg-black/5 hover:text-ink"
          >
            Simulate Interview Email
          </button>
        </div>
      </aside>
    </>
  );
}
