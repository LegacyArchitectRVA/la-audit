
  var lnk = document.createElement('link');
  lnk.rel = 'stylesheet';
  lnk.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Bodoni+Moda:ital,wght@0,400;1,400&display=swap';
  document.head.appendChild(lnk);

  var P = [
    { n:'Digital Life',         d:'Access and continuity for essential digital accounts, credentials, and archives.',          i:['PRIMARY EMAIL ACCOUNT ACCESS','MASTER PASSWORD MANAGER VAULT','CLOUD STORAGE & PHOTO ARCHIVES','TWO-FACTOR AUTH (2FA) RECOVERY KEYS','SOCIAL MEDIA LEGACY CONTACTS','DIGITAL MEDIA ARCHIVES'] },
    { n:'Financial & Assets',   d:'Documentation of all financial accounts, obligations, and automated payment systems.',       i:['BANKING & CREDIT CARD ACCESS','INVESTMENT & RETIREMENT ACCOUNTS','CRYPTOCURRENCY WALLETS & KEYS','AUTOMATED BILL PAYMENTS LIST','TAX RETURNS & FINANCIAL RECORDS','DEBT & LOAN DOCUMENTATION'] },
    { n:'Household & Property', d:'Physical property records, access information, and household operational documentation.',    i:['PROPERTY DEEDS & TITLES','VEHICLE REGISTRATIONS','HOME MAINTENANCE RECORDS','UTILITY ACCOUNT ACCESS','PHYSICAL ASSET INVENTORY','STORAGE UNIT KEYS & ACCESS'] },
    { n:'Health & Medical',     d:'Medical history, healthcare directives, and emergency access information.',                  i:['HEALTH INSURANCE INFORMATION','MEDICAL RECORDS & HISTORY','PRESCRIPTION MEDICATIONS LIST','ADVANCE HEALTHCARE DIRECTIVE','ORGAN DONOR STATUS','EMERGENCY CONTACTS LIST'] },
    { n:'Legal & Estate',       d:'Legal instruments, policy documentation, and estate planning records.',                     i:['LAST WILL & TESTAMENT','TRUST DOCUMENTATION','POWERS OF ATTORNEY','LIFE INSURANCE POLICIES','GUARDIANSHIP DESIGNATIONS','BUSINESS SUCCESSION PLAN'] },
    { n:'Legacy & Wishes',      d:'Personal statements, end-of-life preferences, and enduring messages for those left behind.',i:['PERSONAL LETTERS & MESSAGES','ETHICAL WILL STATEMENT','FUNERAL PREFERENCES','OBITUARY INFORMATION','HEIRLOOM STORIES','CHARITABLE GIVING WISHES'] }
  ];

  var ST = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
  var OB = null;

  function getPg1State() {
    for (var i = 0; i < 6; i++) {
      var cb = document.getElementById('c0-' + i);
      ST[0][i] = (cb && cb.checked) ? 1 : 0;
    }
  }

  function prog(active) {
    var h = '<div style="display:flex;gap:6px;margin-bottom:52px;">';
    for (var s = 0; s < 6; s++) {
      var bg = s < active ? '#5e4820' : s === active ? '#c1b085' : '#1e1810';
      var sh = s === active ? '0 0 8px rgba(193,176,133,0.6)' : 'none';
      h += '<div style="height:2px;flex:1;background:' + bg + ';border-radius:1px;box-shadow:' + sh + ';"></div>';
    }
    return h + '</div>';
  }

  function pillarHTML(pi) {
    var pl = P[pi]; var isP5 = pi===4; var isLast = pi===5;
    var cnt = ST[pi].reduce(function(a,v){return a+v;},0);
    var rows = '';
    for (var ii = 0; ii < 6; ii++) {
      var on = ST[pi][ii];
      rows +=
        '<div id="r'+pi+'-'+ii+'" onclick="__la.t('+pi+','+ii+')" style="display:flex;align-items:center;gap:18px;padding:13px 16px;border:1px solid '+(on?'rgba(193,176,133,0.12)':'transparent')+';border-radius:2px;cursor:pointer;background:'+(on?'rgba(193,176,133,0.03)':'transparent')+';">' +
          '<div id="sh'+pi+'-'+ii+'" style="width:22px;height:22px;flex-shrink:0;border:1px solid '+(on?'#c1b085':'#3a2e1e')+';border-radius:2px;display:flex;align-items:center;justify-content:center;box-shadow:'+(on?'0 0 10px rgba(193,176,133,0.55)':'none')+';">' +
            '<svg id="mk'+pi+'-'+ii+'" width="14" height="11" viewBox="0 0 14 11" fill="none" style="opacity:'+(on?'1':'0')+';transform:'+(on?'scale(1)':'scale(0.6)')+';transition:opacity 0.2s,transform 0.2s;filter:drop-shadow(0 0 3px rgba(193,176,133,0.9));"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</div>' +
          '<div id="lb'+pi+'-'+ii+'" style="font-size:10px;letter-spacing:2px;color:'+(on?'#c1b085':'#5e5548')+';">'+pl.i[ii]+'</div>' +
        '</div>';
    }
    var gate = '';
    if (isP5) {
      gate = '<div style="margin-top:36px;padding-top:32px;border-top:1px solid #18140a;margin-bottom:52px;"><div style="font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;color:#877044;margin-bottom:20px;">DO YOU OWN A BUSINESS?</div><div style="display:flex;gap:12px;"><button id="by" onclick="__la.by()" style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;padding:13px 32px;border:1px solid '+(OB===true?'#c1b085':'#2a2116')+';background:'+(OB===true?'rgba(193,176,133,0.05)':'transparent')+';color:'+(OB===true?'#c1b085':'#4e3a19')+';cursor:pointer;border-radius:1px;">YES</button><button id="bn" onclick="__la.bn()" style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;padding:13px 32px;border:1px solid '+(OB===false?'#3a2e1e':'#2a2116')+';background:'+(OB===false?'rgba(78,58,25,0.08)':'transparent')+';color:#4e3a19;cursor:pointer;border-radius:1px;">NO</button></div><div id="bh" style="font-size:13px;font-style:italic;color:'+(OB!==null?'#5e5548':'transparent')+';margin-top:14px;min-height:18px;">'+(OB===true?'Pillar 6 will be included in your audit.':OB===false?'Your score will be calculated across 5 pillars.':'')+'</div></div>';
    }
    var nextBtn = isP5
      ? '<button onclick="__la.p5()" style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:#0f0c08;background:#c1b085;border:none;cursor:pointer;text-transform:uppercase;padding:15px 34px;border-radius:1px;">CONTINUE</button>'
      : isLast
        ? '<button onclick="__la.go(\'R\')" style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:#0f0c08;background:#c1b085;border:none;cursor:pointer;text-transform:uppercase;padding:15px 34px;border-radius:1px;">SEE RESULTS</button>'
        : '<button onclick="__la.go('+(pi+2)+')" style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:#0f0c08;background:#c1b085;border:none;cursor:pointer;text-transform:uppercase;padding:15px 34px;border-radius:1px;">NEXT PILLAR</button>';
    var backBtn = pi === 1
      ? '<a href="#go1" style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:#3a2e1e;text-decoration:none;text-transform:uppercase;">BACK</a>'
      : '<button onclick="__la.go('+(pi)+')" style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:#3a2e1e;background:none;border:none;cursor:pointer;text-transform:uppercase;padding:0;">BACK</button>';
    return prog(pi)+
      '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:5px;color:#877044;margin-bottom:10px;">PILLAR '+(pi+1)+' OF 6</div>'+
      '<div style="font-family:Cinzel,serif;font-size:26px;font-weight:600;color:#c1b085;letter-spacing:2px;margin-bottom:12px;line-height:1.15;">'+pl.n.toUpperCase()+'</div>'+
      '<div style="font-size:15px;font-style:italic;color:#6e6458;line-height:1.6;margin-bottom:44px;">'+pl.d+'</div>'+
      '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:'+(isP5?'0':'52px')+';">'+rows+'</div>'+
      gate+
      '<div style="display:flex;justify-content:space-between;align-items:center;">'+
        backBtn+
        '<div style="display:flex;align-items:center;gap:24px;">'+
          '<span id="tl'+pi+'" style="font-size:14px;font-style:italic;color:'+(cnt===6?'#877044':'#3a2e1e')+';">'+cnt+' of 6</span>'+
          nextBtn+
        '</div>'+
      '</div>';
  }

  function resultsHTML() {
    getPg1State();
    var inc = OB===false?5:6; var tot=0;
    for (var i=0;i<inc;i++) ST[i].forEach(function(v){tot+=v;});
    var pct=Math.round(tot/(inc*6)*100);
    var desc=pct<20?'Critical gaps identified':pct<40?'Significant gaps remain':pct<60?'Partially documented':pct<80?'Well organized':pct<100?'Strongly organized':'Comprehensive coverage';
    var brows='';
    for (var idx=0;idx<inc;idx++) {
      var c=ST[idx].reduce(function(a,v){return a+v;},0);
      var w=Math.round(c/6*100); var mx=c===6;
      brows+='<div style="display:flex;align-items:center;gap:16px;padding:11px 0;border-bottom:1px solid #18140a;"><div style="font-family:Cinzel,serif;font-size:9px;letter-spacing:1.5px;color:#4e3a19;width:150px;flex-shrink:0;">'+P[idx].n.toUpperCase()+'</div><div style="flex:1;height:1px;background:#1e1810;position:relative;"><div class="lab" data-w="'+w+'" style="position:absolute;top:0;left:0;height:100%;width:0%;background:'+(mx?'#c1b085':'#5e4820')+';transition:width 1.2s cubic-bezier(0.4,0,0.2,1);"></div></div><div style="font-size:13px;font-style:italic;color:'+(mx?'#877044':'#4e3a19')+';width:28px;text-align:right;flex-shrink:0;">'+c+'/6</div></div>';
    }
    return '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:5px;color:#877044;text-align:center;margin-bottom:14px;">AUDIT COMPLETE</div>'+
      '<div style="font-family:Cinzel,serif;font-size:20px;font-weight:600;color:#fdfcfa;letter-spacing:3px;text-align:center;margin-bottom:56px;">YOUR CONTINUITY SCORE</div>'+
      '<div style="display:flex;justify-content:center;margin-bottom:60px;"><div style="position:relative;width:230px;height:230px;"><div style="position:absolute;top:0;right:0;bottom:0;left:0;border-radius:50%;animation:la-spin 2.8s linear infinite;"><div style="position:absolute;top:0;right:0;bottom:0;left:0;border-radius:50%;background:conic-gradient(from 0deg,rgba(193,176,133,0) 0deg,rgba(193,176,133,0.7) 80deg,rgba(253,252,250,1) 90deg,rgba(193,176,133,0.7) 100deg,rgba(193,176,133,0) 180deg);filter:blur(1px);"></div></div><div style="position:absolute;top:0;right:0;bottom:0;left:0;border-radius:50%;border:1px solid #1e1810;"></div><div style="position:absolute;top:4px;right:4px;bottom:4px;left:4px;border-radius:50%;background:#0f0c08;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;"><div style="font-family:Cinzel,serif;font-size:8px;letter-spacing:5px;color:#4e3a19;">CONTINUITY</div><div style="display:flex;align-items:baseline;gap:3px;"><div style="font-family:Cinzel,serif;font-size:58px;font-weight:600;color:#c1b085;line-height:1;">'+pct+'</div><div style="font-family:Cinzel,serif;font-size:22px;color:#877044;line-height:1;">%</div></div><div style="font-size:13px;font-style:italic;color:#5e5548;text-align:center;padding:0 16px;margin-top:4px;">'+desc+'</div></div></div></div>'+
      '<div style="margin-bottom:56px;"><div style="font-family:Cinzel,serif;font-size:9px;letter-spacing:4px;color:#3a2e1e;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid #18140a;">PILLAR BREAKDOWN</div>'+brows+'</div>'+
      '<div style="padding:48px 0 0;border-top:1px solid #18140a;text-align:center;"><div style="font-size:18px;font-style:italic;color:#7a7068;line-height:1.6;margin-bottom:10px;">Your Life Manual starts here.</div><div style="font-family:Cinzel,serif;font-size:9px;letter-spacing:3px;color:#3a2e1e;margin-bottom:36px;">SCHEDULE A PRIVATE CONVERSATION -- NO OBLIGATION</div><a href="https://cal.com/legacyarchitectrva/private-conversation" target="_blank" style="font-family:Cinzel,serif;font-size:10px;letter-spacing:3px;color:#0f0c08;background:#c1b085;text-decoration:none;display:inline-block;padding:17px 44px;border-radius:1px;">SCHEDULE A CONVERSATION</a><div onclick="__la.rs()" style="display:block;margin-top:28px;font-family:Cinzel,serif;font-size:9px;letter-spacing:3px;color:#2a2116;cursor:pointer;">START OVER</div></div>';
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
      if(s){s.style.borderColor=on?'#c1b085':'#3a2e1e';s.style.boxShadow=on?'0 0 10px rgba(193,176,133,0.55)':'none';}
      if(m){m.style.opacity=on?'1':'0';m.style.transform=on?'scale(1)':'scale(0.6)';}
      if(l){l.style.color=on?'#c1b085':'#5e5548';}
      var cnt=ST[pi].reduce(function(a,v){return a+v;},0);
      var tl=document.getElementById('tl'+pi); if(tl){tl.textContent=cnt+' of 6';tl.style.color=cnt===6?'#877044':'#3a2e1e';}
    },
    by: function() { OB=true; var y=document.getElementById('by'),n=document.getElementById('bn'),h=document.getElementById('bh'); if(y){y.style.borderColor='#c1b085';y.style.color='#c1b085';y.style.background='rgba(193,176,133,0.05)';} if(n){n.style.borderColor='#2a2116';n.style.color='#4e3a19';n.style.background='transparent';} if(h){h.textContent='Pillar 6 will be included in your audit.';h.style.color='#5e5548';} },
    bn: function() { OB=false; var y=document.getElementById('by'),n=document.getElementById('bn'),h=document.getElementById('bh'); if(n){n.style.borderColor='#3a2e1e';n.style.background='rgba(78,58,25,0.08)';} if(y){y.style.borderColor='#2a2116';y.style.color='#4e3a19';y.style.background='transparent';} if(h){h.textContent='Your score will be calculated across 5 pillars.';h.style.color='#5e5548';} },
    p5: function() { if(OB===null){var h=document.getElementById('bh');if(h){h.textContent='Please answer before continuing.';h.style.color='#877044';}return;} window.__la.go(OB?6:'R'); },
    rs: function() { ST=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]; OB=null; showPg1(); showRest(''); try{window.scrollTo(0,0);}catch(e){} }
  };



// Poll for nav checkbox
setInterval(function(){var c=document.getElementById("la-go");if(c&&c.checked){c.checked=false;window.__la.go(2);}},150);
