/**
 * Legacy Architect RVA — Audit Results Email Worker
 * Cloudflare Worker that receives audit results and emails them to the user.
 *
 * Environment variables (set in Cloudflare dashboard):
 *   RESEND_API_KEY  — your Resend API key
 *   FROM_EMAIL      — verified sender (e.g. results@legacyarchitectrva.com)
 *   ALLOWED_ORIGIN  — your site origin (e.g. https://legacyarchitectrva.com)
 */

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(env.ALLOWED_ORIGIN || '*'),
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, env.ALLOWED_ORIGIN);
    }

    try {
      const data = await request.json();
      const { email, firstName, score, maxScore, percent, tier, businessOwner, pillars, recommendation } = data;

      if (!email || !score || !pillars) {
        return jsonResponse({ error: 'Missing required fields' }, 400, env.ALLOWED_ORIGIN);
      }

      const html = buildEmail({ email, firstName, score, maxScore, percent, tier, businessOwner, pillars, recommendation });

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.FROM_EMAIL || 'Legacy Architect RVA <results@legacyarchitectrva.com>',
          to: [email],
          subject: `Your 7 Pillar Audit Results — ${percent}% Continuity Score`,
          html: html,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Resend error:', err);
        return jsonResponse({ error: 'Email delivery failed' }, 502, env.ALLOWED_ORIGIN);
      }

      return jsonResponse({ success: true }, 200, env.ALLOWED_ORIGIN);
    } catch (e) {
      console.error('Worker error:', e);
      return jsonResponse({ error: 'Internal error' }, 500, env.ALLOWED_ORIGIN);
    }
  },
};

/* ── Helpers ─────────────────────────────────────────── */

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

/* ── Email Template ──────────────────────────────────── */

function tierColor(tier) {
  if (tier === 'Fully Documented') return '#4a7c59';
  if (tier === 'Nearly Complete') return '#7a8a3e';
  if (tier === 'Needs Attention') return '#b8984e';
  return '#8b3a3a'; // Critical Gaps
}

function tierEmoji(tier) {
  if (tier === 'Fully Documented') return '✅';
  if (tier === 'Nearly Complete') return '🟡';
  if (tier === 'Needs Attention') return '🟠';
  return '🔴';
}

