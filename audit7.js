/* LA Digital Audit - audit7.js */
(function(){
  var P=[
    {n:'Digital Life',d:'Access and continuity for essential digital accounts, credentials, and archives.',i:['PRIMARY EMAIL ACCOUNT ACCESS','MASTER PASSWORD MANAGER VAULT','CLOUD STORAGE & PHOTO ARCHIVES','TWO-FACTOR AUTH (2FA) RECOVERY KEYS','SOCIAL MEDIA LEGACY CONTACTS','DIGITAL MEDIA ARCHIVES']},
    {n:'Financial & Assets',d:'Documentation of all financial accounts, obligations, and automated payment systems.',i:['BANKING & CREDIT CARD ACCESS','INVESTMENT & RETIREMENT ACCOUNTS','CRYPTOCURRENCY WALLETS & KEYS','AUTOMATED BILL PAYMENTS LIST','TAX RETURNS & FINANCIAL RECORDS','DEBT & LOAN DOCUMENTATION']},
    {n:'Household & Property',d:'Physical property records, access information, and household operational documentation.',i:['PROPERTY DEEDS & TITLES','VEHICLE REGISTRATIONS','HOME MAINTENANCE RECORDS','UTILITY ACCOUNT ACCESS','PHYSICAL ASSET INVENTORY','STORAGE UNIT KEYS & ACCESS']},
    {n:'Health & Medical',d:'Medical history, healthcare directives, and emergency access information.',i:['HEALTH INSURANCE INFORMATION','MEDICAL RECORDS & HISTORY','PRESCRIPTION MEDICATIONS LIST','ADVANCE HEALTHCARE DIRECTIVE','ORGAN DONOR STATUS','EMERGENCY CONTACTS LIST']},
    {n:'Legal & Estate',d:'Legal instruments, policy documentation, and estate planning records.',i:['LAST WILL & TESTAMENT','TRUST DOCUMENTATION','POWERS OF ATTORNEY','LIFE INSURANCE POLICIES','GUARDIANSHIP DESIGNATIONS','BUSINESS SUCCESSION PLAN']},
    {n:'Business Continuity',d:'Operational documentation for business owners, including entity records, access, and transition planning.',i:['BUSINESS ENTITY DOCUMENTS','BUSINESS BANKING & CREDIT ACCESS','OPERATING OR PARTNERSHIP AGREEMENTS','BUSINESS INSURANCE POLICIES','KEY VENDOR & CLIENT CONTACTS','BUSINESS CONTINUITY INSTRUCTIONS']},
    {n:'Legacy & Wishes',d:'Personal statements, end-of-life preferences, and enduring messages for those left behind.',i:['PERSONAL LETTERS & MESSAGES','ETHICAL WILL STATEMENT','FUNERAL PREFERENCES','OBITUARY INFORMATION','HEIRLOOM STORIES','CHARITABLE GIVING WISHES']}
  ];

  // Tracking states: ST for Checks, NA for N/As
  var ST = Array(7).fill().map(() => Array(6).fill(0));
  var NA = Array(7).fill().map(() => Array(6).fill(0));
  var OB = null;

  function scrollToAudit(){
    var el = document.getElementById('la-wrap');
    if(!el) return;
    window.scrollTo({top: el.offsetTop - 10, behavior:'smooth'});
  }

  function updateCtr(pi){
    var cnt=0, max=0;
    for(var i=0; i<6; i++){
      if(!NA[pi][i]){ max++; if(ST[pi][i]) cnt++; }
    }
    var wrap=document.getElementById('la-ctr-'+pi);
    if(!wrap) return;
    var num=wrap.querySelector('span:first-child');
    var tot=wrap.querySelector('span:last-child');
    if(num) num.textContent = cnt;
    if(tot) tot.textContent = 'of ' + max;
  }

  function pillarHTML(pi){
    var pl=P[pi], isP5=pi===4, isLast=pi===6;
    var rows='';
    
    for(var ii=0; ii<6; ii++){
      var on = ST[pi][ii];
      var n = NA[pi][ii];
      
      // THIS GENERATES THE N/A BUTTON AND THE ROW
      rows += `
        <div class="la-item-wrap ${n ? 'is-na' : ''}">
          <div onclick="__la.t(${pi},${ii})" class="larow" style="border-color:${on ? 'rgba(193,176,133,0.12)' : 'transparent'}; background:${on ? 'rgba(193,176,133,0.03)' : 'transparent'};">
            <div class="lash" style="border-color:${on ? '#c1b085' : '#7A6842'}; box-shadow:${on ? '0 0 12px rgba(193,176,133,0.6)' : 'none'};">
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none" style="opacity:${on ? '1' : '0'}; transform:${on ? 'scale(1)' : 'scale(0.6)'}; transition:all 0.2s;">
                <path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="lalb" style="color:${on ? '#c1b085' : '#9a8d7a'}">${pl.i[ii]}</div>
          </div>
          <button onclick="__la.na(${pi},${ii})" class="lana-btn" style="${n ? 'background:#342a1c; color:#c1b085; border-color:#7A6842;' : ''}">N/A</button>
        </div>`;
    }

    var backBtn = pi===0 ? '' : `<button onclick="__la.go(${pi===6 && OB===false ? 5 : pi})" style="background:none; border:none; color:#6b5a38; cursor:pointer; font-family:Cinzel; letter-spacing:2px;">BACK</button>`;
    var nextBtn = `<button onclick="${isLast ? '__la.go(\'R\')' : isP5 ? '__la.p5()' : '__la.go('+(pi+2)+')'}" style="background:#c1b085; border:none; color:#100d0a; padding:15px 40px; cursor:pointer; font-family:Cinzel; font-weight:700;">${isLast ? 'SEE RESULTS' : 'CONTINUE'}</button>`;

    return `
      <div style="text-align:center; font-family:Cinzel; font-size:11px; letter-spacing:5px; color:#b8984e; margin-bottom:4px;">PILLAR ${pi+1} OF 7</div>
      <div style="text-align:center; font-family:Cinzel; font-size:24px; font-weight:700; color:#fdfcfa; letter-spacing:3px; margin-bottom:32px;">${pl.n.toUpperCase()}</div>
      <div id="la-ctr-${pi}" style="display:flex; align-items:center; justify-content:center; margin-bottom:32px;">
        <div style="display:inline-flex; align-items:baseline; gap:8px; padding:14px 32px; border:1px solid #342a1c; border-radius:2px; background:rgba(193,176,133,0.02);">
          <span style="font-family:Cinzel; font-size:28px; font-weight:700; color:#c1b085;">0</span>
          <span style="font-family:Bodoni Moda; font-size:16px; font-style:italic; color:#8a7240;">of 6</span>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:52px;">${rows}</div>
      ${isP5 ? `<div style="text-align:center; margin-bottom:40px; border-top:1px solid #2a2218; padding-top:20px;">
          <div style="color:#b8984e; margin-bottom:15px; font-family:Cinzel;">DO YOU OWN A BUSINESS?</div>
          <button id="by" onclick="__la.by()" style="padding:10px 20px; cursor:pointer; margin-right:10px;">YES</button>
          <button id="bn" onclick="__la.bn()" style="padding:10px 20px; cursor:pointer;">NO</button>
      </div>` : ''}
      <div style="display:flex; justify-content:space-between; align-items:center;">${backBtn}${nextBtn}</div>`;
  }

  window.__la = {
    go: function(n){
      if(n===1) { document.getElementById('pg1').style.display=''; document.getElementById('pg-rest').innerHTML=''; }
      else { document.getElementById('pg1').style.display='none'; document.getElementById('pg-rest').innerHTML=(n==='R'?'Calculation...':pillarHTML(n-1)); if(n!=='R') updateCtr(n-1); }
      scrollToAudit();
    },
    t: function(pi, ii){ if(NA[pi][ii]) return; ST[pi][ii]=ST[pi][ii]?0:1; this.refresh(pi); },
    na: function(pi, ii){ NA[pi][ii]=NA[pi][ii]?0:1; if(NA[pi][ii]) ST[pi][ii]=0; this.refresh(pi); },
    refresh: function(pi){
      if(pi === 0) { updateCtr(0); } // Page 1 handled by polling
      else { document.getElementById('pg-rest').innerHTML = pillarHTML(pi); updateCtr(pi); }
    },
    by: function(){ OB=true; document.getElementById('by').style.background='#c1b085'; document.getElementById('bn').style.background='none'; },
    bn: function(){ OB=false; document.getElementById('bn').style.background='#c1b085'; document.getElementById('by').style.background='none'; },
    p5: function(){ if(OB===null)alert('Please select Business status'); else this.go(OB?6:7); }
  };

  // Keep Page 1 in sync
  setInterval(function(){
    var pg1 = document.getElementById('pg1');
    if(pg1 && pg1.style.display !== 'none'){
      for(var i=0; i<6; i++){
        var cb = document.getElementById('c0-'+i);
        if(cb) ST[0][i] = cb.checked ? 1 : 0;
        var wrap = document.getElementById('wrap0-'+i);
        if(wrap) NA[0][i] = wrap.classList.contains('is-na') ? 1 : 0;
      }
      updateCtr(0);
    }
  }, 500);

})();
