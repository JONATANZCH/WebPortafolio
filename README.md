# JZ Portfolio

Personal portfolio + technical blog for Jonatan Zarate. Built with Next.js (frontend), NestJS on AWS Lambda (backend API), and Sanity CMS.

## Project Structure

```
/
├── frontend/       Next.js 16 (SSR + ISR) — deployed to Netlify
├── backend/        NestJS + TypeORM — deployed to AWS Lambda via Serverless Framework
├── sanity/         Sanity Studio v3 schema — hosted at sanity.studio
├── scripts/        Developer utilities (E2E test runner, etc.)
└── docs/           Design specs and implementation plans
```

## Quick Start

Copy environment files first:

```bash
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.local.example  backend/.env.local
cp sanity/.env.local.example   sanity/.env.local
# Then fill in real values (see docs/DEPLOYMENT.md)
```

Start all three services:

```bash
# Terminal 1 — Frontend (http://localhost:3000)
cd frontend && npm install && npm run dev

# Terminal 2 — Backend API (http://localhost:3001)
cd backend && npm install && npm run start:dev

# Terminal 3 — Sanity Studio (http://localhost:3333)
cd sanity && npm install && npm run dev
```

Run the E2E contact form test (requires all 3 services):

```bash
bash scripts/test-e2e-contact.sh
```

## Deployment

| Service | Platform | Trigger |
|---------|----------|---------|
| Frontend | Netlify | Push to `main` — auto-deploy |
| Backend API | AWS Lambda (Serverless Framework) | `cd backend && npx serverless deploy` |
| Sanity Studio | Sanity-hosted | `cd sanity && npm run deploy` |

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full step-by-step guide.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, TypeScript, CSS Modules, Sanity client |
| Backend | NestJS, TypeORM, PostgreSQL (Neon), SendGrid |
| CMS | Sanity v3 (GROQ queries, Portable Text) |
| Infrastructure | AWS Lambda, Netlify, GitHub Actions CI |
| Fonts | Bricolage Grotesque (headings), Space Grotesk (body) |

## CI

GitHub Actions runs on every push / PR to `main`:

- **Frontend**: `tsc --noEmit` + `next build`
- **Backend**: `tsc --noEmit` + `nest build`

See [.github/workflows/build.yml](.github/workflows/build.yml).

---

*Design spec: `docs/superpowers/specs/DESIGN_SPEC.md`*
*Implementation plan: `docs/superpowers/plans/2026-06-21-portfolio-implementation.md`*
