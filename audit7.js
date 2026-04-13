// === CONTINUITY AUDIT ENGINE (FIXED SEQUENCING) ===

var P = [
  { n: "Digital Life" },
  { n: "Financial & Assets" },
  { n: "Household & Property" },
  { n: "Health & Medical" },
  { n: "Legal & Estate" },
  { n: "Business (Optional)" },
  { n: "Legacy & Wishes" }
];

var ST = Array.from({ length: 7 }, () => Array(6).fill(0));
var OB = true;

// === RESULTS SCREEN (FIXED) ===
function resultsHTML(){

  var tot=0, mx=0;
  for(var i=0;i<7;i++){
    if(i===5 && OB===false) continue;
    ST[i].forEach(function(v){
      if(v===1) tot++;
      if(v!==-1) mx++;
    });
  }

  var pct = mx > 0 ? Math.round(tot/mx*100) : 0;

  var desc = pct <= 50
    ? "Critical gaps identified"
    : "Partial continuity in place";

  var brows='';
  for(var i=0;i<7;i++){
    if(i===5 && OB===false) continue;

    var c = ST[i].filter(v=>v===1).length;
    var act = 6 - ST[i].filter(v=>v===-1).length;

    brows += `<div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(193,176,133,0.1);">
      <div>${P[i].n.toUpperCase()}</div>
      <div>${c}/${act}</div>
    </div>`;
  }

  return `
  <div style="max-width:620px;margin:0 auto;">

    <div style="text-align:center;margin-bottom:20px;">AUDIT COMPLETE</div>

    <div style="text-align:center;font-size:72px;">${pct}%</div>
    <div style="text-align:center;margin-bottom:20px;">${desc}</div>

    <div style="text-align:center;margin-bottom:30px;">
      ${tot} OF ${mx} APPLICABLE POINTS
    </div>

    <div style="margin-bottom:30px;">${brows}</div>

    <div style="text-align:center;margin-bottom:10px;">
      Your results show gaps across multiple systems.
    </div>

    <div style="text-align:center;margin-bottom:20px;">
      Enter your email to receive your full breakdown and checklist.
    </div>

    <div style="display:flex;gap:10px;justify-content:center;">
      <input id="la-em" type="email" placeholder="Email"
        style="padding:12px;border:1px solid #7A6842;background:transparent;color:#fff;">
      <button onclick="submitEmail()" style="padding:12px;background:#c1b085;color:#000;">
        SEND ME MY RESULTS
      </button>
    </div>

    <div id="la-msg" style="text-align:center;margin-top:10px;"></div>

  </div>`;
}

// === EMAIL HANDLER ===
function submitEmail(){
  var email = document.getElementById("la-em").value;
  var msg = document.getElementById("la-msg");

  if(!email || email.indexOf("@") === -1){
    msg.innerText = "Please enter a valid email.";
    return;
  }

  msg.innerText = "Sending...";

  setTimeout(function(){
    msg.innerText = "";
    document.getElementById("la-wrap").innerHTML = fullResultsHTML();
  }, 800);
}

