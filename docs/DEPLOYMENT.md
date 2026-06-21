# Deployment Guide

Step-by-step instructions for deploying the JZ Portfolio stack to production.

## Overview

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Netlify | `https://jonatanzarate.dev` |
| Backend API | AWS Lambda (Serverless Framework) | `https://api.jonatanzarate.dev` |
| Sanity Studio | Sanity-hosted | `https://jz-portfolio.sanity.studio` |
| Database | Neon (PostgreSQL) | — |

---

## Prerequisites

- Node.js 20+
- AWS CLI configured (`aws configure`)
- Netlify CLI: `npm install -g netlify-cli`
- Serverless Framework: `npm install -g serverless`
- A Sanity account at https://sanity.io
- A Neon account at https://neon.tech
- A SendGrid account at https://sendgrid.com

---

## 1. Sanity CMS

### First-time setup

1. Log in: `npx sanity login`
2. The project ID is already set: `ohw2y3ub` (dataset: `production`).
3. Deploy the Studio:

```bash
cd sanity
npm install
npm run deploy
```

The Studio will be live at `https://jz-portfolio.sanity.studio`.

### Update schemas

After modifying `sanity/schemaTypes/`:

```bash
cd sanity && npm run deploy
```

---

## 2. Database (Neon)

1. Create a project at https://console.neon.tech
2. Copy the connection string (format: `postgresql://user:pass@host/dbname?sslmode=require`)
3. The backend uses TypeORM with `synchronize: true` in development — the schema is created automatically on first start.
4. For production, set `synchronize: false` and run migrations manually (TODO: add migration setup).

---

## 3. Backend API (AWS Lambda)

### Environment variables

Create `backend/.env.local` (or set in AWS SSM Parameter Store for production):

```env
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
SENDGRID_API_KEY=SG.your_actual_key
CONTACT_TO_EMAIL=jonatanzch@gmail.com
CONTACT_FROM_EMAIL=no-reply@jonatanzarate.dev
```

### Build and deploy

```bash
cd backend
npm install
npm run build               # Compiles TypeScript to dist/
npx serverless deploy       # Deploys to AWS Lambda + API Gateway
```

The deploy output includes the API Gateway URL, for example:
`https://abc123.execute-api.us-east-1.amazonaws.com/prod`

### Verify

```bash
curl https://abc123.execute-api.us-east-1.amazonaws.com/prod/health
# Expected: {"status":"OK"}
```

### Custom domain (optional)

1. In AWS API Gateway, add a custom domain mapping to `api.jonatanzarate.dev`
2. Point the CNAME in your DNS provider to the API Gateway regional domain.

---

## 4. Frontend (Netlify)

### Link the project

```bash
cd frontend
npm install
netlify login
netlify link    # Select your Netlify site or create a new one
```

### Environment variables

Set these in the Netlify dashboard (Site settings → Environment variables):

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `ohw2y3ub` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_API_URL` | your Lambda API Gateway URL |

### Deploy

Netlify auto-deploys on every push to `main`. To trigger a manual deploy:

```bash
netlify deploy --prod
```

Or via the Netlify dashboard → Deploys → Trigger deploy.

### Plugin

`netlify.toml` references `@netlify/plugin-nextjs` — install it in the Netlify dashboard under
Site settings → Build plugins, or it will be installed automatically.

---

## 5. GitHub Actions CI

The workflow at `.github/workflows/build.yml` runs on every push and PR to `main`:

- Type-checks and builds the frontend
- Type-checks and builds the backend

No secrets are required for the build step (Sanity project ID is not sensitive). If you want
the frontend build to fetch real content during CI, add these to GitHub repository secrets:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_API_URL`

---

## 6. End-to-End Verification

After deploying all services, run the E2E script against production:

```bash
FRONTEND_URL=https://jonatanzarate.dev \
BACKEND_URL=https://api.jonatanzarate.dev \
bash scripts/test-e2e-contact.sh
```

### Manual checklist

- [ ] Home page loads: hero, projects grid, timeline, testimonials, blog preview, footer
- [ ] `/blog` lists Sanity posts
- [ ] `/blog/[slug]` renders post with Portable Text
- [ ] `/contact` form submits successfully (check email inbox)
- [ ] Sanity Studio: add/edit a project → refresh site → content appears (ISR revalidation ~5 min)
- [ ] GitHub Actions: all checks green on the latest commit

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Home page shows no projects/posts | Sanity env vars missing | Check `NEXT_PUBLIC_SANITY_PROJECT_ID` in Netlify |
| Contact form returns 500 | Backend `DATABASE_URL` invalid | Verify Neon connection string in Lambda env |
| Email not received | `SENDGRID_API_KEY` unset or domain unverified | Set key + verify sender domain in SendGrid |
| TypeScript errors in CI | Dependency version mismatch | Run `npm ci` locally, commit updated lockfile |

---

*Last updated: 2026-06-21*
