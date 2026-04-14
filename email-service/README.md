# Legacy Architect — Audit Results Email Service

Cloudflare Worker that automatically emails 7 Pillar Audit results to users after they complete the audit.

## How It Works

1. User completes the audit and enters their email
2. `audit7.js` sends results to this worker via POST
3. Worker generates a branded HTML email with score, pillar breakdown, and CTAs
4. Email is sent via [Resend](https://resend.com) (free tier: 100 emails/day)

## Setup (one-time, ~5 minutes)

### 1. Create a Resend Account
- Go to [resend.com](https://resend.com) and sign up
- Add your domain (`legacyarchitectrva.com`) and verify DNS records
- Create an API key → copy it

### 2. Create a Cloudflare Account
- Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign up (free)
- Install Wrangler CLI: `npm install -g wrangler`
- Login: `npx wrangler login`

### 3. Deploy
```bash
cd email-service
npx wrangler secret put RESEND_API_KEY
# Paste your Resend API key when prompted

npx wrangler deploy
```

Your worker URL will be: `https://la-audit-email.<your-subdomain>.workers.dev`

### 4. Update audit7.js
Replace `__WORKER_URL__` in audit7.js with your worker URL.

## Configuration

Edit `wrangler.toml` to change:
- `FROM_EMAIL` — the sender address (must be verified in Resend)
- `ALLOWED_ORIGIN` — your website URL (CORS protection)

## API

**POST /** — Send audit results email

```json
{
  "email": "user@example.com",
  "firstName": "John",
  "score": 24,
  "maxScore": 42,
  "percent": 57,
  "tier": "Needs Attention",
  "businessOwner": true,
  "recommendation": "Start with your Digital Life pillar...",
  "pillars": [
    {
      "name": "Digital Life",
      "checked": 4,
      "max": 6,
      "tier": "Needs Attention",
      "items": [
        { "name": "Primary Email Account Access", "checked": true, "na": false },
        { "name": "Master Password Manager Vault", "checked": false, "na": false },
        { "name": "Cloud Storage & Photo Archives", "checked": true, "na": false }
      ]
    }
  ]
}
```

Returns `{ "success": true }` on success.

## Costs

- **Cloudflare Workers**: Free (100,000 requests/day)
- **Resend**: Free (100 emails/day, 3,000/month)

For higher volume, Resend Pro is $20/month for 50,000 emails.