// === FULL RESULTS (ONLY AFTER EMAIL) ===
function fullResultsHTML(){
  return `
  <div style="max-width:620px;margin:0 auto;text-align:center;">

    <div style="margin-bottom:20px;">YOUR KEY GAPS</div>

    <div style="margin-bottom:30px;">
      Missing documentation across legal, financial, and operational systems.
    </div>

    <div style="margin-bottom:30px;">
      Full checklist and breakdown provided here.
    </div>

    <button style="padding:14px;background:#c1b085;color:#000;">
      SCHEDULE A CONVERSATION
    </button>

  </div>`;
}    if (!emailSec) return;

    var secText = textOf(emailSec).toUpperCase();
    if (secText.indexOf('YOUR FULL RESULTS') === -1) return;

    var all = emailSec.querySelectorAll('*');

    for (var i = 0; i < all.length; i++) {
      var t = textOf(all[i]);

      if (
        t === 'No obligation - 100% confidential' ||
        t === '"Order in Your Absence"' ||
        t === 'Legacy Architect RVA - Richmond, Virginia' ||
        t === 'Most people find gaps they did not expect.' ||
        t === 'A Life Manual closes them before someone else has to.'
      ) {
        all[i].style.display = 'none';
      }
    }

    var ctas = emailSec.querySelectorAll('a, button');
    var found = [];

    for (var j = 0; j < ctas.length; j++) {
      var label = textOf(ctas[j]).toUpperCase();
      if (label === 'SCHEDULE A CONVERSATION') {
        found.push(ctas[j]);
      }
    }

    for (var k = 0; k < found.length; k++) {
      var el = found[k];

      if (el.tagName.toLowerCase() === 'a') {
        el.setAttribute('href', '/#contact');
      } else {
        el.onclick = function () {
          window.location.href = '/#contact';
        };
      }
    }

    for (var m = 1; m < found.length; m++) {
      var extra = found[m];
      var parent = extra.parentElement;
      if (parent) {
        parent.style.display = 'none';
      } else {
        extra.style.display = 'none';
      }
    }

    var hiddenParents = emailSec.querySelectorAll('*');
    for (var n = 0; n < hiddenParents.length; n++) {
      var childText = textOf(hiddenParents[n]).toUpperCase();
      if (
        childText === 'NO OBLIGATION - 100% CONFIDENTIAL' ||
        childText === '"ORDER IN YOUR ABSENCE"' ||
        childText === 'LEGACY ARCHITECT RVA - RICHMOND, VIRGINIA' ||
        childText === 'MOST PEOPLE FIND GAPS THEY DID NOT EXPECT.' ||
        childText === 'A LIFE MANUAL CLOSES THEM BEFORE SOMEONE ELSE HAS TO.'
      ) {
        var p = hiddenParents[n].parentElement;
        if (p) p.style.display = 'none';
      }
    }
  }

  setInterval(cleanAuditResults, 500);
})();
</script>    msg.innerText = "";
    document.getElementById("la-wrap").innerHTML = fullResultsHTML();
  }, 800);
}

