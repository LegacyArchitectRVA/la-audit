/* LA Digital Audit v12 - audit7.js
   Changes from v11:
   - Scroll fix: scrolls to #la-wrap instead of page top
   - Visual consistency: all font sizes match Page 1 HTML (16px labels/buttons, 18px descriptions)
   - Checkbox border color unified to #7A6842
   - Glowing counter box on every pillar page (updates live)
   - Page 1 counter updated via polling
   - Item-level detail appended to HubSpot submission
   - Removed inline "X of 6" text (replaced by counter box)
*/
(function(){
  var lnk=document.createElement('link');
  lnk.rel='stylesheet';
  lnk.href='https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,300;1,6..96,400&display=swap';
  document.head.appendChild(lnk);

  var P=[
    {n:'Digital Life',d:'Access and continuity for essential digital accounts, credentials, and archives.',i:['PRIMARY EMAIL ACCOUNT ACCESS','MASTER PASSWORD MANAGER VAULT','CLOUD STORAGE & PHOTO ARCHIVES','TWO-FACTOR AUTH (2FA) RECOVERY KEYS','SOCIAL MEDIA LEGACY CONTACTS','DIGITAL MEDIA ARCHIVES']},
    {n:'Financial & Assets',d:'Documentation of all financial accounts, obligations, and automated payment systems.',i:['BANKING & CREDIT CARD ACCESS','INVESTMENT & RETIREMENT ACCOUNTS','CRYPTOCURRENCY WALLETS & KEYS','AUTOMATED BILL PAYMENTS LIST','TAX RETURNS & FINANCIAL RECORDS','DEBT & LOAN DOCUMENTATION']},
    {n:'Household & Property',d:'Physical property records, access information, and household operational documentation.',i:['PROPERTY DEEDS & TITLES','VEHICLE REGISTRATIONS','HOME MAINTENANCE RECORDS','UTILITY ACCOUNT ACCESS','PHYSICAL ASSET INVENTORY','STORAGE UNIT KEYS & ACCESS']},
    {n:'Health & Medical',d:'Medical history, healthcare directives, and emergency access information.',i:['HEALTH INSURANCE INFORMATION','MEDICAL RECORDS & HISTORY','PRESCRIPTION MEDICATIONS LIST','ADVANCE HEALTHCARE DIRECTIVE','ORGAN DONOR STATUS','EMERGENCY CONTACTS LIST']},
    {n:'Legal & Estate',d:'Legal instruments, policy documentation, and estate planning records.',i:['LAST WILL & TESTAMENT','TRUST DOCUMENTATION','POWERS OF ATTORNEY','LIFE INSURANCE POLICIES','GUARDIANSHIP DESIGNATIONS','BUSINESS SUCCESSION PLAN']},
    {n:'Business Continuity',d:'Operational documentation for business owners, including entity records, access, and transition planning.',i:['BUSINESS ENTITY DOCUMENTS','BUSINESS BANKING & CREDIT ACCESS','OPERATING OR PARTNERSHIP AGREEMENTS','BUSINESS INSURANCE POLICIES','KEY VENDOR & CLIENT CONTACTS','BUSINESS CONTINUITY INSTRUCTIONS']},
    {n:'Legacy & Wishes',d:'Personal statements, end-of-life preferences, and enduring messages for those left behind.',i:['PERSONAL LETTERS & MESSAGES','ETHICAL WILL STATEMENT','FUNERAL PREFERENCES','OBITUARY INFORMATION','HEIRLOOM STORIES','CHARITABLE GIVING WISHES']}
  ];

  var ST=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
  var OB=null;
  var lastP1Cnt=-1;

  /* ── helpers ────────────────────────────────────── */

  function scrollToAudit(){
    var el=document.getElementById('la-wrap');
    if(!el) return;
    var rect=el.getBoundingClientRect();
    var scrollY=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;
    var target=rect.top+scrollY-10;
    try{window.scrollTo({top:target,behavior:'smooth'});}catch(e){window.scrollTo(0,target);}
  }

  function getPg1State(){
    for(var i=0;i<6;i++){var cb=document.getElementById('c0-'+i);ST[0][i]=(cb&&cb.checked)?1:0;}
  }

  /* ── glowing counter ───────────────────────────── */

  function ctrStyles(cnt){
    var f=cnt===6;
    return {
      border: f?'#c1b085': cnt>0?'rgba(193,176,133,'+(0.3+cnt*0.1).toFixed(1)+')':'#342a1c',
      shadow: cnt>0?'0 0 '+(8+cnt*4)+'px rgba(193,176,133,'+(0.15+cnt*0.05).toFixed(2)+')'+(f?',0 0 32px rgba(193,176,133,0.3)':''):'none',
      bg: 'rgba(193,176,133,'+(f?'0.06':'0.02')+')',
      numColor: f?'#c1b085': cnt>0?'#b8984e':'#6b5a38',
      numShadow: f?'0 0 16px rgba(193,176,133,0.5)':'none'
    };
  }

  function counterHTML(pi){
    var cnt=ST[pi].reduce(function(a,v){return a+v;},0);
    var s=ctrStyles(cnt);
    return '<div id="la-ctr-'+pi+'" style="display:flex;align-items:center;justify-content:center;margin-bottom:32px;">'+
      '<div style="display:inline-flex;align-items:baseline;gap:8px;padding:14px 32px;'+
        'border:1px solid '+s.border+';border-radius:2px;'+
        'background:'+s.bg+';'+
        'box-shadow:'+s.shadow+';'+
        'transition:border-color 0.3s,box-shadow 0.4s,background 0.3s;">'+
        '<span style="font-family:Cinzel,serif;font-size:28px;font-weight:700;color:'+s.numColor+';line-height:1;'+
          'text-shadow:'+s.numShadow+';transition:color 0.3s,text-shadow 0.3s;">'+cnt+'</span>'+
        '<span style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#8a7240;line-height:1;">of 6</span>'+
      '</div>'+
    '</div>';
  }

  function updateCtr(pi){
    var cnt=ST[pi].reduce(function(a,v){return a+v;},0);
    var wrap=document.getElementById('la-ctr-'+pi);
    if(!wrap)return;
    var box=wrap.firstElementChild; if(!box)return;
    var num=box.firstElementChild; if(!num)return;
    var s=ctrStyles(cnt);
    box.style.borderColor=s.border;
    box.style.boxShadow=s.shadow;
    box.style.background=s.bg;
    num.textContent=cnt;
    num.style.color=s.numColor;
    num.style.textShadow=s.numShadow;
  }

  /* ── progress bar ──────────────────────────────── */

  function prog(active){
    var h='<div style="display:flex;gap:6px;margin-bottom:52px;">';
    for(var s=0;s<7;s++){
      var bg=s<active?'#8a7030':s===active?'#c1b085':'#342a1c';
      var sh=s===active?'0 0 8px rgba(193,176,133,0.6)':'none';
      h+='<div style="height:2px;flex:1;background:'+bg+';border-radius:1px;box-shadow:'+sh+';"></div>';
    }
    return h+'</div>';
  }

  /* ── pillar page ───────────────────────────────── */

  function pillarHTML(pi){
    var pl=P[pi],isP5=pi===4,isLast=pi===6;
    var rows='';
    for(var ii=0;ii<6;ii++){
      var on=ST[pi][ii];
      rows+=
        '<div id="r'+pi+'-'+ii+'" onclick="__la.t('+pi+','+ii+')" style="display:flex;align-items:center;gap:18px;padding:13px 16px;border:1px solid '+(on?'rgba(193,176,133,0.12)':'transparent')+';border-radius:2px;cursor:pointer;background:'+(on?'rgba(193,176,133,0.03)':'transparent')+';">'+
          '<div id="sh'+pi+'-'+ii+'" style="width:24px;height:24px;flex-shrink:0;border:1px solid '+(on?'#c1b085':'#7A6842')+';border-radius:2px;display:flex;align-items:center;justify-content:center;box-shadow:'+(on?'0 0 12px rgba(193,176,133,0.6),0 0 24px rgba(193,176,133,0.25),inset 0 0 8px rgba(193,176,133,0.1)':'none')+';">'+
            '<svg id="mk'+pi+'-'+ii+'" width="14" height="11" viewBox="0 0 14 11" fill="none" style="opacity:'+(on?'1':'0')+';transform:'+(on?'scale(1)':'scale(0.6)')+';transition:opacity 0.2s,transform 0.2s;filter:drop-shadow(0 0 3px rgba(193,176,133,0.9));"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
          '</div>'+
          '<div id="lb'+pi+'-'+ii+'" style="font-family:Cinzel,serif;font-size:16px;letter-spacing:2px;color:'+(on?'#c1b085':'#9a8d7a')+';'+(on?'text-shadow:0 0 12px rgba(193,176,133,0.3);':'')+'">'+pl.i[ii]+'</div>'+
        '</div>';
    }

    /* business-owner gate on Pillar 5 */
    var gate='';
    if(isP5){
      gate='<div style="margin-top:36px;padding-top:32px;border-top:1px solid #2a2218;margin-bottom:52px;">'+
        '<div style="font-family:Cinzel,serif;font-size:16px;letter-spacing:3px;color:#b8984e;margin-bottom:20px;">DO YOU OWN A BUSINESS?</div>'+
        '<div style="display:flex;gap:12px;">'+
          '<button id="by" onclick="__la.by()" style="font-family:Cinzel,serif;font-size:14px;font-weight:700;letter-spacing:3px;padding:13px 32px;border:1px solid '+(OB===true?'#c1b085':'#4a3d28')+';background:'+(OB===true?'rgba(193,176,133,0.05)':'transparent')+';color:'+(OB===true?'#c1b085':'#8a7240')+';cursor:pointer;border-radius:1px;">YES</button>'+
          '<button id="bn" onclick="__la.bn()" style="font-family:Cinzel,serif;font-size:14px;font-weight:700;letter-spacing:3px;padding:13px 32px;border:1px solid '+(OB===false?'#6b5a38':'#4a3d28')+';background:'+(OB===false?'rgba(78,58,25,0.08)':'transparent')+';color:#8a7240;cursor:pointer;border-radius:1px;">NO</button>'+
        '</div>'+
        '<div id="bh" style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:'+(OB!==null?'#9a8d7a':'transparent')+';margin-top:14px;min-height:18px;">'+
          (OB===true?'Pillar 6 will be included in your audit.':OB===false?'Your score will be calculated across 5 pillars.':'')+
        '</div></div>';
    }

    /* nav buttons */
    var nextBtn;
    if(isP5){
      nextBtn='<button onclick="__la.p5()" style="font-family:Cinzel,serif;font-size:16px;font-weight:700;letter-spacing:3px;color:#100d0a;background:#c1b085;border:none;cursor:pointer;text-transform:uppercase;padding:15px 34px;border-radius:1px;">CONTINUE</button>';
    }else if(isLast){
      nextBtn='<button onclick="__la.go(\'R\')" style="font-family:Cinzel,serif;font-size:16px;font-weight:700;letter-spacing:3px;color:#100d0a;background:#c1b085;border:none;cursor:pointer;text-transform:uppercase;padding:15px 34px;border-radius:1px;">SEE RESULTS</button>';
    }else{
      nextBtn='<button onclick="__la.go('+(pi+2)+')" style="font-family:Cinzel,serif;font-size:16px;font-weight:700;letter-spacing:3px;color:#100d0a;background:#c1b085;border:none;cursor:pointer;text-transform:uppercase;padding:15px 34px;border-radius:1px;">NEXT PILLAR</button>';
    }

    var backTarget=pi===1?1:(pi===6&&OB===false)?5:pi;
    var backBtn=pi===0?'':'<button onclick="__la.go('+backTarget+')" style="font-family:Cinzel,serif;font-size:16px;font-weight:700;letter-spacing:3px;color:#6b5a38;background:none;border:none;cursor:pointer;text-transform:uppercase;padding:0;">BACK</button>';

    return prog(pi)+
      '<div style="font-family:Cinzel,serif;font-size:16px;letter-spacing:5px;color:#b8984e;margin-bottom:10px;">PILLAR '+(pi+1)+' OF 7</div>'+
      '<div style="font-family:Cinzel,serif;font-size:30px;font-weight:700;color:#c1b085;letter-spacing:2px;margin-bottom:12px;line-height:1.15;">'+pl.n.toUpperCase()+'</div>'+
      '<div style="font-family:Bodoni Moda,serif;font-size:18px;font-style:italic;color:#a09484;line-height:1.6;margin-bottom:44px;">'+pl.d+'</div>'+
      counterHTML(pi)+
      '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:'+(isP5?'0':'52px')+';">'+rows+'</div>'+
      gate+
      '<div style="display:flex;justify-content:'+(pi===0?'flex-end':'space-between')+';align-items:center;">'+
        backBtn+
        nextBtn+
      '</div>';
  }

  /* ── results page ──────────────────────────────── */

  function resultsHTML(){
    getPg1State();
    var tot=0,pillarsUsed=0;
    for(var i=0;i<7;i++){
      if(i===5&&OB===false)continue;
      ST[i].forEach(function(v){tot+=v;});
      pillarsUsed++;
    }
    var pct=Math.round(tot/(pillarsUsed*6)*100);
    var pts=tot,maxPts=pillarsUsed*6;

    var desc,tier,tierDesc,tierRec;
    if(pts<=10){desc='Critical gaps identified';tier='LEAN & READY';tierDesc='Minimal digital and legal silos. A standard continuity plan would cover this.';tierRec='Most people in this range start with <strong>The Vault</strong>.';}
    else if(pts<=22){desc='Significant gaps remain';tier='LEGACY AT RISK';tierDesc='Some documentation exists, but access gaps and single points of failure remain.';tierRec='Most people in this range benefit from <strong>The Archive</strong>.';}
    else if(pts<=30){desc='Partially documented';tier='CRITICAL COMPLEXITY';tierDesc='High-value, multi-layered responsibilities. Risk of permanent asset loss without a clear system.';tierRec='Most people in this range need <strong>The Legacy</strong>.';}
    else if(pts<=36){desc='Well organized';tier='WELL STRUCTURED';tierDesc='Strong foundation in place. A few remaining gaps to close.';tierRec='A focused session can identify what is missing.';}
    else{desc='Strongly organized';tier='COMPREHENSIVE';tierDesc='Thorough documentation across all pillars. Successor readiness is high.';tierRec='An annual review keeps this current.';}

    var brows='';
    for(var idx=0;idx<7;idx++){
      if(idx===5&&OB===false)continue;
      var c=ST[idx].reduce(function(a,v){return a+v;},0);
      var w=Math.round(c/6*100),mx=c===6;
      brows+='<div style="display:flex;align-items:center;gap:16px;padding:11px 0;border-bottom:1px solid #2a2218;">'+
        '<div style="font-family:Cinzel,serif;font-size:12px;letter-spacing:1.5px;color:#c1b085;width:170px;flex-shrink:0;">'+P[idx].n.toUpperCase()+'</div>'+
        '<div style="flex:1;height:2px;background:#342a1c;position:relative;">'+
          '<div class="lab" data-w="'+w+'" style="position:absolute;top:0;left:0;height:100%;width:0%;background:'+(mx?'#c1b085':'#8a7030')+';transition:width 1.2s cubic-bezier(0.4,0,0.2,1);box-shadow:'+(mx?'0 0 8px rgba(193,176,133,0.5)':'0 0 4px rgba(138,112,48,0.4)')+';"></div>'+
        '</div>'+
        '<div style="font-family:Bodoni Moda,serif;font-size:18px;font-style:italic;color:'+(mx?'#c1b085':'#b8984e')+';width:32px;text-align:right;flex-shrink:0;">'+c+'/6</div>'+
      '</div>';
    }

    return '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:5px;color:#b8984e;text-align:center;margin-bottom:14px;">AUDIT COMPLETE</div>'+
      '<div style="font-family:Cinzel,serif;font-size:23px;font-weight:600;color:#fdfcfa;letter-spacing:3px;text-align:center;margin-bottom:56px;">YOUR CONTINUITY SCORE</div>'+

      /* score ring */
      '<div style="display:flex;justify-content:center;margin-bottom:40px;">'+
        '<div style="position:relative;width:230px;height:230px;">'+
          '<div style="position:absolute;top:0;right:0;bottom:0;left:0;border-radius:50%;animation:la-spin 2.8s linear infinite;">'+
            '<div style="position:absolute;top:0;right:0;bottom:0;left:0;border-radius:50%;background:conic-gradient(from 0deg,rgba(193,176,133,0) 0deg,rgba(193,176,133,0.7) 80deg,rgba(253,252,250,1) 90deg,rgba(193,176,133,0.7) 100deg,rgba(193,176,133,0) 180deg);filter:blur(1px);"></div>'+
          '</div>'+
          '<div style="position:absolute;top:0;right:0;bottom:0;left:0;border-radius:50%;border:1px solid #342a1c;"></div>'+
          '<div style="position:absolute;top:4px;right:4px;bottom:4px;left:4px;border-radius:50%;background:#100d0a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;">'+
            '<div style="font-family:Cinzel,serif;font-size:9px;letter-spacing:5px;color:#b8984e;">CONTINUITY</div>'+
            '<div style="display:flex;align-items:baseline;gap:3px;">'+
              '<div style="font-family:Cinzel,serif;font-size:58px;font-weight:600;color:#c1b085;line-height:1;text-shadow:0 0 30px rgba(193,176,133,0.3);">'+pct+'</div>'+
              '<div style="font-family:Cinzel,serif;font-size:22px;color:#b8984e;line-height:1;">%</div>'+
            '</div>'+
            '<div style="font-family:Bodoni Moda,serif;font-size:15px;font-style:italic;color:#c1b085;text-align:center;padding:0 16px;margin-top:4px;">'+desc+'</div>'+
          '</div>'+
        '</div>'+
      '</div>'+

      /* score summary */
      '<div style="text-align:center;margin-bottom:48px;">'+
        '<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;color:#c1b085;margin-bottom:8px;">'+pts+' OF '+maxPts+' POINTS</div>'+
        '<div style="font-family:Cinzel,serif;font-size:20px;font-weight:700;color:#c1b085;letter-spacing:2px;margin-bottom:12px;">'+tier+'</div>'+
        '<div style="font-family:Bodoni Moda,serif;font-size:17px;font-style:italic;color:#b0a494;line-height:1.6;">'+tierDesc+'</div>'+
      '</div>'+

      /* pillar breakdown */
      '<div style="margin-bottom:48px;">'+
        '<div style="font-family:Cinzel,serif;font-size:15px;letter-spacing:4px;color:#b8984e;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid #2a2218;">PILLAR BREAKDOWN</div>'+
        brows+
      '</div>'+

      /* email capture + CTA */
      '<div style="padding:36px 0;border-top:1px solid #2a2218;text-align:center;">'+
        '<div style="margin-bottom:40px;">'+
          '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:3px;color:#c1b085;margin-bottom:12px;">GET YOUR RESULTS</div>'+
          '<div style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#b0a494;margin-bottom:20px;">Enter your email to receive your full breakdown and next steps.</div>'+
          '<div style="display:flex;gap:10px;max-width:400px;margin:0 auto;">'+
            '<input id="la-email" type="email" placeholder="Email" style="flex:1;padding:13px 16px;background:transparent;border:1px solid #6b5a38;border-radius:1px;color:#c1b085;font-family:Bodoni Moda,serif;font-size:15px;outline:none;">'+
            '<button onclick="__la.sub()" style="font-family:Cinzel,serif;font-size:11px;font-weight:700;letter-spacing:2px;color:#100d0a;background:#c1b085;border:none;cursor:pointer;padding:13px 24px;border-radius:1px;white-space:nowrap;">SEND</button>'+
          '</div>'+
          '<div id="la-email-msg" style="font-family:Bodoni Moda,serif;font-size:14px;font-style:italic;color:#b8984e;margin-top:12px;min-height:20px;"></div>'+
        '</div>'+
        '<div style="text-align:center;">'+
          '<div style="font-family:Bodoni Moda,serif;font-size:19px;font-style:italic;color:#c1b085;line-height:1.6;margin-bottom:8px;">Most people find gaps they did not expect.</div>'+
          '<div style="font-family:Bodoni Moda,serif;font-size:17px;font-style:italic;color:#b0a494;line-height:1.6;margin-bottom:32px;">A Life Manual closes them before someone else has to.</div>'+
          '<div style="font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;color:#b8984e;margin-bottom:28px;">SCHEDULE A PRIVATE CONVERSATION \u2014 NO OBLIGATION</div>'+
          '<a href="https://cal.com/legacyarchitectrva/private-conversation" target="_blank" style="font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:3px;color:#100d0a;background:#c1b085;text-decoration:none;display:inline-block;padding:17px 44px;border-radius:1px;transition:background 0.2s;">SCHEDULE A CONVERSATION</a>'+
          '<div style="display:flex;justify-content:center;gap:32px;margin-top:28px;">'+
            '<button onclick="__la.go(7)" style="font-family:Cinzel,serif;font-size:11px;font-weight:700;letter-spacing:3px;color:#b8984e;background:none;border:none;cursor:pointer;text-transform:uppercase;padding:0;">BACK</button>'+
            '<div onclick="__la.rs()" style="font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;color:#8a7240;cursor:pointer;">START OVER</div>'+
          '</div>'+
        '</div>'+
      '</div>';
  }

  /* ── DOM helpers ────────────────────────────────── */

  function showRest(html){
    var el=document.getElementById('pg-rest');
    if(!el)return;
    el.innerHTML=html;
    el.style.animation='none'; void el.offsetWidth; el.style.animation='la-in 0.4s ease';
    setTimeout(function(){var b=document.querySelectorAll('.lab');for(var i=0;i<b.length;i++)b[i].style.width=b[i].getAttribute('data-w')+'%';},80);
  }

  function hidePg1(){var e=document.getElementById('pg1');if(e)e.style.display='none';}
  function showPg1(){var e=document.getElementById('pg1');if(e)e.style.display='';}

  /* ── public API ────────────────────────────────── */

  window.__la={
    go:function(n){
      if(n===1){showPg1();showRest('');}
      else if(n==='R'){getPg1State();hidePg1();showRest(resultsHTML());}
      else{hidePg1();showRest(pillarHTML(n-1));}
      scrollToAudit();
    },

    t:function(pi,ii){
      ST[pi][ii]=ST[pi][ii]?0:1; var on=ST[pi][ii];