function buildEmail({ email, firstName, score, maxScore, percent, tier, businessOwner, pillars, recommendation }) {
  const name = firstName || email.split('@')[0];
  const tc = tierColor(tier);

  let pillarRows = '';
  for (const p of pillars) {
    const pTier = p.tier || 'Critical Gaps';
    const pColor = tierColor(pTier);
    const pEmoji = tierEmoji(pTier);
    const barWidth = p.max > 0 ? Math.round((p.checked / p.max) * 100) : 0;

    let itemRows = '';
    if (p.items && p.items.length) {
      for (const item of p.items) {
        const icon = item.na ? '➖' : (item.checked ? '✅' : '❌');
        const label = item.na ? `<span style="color:#888;">${item.name} (N/A)</span>` : item.name;
        itemRows += `<tr><td style="padding:4px 0 4px 12px;font-family:Georgia,'Bodoni Moda',serif;font-size:14px;color:#d4d0c8;border:0;">${icon}&nbsp; ${label}</td></tr>`;
      }
    }

    pillarRows += `
      <tr><td style="padding:20px 0 6px;border:0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:0;">
          <tr>
            <td style="font-family:'Cinzel',Georgia,serif;font-size:13px;font-weight:700;letter-spacing:2px;color:#fdfcfa;text-transform:uppercase;padding-bottom:4px;border:0;">${p.name}</td>
            <td align="right" style="font-family:'Cinzel',Georgia,serif;font-size:18px;font-weight:700;color:#c1b085;border:0;">${p.checked}/${p.max}</td>
          </tr>
          <tr><td colspan="2" style="padding:4px 0;border:0;">
            <div style="background:#1a1510;border-radius:4px;height:8px;width:100%;">
              <div style="background:linear-gradient(90deg,${pColor},#c1b085);height:8px;border-radius:4px;width:${barWidth}%;"></div>
            </div>
          </td></tr>
          <tr><td colspan="2" style="padding:2px 0 0;border:0;">
            <span style="font-family:Georgia,serif;font-size:12px;font-weight:600;color:${pColor};letter-spacing:1px;">${pEmoji} ${pTier.toUpperCase()}</span>
          </td></tr>
          ${itemRows ? `<tr><td colspan="2" style="border:0;"><table width="100%" cellpadding="0" cellspacing="0" style="border:0;">${itemRows}</table></td></tr>` : ''}
        </table>
      </td></tr>`;
  }

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0806;font-family:Georgia,'Bodoni Moda',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0806;border:0;">
<tr><td align="center" style="padding:20px 10px;border:0;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:0;">

  <!-- Header -->
  <tr><td align="center" style="padding:40px 30px 20px;border:0;">
    <div style="font-family:'Cinzel',Georgia,serif;font-size:11px;letter-spacing:6px;color:#b8984e;text-transform:uppercase;margin-bottom:20px;">Legacy Architect RVA</div>
    <div style="width:50px;height:1px;background:linear-gradient(90deg,transparent,#4a3d28,transparent);margin:0 auto 20px;"></div>
    <div style="font-family:'Cinzel',Georgia,serif;font-size:13px;letter-spacing:5px;color:#b8984e;text-transform:uppercase;margin-bottom:14px;">7 Pillar Audit</div>
    <div style="font-family:'Cinzel',Georgia,serif;font-size:26px;font-weight:700;color:#fdfcfa;letter-spacing:2px;line-height:1.3;">Your Continuity Score</div>
  </td></tr>

  <!-- Score Ring -->
  <tr><td align="center" style="padding:20px 30px;border:0;">
    <table cellpadding="0" cellspacing="0" style="border:0;">
      <tr><td align="center" style="width:140px;height:140px;border-radius:50%;border:3px solid ${tc};text-align:center;vertical-align:middle;">
        <div style="font-family:'Cinzel',Georgia,serif;font-size:48px;font-weight:700;color:#fdfcfa;line-height:1;">${percent}<span style="font-size:22px;color:#c1b085;">%</span></div>
        <div style="font-family:Georgia,serif;font-size:12px;color:#c1b085;margin-top:2px;">${score} of ${maxScore}</div>
      </td></tr>
    </table>
    <div style="margin-top:14px;font-family:'Cinzel',Georgia,serif;font-size:12px;font-weight:600;letter-spacing:2px;color:${tc};text-transform:uppercase;">${tier}</div>
    ${businessOwner !== undefined ? `<div style="margin-top:8px;font-family:Georgia,serif;font-size:13px;color:#888;">Business Owner: ${businessOwner ? 'Yes' : 'No'}</div>` : ''}
  </td></tr>

  <!-- Divider -->
  <tr><td align="center" style="padding:10px 0;border:0;">
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#4a3d28,transparent);"></div>
  </td></tr>

  <!-- Pillar Breakdown -->
  <tr><td style="padding:10px 30px 20px;border:0;">
    <div style="font-family:'Cinzel',Georgia,serif;font-size:12px;letter-spacing:4px;color:#b8984e;margin-bottom:10px;text-transform:uppercase;">Pillar Breakdown</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:0;">
      ${pillarRows}
    </table>
  </td></tr>

  <!-- Recommendation -->
  ${recommendation ? `
  <tr><td style="padding:20px 30px;border:0;">
    <div style="background:#13100c;border:1px solid #2a2218;border-radius:6px;padding:24px;">
      <div style="font-family:'Cinzel',Georgia,serif;font-size:11px;letter-spacing:4px;color:#b8984e;margin-bottom:12px;text-transform:uppercase;">Your Recommended Next Step</div>
      <div style="font-family:Georgia,serif;font-size:16px;font-style:italic;color:#fdfcfa;line-height:1.6;">${recommendation}</div>
    </div>
  </td></tr>` : ''}

  <!-- Divider -->
  <tr><td align="center" style="padding:20px 0 10px;border:0;">
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#4a3d28,transparent);"></div>
  </td></tr>

  <!-- CTA: Book a Call -->
  <tr><td align="center" style="padding:20px 30px 10px;border:0;">
    <a href="https://cal.com/legacyarchitectrva/free-consult" style="display:inline-block;font-family:'Cinzel',Georgia,serif;font-size:13px;font-weight:700;letter-spacing:3px;color:#100d0a;background:linear-gradient(135deg,#c1b085,#d4c4a0);padding:14px 36px;border-radius:2px;text-decoration:none;text-transform:uppercase;">Book a Free Call</a>
  </td></tr>
  <tr><td align="center" style="padding:0 30px 10px;border:0;">
    <div style="font-family:Georgia,serif;font-size:14px;font-style:italic;color:#c1b085;line-height:1.6;">A <strong>Life Manual</strong>&#8482; closes these gaps before someone else has to.</div>
  </td></tr>

  <!-- Secondary CTAs -->
  <tr><td align="center" style="padding:20px 30px;border:0;">
    <table cellpadding="0" cellspacing="0" style="border:0;">
      <tr>
        <td style="padding:0 8px;border:0;">
          <a href="https://legacyarchitectrva.com/#pricing" style="font-family:'Cinzel',Georgia,serif;font-size:11px;letter-spacing:2px;color:#c1b085;text-decoration:underline;text-transform:uppercase;">View Pricing</a>
        </td>
        <td style="color:#4a3d28;padding:0 4px;border:0;">|</td>
        <td style="padding:0 8px;border:0;">
          <a href="https://legacyarchitectrva.com/#workbook" style="font-family:'Cinzel',Georgia,serif;font-size:11px;letter-spacing:2px;color:#c1b085;text-decoration:underline;text-transform:uppercase;">Download Workbook</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td align="center" style="padding:30px;border-top:1px solid #1a1510;border-bottom:0;border-left:0;border-right:0;">
    <div style="font-family:Georgia,serif;font-size:12px;color:#555;line-height:1.8;">
      Legacy Architect RVA<br>
      <a href="https://legacyarchitectrva.com" style="color:#b8984e;text-decoration:none;">legacyarchitectrva.com</a>
    </div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
