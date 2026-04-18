(function(){

const P = [
  { n:"Digital Life", d:"Access and continuity for essential digital accounts, credentials, and archives.", i:[
    "PRIMARY EMAIL ACCOUNT ACCESS",
    "MASTER PASSWORD MANAGER VAULT",
    "CLOUD STORAGE & PHOTO ARCHIVES",
    "TWO-FACTOR AUTH (2FA) RECOVERY KEYS",
    "SOCIAL MEDIA LEGACY CONTACTS",
    "DIGITAL MEDIA ARCHIVES"
  ]},
  { n:"Emergency & Successor", d:"Authority and immediate access for decision-making.", i:[
    "PRIMARY DECISION-MAKER IDENTIFIED",
    "BACKUP DECISION-MAKER IDENTIFIED",
    "AUTHORITY TO ACT DOCUMENTED",
    "FIRST 72 HOURS ACTION PLAN",
    "KEY CONTACTS LISTED",
    "SUCCESSOR KNOWS WHERE TO FIND INFORMATION"
  ]},
  { n:"Financial & Assets", d:"Accounts, obligations, and financial visibility.", i:[
    "BANK ACCOUNTS LISTED",
    "INCOME SOURCES IDENTIFIED",
    "RECURRING EXPENSES DOCUMENTED",
    "INSURANCE POLICIES ORGANIZED",
    "DEBTS & LIABILITIES OUTLINED",
    "ASSETS INVENTORIED"
  ]},
  { n:"Household Operations", d:"Day-to-day systems and responsibilities.", i:[
    "BILLS & PAYMENTS DOCUMENTED",
    "HOME SYSTEMS EXPLAINED",
    "VENDORS LISTED",
    "MAIL & SUBSCRIPTIONS ORGANIZED",
    "VEHICLE INFO DOCUMENTED",
    "ROUTINES CAN CONTINUE"
  ]},
  { n:"Vital Records", d:"Critical documents and access.", i:[
    "IDENTIFICATION DOCUMENTS ACCESSIBLE",
    "LEGAL DOCUMENTS ORGANIZED",
    "MEDICAL RECORDS IDENTIFIED",
    "INSURANCE DOCUMENTS STORED",
    "SECURE STORAGE LOCATION KNOWN",
    "TRUSTED PERSON HAS ACCESS"
  ]},
  { n:"Business Continuity", d:"Continuity for business operations.", i:[
    "BUSINESS STRUCTURE DOCUMENTED",
    "KEY ROLES DEFINED",
    "CLIENTS & REVENUE IDENTIFIED",
    "SYSTEM ACCESS ORGANIZED",
    "PROCESSES DOCUMENTED",
    "TRANSITION PLAN EXISTS"
  ]},
  { n:"Legacy & Wishes", d:"Personal intent and direction.", i:[
    "PERSONAL WISHES DOCUMENTED",
    "CARE PREFERENCES OUTLINED",
    "DEPENDENTS’ NEEDS DEFINED",
    "RELATIONSHIPS ACKNOWLEDGED",
    "PERSONAL ITEMS INSTRUCTIONS",
    "MESSAGE FOR OTHERS"
  ]}
];

let state = {
  p:0,
  answers:[],
  hasBiz:true
};

function el(id){ return document.getElementById(id); }

function buildPillar(idx){
  const wrap = document.createElement("div");
  wrap.style.animation = "la-in .4s ease";

  const p = P[idx];

  let html = `
  <div style="text-align:center;margin-bottom:10px;font-family:Cinzel,serif;letter-spacing:4px;color:#b8984e;">
    PILLAR ${idx+1} OF 7
  </div>
  <div style="text-align:center;font-family:Cinzel,serif;font-size:24px;margin-bottom:10px;">
    ${p.n.toUpperCase()}
  </div>
  <div style="text-align:center;font-style:italic;margin-bottom:25px;color:#b0a494;">
    ${p.d}
  </div>
  `;

  p.i.forEach((t,i)=>{
    html += `
    <div class="la-item-wrap">
      <input type="checkbox" class="lacb" id="c${idx}-${i}">
      <label for="c${idx}-${i}" class="larow">
        <div class="lash"><svg class="lamk" width="14" height="11"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6"/></svg></div>
        <span class="lalb">${t}</span>
      </label>
      <input type="checkbox" class="lana" id="na${idx}-${i}">
      <label for="na${idx}-${i}" class="lana-btn">N/A</label>
    </div>
    `;
  });

  // Pillar 5 business toggle
  if(idx===4){
    html += `
    <div style="margin-top:25px;text-align:center;">
      <div style="margin-bottom:10px;">Do you have a business?</div>
      <label><input type="radio" name="biz" value="yes" checked> Yes</label>
      <label style="margin-left:20px;"><input type="radio" name="biz" value="no"> No</label>
    </div>
    `;
  }

  html += `
  <div style="text-align:center;margin-top:30px;">
    <button id="nextBtn" style="padding:14px 30px;background:#c1b085;border:none;cursor:pointer;">
      CONTINUE
    </button>
  </div>
  `;

  wrap.innerHTML = html;
  return wrap;
}

function go(){
  const container = el("pg-rest");
  container.innerHTML = "";

  // skip business pillar if no business
  if(state.p===5 && !state.hasBiz){
    state.p = 6;
  }

  if(state.p >= P.length){
    container.innerHTML = `<div style="text-align:center;">Complete</div>`;
    return;
  }

  const page = buildPillar(state.p);
  container.appendChild(page);

  // bind business toggle
  if(state.p===4){
    document.querySelectorAll("[name='biz']").forEach(r=>{
      r.addEventListener("change",e=>{
        state.hasBiz = e.target.value==="yes";
      });
    });
  }

  el("nextBtn").onclick = ()=>{
    state.p++;
    go();
  };
}

// initial bind
document.getElementById("la-go").addEventListener("change",()=>{
  document.getElementById("pg1").style.display="none";
  go();
});

})();
