# Brief

A prepared mock-interview product. Not a chatbot.

An interview enters the system. A **Session Planner** researches the company and role in the background. When the session is ready, an **Interviewer** runs a realistic, adaptive loop. When it ends, a separate **Evaluator** writes an evidence-based report.

This repository is a client-side MVP. All planner / interviewer / evaluator behavior is mocked with structured TypeScript data so the product experience can be used and reviewed without auth, billing, or a live model.

## Run locally

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

There is no `.env` file and no backend to configure.

## What you should see

The app opens on the **OpenAI** session in `PREPARING`, with the planner checklist stepping forward over a few seconds.

The sidebar also includes:

1. **Stripe · Software Engineer Intern · READY** — start a full mock interview (Realistic, 45 min, Sep 10).
2. **OpenAI · Software Engineer · PREPARING** — created from email; watch preparation complete, then start.
3. **Datadog · Backend Engineer · COMPLETED** — open a full evaluator report.

**New Interview** creates a session immediately in `PREPARING` and runs the same prep animation. **Simulate Interview Email** adds a fake inbound invite (`Created from email`) and prepares it the same way.

Difficulty (**Guided** / **Realistic** / **Bar Raiser**) can be changed until you press Start Interview. After that it is locked.

## Architecture

```
src/
  app/                 Next.js App Router shell
  components/          Product UI
  lib/
    types.ts           Session + agent package types
    store.tsx          Client session state
    seed.ts            Three demo sessions
    data/              Stripe, OpenAI, Datadog mock packages
    package-builder.ts New-session / email package assembly
    interview-engine.ts Scripted adaptive interviewer
    evaluation-engine.ts Transcript → structured report
    email-demo.ts      Fake inbound interview emails
```

### Main UI

| Component | Role |
| --- | --- |
| `AppShell` / `Sidebar` | Two-column layout, session list, New Interview, email demo |
| `SessionHeader` | Company · role · difficulty · duration · status |
| `PreparationView` | Planner progress, source ledger summary, design rationale. Never shows questions. |
| `ReadyView` | Competency mix and Start Interview |
| `InterviewView` | Focused interviewer UI, one question at a time |
| `EvaluatingView` | Brief evaluator pause |
| `EvaluationView` | Structured report (not a chat dump) |
| `NewInterviewForm` | Create a session (status is `PREPARING` immediately) |

### Where mock data lives

Seeded sessions and the Stripe package are fully populated internal objects: session metadata, job-description analysis, company / role / interview intelligence, source ledger, competency matrix, interview blueprint, question tree, difficulty configuration, evaluation rubric, interviewer brief, evaluator brief, and research uncertainties.

The question tree is in memory for the interviewer. The UI does not render questions or rubric answers during preparation.

Interview turns are scripted. Follow-ups react to answer length and a small set of technical cues (retries, consistency, latency, tradeoffs, and similar). Difficulty changes interviewer tone and hinting, not trivia.

The Datadog session ships a hand-written evaluator report. Other completed interviews get a report generated from the transcript by `evaluation-engine.ts`.

### What a real system would connect

| Surface today | Next connection |
| --- | --- |
| `package-builder.ts` + prep animation | **Session Planner** agent: research, competency model, question tree, rubric |
| `interview-engine.ts` | **Interviewer** agent: live adaptive dialogue using the prepared brief |
| `evaluation-engine.ts` | **Evaluator** agent: evidence-only scoring from the transcript + rubric |
| `Simulate Interview Email` | Inbound email / calendar parser (Grok Bot or equivalent) that creates a `DETECTED` → `PREPARING` session |
| `store.tsx` | Persistence, auth, and job queues — out of scope for this MVP |

Grok Bot, in a later iteration, is the automation edge: watch mail, detect interview invites, open a session, and notify when the planner has moved the session to `READY`.

## Product states

`DETECTED` · `PREPARING` · `NEEDS_INPUT` · `READY` · `IN_PROGRESS` · `EVALUATING` · `COMPLETED` · `FAILED`

Each sidebar row shows company, role, status, and interview date when present. Auto-created sessions show **Created from email**.

## Out of scope

Auth, billing, profiles, admin, analytics, a real mail backend, and live LLM calls. Client state is sufficient for the MVP.
