(function () {
  var HUBSPOT_PORTAL_ID = "244990054";
  var HUBSPOT_FORM_ID = "8def8d38-97f9-4c65-8c3e-fd5b4653c121";

  var P = [
    {
      n: "Digital Life",
      d: "Access and continuity for essential digital accounts, credentials, and archives.",
      i: [
        "PRIMARY EMAIL ACCOUNT ACCESS",
        "MASTER PASSWORD MANAGER VAULT",
        "CLOUD STORAGE & PHOTO ARCHIVES",
        "TWO-FACTOR AUTH (2FA) RECOVERY KEYS",
        "SOCIAL MEDIA LEGACY CONTACTS",
        "DIGITAL MEDIA ARCHIVES"
      ]
    },
    {
      n: "Financial & Assets",
      d: "Documentation of all financial accounts, obligations, and automated payment systems.",
      i: [
        "BANKING & CREDIT CARD ACCESS",
        "INVESTMENT & RETIREMENT ACCOUNTS",
        "CRYPTOCURRENCY WALLETS & KEYS",
        "AUTOMATED BILL PAYMENTS LIST",
        "TAX RETURNS & FINANCIAL RECORDS",
        "DEBT & LOAN DOCUMENTATION"
      ]
    },
    {
      n: "Household & Property",
      d: "Physical property records, access information, and household operational documentation.",
      i: [
        "PROPERTY DEEDS & TITLES",
        "VEHICLE REGISTRATIONS",
        "HOME MAINTENANCE RECORDS",
        "UTILITY ACCOUNT ACCESS",
        "PHYSICAL ASSET INVENTORY",
        "STORAGE UNIT KEYS & ACCESS"
      ]
    },
    {
      n: "Health & Medical",
      d: "Medical history, healthcare directives, and emergency access information.",
      i: [
        "HEALTH INSURANCE INFORMATION",
        "MEDICAL RECORDS & HISTORY",
        "PRESCRIPTION MEDICATIONS LIST",
        "ADVANCE HEALTHCARE DIRECTIVE",
        "ORGAN DONOR STATUS",
        "EMERGENCY CONTACTS LIST"
      ]
    },
    {
      n: "Legal & Estate",
      d: "Legal instruments, policy documentation, and estate planning records.",
      i: [
        "LAST WILL & TESTAMENT",
        "TRUST DOCUMENTATION",
        "POWERS OF ATTORNEY",
        "LIFE INSURANCE POLICIES",
        "GUARDIANSHIP DESIGNATIONS",
        "BUSINESS SUCCESSION PLAN"
      ]
    },
    {
      n: "Business Continuity",
      d: "Operational documentation for business owners, including entity records, access, and transition planning.",
      i: [
        "BUSINESS ENTITY DOCUMENTS",
        "BUSINESS BANKING & CREDIT ACCESS",
        "OPERATING OR PARTNERSHIP AGREEMENTS",
        "BUSINESS INSURANCE POLICIES",
        "KEY VENDOR & CLIENT CONTACTS",
        "BUSINESS CONTINUITY INSTRUCTIONS"
      ]
    },
    {
      n: "Legacy & Wishes",
      d: "Personal statements, end-of-life preferences, and enduring messages for those left behind.",
      i: [
        "PERSONAL LETTERS & MESSAGES",
        "ETHICAL WILL STATEMENT",
        "FUNERAL PREFERENCES",
        "OBITUARY INFORMATION",
        "HEIRLOOM STORIES",
        "CHARITABLE GIVING WISHES"
      ]
    }
  ];

  var GD = [
    [
      "Email is the recovery method for nearly every other account. Without access, password resets fail across the board.",
      "Without a centralized credential system, a successor would need to recover each account individually, a process that can take weeks or months, with some accounts lost permanently.",
      "Family photos, documents, and personal files stored in the cloud can become permanently inaccessible if credentials are lost.",
      "If 2FA is enabled without stored recovery keys, accounts become permanently inaccessible. This is one of the most common causes of irreversible digital lockout.",
      "Without designated legacy contacts, social media accounts may be memorialized, deleted, or hijacked, with no way to recover meaningful content.",
      "Digital purchases, streaming libraries, and media collections are tied to accounts. Without access documentation, they disappear."
    ],
    [
      "Without account documentation, a successor may not know which institutions to contact, leading to missed payments, penalties, and frozen funds.",
      "Retirement and brokerage accounts each have different beneficiary and access requirements. Gaps here can mean months of legal process.",
      "Cryptocurrency without documented recovery keys is permanently lost. There is no institution to call and no reset to request.",
      "Automated payments continue after incapacitation or death. Without a list, successors discover them only when accounts overdraft or services are cut.",
      "Tax history is required for settlement, insurance claims, and financial transfers.}

// === FULL RESULTS (ONLY AFTER EMAIL) ===
function fullResultsHTML(){
  return `
  <div style="max-width:620px;margin:0 auto;text-align:center;">

    <div style="font-family:Cinzel,serif;font-size:18px;letter-spacing:3px;color:#fdfcfa;margin-bottom:20px;">
      YOUR FULL RESULTS
    </div>

    <div style="max-width:560px;margin:0 auto 22px;font-family:'Bodoni Moda',serif;font-size:18px;font-style:italic;line-height:1.8;color:#d1c4b0;">
      Your audit revealed gaps across multiple systems. This is not unusual.
    </div>

    <div style="max-width:560px;margin:0 auto 18px;font-family:'Bodoni Moda',serif;font-size:18px;font-style:italic;line-height:1.8;color:#d1c4b0;">
      The highest-risk areas are usually access, records, and missing instructions for the person who would need to step in.
    </div>

    <div style="max-width:560px;margin:0 auto 32px;font-family:'Bodoni Moda',serif;font-size:18px;font-style:italic;line-height:1.8;color:#d1c4b0;">
      Your full checklist and breakdown would continue here.
    </div>

    <div style="margin-top:36px;padding-top:24px;border-top:1px solid rgba(193,176,133,0.12);">
      <div style="max-width:560px;margin:0 auto 22px;font-family:'Bodoni Moda',serif;font-size:18px;font-style:italic;line-height:1.8;color:#d1c4b0;">
        A Life Manual helps organize the operational details someone else would need if you could not manage them yourself.
      </div>

      <button onclick="window.location.href='/#contact'" style="padding:14px 24px;background:#c1b085;color:#100d0a;border:none;cursor:pointer;font-family:Cinzel,serif;font-size:13px;font-weight:700;letter-spacing:2px;">
        SCHEDULE A CONVERSATION
      </button>
    </div>

  </div>`;
}
