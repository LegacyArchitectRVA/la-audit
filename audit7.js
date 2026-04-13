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

    <div style="margin-bottom:20px;">YOUR KEY GAPS</div>

    <div style="margin-bottom:30px;">
      Missing documentation across legal, financial, and operational systems.
    </div>

    <div style="margin-bottom:30px;">
      Full checklist and breakdown provided here.
    </div>

    <button onclick="window.location.href='/#contact'" style="padding:14px;background:#c1b085;color:#000;cursor:pointer;">
      SCHEDULE A CONVERSATION
    </button>

  </div>`;
}
