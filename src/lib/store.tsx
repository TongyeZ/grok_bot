"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { emptyRuntime } from "./defaults";
import { sessionFromSimulatedEmail } from "./email-demo";
import { buildEvaluation } from "./evaluation-engine";
import { uid } from "./format";
import { displayQuestion, nextInterviewerMessage, openingMessage } from "./interview-engine";
import { buildPreparedPackage } from "./package-builder";
import { advancePrepSteps } from "./prep";
import { createSeedSessions, OPENAI_ID } from "./seed";
import type {
  Difficulty,
  InterviewSession,
  NewInterviewInput,
  TranscriptMessage,
} from "./types";

type WorkspaceMode = "session" | "new";

interface StoreValue {
  sessions: InterviewSession[];
  selectedId: string | null;
  mode: WorkspaceMode;
  selected: InterviewSession | undefined;
  selectSession: (id: string) => void;
  openNewInterview: () => void;
  createInterview: (input: NewInterviewInput) => string;
  simulateEmail: () => string;
  setDifficulty: (id: string, difficulty: Difficulty) => void;
  startInterview: (id: string) => void;
  sendAnswer: (id: string, text: string) => void;
  endInterview: (id: string) => void;
  practiceWeakness: (id: string) => string | null;
}

const StoreContext = createContext<StoreValue | null>(null);

function patchSession(
  sessions: InterviewSession[],
  id: string,
  updater: (session: InterviewSession) => InterviewSession,
): InterviewSession[] {
  return sessions.map((session) => (session.metadata.id === id ? updater(session) : session));
}

