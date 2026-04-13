// === CONTINUITY AUDIT ENGINE (WORKING VERSION WITH BETTER CONVERSION) ===

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

// === RESULTS SCREEN ===
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

  var desc = pct <= 25
    ? "Critical gaps identified"
    : pct <= 50
    ? "Significant gaps remain"
    : pct <= 75
    ? "Partial continuity in place"
    : "Strong continuity foundation";

  var brows='';
  for(var i=0;i<7;i++){
    if(i===5 && OB===false) continue;

    var c = ST[i].filter(v=>v===1).length;
    var act = 6 - ST[i].filter(v=>v===-1).length;

    brows += `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid rgba(193,176,133,0.10);font-family:Cinzel,serif;letter-spacing:1px;">
      <div style="color:#cfc3b0;">${P[i].n.toUpperCase()}</div>
      <div style="color:#c1b085;">${c}/${act}</div>
    </div>`;
  }

  return `
  <div style="max-width:620px;margin:0 auto;">

    <div style="text-align:center;font-family:Cinzel,serif;letter-spacing:4px;color:#b8984e;margin-bottom:12px;">AUDIT COMPLETE</div>

    <div style="text-align:center;font-family:Cinzel,serif;font-size:72px;line-height:1;color:#fdfcfa;margin-bottom:8px;">${pct}%</div>
    <div style="text-align:center;font-family:'Bodoni Moda',serif;font-style:italic;color:#c1b085;margin-bottom:22px;">${desc}</div>

    <div style="text-align:center;font-family:Cinzel,serif;letter-spacing:2px;color:#b0a494;margin-bottom:30px;">
      ${tot} OF ${mx} APPLICABLE POINTS
    </div>

    <div style="margin-bottom:34px;">${brows}</div>

    <div style="max-width:560px;margin:0 auto 10px;text-align:center;font-family:'Bodoni Moda',serif;font-size:18px;font-style:italic;line-height:1.7;color:#d1c4b0;">
      Your score shows where continuity is already in place and where someone else would still have to reconstruct key information.
    </div>

    <div style="max-width:560px;margin:0 auto 24px;text-align:center;font-family:'Bodoni Moda',serif;font-size:18px;font-style:italic;line-height:1.7;color:#d1c4b0;">
      Enter your email to receive your full breakdown, key gaps, and checklist.
    </div>

    <div style="display:flex;gap:10px;justify-content:center;align-items:stretch;flex-wrap:wrap;margin-bottom:10px;">
      <input id="la-em" type="email" placeholder="Email address"
        style="padding:14px 16px;border:1px solid #7A6842;background:transparent;color:#fff;min-width:280px;font-family:'Bodoni Moda',serif;font-size:16px;outline:none;">
      <button onclick="submitEmail()" style="padding:14px 20px;background:#c1b085;color:#100d0a;border:none;cursor:pointer;font-family:Cinzel,serif;font-size:13px;font-weight:700;letter-spacing:2px;">
        SEND MY FULL RESULTS
      </button>
    </div>

    <div style="text-align:center;font-family:'Bodoni Moda',serif;font-size:14px;font-style:italic;color:#bfa57a;margin-top:8px;">
      Private and direct.
    </div>

    <div id="la-msg" style="text-align:center;margin-top:12px;font-family:'Bodoni Moda',serif;font-size:14px;font-style:italic;color:#bfa57a;"></div>

  </div>`;
}

// === EMAIL HANDLER ===
function submitEmail(){
  var email = document.getElementById("la-em").value;
  var msg = document.getElementById("la-msg");

  if(!email || email.indexOf("@") === -1){
    msg.innerText = "Please enter a valid email address.";
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

    <div style="font-family:Cinzel,serif;letter-spacing:4px;color:#b8984e;margin-bottom:14px;">YOUR FULL RESULTS</div>

    <div style="font-family:Cinzel,serif;font-size:20px;letter-spacing:2px;color:#fdfcfa;margin-bottom:18px;">
      YOUR KEY GAPS
    </div>

    <div style="max-width:560px;margin:0 auto 18px;font-family:'Bodoni Moda',serif;font-size:18px;font-style:italic;line-height:1.7;color:#d1c4b0;">
      Missing documentation across legal, financial, digital, and operational systems creates the most friction when someone else has to step in.
    </div>

    <div style="max-width:560px;margin:0 auto 28px;font-family:'Bodoni Moda',serif;font-size:18px;font-style:italic;line-height:1.7;color:#d1c4b0;">
      Your full checklist and breakdown would continue here.
    </div>

    <div style="max-width:560px;margin:0 auto 28px;padding-top:24px;border-top:1px solid rgba(193,176,133,0.12);font-family:'Bodoni Moda',serif;font-size:18px;font-style:italic;line-height:1.7;color:#d1c4b0;">
      A Life Manual helps organize the operational details someone else would need if you could not manage them yourself.
    </div>

    <button onclick="window.location.href='/#contact'" style="padding:14px 24px;background:#c1b085;color:#100d0a;border:none;cursor:pointer;font-family:Cinzel,serif;font-size:13px;font-weight:700;letter-spacing:2px;">
      SCHEDULE A CONVERSATION
    </button>

    <div style="text-align:center;font-family:'Bodoni Moda',serif;font-size:14px;font-style:italic;color:#bfa57a;margin-top:12px;">
      Private and direct.
    </div>

  </div>`;
}
