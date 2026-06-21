#!/usr/bin/env bash
# test-e2e-contact.sh
# Verifies the contact form end-to-end flow with all 3 services running.
# Usage: ./scripts/test-e2e-contact.sh
#
# Prerequisites:
#   1. frontend/.env.local  — NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_API_URL
#   2. backend/.env.local   — DATABASE_URL, SENDGRID_API_KEY, CONTACT_TO_EMAIL
#   3. All 3 services running: frontend:3000, backend:3001, sanity:3333

set -euo pipefail

FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
BACKEND_URL="${BACKEND_URL:-http://localhost:3001}"

echo "=== E2E Contact Form Test ==="
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
echo ""

# 1. Verify home page loads
echo "[1/5] Checking home page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$STATUS" = "200" ]; then
  echo "  PASS - home page returned 200"
else
  echo "  FAIL - home page returned $STATUS"
  exit 1
fi

# 2. Verify backend health endpoint
echo "[2/5] Checking backend health..."
HEALTH=$(curl -s "$BACKEND_URL/health" 2>/dev/null || echo "")
if echo "$HEALTH" | grep -q '"status":"OK"'; then
  echo "  PASS - backend health OK"
else
  echo "  FAIL - backend health check failed: $HEALTH"
  exit 1
fi

# 3. Verify contact page loads
echo "[3/5] Checking /contact page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/contact")
if [ "$STATUS" = "200" ]; then
  echo "  PASS - /contact returned 200"
else
  echo "  FAIL - /contact returned $STATUS"
  exit 1
fi

# 4. Submit a test contact form message
echo "[4/5] Submitting test contact message..."
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test E2E Runner",
    "email": "test@example.com",
    "subject": "E2E Test Message",
    "message": "This is an automated E2E test submission. Please ignore."
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "  PASS - message saved (response: $RESPONSE)"
else
  echo "  FAIL - unexpected response: $RESPONSE"
  exit 1
fi

# 5. Verify blog page loads with Sanity content
echo "[5/5] Checking /blog page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/blog")
if [ "$STATUS" = "200" ]; then
  echo "  PASS - /blog returned 200"
else
  echo "  FAIL - /blog returned $STATUS"
  exit 1
fi

echo ""
echo "=== All E2E checks passed ==="
echo ""
echo "Manual verification steps:"
echo "  1. Open $FRONTEND_URL - confirm all sections render (hero, projects, timeline, testimonials, blog)"
echo "  2. Check email inbox for the contact notification from SendGrid"
echo "  3. Open http://localhost:3333 (Sanity Studio), add a project,"
echo "     then refresh $FRONTEND_URL to confirm live content updates"
