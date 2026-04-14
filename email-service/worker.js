/**
 * Legacy Architect RVA -- Audit Results Email Worker (v2 with Nurture Sequences)
 * Cloudflare Worker that:
 *   1. Receives audit results and emails them immediately (unchanged from v1)
 *   2. Runs a daily cron to send tier-based nurture emails at Day 2, 5, 9, 14
 *
 * Environment variables (set in Cloudflare dashboard):
 *   RESEND_API_KEY  -- Resend API key
 *   FROM_EMAIL      -- verified sender (e.g. results@legacyarchitectrva.com)
 *   ALLOWED_ORIGIN  -- site origin (e.g. https://legacyarchitectrva.com)
 *   HUBSPOT_API_KEY -- HubSpot private app token for contact queries + updates
 */

/* ================================================================
   NURTURE EMAIL TEMPLATES (15 total: 3 tiers x 5 emails each)
   Tier mapping from audit_tier property:
     "Critical Gaps" / "Needs Attention" -> Low
     "Nearly Complete"                   -> Mid
     "Fully Documented"                  -> High
   Day 5 has two variants: regular + business owner (Day5Biz)
   ================================================================ */

const NURTURE_EMAILS = {
  'High_Day14': {
    subject: 'The final mile of legacy planning',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>You took the audit. You scored well. You've clearly put real effort into organizing your life.</p><p>The question now is: <em style="color:#b0a494;">is it finished?</em></p><p>For most people, the answer is <em>close, but not quite</em>. There are always a few gaps — things you meant to document, accounts without access pathways, information in your head but not written down.</p><p>I'm currently accepting new clients through the <strong style="color:#c1b085;">Founding Families Initiative</strong> — a limited program for the first 5 households. Priority scheduling, your first annual review included, and <strong style="color:#c1b085;">$500 off any package</strong>.</p><p><strong style="color:#c1b085;">4 of 5 seats remain.</strong></p><p>For someone at your level, a focused engagement would close the remaining gaps and ensure everything is truly successor-ready.</p><p style="font-size: 13px; color: #8a7e6a;">No obligation. Completely confidential.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">BOOK YOUR 60-MINUTE CONSULTATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig Rothchild<br>Legacy Architect RVA<br><em>"Order in Your Absence"</em></div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'High_Day2': {
    subject: 'You\'re ahead of 76% of Americans',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>A couple of days ago, you completed the 7-Pillar Digital Audit — and your results were impressive.</p><p>You've clearly put thought into organizing your life. <strong style="color:#c1b085;">76% of Americans</strong> say a clear plan would bring them peace, yet the majority never build one. You have.</p><p>So what's left?</p><p>Even at your level, there's a meaningful difference between <strong style="color:#c1b085;">having documents</strong> and <strong style="color:#c1b085;">having a system</strong>. A system means someone else — someone who might be overwhelmed, grieving, or just unfamiliar — can follow it step by step without guesswork.</p><p>That's the gap that even well-organized people tend to have. The information exists, but it's not structured for a successor.</p><p>If you're curious about what the next level looks like, I'd enjoy that conversation.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">BOOK A PRIVATE CONVERSATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig</div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'High_Day5': {
    subject: 'From organized to truly protected',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>You've done the hard part. You've gathered documents, set up accounts, organized records.</p><p>But here's a question worth sitting with:</p><p><em style="color:#b0a494;">If you were suddenly unavailable — could the person you trust most step into your life and manage everything within 48 hours?</em></p><p>Not just find the will. But understand the full picture: which bills are on autopay, where the insurance policies are, who your financial advisor is, what the passwords are, how to access cloud storage, which subscriptions to cancel and which to keep.</p><p>That's the difference between organized and protected.</p><p>A Life Manual takes everything you've already built and structures it for the person who comes after you. It's not starting over — it's completing what you've started.</p><p>If you'd like to see what that completion looks like, I'd be happy to walk you through it.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">BOOK A 60-MINUTE CONSULTATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig</div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'High_Day5Biz': {
    subject: 'Your personal life is organized — but what about the business?',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>Your audit showed strong personal organization. But if you're a business owner, there's an entire layer that most people haven't fully addressed.</p><p>Operating agreements. Business banking access. Vendor relationships. Client obligations. Insurance policies. The daily operations that keep things running.</p><p>Your business probably represents your family's <strong style="color:#c1b085;">largest asset</strong>. Unlike a bank account or a house, a business can lose value quickly when the owner isn't available.</p><p>A Life Manual covers both sides — personal and business — in a single, unified system. For someone at your level, it's less about building from scratch and more about connecting the pieces.</p><p>If you'd like to see what that looks like for a business owner, I'd enjoy that conversation.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">BOOK A 60-MINUTE CONSULTATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig</div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'High_Day9': {
    subject: 'What your successor actually needs',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>Most people think about legacy planning from their own perspective. <em style="color:#b0a494;">What do I need to document?</em></p><p>But the real question is different: <strong style="color:#c1b085;">What does the person who steps in after me actually need?</strong></p><p>That shift changes everything.</p><p>Your successor doesn't need to know your system. They need a system designed for them — someone who may not know your passwords, your financial advisor, or where you keep important papers.</p><p>They need a step-by-step guide written in plain language, organized by priority, starting with the first 48 hours.</p><p>That's what a Life Manual is. Not a binder of documents — an operational blueprint for someone stepping into your life.</p><p>You've already built a strong foundation. The question is whether what you've built is written for you, or for them.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">SCHEDULE A CONVERSATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig</div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'Low_Day14': {
    subject: 'Your legacy plan doesn\'t have to wait',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>Two weeks ago, you took the 7-Pillar Audit and discovered some gaps in your continuity planning.</p><p>This work doesn't get easier with time. It gets harder. Life gets more complex. Accounts multiply. The longer you wait, the more there is to organize — and the higher the stakes if something happens before you do.</p><p>But the starting point is simple: one conversation.</p><p>Right now, I'm accepting new clients through the <strong style="color:#c1b085;">Founding Families Initiative</strong> — a limited program for the first 5 households. It includes priority scheduling, your first annual review included, and <strong style="color:#c1b085;">$500 off any package</strong>.</p><p><strong style="color:#c1b085;">4 of 5 seats are still available.</strong></p><p>If you've been thinking about getting organized, this is the easiest way to start.</p><p style="font-size: 13px; color: #8a7e6a;">No obligation. 100% confidential.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">BOOK YOUR 60-MINUTE CONSULTATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig Rothchild<br>Legacy Architect RVA<br><em>"Order in Your Absence"</em></div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'Low_Day2': {
    subject: 'What your audit revealed — and why it matters',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>You took the 7-Pillar Digital Audit a couple of days ago, and your results showed some significant gaps.</p><p>That's not a judgment — it's information. And the fact that you took the audit at all puts you ahead of most people. Fifty-two percent of American adults have no plan at all for their digital assets, let alone the rest.</p><p>Here's what those gaps mean in real terms:</p><p>When a family loses someone unexpectedly — or when someone becomes incapacitated — the people left behind don't just grieve. They search. For passwords. For account numbers. For documents they were sure existed but can't find. On average, families spend <strong style="color:#c1b085;">over 60 hours</strong> sorting through the chaos that a simple system could have prevented.</p><p>Your audit identified exactly where those gaps are in your life. That's the first step.</p><p>The second step is closing them.</p><p>If you'd like to talk through what came up in your results — no obligation, completely confidential — I offer a free 60-minute consultation where we walk through your specific situation together.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">BOOK A PRIVATE CONVERSATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">Warmly,<br>Craig Rothchild<br>Legacy Architect RVA</div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'Low_Day5': {
    subject: 'The 60-hour problem',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>When someone dies or becomes incapacitated without a clear system, the burden falls on the people closest to them.</p><p>It's not just emotional. It's operational.</p><p>Where are the bank accounts? Which bills are on autopay? Is there a will? Who has power of attorney?</p><p>The average family spends <strong style="color:#c1b085;">over 60 hours</strong> searching for answers to questions that should have been written down somewhere.</p><p>Your audit showed areas where this kind of confusion could happen in your life. Some of those gaps might feel small individually, but together they create real vulnerability.</p><p>The fix isn't complicated. It starts with getting everything into one place — organized, labeled, and written so someone else can actually follow it.</p><p>That's exactly what a Life Manual does.</p><p>If you want to see what closing those gaps looks like in practice, I'd love to walk you through it.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">BOOK A 60-MINUTE CONSULTATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig</div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'Low_Day5Biz': {
    subject: 'Your business is your most complex asset — and your biggest gap',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>When someone dies or becomes incapacitated without a clear system, the burden falls on the people closest to them.</p><p>But when a <strong style="color:#c1b085;">business owner</strong> is that person, the impact multiplies.</p><p>Your audit flagged gaps that go beyond personal — they extend into business continuity. Operating agreements. Vendor relationships. Client obligations. Business banking access. Insurance.</p><p>Your business is probably your family's largest asset. Without a documented continuity plan, that asset is at risk — not from fraud or market conditions, but from simple inaccessibility.</p><p>A Life Manual brings everything together — personal and business — into a single, navigable system that a successor can actually follow.</p><p>I work with business owners specifically on this. If you'd like to see what a complete continuity plan looks like for someone in your situation, let's talk.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">BOOK A 60-MINUTE CONSULTATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig</div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'Low_Day9': {
    subject: '3 things most families wish they\'d organized sooner',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>After working with families on their continuity plans, the same three things come up almost every time.</p><p><strong style="color:#c1b085;">1. Digital access.</strong><br>Not just passwords — recovery emails, two-factor authentication, security questions. Most people don't realize that locking down their accounts also locks out the people who might need access most.</p><p><strong style="color:#c1b085;">2. Financial visibility.</strong><br>Knowing that accounts exist is not the same as knowing how to access them. Auto-payments, investment accounts, crypto wallets, outstanding debts — if these aren't documented, they become invisible.</p><p><strong style="color:#c1b085;">3. The "who to call" list.</strong><br>Insurance agents. Attorneys. Financial advisors. Accountants. Doctors. The people who hold pieces of the picture.</p><p>Your audit touched on all of these areas. Closing those gaps doesn't have to be overwhelming. In 60 minutes, we can walk through your situation and build a plan.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">SCHEDULE YOUR FREE CONSULTATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig</div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'Mid_Day14': {
    subject: 'Turning complexity into clarity',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>Your situation is not as far from "complete" as it might feel.</p><p>You've already done real work. You have foundations in place. The challenge isn't building from scratch — it's <strong style="color:#c1b085;">connecting the pieces</strong> into a single system that holds up when it matters most.</p><p>That's what a Life Manual does.</p><p>I'm currently accepting new clients through the <strong style="color:#c1b085;">Founding Families Initiative</strong> — a limited program for the first 5 households. Priority scheduling, your first annual review included, and <strong style="color:#c1b085;">$500 off any package</strong>.</p><p><strong style="color:#c1b085;">4 of 5 seats remain.</strong></p><p>For someone in your position — with real foundations but real gaps — this is the fastest path to full coverage.</p><p style="font-size: 13px; color: #8a7e6a;">No obligation. 100% confidential.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">BOOK YOUR 60-MINUTE CONSULTATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig Rothchild<br>Legacy Architect RVA<br><em>"Order in Your Absence"</em></div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'Mid_Day2': {
    subject: 'Your audit revealed a pattern worth understanding',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>You took the 7-Pillar Digital Audit a couple of days ago, and your results landed in an interesting place.</p><p>You're not starting from zero — you've clearly taken steps. But your score suggests there's real complexity creating hidden risk.</p><p>This is the most common pattern I see. People who have <em style="color:#b0a494;">some</em> things in order but significant gaps in others. The danger isn't that nothing is done — it's that partial organization creates a <strong style="color:#c1b085;">false sense of security</strong>.</p><p>You have some accounts documented but not all. Some documents filed but not updated. Some plans made but not shared with the right people.</p><p>The result? When something happens, the people who step in find some answers quickly — and then hit walls they weren't expecting.</p><p>If you'd like to talk through what your results mean — no obligation, completely confidential — I'm here for it.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">BOOK A PRIVATE CONVERSATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">Warmly,<br>Craig Rothchild<br>Legacy Architect RVA</div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'Mid_Day5': {
    subject: 'The half-organized trap',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>There's a pattern I see often in families going through a crisis:</p><p>They find some things organized. A filing cabinet with key documents. A few passwords written down. Maybe even a will that's a few years old.</p><p>So they think: <em style="color:#b0a494;">"Okay, they had a plan."</em></p><p>But then they start pulling threads. The will references a closed account. The password list is missing the most important logins. The insurance policy exists but nobody knows which agent to call.</p><p>This is the <strong style="color:#c1b085;">"half-organized" trap</strong> — the family keeps finding <em>pieces</em> of a system, so they assume the whole system exists. They keep searching. And losing time they don't have.</p><p>Your audit results suggest you might be in this zone. Strong in some pillars, gaps in others.</p><p>A Life Manual turns those scattered pieces into one cohesive system — something a successor can follow from day one.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">BOOK A 60-MINUTE CONSULTATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig</div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'Mid_Day5Biz': {
    subject: 'The complexity multiplier — when business meets personal',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>Your audit showed a split that's extremely common among business owners: some personal pillars are strong, others have gaps — and the business layer adds a whole new dimension of complexity.</p><p>For most people, a gap means confusion. For a business owner, a gap means <strong style="color:#c1b085;">potential financial loss</strong> — not just for you, but for your employees, your clients, and your family.</p><p>Your business is likely your household's most complex asset. If you're suddenly unavailable, the personal and business challenges compound each other.</p><p>The partial organization you have makes this trickier, not easier. Someone stepping in finds some answers but not all — and for a business, the missing pieces create cascading problems.</p><p>A Life Manual is designed for exactly this kind of complexity — personal and business, unified in one system.</p><p>I work with business owners specifically because this intersection is where the stakes are highest.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">BOOK A 60-MINUTE CONSULTATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig</div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  },
  'Mid_Day9': {
    subject: 'The 3 gaps that create the most confusion',
    html: `<div style="font-family: Georgia, serif; color: #d4c8b4; background-color: #100d0a; padding: 40px 24px; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="font-size: 11px; letter-spacing: 4px; color: #8a7240; text-transform: uppercase;">Legacy Architect RVA</span>
  </div>
  <div style="font-size: 16px; line-height: 1.7; color: #c8bfad;">
    <p>The most damaging gaps aren't usually the ones people worry about. They're the ones hiding in plain sight.</p><p><strong style="color:#c1b085;">1. Access vs. awareness.</strong><br>Knowing an account exists is not the same as being able to access it. Your family might know about your investment accounts, but do they know the login credentials, recovery email, and two-factor method?</p><p><strong style="color:#c1b085;">2. The outdated document problem.</strong><br>Having a will from 2018 is better than nothing — but it can create new problems if your life has changed since then.</p><p><strong style="color:#c1b085;">3. The "I'll know what to do" assumption.</strong><br>Most people assume their spouse or kids will figure it out. But figuring it out under stress, while grieving — that's an entirely different challenge.</p><p>Your audit put you in a middle zone: some things are solid, some aren't. The risk is assuming the solid parts cover for the gaps. They usually don't.</p>
  </div>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://legacyarchitectrva.com/legacyarchitectrva/60min" style="font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #100d0a; background-color: #c1b085; padding: 14px 28px; border-radius: 2px; text-decoration: none; display: inline-block; text-transform: uppercase;">SCHEDULE YOUR FREE CONSULTATION</a>
  </div>
  <div style="color: #8a7e6a; margin-top: 24px;">— Craig</div>
  <div style="border-top: 1px solid #2a2218; padding-top: 24px; margin-top: 32px; text-align: center;">
    <p style="font-size: 10px; letter-spacing: 3px; color: #6b5a38; margin: 0;">LEGACY ARCHITECT RVA</p>
    <p style="font-style: italic; font-size: 12px; color: #8a7e6a; margin: 8px 0 0 0;">"Order in Your Absence"</p>
  </div>
</div>`
  }
};

/* ================================================================
   TIER MAPPING
   ================================================================ */

function getNurtureTier(auditTier) {
  if (!auditTier) return null;
  const t = auditTier.toLowerCase();
  if (t === 'critical gaps' || t === 'needs attention') return 'Low';
  if (t === 'nearly complete') return 'Mid';
  if (t === 'fully documented') return 'High';
  return null;
}

/* ================================================================
   MAIN EXPORT -- fetch (POST) + scheduled (cron)
   ================================================================ */

export default {
  /* ---- Immediate results email (unchanged from v1) ---- */
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env.ALLOWED_ORIGIN || '*') });
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

      const html = buildResultsEmail({ email, firstName, score, maxScore, percent, tier, businessOwner, pillars, recommendation });

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.FROM_EMAIL || 'Legacy Architect RVA <results@legacyarchitectrva.com>',
          to: [email],
          subject: `Your 7 Pillar Audit Results -- ${percent}% Continuity Score`,
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

  /* ---- Daily cron: send nurture emails ---- */
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runNurtureSequence(env));
  },
};

