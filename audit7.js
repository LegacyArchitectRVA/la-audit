
  var lnk = document.createElement('link');
  lnk.rel = 'stylesheet';
  lnk.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,300;1,6..96,400&display=swap';
  document.head.appendChild(lnk);

  var P = [
    { n:'Digital Life',         d:'Access and continuity for essential digital accounts, credentials, and archives.',          i:['PRIMARY EMAIL ACCOUNT ACCESS','MASTER PASSWORD MANAGER VAULT','CLOUD STORAGE & PHOTO ARCHIVES','TWO-FACTOR AUTH (2FA) RECOVERY KEYS','SOCIAL MEDIA LEGACY CONTACTS','DIGITAL MEDIA ARCHIVES'] },
    { n:'Financial & Assets',   d:'Documentation of all financial accounts, obligations, and automated payment systems.',       i:['BANKING & CREDIT CARD ACCESS','INVESTMENT & RETIREMENT ACCOUNTS','CRYPTOCURRENCY WALLETS & KEYS','AUTOMATED BILL PAYMENTS LIST','TAX RETURNS & FINANCIAL RECORDS','DEBT & LOAN DOCUMENTATION'] },
    { n:'Household & Property', d:'Physical property records, access information, and household operational documentation.',    i:['PROPERTY DEEDS & TITLES','VEHICLE REGISTRATIONS','HOME MAINTENANCE RECORDS','UTILITY ACCOUNT ACCESS','PHYSICAL ASSET INVENTORY','STORAGE UNIT KEYS & ACCESS'] },
    { n:'Health & Medical',     d:'Medical history, healthcare directives, and emergency access information.',                  i:['HEALTH INSURANCE INFORMATION','MEDICAL RECORDS & HISTORY','PRESCRIPTION MEDICATIONS LIST','ADVANCE HEALTHCARE DIRECTIVE','ORGAN DONOR STATUS','EMERGENCY CONTACTS LIST'] },
    { n:'Legal & Estate',       d:'Legal instruments, policy documentation, and estate planning records.',                     i:['LAST WILL & TESTAMENT','TRUST DOCUMENTATION','POWERS OF ATTORNEY','LIFE INSURANCE POLICIES','GUARDIANSHIP DESIGNATIONS','BUSINESS SUCCESSION PLAN'] },
    { n:'Business Continuity',  d:'Operational documentation for business owners, including entity records, access, and transition planning.', i:['BUSINESS ENTITY DOCUMENTS','BUSINESS BANKING & CREDIT ACCESS','OPERATING OR PARTNERSHIP AGREEMENTS','BUSINESS INSURANCE POLICIES','KEY VENDOR & CLIENT CONTACTS','BUSINESS CONTINUITY INSTRUCTIONS'] },
    { n:'Legacy & Wishes',      d:'Personal statements, end-of-life preferences, and enduring messages for those left behind.',i:['PERSONAL LETTERS & MESSAGES','ETHICAL WILL STATEMENT','FUNERAL PREFERENCES','OBITUARY INFORMATION','HEIRLOOM STORIES','CHARITABLE GIVING WISHES'] }
  ];

  var ST = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
  var OB = null;

  function getPg1State() {
    for (var i = 0; i < 6; i++) {
      var cb = document.getElementById('c0-' + i);
      ST[0][i] = (cb && cb.checked) ? 1 : 0;
    }
  }

  function prog(active) {
    var h = '<div style="display:flex;gap:6px;margin-bottom:52px;">';
    for (var s = 0; s < 7; s++) {
      var bg = s < active ? '#8a7030' : s === active ? '#c1b085' : '#342a1c';
      var sh = s === active ? '0 0 8px rgba(193,176,133,0.6)' : 'none';
      h += '<div style="height:2px;flex:1;background:' + bg + ';border-radius:1px;box-shadow:' + sh + ';"></div>';
    }
    return h + '</div>';
  }

  function pillarHTML(pi) {
    var pl = P[pi]; var isP5 = pi===4; var isLast = pi===6;
    var cnt = ST[pi].reduce(function(a,v){return a+v;},0);
    var rows = '';
    for (var ii = 0; ii < 6; ii++) {
      var on = ST[pi][ii];
      rows +=
        '<div id="r'+pi+'-'+ii+'" onclick="__la.t('+pi+','+ii+')" style="display:flex;align-items:center;gap:18px;padding:13px 16px;border:1px solid '+(on?'rgba(193,176,133,0.12)':'transparent')+';border-radius:2px;cursor:pointer;background:'+(on?'rgba(193,176,133,0.03)':'transparent')+';">' +
          '<div id="sh'+pi+'-'+ii+'" style="width:24px;height:24px;flex-shrink:0;border:1px solid '+(on?'#c1b085':'#6b5a38')+';border-radius:2px;display:flex;align-items:center;justify-content:center;box-shadow:'+(on?'0 0 12px rgba(193,176,133,0.6),0 0 24px rgba(193,176,133,0.25),inset 0 0 8px rgba(193,176,133,0.1)':'none')+';">' +
            '<svg id="mk'+pi+'-'+ii+'" width="14" height="11" viewBox="0 0 14 11" fill="none" style="opacity:'+(on?'1':'0')+';transform:'+(on?'scale(1)':'scale(0.6)')+';transition:opacity 0.2s,transform 0.2s;filter:drop-shadow(0 0 3px rgba(193,176,133,0.9));"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</div>' +
          '<div id="lb'+pi+'-'+ii+'" style="font-family:Cinzel,serif;font-size:12px;letter-spacing:2px;color:'+(on?'#c1b085':'#9a8d7a')+';">'+pl.i[ii]+'</div>' +
        '</div>';
    }
    var gate = '';
    if (isP5) {
      gate = '<div style="margin-top:36px;padding-top:32px;border-top:1px solid #2a2218;margin-bottom:52px;"><div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:3px;color:#b8984e;margin-bottom:20px;">DO YOU OWN A BUSINESS?</div><div style="display:flex;gap:12px;"><button id="by" onclick="__la.by()" style="font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:3px;padding:13px 32px;border:1px solid '+(OB===true?'#c1b085':'#4a3d28')+';background:'+(OB===true?'rgba(193,176,133,0.05)':'transparent')+';color:'+(OB===true?'#c1b085':'#8a7240')+';cursor:pointer;border-radius:1px;">YES</button><button id="bn" onclick="__la.bn()" style="font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:3px;padding:13px 32px;border:1px solid '+(OB===false?'#6b5a38':'#4a3d28')+';background:'+(OB===false?'rgba(78,58,25,0.08)':'transparent')+';color:#8a7240;cursor:pointer;border-radius:1px;">NO</button></div><div id="bh" style="font-family:Bodoni Moda,serif;font-size:15px;font-style:italic;color:'+(OB!==null?'#9a8d7a':'transparent')+';margin-top:14px;min-height:18px;">'+(OB===true?'Pillar 6 will be included in your audit.':OB===false?'Your score will be calculated across 5 pillars.':'')+'</div></div>';
    }
    var nextBtn = isP5
      ? '<button onclick="__la.p5()" style="font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:3px;color:#100d0a;background:#c1b085;border:none;cursor:pointer;text-transform:uppercase;padding:15px 34px;border-radius:1px;">CONTINUE</button>'
      : isLast
        ? '<button onclick="__la.go(\'R\')" style="font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:3px;color:#100d0a;background:#c1b085;border:none;cursor:pointer;text-transform:uppercase;padding:15px 34px;border-radius:1px;">SEE RESULTS</button>'
        : '<button onclick="__la.go('+(pi+2)+')" style="font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:3px;color:#100d0a;background:#c1b085;border:none;cursor:pointer;text-transform:uppercase;padding:15px 34px;border-radius:1px;">NEXT PILLAR</button>';
    var backTarget = pi===1 ? 1 : (pi===6 && OB===false) ? 5 : pi;
    var backBtn = pi === 0
      ? ''
      : '<button onclick="__la.go('+backTarget+')" style="font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:3px;color:#6b5a38;background:none;border:none;cursor:pointer;text-transform:uppercase;padding:0;">BACK</button>';
    return prog(pi)+
      '<div style="font-family:Cinzel,serif;font-size:12px;letter-spacing:5px;color:#b8984e;margin-bottom:10px;">PILLAR '+(pi+1)+' OF 7</div>'+
      '<div style="font-family:Cinzel,serif;font-size:30px;font-weight:700;color:#c1b085;letter-spacing:2px;margin-bottom:12px;line-height:1.15;">'+pl.n.toUpperCase()+'</div>'+
      '<div style="font-family:Bodoni Moda,serif;font-size:17px;font-style:italic;color:#a09484;line-height:1.6;margin-bottom:44px;">'+pl.d+'</div>'+
      '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:'+(isP5?'0':'52px')+';">'+rows+'</div>'+
      gate+
      '<div style="display:flex;justify-content:space-between;align-items:center;">'+
        backBtn+
        '<div style="display:flex;align-items:center;gap:24px;">'+
          '<span id="tl'+pi+'" style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:'+(cnt===6?'#b8984e':'#6b5a38')+';">'+cnt+' of 6</span>'+
          nextBtn+
        '</div>'+
      '</div>';
  }

  function resultsHTML() {
    getPg1State();
    var tot=0; var pillarsUsed=0;
    for (var i=0;i<7;i++) {
      if (i===5 && OB===false) continue;
      ST[i].forEach(function(v){tot+=v;});
      pillarsUsed++;
    }
    var pct=Math.round(tot/(pillarsUsed*6)*100);
    var pts=tot;
    var maxPts=pillarsUsed*6;

    var desc,tier,tierDesc;
    if (pts<=10) { desc='Critical gaps identified'; tier='LEAN & READY'; tierDesc='Minimal digital and legal silos. A standard continuity plan would cover this.'; tierRec='Most people in this range start with <strong>The Vault</strong>.'; }
    else if (pts<=22) { desc='Significant gaps remain'; tier='LEGACY AT RISK'; tierDesc='Some documentation exists, but access gaps and single points of failure remain.'; tierRec='Most people in this range benefit from <strong>The Archive</strong>.'; }
    else if (pts<=30) { desc='Partially documented'; tier='CRITICAL COMPLEXITY'; tierDesc='High-value, multi-layered responsibilities. Risk of permanent asset loss without a clear system.'; tierRec='Most people in this range need <strong>The Legacy</strong>.'; }
    else if (pts<=36) { desc='Well organized'; tier='WELL STRUCTURED'; tierDesc='Strong foundation in place. A few remaining gaps to close.'; tierRec='A focused session can identify what is missing.'; }
    else { desc='Strongly organized'; tier='COMPREHENSIVE'; tierDesc='Thorough documentation across all pillars. Successor readiness is high.'; tierRec='An annual review keeps this current.'; }

    var brows='';
    for (var idx=0;idx<7;idx++) {
      if (idx===5 && OB===false) continue;
      var c=ST[idx].reduce(function(a,v){return a+v;},0);
      var w=Math.round(c/6*100); var mx=c===6;
      brows+='<div style="display:flex;align-items:center;gap:16px;padding:11px 0;border-bottom:1px solid #2a2218;"><div style="font-family:Cinzel,serif;font-size:12px;letter-spacing:1.5px;color:#c1b085;width:170px;flex-shrink:0;">'+P[idx].n.toUpperCase()+'</div><div style="flex:1;height:2px;background:#342a1c;position:relative;"><div class="lab" data-w="'+w+'" style="position:absolute;top:0;left:0;height:100%;width:0%;background:'+(mx?'#c1b085':'#8a7030')+';transition:width 1.2s cubic-bezier(0.4,0,0.2,1);box-shadow:'+(mx?'0 0 8px rgba(193,176,133,0.5)':'0 0 4px rgba(138,112,48,0.4)')+';"></div></div><div style="font-family:Bodoni Moda,serif;font-size:18px;font-style:italic;color:'+(mx?'#c1b085':'#b8984e')+';width:32px;text-align:right;flex-shrink:0;">'+c+'/6</div></div>';
    }

    return '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:5px;color:#b8984e;text-align:center;margin-bottom:14px;">AUDIT COMPLETE</div>'+
      '<div style="font-family:Cinzel,serif;font-size:23px;font-weight:600;color:#fdfcfa;letter-spacing:3px;text-align:center;margin-bottom:56px;">YOUR CONTINUITY SCORE</div>'+
      '<div style="display:flex;justify-content:center;margin-bottom:40px;"><div style="position:relative;width:230px;height:230px;"><div style="position:absolute;top:0;right:0;bottom:0;left:0;border-radius:50%;animation:la-spin 2.8s linear infinite;"><div style="position:absolute;top:0;right:0;bottom:0;left:0;border-radius:50%;background:conic-gradient(from 0deg,rgba(193,176,133,0) 0deg,rgba(193,176,133,0.7) 80deg,rgba(253,252,250,1) 90deg,rgba(193,176,133,0.7) 100deg,rgba(193,176,133,0) 180deg);filter:blur(1px);"></div></div><div style="position:absolute;top:0;right:0;bottom:0;left:0;border-radius:50%;border:1px solid #342a1c;"></div><div style="position:absolute;top:4px;right:4px;bottom:4px;left:4px;border-radius:50%;background:#100d0a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;"><div style="font-family:Cinzel,serif;font-size:9px;letter-spacing:5px;color:#b8984e;">CONTINUITY</div><div style="display:flex;align-items:baseline;gap:3px;"><div style="font-family:Cinzel,serif;font-size:58px;font-weight:600;color:#c1b085;line-height:1;text-shadow:0 0 30px rgba(193,176,133,0.3);">'+pct+'</div><div style="font-family:Cinzel,serif;font-size:22px;color:#b8984e;line-height:1;">%</div></div><div style="font-family:Bodoni Moda,serif;font-size:15px;font-style:italic;color:#c1b085;text-align:center;padding:0 16px;margin-top:4px;">'+desc+'</div></div></div></div>'+
      '<div style="text-align:center;margin-bottom:48px;"><div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;color:#c1b085;margin-bottom:8px;">'+pts+' OF '+maxPts+' POINTS</div><div style="font-family:Cinzel,serif;font-size:20px;font-weight:700;color:#c1b085;letter-spacing:2px;margin-bottom:12px;">'+tier+'</div><div style="font-family:Bodoni Moda,serif;font-size:17px;font-style:italic;color:#b0a494;line-height:1.6;">'+tierDesc+'</div></div>'+
      '<div style="margin-bottom:48px;"><div style="font-family:Cinzel,serif;font-size:15px;letter-spacing:4px;color:#b8984e;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid #2a2218;">PILLAR BREAKDOWN</div>'+brows+'</div>'+
      '<div style="padding:36px 0;border-top:1px solid #2a2218;text-align:center;"><div style="margin-bottom:40px;"><div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:3px;color:#c1b085;margin-bottom:12px;">GET YOUR RESULTS</div><div style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#b0a494;margin-bottom:20px;">Enter your email to receive your full breakdown and next steps.</div><div style="display:flex;gap:10px;max-width:400px;margin:0 auto;"><input id="la-email" type="email" placeholder="Email" style="flex:1;padding:13px 16px;background:transparent;border:1px solid #6b5a38;border-radius:1px;color:#c1b085;font-family:Bodoni Moda,serif;font-size:15px;outline:none;"><button onclick="__la.sub()" style="font-family:Cinzel,serif;font-size:11px;font-weight:700;letter-spacing:2px;color:#100d0a;background:#c1b085;border:none;cursor:pointer;padding:13px 24px;border-radius:1px;white-space:nowrap;">SEND</button></div><div id="la-email-msg" style="font-family:Bodoni Moda,serif;font-size:14px;font-style:italic;color:#b8984e;margin-top:12px;min-height:20px;"></div></div>'+
      '<div style="text-align:center;"><div style="font-family:Bodoni Moda,serif;font-size:19px;font-style:italic;color:#c1b085;line-height:1.6;margin-bottom:8px;">Most people find gaps they did not expect.</div><div style="font-family:Bodoni Moda,serif;font-size:17px;font-style:italic;color:#b0a494;line-height:1.6;margin-bottom:32px;">A Life Manual closes them before someone else has to.</div><div style="font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;color:#b8984e;margin-bottom:28px;">SCHEDULE A PRIVATE CONVERSATION \u2014 NO OBLIGATION</div><a href="https://cal.com/legacyarchitectrva/private-conversation" target="_blank" style="font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:3px;color:#100d0a;background:#c1b085;text-decoration:none;display:inline-block;padding:17px 44px;border-radius:1px;transition:background 0.2s;">SCHEDULE A CONVERSATION</a><div style="display:flex;justify-content:center;gap:32px;margin-top:28px;"><button onclick="__la.go(7)" style="font-family:Cinzel,serif;font-size:11px;font-weight:700;letter-spacing:3px;color:#b8984e;background:none;border:none;cursor:pointer;text-transform:uppercase;padding:0;">BACK</button><div onclick="__la.rs()" style="font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;color:#8a7240;cursor:pointer;">START OVER</div></div></div>';
  }

  function showRest(html) {
    var el = document.getElementById('pg-rest');
    if (!el) return;
    el.innerHTML = html;
    el.style.animation='none'; void el.offsetWidth; el.style.animation='la-in 0.4s ease';
    setTimeout(function(){var b=document.querySelectorAll('.lab');for(var i=0;i<b.length;i++)b[i].style.width=b[i].getAttribute('data-w')+'%';},80);
  }

  function hidePg1() { var e=document.getElementById('pg1'); if(e) e.style.display='none'; }
  function showPg1() { var e=document.getElementById('pg1'); if(e) e.style.display=''; }

  window.__la = {
    go: function(n) {
      if (n===1) { showPg1(); showRest(''); }
      else if (n==='R') { hidePg1(); showRest(resultsHTML()); }
      else { hidePg1(); showRest(pillarHTML(n-1)); }
      try{window.scrollTo(0,0);}catch(e){}
    },
    t: function(pi,ii) {
      ST[pi][ii]=ST[pi][ii]?0:1; var on=ST[pi][ii];
      var r=document.getElementById('r'+pi+'-'+ii);
      var s=document.getElementById('sh'+pi+'-'+ii);
      var m=document.getElementById('mk'+pi+'-'+ii);
      var l=document.getElementById('lb'+pi+'-'+ii);
      if(r){r.style.borderColor=on?'rgba(193,176,133,0.12)':'transparent';r.style.background=on?'rgba(193,176,133,0.03)':'transparent';}
      if(s){s.style.borderColor=on?'#c1b085':'#6b5a38';s.style.boxShadow=on?'0 0 12px rgba(193,176,133,0.6),0 0 24px rgba(193,176,133,0.25),inset 0 0 8px rgba(193,176,133,0.1)':'none';}
      if(m){m.style.opacity=on?'1':'0';m.style.transform=on?'scale(1)':'scale(0.6)';}
      if(l){l.style.color=on?'#c1b085':'#9a8d7a';l.style.textShadow=on?'0 0 12px rgba(193,176,133,0.3)':'none';}
      var cnt=ST[pi].reduce(function(a,v){return a+v;},0);
      var tl=document.getElementById('tl'+pi); if(tl){tl.textContent=cnt+' of 6';tl.style.color=cnt===6?'#b8984e':'#6b5a38';}
    },
    by: function() { OB=true; var y=document.getElementById('by'),n=document.getElementById('bn'),h=document.getElementById('bh'); if(y){y.style.borderColor='#c1b085';y.style.color='#c1b085';y.style.background='rgba(193,176,133,0.05)';} if(n){n.style.borderColor='#4a3d28';n.style.color='#8a7240';n.style.background='transparent';} if(h){h.textContent='Pillar 6 will be included in your audit.';h.style.color='#9a8d7a';} },
    bn: function() { OB=false; var y=document.getElementById('by'),n=document.getElementById('bn'),h=document.getElementById('bh'); if(n){n.style.borderColor='#6b5a38';n.style.background='rgba(78,58,25,0.08)';} if(y){y.style.borderColor='#4a3d28';y.style.color='#8a7240';y.style.background='transparent';} if(h){h.textContent='Your score will be calculated across 5 pillars.';h.style.color='#9a8d7a';} },
    p5: function() { if(OB===null){var h=document.getElementById('bh');if(h){h.textContent='Please answer before continuing.';h.style.color='#b8984e';}return;} window.__la.go(OB?6:7); },
    sub: function() {
      var em = document.getElementById('la-email');
      var msg = document.getElementById('la-email-msg');
      if (!em || !em.value || em.value.indexOf('@')<1) { if(msg) msg.textContent='Please enter a valid email.'; return; }
      var email = em.value;
      if(msg) msg.textContent='Sending...';
      var tot=0; var used=0;
      for(var i=0;i<7;i++){if(i===5&&OB===false)continue;ST[i].forEach(function(v){tot+=v;});used++;}
      var maxPts=used*6;
      var pct=Math.round(tot/maxPts*100);
      var tier=tot<=10?'LEAN & READY':tot<=22?'LEGACY AT RISK':tot<=30?'CRITICAL COMPLEXITY':tot<=36?'WELL STRUCTURED':'COMPREHENSIVE';
      var rec=tot<=10?'The Vault':tot<=22?'The Archive':tot<=30?'The Legacy':tot<=36?'Focused session':'Annual review';
      var bd='';
      for(var j=0;j<7;j++){if(j===5&&OB===false)continue;var c=ST[j].reduce(function(a,v){return a+v;},0);bd+=P[j].n+': '+c+'/6\n';}
      var body='DIGITAL LIFE AUDIT RESULTS\n\nScore: '+pct+'% ('+tot+' of '+maxPts+' points)\nTier: '+tier+'\nBusiness Owner: '+(OB?'Yes':'No')+'\n\nPILLAR BREAKDOWN\n'+bd+'\nRecommended: '+rec;
      var xhr=new XMLHttpRequest();
      xhr.open('POST','https://api.hsforms.com/submissions/v3/integration/submit/244990054/8def8d38-97f9-4c65-8c3e-fd5b4653c121');
      xhr.setRequestHeader('Content-Type','application/json');
      xhr.onload=function(){if(xhr.status>=200&&xhr.status<300){if(msg)msg.textContent='Thank you. Craig will follow up with your full results and recommended next steps within 24 hours.';em.value='';em.style.borderColor='#b8984e';}else{if(msg)msg.textContent='Something went wrong. Please try again.';}};
      xhr.onerror=function(){if(msg)msg.textContent='Connection error. Please try again.';};
      xhr.send(JSON.stringify({fields:[{name:'email',value:email},{name:'message',value:body}]}));
    },
    rs: function() { ST=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]; OB=null; showPg1(); showRest(''); try{window.scrollTo(0,0);}catch(e){} }
  };



// Poll for nav checkbox
setInterval(function(){var c=document.getElementById("la-go");if(c&&c.checked){c.checked=false;window.__la.go(2);}},150);
