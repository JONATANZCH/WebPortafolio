# JZ Portfolio

Professional portfolio + blog. **New project — complete rewrite from 2026-06-21.**

## Project Structure

- `frontend/` — Next.js 14 SSR app (Netlify)
- `backend/` — NestJS Lambda function (AWS)
- `sanity/` — Sanity CMS schema + config
- `docs/` — Design specs and implementation plans

## Quick Start

```bash
# Frontend dev
cd frontend && npm install && npm run dev
# Visit http://localhost:3000

# Backend dev
cd backend && npm install && npm run start:dev
# Listens on http://localhost:3001

# Sanity studio
cd sanity && npm install && npm run dev
# Visit http://localhost:3333
```

## Deployment

- Frontend: `npm run build` → Netlify auto-deploys on push to main
- Backend: `npm run build` → Manual deploy to Lambda via CLI or GitHub Actions
- CMS: Hosted at `<project>.sanity.studio` (no deployment needed)

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript, PostgreSQL (Neon)
- **CMS:** Sanity
- **Fonts:** Bricolage Grotesque (titles), Space Grotesk (body)

---

*Spec: docs/superpowers/specs/DESIGN_SPEC.md*
*Plan: docs/superpowers/plans/2026-06-21-portfolio-implementation.md*