/* ================================================================
   NURTURE SEQUENCE LOGIC
   Runs daily via cron. Queries HubSpot for contacts due for each
   nurture day (2, 5, 9, 14), sends the right email, marks as sent.
   ================================================================ */

async function runNurtureSequence(env) {
  const HUBSPOT_TOKEN = env.HUBSPOT_API_KEY;
  if (!HUBSPOT_TOKEN) {
    console.error('HUBSPOT_API_KEY not configured');
    return;
  }

  const nurtureDays = [2, 5, 9, 14];

  for (const day of nurtureDays) {
    try {
      const contacts = await getContactsDueForDay(HUBSPOT_TOKEN, day);
      console.log(`Day ${day}: ${contacts.length} contacts due`);

      for (const contact of contacts) {
        try {
          await sendNurtureEmail(env, contact, day);
          await markNurtureSent(HUBSPOT_TOKEN, contact.id, day);
          console.log(`Sent Day ${day} to ${contact.id}`);
        } catch (err) {
          console.error(`Failed Day ${day} for ${contact.id}:`, err.message);
        }
      }
    } catch (err) {
      console.error(`Failed querying Day ${day}:`, err.message);
    }
  }
}

/* Query HubSpot for contacts due for a specific nurture day */
async function getContactsDueForDay(token, day) {
  const now = new Date();
  // Target: contacts created exactly `day` days ago (with a 24h window)
  const dayStart = new Date(now);
  dayStart.setDate(dayStart.getDate() - day);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setHours(23, 59, 59, 999);

  // Determine which nurture_last_sent value means "hasn't received this day yet"
  const prevDay = day === 2 ? 0 : day === 5 ? 2 : day === 9 ? 5 : 9;

  const filters = [
    // Must have an audit_tier (completed the audit)
    { propertyName: 'audit_tier', operator: 'HAS_PROPERTY' },
    // Created in the right date window
    { propertyName: 'createdate', operator: 'GTE', value: dayStart.getTime().toString() },
    { propertyName: 'createdate', operator: 'LTE', value: dayEnd.getTime().toString() },
  ];

  // For Day 2, nurture_last_sent should not exist or be 0
  // For later days, nurture_last_sent should be the previous day value
  if (day === 2) {
    filters.push({
      propertyName: 'nurture_last_sent',
      operator: 'NOT_HAS_PROPERTY',
    });
  } else {
    filters.push({
      propertyName: 'nurture_last_sent',
      operator: 'EQ',
      value: String(prevDay),
    });
  }

  // Use OR group: for Day 2, also match nurture_last_sent = "0"
  const filterGroups = [{ filters }];
  if (day === 2) {
    filterGroups.push({
      filters: [
        { propertyName: 'audit_tier', operator: 'HAS_PROPERTY' },
        { propertyName: 'createdate', operator: 'GTE', value: dayStart.getTime().toString() },
        { propertyName: 'createdate', operator: 'LTE', value: dayEnd.getTime().toString() },
        { propertyName: 'nurture_last_sent', operator: 'EQ', value: '0' },
      ]
    });
  }

  const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filterGroups,
      properties: ['email', 'firstname', 'audit_tier', 'audit_percent', 'business_owner', 'nurture_last_sent'],
      limit: 100,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HubSpot search failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  return (data.results || []).map(r => ({
    id: r.id,
    email: r.properties.email,
    firstName: r.properties.firstname || '',
    auditTier: r.properties.audit_tier,
    auditPercent: r.properties.audit_percent,
    businessOwner: r.properties.business_owner === 'Yes',
  }));
}

