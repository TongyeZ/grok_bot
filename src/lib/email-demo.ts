import { uid } from "./format";
import { buildPreparedPackage } from "./package-builder";
import { emptyRuntime } from "./defaults";
import type { InterviewSession } from "./types";

const EMAIL_INTAKES = [
  {
    company: "Ramp",
    role: "Software Engineer",
    interviewType: "Mixed" as const,
    durationMinutes: 45,
    dateOffsetDays: 12,
    jobDescription:
      "Ramp is hiring software engineers to build financial infrastructure — cards, bill pay, and spend controls. You will write backend services, care about money-correctness, and work with product on high-trust workflows.",
  },
  {
    company: "Linear",
    role: "Full-Stack Engineer",
    interviewType: "Technical" as const,
    durationMinutes: 45,
    dateOffsetDays: 9,
    jobDescription:
      "Linear is hiring full-stack engineers to work on a fast, opinionated issue tracker. We care about product craft, performance, and the ability to make decisions without a large committee.",
  },
  {
    company: "Cloudflare",
    role: "Systems Engineer",
    interviewType: "System Design" as const,
    durationMinutes: 60,
    dateOffsetDays: 18,
    jobDescription:
      "Cloudflare is hiring systems engineers to work on edge services, reliability, and performance. Expect conversations about failure domains, load, and what you measure.",
  },
  {
    company: "Notion",
    role: "Software Engineer",
    interviewType: "Mixed" as const,
    durationMinutes: 45,
    dateOffsetDays: 14,
    jobDescription:
      "Notion is hiring software engineers to build collaborative workspace products. You will work across product surfaces and data models where sync, permissions, and latency matter.",
  },
  {
    company: "Snowflake",
    role: "Backend Engineer",
    interviewType: "System Design" as const,
    durationMinutes: 60,
    dateOffsetDays: 21,
    jobDescription:
      "Snowflake is hiring backend engineers to work on query processing, storage, and platform services. We look for people who can reason about correctness and performance in data-intensive systems.",
  },
];

function datePlus(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function sessionFromSimulatedEmail(existingCompanies: string[]): InterviewSession {
  const unused = EMAIL_INTAKES.filter((item) => !existingCompanies.includes(item.company));
  const intake = unused[0] ?? EMAIL_INTAKES[Math.floor(Math.random() * EMAIL_INTAKES.length)];
  const durationMinutes = intake.durationMinutes;

  return {
    metadata: {
      id: uid("session"),
      company: intake.company,
      role: intake.role,
      status: "PREPARING",
      difficulty: "REALISTIC",
      durationMinutes,
      interviewDate: datePlus(intake.dateOffsetDays),
      interviewType: intake.interviewType,
      createdFromEmail: true,
      createdAt: new Date().toISOString(),
    },
    package: buildPreparedPackage({
      company: intake.company,
      role: intake.role,
      jobDescription: intake.jobDescription,
      difficulty: "REALISTIC",
      durationMinutes,
      interviewType: intake.interviewType,
    }),
    runtime: emptyRuntime(durationMinutes),
  };
}
