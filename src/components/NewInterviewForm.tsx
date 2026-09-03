"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { DIFFICULTY_DETAIL, DIFFICULTY_LABEL } from "@/lib/format";
import { useSessions } from "@/lib/store";
import type { Difficulty, InterviewType } from "@/lib/types";

const TYPES: InterviewType[] = [
  "Mixed",
  "Technical",
  "System Design",
  "Behavioral",
  "Phone Screen",
];

const DIFFICULTIES: Difficulty[] = ["GUIDED", "REALISTIC", "BAR_RAISER"];

export function NewInterviewForm() {
  const { createInterview } = useSessions();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewType, setInterviewType] = useState<InterviewType | "">("");
  const [durationMinutes, setDurationMinutes] = useState("45");
  const [difficulty, setDifficulty] = useState<Difficulty>("REALISTIC");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!company.trim() || !role.trim() || !jobDescription.trim()) {
      setError("Company, role, and job description are required.");
      return;
    }
    setError(null);
    createInterview({
      company,
      role,
      jobDescription,
      interviewDate: interviewDate || undefined,
      interviewType: interviewType || undefined,
      durationMinutes: Number(durationMinutes) || 45,
      difficulty,
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-faint">New session</p>
      <h2 className="mt-3 font-serif text-[34px] leading-[1.1] tracking-tight text-ink">
        Prepare an interview
      </h2>
      <p className="mt-3 text-[15px] leading-6 text-muted">
        The session appears immediately and prepares in the background. You will not see questions
        until you start.
      </p>

      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        <Field label="Company" required>
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={inputClass}
            placeholder="Stripe"
          />
        </Field>
        <Field label="Role" required>
          <input
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className={inputClass}
            placeholder="Software Engineer Intern"
          />
        </Field>
        <Field label="Job description" required>
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            rows={7}
            className={`${inputClass} resize-y`}
            placeholder="Paste the posting. The planner uses this to weight competencies."
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Interview date">
            <input
              type="date"
              value={interviewDate}
              onChange={(event) => setInterviewDate(event.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Interview type">
            <select
              value={interviewType}
              onChange={(event) => setInterviewType(event.target.value as InterviewType | "")}
              className={inputClass}
            >
              <option value="">Optional</option>
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Duration">
            <select
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
              className={inputClass}
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </Field>
          <div />
        </div>

        <fieldset>
          <legend className="text-[12px] uppercase tracking-[0.06em] text-faint">Difficulty</legend>
          <div className="mt-3 space-y-2">
            {DIFFICULTIES.map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-3 ${
                  difficulty === option ? "border-ink bg-panel" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  checked={difficulty === option}
                  onChange={() => setDifficulty(option)}
                  className="mt-1"
                />
                <span>
                  <span className="block text-[14px] font-medium text-ink">
                    {DIFFICULTY_LABEL[option]}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-muted">
                    {DIFFICULTY_DETAIL[option]}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {error ? <p className="text-[13px] text-fail">{error}</p> : null}

        <button
          type="submit"
          className="rounded-md bg-ink px-5 py-3 text-[14px] font-medium text-panel hover:bg-[#2a2723]"
        >
          Create session
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[12px] uppercase tracking-[0.06em] text-faint">
        {label}
        {required ? <span className="text-ink"> *</span> : null}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-line bg-input px-3 py-2 text-[14px] text-ink outline-none placeholder:text-faint focus:border-line-strong";