/* Send the right nurture email for a contact + day */
async function sendNurtureEmail(env, contact, day) {
  const tier = getNurtureTier(contact.auditTier);
  if (!tier) {
    console.log(`Skipping ${contact.id}: unknown tier "${contact.auditTier}"`);
    return;
  }

  // Day 5: use business owner variant if applicable
  let emailKey;
  if (day === 5 && contact.businessOwner) {
    emailKey = `${tier}_Day5Biz`;
  } else {
    emailKey = `${tier}_Day${day}`;
  }

  const template = NURTURE_EMAILS[emailKey];
  if (!template) {
    console.error(`No template for key: ${emailKey}`);
    return;
  }

  // Wrap the body HTML in the full email frame
  const fullHtml = wrapNurtureEmail(template.html);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL || 'Legacy Architect RVA <results@legacyarchitectrva.com>',
      to: [contact.email],
      subject: template.subject,
      html: fullHtml,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend send failed: ${res.status} ${err}`);
  }
}

/* Mark a contact as having received a specific nurture day */
async function markNurtureSent(token, contactId, day) {
  const res = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { nurture_last_sent: String(day) },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HubSpot update failed: ${res.status} ${err}`);
  }
}

/* Wrap nurture body in a full HTML email document */
function wrapNurtureEmail(bodyHtml) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0806;font-family:Georgia,'Bodoni Moda',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0806;border:0;">
<tr><td align="center" style="padding:20px 10px;border:0;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border:0;">
<tr><td style="border:0;">${bodyHtml}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/* ================================================================
   ORIGINAL HELPERS (unchanged from v1)
   ================================================================ */

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