function toEvaluating(session: InterviewSession): InterviewSession {
  if (session.metadata.status === "COMPLETED" || session.metadata.status === "EVALUATING") {
    return session;
  }
  return {
    ...session,
    metadata: { ...session.metadata, status: "EVALUATING" },
    runtime: {
      ...session.runtime,
      typing: false,
      endedAt: new Date().toISOString(),
    },
  };
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<InterviewSession[]>(() => createSeedSessions());
  const [selectedId, setSelectedId] = useState<string | null>(OPENAI_ID);
  const [mode, setMode] = useState<WorkspaceMode>("session");
  const sessionsRef = useRef(sessions);
  const evaluatingStarted = useRef<Set<string>>(new Set());

  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSessions((current) => {
        let changed = false;
        const next = current.map((session) => {
          if (session.metadata.status !== "PREPARING") return session;
          const advanced = advancePrepSteps(session.package.prepSteps);
          if (
            advanced.complete &&
            advanced.steps.every((step, index) => step.status === session.package.prepSteps[index]?.status)
          ) {
            return session;
          }
          changed = true;
          return {
            ...session,
            metadata: {
              ...session.metadata,
              status: advanced.complete ? ("READY" as const) : session.metadata.status,
            },
            package: { ...session.package, prepSteps: advanced.steps },
          };
        });
        return changed ? next : current;
      });
    }, 780);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSessions((current) => {
        let changed = false;
        const next = current.map((session) => {
          if (session.metadata.status !== "IN_PROGRESS") return session;
          if (session.runtime.remainingSeconds <= 0) {
            changed = true;
            return toEvaluating(session);
          }
          changed = true;
          return {
            ...session,
            runtime: {
              ...session.runtime,
              remainingSeconds: session.runtime.remainingSeconds - 1,
            },
          };
        });
        return changed ? next : current;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const pending = sessions.filter(
      (session) =>
        session.metadata.status === "EVALUATING" && !evaluatingStarted.current.has(session.metadata.id),
    );
    pending.forEach((session) => {
      evaluatingStarted.current.add(session.metadata.id);
      window.setTimeout(() => {
        setSessions((current) =>
          patchSession(current, session.metadata.id, (item) => {
            if (item.metadata.status !== "EVALUATING") return item;
            return {
              ...item,
              metadata: { ...item.metadata, status: "COMPLETED" },
              evaluation: buildEvaluation(item),
            };
          }),
        );
      }, 1700);
    });
  }, [sessions]);

  const selectSession = useCallback((id: string) => {
    setSelectedId(id);
    setMode("session");
  }, []);

  const openNewInterview = useCallback(() => {
    setMode("new");
    setSelectedId(null);
  }, []);

  const createInterview = useCallback((input: NewInterviewInput) => {
    const durationMinutes = input.durationMinutes ?? 45;
    const session: InterviewSession = {
      metadata: {
        id: uid("session"),
        company: input.company.trim(),
        role: input.role.trim(),
        status: "PREPARING",
        difficulty: input.difficulty,
        durationMinutes,
        interviewDate: input.interviewDate || undefined,
        interviewType: input.interviewType,
        createdFromEmail: false,
        createdAt: new Date().toISOString(),
      },
      package: buildPreparedPackage({
        company: input.company.trim(),
        role: input.role.trim(),
        jobDescription: input.jobDescription.trim(),
        difficulty: input.difficulty,
        durationMinutes,
        interviewType: input.interviewType,
      }),
      runtime: emptyRuntime(durationMinutes),
    };
    setSessions((current) => [session, ...current]);
    setSelectedId(session.metadata.id);
    setMode("session");
    return session.metadata.id;
  }, []);

  const simulateEmail = useCallback(() => {
    const existing = sessionsRef.current.map((session) => session.metadata.company);
    const session = sessionFromSimulatedEmail(existing);
    setSessions((current) => [session, ...current]);
    setSelectedId(session.metadata.id);
    setMode("session");
    return session.metadata.id;
  }, []);

  const setDifficulty = useCallback((id: string, difficulty: Difficulty) => {
    setSessions((current) =>
      patchSession(current, id, (session) => {
        if (session.metadata.status !== "READY" && session.metadata.status !== "PREPARING") {
          return session;
        }
        return {
          ...session,
          metadata: { ...session.metadata, difficulty },
        };
      }),
    );
  }, []);

  const startInterview = useCallback((id: string) => {
    setSessions((current) =>
      patchSession(current, id, (session) => {
        if (session.metadata.status !== "READY") return session;
        const opener = openingMessage(session);
        return {
          ...session,
          metadata: { ...session.metadata, status: "IN_PROGRESS" },
          runtime: {
            ...emptyRuntime(session.metadata.durationMinutes),
            startedAt: new Date().toISOString(),
            currentStage: opener.stage,
            currentQuestionIndex: 0,
            messages: [opener],
            assistanceLog: opener.questionId
              ? [
                  {
                    questionId: opener.questionId,
                    question: displayQuestion(opener.text),
                    level: opener.assistance ?? "Independent",
                  },
                ]
              : [],
          },
        };
      }),
    );
    setMode("session");
    setSelectedId(id);
  }, []);

  const sendAnswer = useCallback((id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setSessions((current) =>
      patchSession(current, id, (session) => {
        if (session.metadata.status !== "IN_PROGRESS" || session.runtime.typing) return session;
        const currentQuestion = session.package.questions[session.runtime.currentQuestionIndex];
        const candidateMessage: TranscriptMessage = {
          id: uid("msg"),
          role: "candidate",
          text: trimmed,
          stage: session.runtime.currentStage,
          questionId: currentQuestion?.id,
          at: new Date().toISOString(),
        };
        return {
          ...session,
          runtime: {
            ...session.runtime,
            typing: true,
            messages: [...session.runtime.messages, candidateMessage],
          },
        };
      }),
    );

    window.setTimeout(() => {
      setSessions((current) =>
        patchSession(current, id, (session) => {
          if (session.metadata.status !== "IN_PROGRESS") return session;
          const result = nextInterviewerMessage(session, trimmed);
          const assistanceLog = session.runtime.assistanceLog.map((entry) => ({ ...entry }));
          if (result.message.questionId && result.message.assistance) {
            const existing = assistanceLog.find((entry) => entry.questionId === result.message.questionId);
            if (!existing) {
              assistanceLog.push({
                questionId: result.message.questionId,
                question: displayQuestion(result.message.text),
                level: result.message.assistance,
              });
            } else if (
              result.message.assistance === "Light hint" ||
              (result.message.assistance === "Clarification only" && existing.level === "Independent")
            ) {
              existing.level = result.message.assistance;
            }
          }

          const withMessage: InterviewSession = {
            ...session,
            runtime: {
              ...session.runtime,
              typing: false,
              currentQuestionIndex: result.questionIndex,
              awaitingFollowUp: result.awaitingFollowUp,
              currentStage: result.message.stage,
              messages: [...session.runtime.messages, result.message],
              assistanceLog,
            },
          };

          return result.done ? toEvaluating(withMessage) : withMessage;
        }),
      );
    }, 520);
  }, []);

  const endInterview = useCallback((id: string) => {
    setSessions((current) =>
      patchSession(current, id, (session) => {
        if (session.metadata.status !== "IN_PROGRESS") return session;
        return toEvaluating(session);
      }),
    );
  }, []);

  const practiceWeakness = useCallback(
    (id: string) => {
      const session = sessionsRef.current.find((item) => item.metadata.id === id);
      if (!session?.evaluation) return null;
      const weakest =
        session.package.competencies.find((item) => item.id === session.evaluation?.weakestCompetencyId) ??
        session.package.competencies[0];
      if (!weakest) return null;
      return createInterview({
        company: session.metadata.company,
        role: `${session.metadata.role} — ${weakest.name}`,
        jobDescription: `${session.package.jobDescription.raw}\n\nFocus this session on ${weakest.name}: ${weakest.description}`,
        interviewType: "Mixed",
        durationMinutes: 30,
        difficulty: "GUIDED",
      });
    },
    [createInterview],
  );

  const selected = sessions.find((session) => session.metadata.id === selectedId);

  const value = useMemo<StoreValue>(
    () => ({
      sessions,
      selectedId,
      mode,
      selected,
      selectSession,
      openNewInterview,
      createInterview,
      simulateEmail,
      setDifficulty,
      startInterview,
      sendAnswer,
      endInterview,
      practiceWeakness,
    }),
    [
      sessions,
      selectedId,
      mode,
      selected,
      selectSession,
      openNewInterview,
      createInterview,
      simulateEmail,
      setDifficulty,
      startInterview,
      sendAnswer,
      endInterview,
      practiceWeakness,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useSessions() {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("useSessions must be used within SessionProvider");
  }
  return value;
}
