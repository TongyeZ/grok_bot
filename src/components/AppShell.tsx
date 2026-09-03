"use client";

import { useState } from "react";
import { SessionProvider } from "@/lib/store";
import { SessionWorkspace } from "./SessionWorkspace";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="flex h-dvh overflow-hidden bg-canvas">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3 md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="text-[13px] text-ink"
            >
              Sessions
            </button>
            <span className="font-serif text-[18px]">Brief</span>
          </div>
          <SessionWorkspace />
        </div>
      </div>
    </SessionProvider>
  );
}