/* ================================================================
   ORIGINAL RESULTS EMAIL TEMPLATE (unchanged from v1)
   ================================================================ */

function tierColor(tier) {
  if (tier === 'Fully Documented') return '#4a7c59';
  if (tier === 'Nearly Complete') return '#7a8a3e';
  if (tier === 'Needs Attention') return '#b8984e';
  return '#8b3a3a';
}

function tierEmoji(tier) {
  if (tier === 'Fully Documented') return '\u2705';
  if (tier === 'Nearly Complete') return '\ud83d\udfe1';
  if (tier === 'Needs Attention') return '\ud83d\udfe0';
  return '\ud83d\udd34';
}

function buildResultsEmail({ email, firstName, score, maxScore, percent, tier, businessOwner, pillars, recommendation }) {
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
        const icon = item.na ? '\u2796' : (item.checked ? '\u2705' : '\u274c');
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

  <tr><td align="center" style="padding:40px 30px 20px;border:0;">
    <div style="font-family:'Cinzel',Georgia,serif;font-size:11px;letter-spacing:6px;color:#b8984e;text-transform:uppercase;margin-bottom:20px;">Legacy Architect RVA</div>
    <div style="width:50px;height:1px;background:linear-gradient(90deg,transparent,#4a3d28,transparent);margin:0 auto 20px;"></div>
    <div style="font-family:'Cinzel',Georgia,serif;font-size:13px;letter-spacing:5px;color:#b8984e;text-transform:uppercase;margin-bottom:14px;">7 Pillar Audit</div>
    <div style="font-family:'Cinzel',Georgia,serif;font-size:26px;font-weight:700;color:#fdfcfa;letter-spacing:2px;line-height:1.3;">Your Continuity Score</div>
  </td></tr>

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

  <tr><td align="center" style="padding:10px 0;border:0;">
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#4a3d28,transparent);"></div>
  </td></tr>

  <tr><td style="padding:10px 30px 20px;border:0;">
    <div style="font-family:'Cinzel',Georgia,serif;font-size:12px;letter-spacing:4px;color:#b8984e;margin-bottom:10px;text-transform:uppercase;">Pillar Breakdown</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:0;">
      ${pillarRows}
    </table>
  </td></tr>

  ${recommendation ? `
  <tr><td style="padding:20px 30px;border:0;">
    <div style="background:#13100c;border:1px solid #2a2218;border-radius:6px;padding:24px;">
      <div style="font-family:'Cinzel',Georgia,serif;font-size:11px;letter-spacing:4px;color:#b8984e;margin-bottom:12px;text-transform:uppercase;">Your Recommended Next Step</div>
      <div style="font-family:Georgia,serif;font-size:16px;font-style:italic;color:#fdfcfa;line-height:1.6;">${recommendation}</div>
    </div>
  </td></tr>` : ''}

  <tr><td align="center" style="padding:20px 0 10px;border:0;">
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#4a3d28,transparent);"></div>
  </td></tr>

  <tr><td align="center" style="padding:20px 30px 10px;border:0;">
    <a href="https://cal.com/legacyarchitectrva/free-consult" style="display:inline-block;font-family:'Cinzel',Georgia,serif;font-size:13px;font-weight:700;letter-spacing:3px;color:#100d0a;background:linear-gradient(135deg,#c1b085,#d4c4a0);padding:14px 36px;border-radius:2px;text-decoration:none;text-transform:uppercase;">Book a Free Call</a>
  </td></tr>
  <tr><td align="center" style="padding:0 30px 10px;border:0;">
    <div style="font-family:Georgia,serif;font-size:14px;font-style:italic;color:#c1b085;line-height:1.6;">A <strong>Life Manual</strong>\u2122 closes these gaps before someone else has to.</div>
  </td></tr>

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