// === FULL RESULTS (ONLY AFTER EMAIL) ===
function fullResultsHTML(){
  return `
  <div style="max-width:620px;margin:0 auto;text-align:center;">

    <div style="margin-bottom:20px;">YOUR KEY GAPS</div>

    <div style="margin-bottom:30px;">
      Missing documentation across legal, financial, and operational systems.
    </div>

    <div style="margin-bottom:30px;">
      Full checklist and breakdown provided here.
    </div>

    <button style="padding:14px;background:#c1b085;color:#000;">
      SCHEDULE A CONVERSATION
    </button>

  </div>`;
}    [0, 0, 0, 0, 0, 0]
  ];

  var OB = null;
  var lastP1State = "";

  var GD = [
    [
      "Email is the recovery method for nearly every other account. Without access, password resets fail across the board.",
      "Without a centralized credential system, a successor would need to recover each account individually, a process that can take weeks or months, with some accounts lost permanently.",
      "Family photos, documents, and personal files stored in the cloud can become permanently inaccessible if credentials are lost.",
      "If 2FA is enabled without stored recovery keys, accounts become permanently inaccessible. This is the single most common cause of irreversible digital lockout.",
      "Without designated legacy contacts, social media accounts may be memorialized, deleted, or hijacked, with no way to recover meaningful content.",
      "Digital purchases, streaming libraries, and media collections are tied to accounts. Without access documentation, they disappear."
    ],
    [
      "Without account documentation, a successor may not know which institutions to contact, leading to missed payments, penalties, and frozen funds.",
      "Retirement and brokerage accounts each have different beneficiary and access requirements. Gaps here can mean months of legal process.",
      "Cryptocurrency without documented recovery keys is permanently lost. There is no institution to call, no reset to request.",
      "Automated payments continue after incapacitation or death. Without a list, successors discover them only when accounts overdraft or services are cut.",
      "Tax history is required for estate settlement, insurance claims, and financial transfers. Missing records create delays and potential legal exposure.",
      "Undocumented debts can lead to collection actions, credit damage, and unexpected liabilities for the estate."
    ],
    [
      "Without accessible deeds, property transfers require title searches, legal fees, and significant delays.",
      "Vehicle transfers require title documentation. Missing titles mean DMV processes, potential lien searches, and delays.",
      "Warranty information, service contracts, and maintenance schedules prevent costly duplicate work and protect property value.",
      "Utilities left unmanaged can result in service interruptions, damage to property, and unnecessary charges.",
      "Without an inventory, valuable items can be overlooked, undervalued, or lost during estate settlement.",
      "Storage units with unknown contents or lost access can result in forfeiture of personal property."
    ],
    [
      "Without insurance documentation, medical decisions may be delayed and coverage may lapse during a critical period.",
      "A complete medical history is essential for treatment decisions. Gaps can lead to dangerous drug interactions or repeated procedures.",
      "A current medication list prevents dangerous interactions and ensures continuity of care during transitions.",
      "Without a directive, medical decisions may not reflect your wishes, and family members may face agonizing choices without guidance.",
      "Documented preferences prevent confusion and ensure your wishes are honored in time-sensitive situations.",
      "A clear emergency contact list ensures the right people are reached immediately, not hours or days later."
    ],
    [
      "Without a will, state intestacy laws determine asset distribution, which may not align with your intentions.",
      "Trusts without accessible documentation may not function as intended, potentially triggering probate for assets meant to avoid it.",
      "Without a Power of Attorney, even a spouse may not have legal authority to act on financial, medical, or legal matters during incapacitation.",
      "Undiscovered policies are more common than most people realize. Billions in life insurance go unclaimed every year.",
      "Without documented guardianship preferences, courts decide who cares for your dependents.",
      "A business without a succession plan risks operational collapse, employee displacement, and loss of client relationships."
    ],
    [
      "Articles of incorporation, EINs, and operating documents are required for continuity. Without them, basic business functions stall.",
      "Business accounts often have different access requirements than personal. Without documentation, cash flow stops.",
      "Operating agreements define authority. Without them, partners and successors may have no legal standing to act.",
      "Business insurance lapses can expose the entity to liability during a transition period.",
      "Relationships are assets. Without a contact list, critical vendor and client relationships may be lost.",
      "Without operational documentation, institutional knowledge leaves with the owner."
    ],
    [
      "Words left unsaid become the things people wish they had. Letters provide closure that no legal document can.",
      "An ethical will captures values, beliefs, and life lessons, the intangible inheritance that matters most to many families.",
      "Without documented preferences, families make difficult decisions under emotional pressure, often second-guessing themselves.",
      "A prepared obituary ensures accuracy and reflects your life as you would want it told.",
      "Objects carry meaning, but only if the stories behind them are preserved. Without documentation, heirlooms become just things.",
      "Documented giving preferences ensure your philanthropic intentions continue."
    ]
  ];

  var TP = [
    {
      t: "LEAN & READY",
      p: [
        "Your audit revealed critical gaps across most pillars. This is not unusual. Most people have never been asked to think about continuity in structured terms.",
        "What it means practically: if something happened to you tomorrow, the people you trust most would face significant confusion. Access to accounts, knowledge of obligations, and location of key documents are the things that fall through the cracks when there is no system in place.",
        "The gaps you have are common and fixable. A foundational continuity plan would cover the highest-risk areas first: digital access, emergency contacts, and essential documents."
      ]
    },
    {
      t: "LEGACY AT RISK",
      p: [
        "You have some documentation in place, but significant gaps remain. The items you checked show awareness. The unchecked ones represent single points of failure.",
        "This is the range where risk is most deceptive. You have enough organized that it feels manageable, but not enough that a successor could act without guesswork. Financial accounts without documented access pathways, insurance policies without location records, and digital accounts without recovery options create months of confusion.",
        "An expanded continuity plan would close these gaps systematically, covering not just the basics but the financial, legal, and household layers that hold everything together."
      ]
    },
    {
      t: "CRITICAL COMPLEXITY",
      p: [
        "Your audit shows multi-layered responsibilities across most pillars. You have significant documentation, but the complexity of your situation means the remaining gaps carry outsized risk.",
        "At this level, the issue is not awareness but architecture. Individual items may be documented, but without a unified system that a successor can follow step by step, even well-organized people leave critical gaps. Cryptocurrency keys, business operating agreements, trust documentation, and advanced healthcare directives are items where a single missing piece can mean permanent loss.",
        "A comprehensive continuity plan would bring every pillar into a single, navigable system, including business operations if applicable."
      ]
    },
    {
      t: "WELL STRUCTURED",
      p: [
        "You are well organized. Your audit shows a strong foundation across most pillars, with only a few remaining gaps.",
        "At this level, the value is not in building from scratch. It is in validation and completion. The items you have not checked may represent things you have not gotten to yet, or things you assumed were covered but are not. Either way, a focused review would identify exactly what is missing and ensure everything is accessible, current, and connected.",
        "Most people at this level benefit from a structured review session rather than a full engagement."
      ]
    },
    {
      t: "COMPREHENSIVE",
      p: [
        "Your documentation is thorough. This is rare. Most people who take this audit score well below where you are.",
        "The question at this level is not what is missing, but whether what exists is current, accessible, and structured in a way that a successor could actually use. Documents can exist without being findable. Accounts can be listed without access being transferable.",
        "An annual review ensures nothing drifts out of date and that the people who may need this information know where to find it."
      ]
    }
  ];

  function scrollToAudit() {
    var el = document.getElementById("la-wrap");
    if (!el) return;
    var rect = el.getBoundingClientRect();
    var scrollY =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    var target = rect.top + scrollY - 10;
    try {
      window.scrollTo({ top: target, behavior: "smooth" });
    } catch (e) {
      window.scrollTo(0, target);
    }
  }

  function getPg1State() {
    for (var i = 0; i < 6; i++) {
      var cb = document.getElementById("c0-" + i);
      var na = document.getElementById("na0-" + i);

      if (na && na.checked) ST[0][i] = -1;
      else if (cb && cb.checked) ST[0][i] = 1;
      else ST[0][i] = 0;
    }
  }

  function ctrStyles(cnt, totalActive) {
    var full = cnt === totalActive && totalActive > 0;
    return {
      border: full
        ? "#c1b085"
        : cnt > 0
        ? "rgba(193,176,133," + (0.3 + cnt * 0.1).toFixed(1) + ")"
        : "#342a1c",
      shadow:
        cnt > 0
          ? "0 0 " +
            (8 + cnt * 4) +
            "px rgba(193,176,133," +
            (0.15 + cnt * 0.05).toFixed(2) +
            ")" +
            (full ? ",0 0 32px rgba(193,176,133,0.3)" : "")
          : "none",
      bg: "rgba(193,176,133," + (full ? "0.06" : "0.02") + ")",
      numColor: full ? "#c1b085" : cnt > 0 ? "#b8984e" : "#6b5a38",
      numShadow: full ? "0 0 16px rgba(193,176,133,0.5)" : "none"
    };
  }

  function counterHTML(pi) {
    var cnt = ST[pi].filter(function (v) {
      return v === 1;
    }).length;
    var totalActive = 6 - ST[pi].filter(function (v) {
      return v === -1;
    }).length;
    var s = ctrStyles(cnt, totalActive);

    return `
      <div id="la-ctr-${pi}" style="display:flex;align-items:center;justify-content:center;margin-bottom:32px;">
        <div style="display:inline-flex;align-items:baseline;gap:8px;padding:14px 32px;border:1px solid ${s.border};border-radius:2px;background:${s.bg};box-shadow:${s.shadow};transition:border-color 0.3s,box-shadow 0.4s,background 0.3s;">
          <span style="font-family:Cinzel,serif;font-size:28px;font-weight:700;color:${s.numColor};line-height:1;text-shadow:${s.numShadow};transition:color 0.3s,text-shadow 0.3s;">${cnt}</span>
          <span style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#8a7240;line-height:1;">of ${totalActive}</span>
        </div>
      </div>
    `;
  }

  function updateCtr(pi) {
    var cnt = ST[pi].filter(function (v) {
      return v === 1;
    }).length;
    var totalActive = 6 - ST[pi].filter(function (v) {
      return v === -1;
    }).length;

    var wrap = document.getElementById("la-ctr-" + pi);
    if (!wrap) return;

    var box = wrap.firstElementChild;
    if (!box) return;

    var spans = box.querySelectorAll("span");
    if (spans.length < 2) return;

    var num = spans[0];
    var denom = spans[1];
    var s = ctrStyles(cnt, totalActive);

    box.style.borderColor = s.border;
    box.style.boxShadow = s.shadow;
    box.style.background = s.bg;
    num.textContent = cnt;
    num.style.color = s.numColor;
    num.style.textShadow = s.numShadow;
    denom.textContent = "of " + totalActive;
  }

  function prog(active) {
    var h =
      '<div style="display:flex;justify-content:center;gap:8px;margin:0 0 34px;">';
    for (var s = 0; s < 7; s++) {
      var bg = s <= active ? "#c1b085" : "rgba(193,176,133,0.15)";
      h +=
        '<div style="width:34px;height:2px;background:' + bg + ';"></div>';
    }
    return h + "</div>";
  }

  function pillarHTML(pi) {
    var pl = P[pi];
    var isP5 = pi === 4;
    var isLast = pi === 6;
    var rows = "";

    for (var ii = 0; ii < 6; ii++) {
      var on = ST[pi][ii] === 1;
      var na = ST[pi][ii] === -1;

      rows += `
        <div class="la-item-wrap ${na ? "is-na" : ""}">
          <input type="checkbox" id="c${pi}-${ii}" class="lacb" ${on ? "checked" : ""}>
          <label for="c${pi}-${ii}" class="larow">
            <div class="lash">
              <svg class="lamk" width="14" height="11" viewBox="0 0 14 11" fill="none" style="${on ? "opacity:1;transform:scale(1);" : ""}">
                <path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <span class="lalb">${pl.i[ii]}</span>
          </label>
          <input type="checkbox" id="na${pi}-${ii}" class="lana" ${na ? "checked" : ""}>
          <label for="na${pi}-${ii}" class="lana-btn">N/A</label>
        </div>
      `;
    }

    var gate = "";
    if (isP5) {
      gate = `
        <div style="margin:28px 0 20px;padding:24px;border:1px solid rgba(193,176,133,0.12);text-align:center;">
          <div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:4px;color:#c1b085;margin-bottom:16px;">DO YOU OWN A BUSINESS?</div>
          <div style="display:flex;justify-content:center;gap:16px;">
            <button class="lab" onclick="window.__la.ob(true)" style="background:${OB === true ? "#c1b085" : "transparent"};color:${OB === true ? "#100d0a" : "#c1b085"};border:1px solid #7A6842;padding:12px 26px;font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;cursor:pointer;">YES</button>
            <button class="lab" onclick="window.__la.ob(false)" style="background:${OB === false ? "#c1b085" : "transparent"};color:${OB === false ? "#100d0a" : "#c1b085"};border:1px solid #7A6842;padding:12px 26px;font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;cursor:pointer;">NO</button>
          </div>
          <div style="margin-top:14px;font-family:Bodoni Moda,serif;font-size:15px;font-style:italic;color:#bfa57a;">
            ${
              OB === true
                ? "All 7 pillars will be included in your audit."
                : OB === false
                ? "Your score will be calculated across 6 pillars."
                : ""
            }
          </div>
        </div>
      `;
    }

    var nextBtn;
    if (isP5) nextBtn = "CONTINUE";
    else if (isLast) nextBtn = "SEE RESULTS";
    else nextBtn = "NEXT PILLAR";

    var backTarget = pi === 1 ? 1 : pi === 6 && OB === false ? 5 : pi;
    var backBtn = pi === 0 ? "" : "BACK";

    return (
      prog(pi) +
      `
      <div style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:5px;color:#b8984e;text-align:center;margin-bottom:4px;">PILLAR ${
        pi + 1
      } OF 7</div>
      <div style="font-family:'Cinzel',serif;font-size:24px;font-weight:700;color:#fdfcfa;text-align:center;letter-spacing:3px;margin-bottom:10px;">${pl.n.toUpperCase()}</div>
      <div style="font-family:'Bodoni Moda',serif;font-size:16px;font-style:italic;color:#b0a494;text-align:center;margin-bottom:28px;line-height:1.5;">${
        pl.d
      }</div>

      ${counterHTML(pi)}

      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:52px;">
        ${rows}
      </div>

      ${gate}

      <div style="display:flex;justify-content:center;gap:34px;margin-top:30px;">
        ${
          backBtn
            ? `<button class="lab" onclick="window.__la.bk(${backTarget})" style="background:none;border:none;color:#b8984e;font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;cursor:pointer;">${backBtn}</button>`
            : `<span></span>`
        }
        <button class="lab" onclick="window.__la.go(${pi + 2})" style="background:#c1b085;border:none;color:#100d0a;padding:15px 36px;font-family:Cinzel,serif;font-size:15px;font-weight:700;letter-spacing:3px;cursor:pointer;">${nextBtn}</button>
      </div>
    `
    );
  }

  function detailHTML() {
    var h =
      '<div style="margin-top:42px;"><div style="font-family:Cinzel,serif;font-size:15px;letter-spacing:6px;color:#b9a57b;text-align:center;margin-bottom:24px;">YOUR FULL BREAKDOWN</div>';

    for (var pi = 0; pi < 7; pi++) {
      if (pi === 5 && OB === false) continue;
// === FULL RESULTS (ONLY AFTER EMAIL) ===
function fullResultsHTML(){
  return `
  <div style="max-width:620px;margin:0 auto;text-align:center;">

    <div style="margin-bottom:20px;">YOUR KEY GAPS</div>

    <div style="margin-bottom:30px;">
      Missing documentation across legal, financial, and operational systems.
    </div>

    <div style="margin-bottom:30px;">
      Full checklist and breakdown provided here.
    </div>

    <button style="padding:14px;background:#c1b085;color:#000;">
      SCHEDULE A CONVERSATION
    </button>

  </div>`;
}
