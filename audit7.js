/* LA Digital Audit - full working replacement
   Includes:
   - N/A buttons on pages 2-7
   - matching YES / NO glow on business ownership
   - post-submit message says "Your results are below."
   - no "results have been sent" message
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

  /* 1 = checked, 0 = unchecked, -1 = N/A */
  var ST=[
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0]
  ];

  var OB=null;
  var lastP1State='';

  function scrollToAudit(){
    var el=document.getElementById('la-wrap');
    if(!el) return;
    var rect=el.getBoundingClientRect();
    var scrollY=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;
    var target=rect.top+scrollY-10;
    try{window.scrollTo({top:target,behavior:'smooth'});}catch(e){window.scrollTo(0,target);}
  }

  function getPg1State(){
    for(var i=0;i<6;i++){
      var cb=document.getElementById('c0-'+i);
      var na=document.getElementById('na0-'+i);
      if(na&&na.checked) ST[0][i]=-1;
      else if(cb&&cb.checked) ST[0][i]=1;
      else ST[0][i]=0;
    }
  }

  function getCount(pi){
    var cnt=0;
    for(var i=0;i<6;i++) if(ST[pi][i]===1) cnt++;
    return cnt;
  }

  function getActiveTotal(pi){
    var n=0;
    for(var i=0;i<6;i++) if(ST[pi][i]!==-1) n++;
    return n;
  }

  function ctrStyles(cnt,totalActive){
    var full=cnt===totalActive&&totalActive>0;
    return {
      border: full?'#c1b085':cnt>0?'rgba(193,176,133,'+(0.3+cnt*0.1).toFixed(1)+')':'#342a1c',
      shadow: cnt>0?'0 0 '+(8+cnt*4)+'px rgba(193,176,133,'+(0.15+cnt*0.05).toFixed(2)+')'+(full?',0 0 32px rgba(193,176,133,0.3)':''):'none',
      bg: 'rgba(193,176,133,'+(full?'0.06':'0.02')+')',
      numColor: full?'#c1b085':cnt>0?'#b8984e':'#6b5a38',
      numShadow: full?'0 0 16px rgba(193,176,133,0.5)':'none'
    };
  }

  function counterHTML(pi){
    var cnt=getCount(pi);
    var totalActive=getActiveTotal(pi);
    var s=ctrStyles(cnt,totalActive);
    return '<div id="la-ctr-'+pi+'" style="display:flex;align-items:center;justify-content:center;margin-bottom:32px;">'+
      '<div style="display:inline-flex;align-items:baseline;gap:8px;padding:14px 32px;border:1px solid '+s.border+';border-radius:2px;background:'+s.bg+';box-shadow:'+s.shadow+';transition:border-color 0.3s,box-shadow 0.4s,background 0.3s;">'+
        '<span style="font-family:Cinzel,serif;font-size:28px;font-weight:700;color:'+s.numColor+';line-height:1;text-shadow:'+s.numShadow+';transition:color 0.3s,text-shadow 0.3s;">'+cnt+'</span>'+
        '<span style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#8a7240;line-height:1;">of '+totalActive+'</span>'+
      '</div>'+
    '</div>';
  }

  function updateCtr(pi){
    var wrap=document.getElementById('la-ctr-'+pi);
    if(!wrap) return;
    wrap.outerHTML=counterHTML(pi);
  }

  function prog(active){
    var h='<div style="display:flex;justify-content:center;gap:8px;margin:0 0 34px;">';
    for(var s=0;s<7;s++){
      var bg=s<=active?'#c1b085':'rgba(193,176,133,0.15)';
      h+='<div style="width:34px;height:2px;background:'+bg+';"></div>';
    }
    return h+'</div>';
  }

  function rowHTML(pi,ii){
    var on=ST[pi][ii]===1;
    var na=ST[pi][ii]===-1;
    return ''+
      '<div id="wrap'+pi+'-'+ii+'" class="la-item-wrap '+(na?'is-na':'')+'" style="display:flex;align-items:center;justify-content:space-between;gap:12px;transition:opacity 0.3s;">'+
        '<div style="flex:1;">'+
          '<input type="checkbox" id="c'+pi+'-'+ii+'" class="lacb" '+(on?'checked':'')+'>'+
          '<label for="c'+pi+'-'+ii+'" class="larow" onclick="window.__la.pick('+pi+','+ii+',\'check\')" style="display:flex;align-items:center;gap:18px;padding:16px 8px;border:1px solid '+(on?'rgba(193,176,133,0.12)':'transparent')+';border-radius:2px;cursor:pointer;transition:all 0.3s;flex-grow:1;background:'+(on?'rgba(193,176,133,0.03)':'transparent')+';opacity:'+(na?'0.4':'1')+';filter:'+(na?'grayscale(100%)':'none')+';">'+
            '<div class="lash" style="width:24px;height:24px;flex-shrink:0;border:1px solid '+(on?'#c1b085':'#7A6842')+';border-radius:2px;background:transparent;display:flex;align-items:center;justify-content:center;transition:all 0.3s;box-shadow:'+(on?'0 0 12px rgba(193,176,133,0.6), 0 0 24px rgba(193,176,133,0.25), inset 0 0 8px rgba(193,176,133,0.1)':'none')+';">'+
              '<svg class="lamk" width="14" height="11" viewBox="0 0 14 11" fill="none" style="opacity:'+(on?'1':'0')+';transform:'+(on?'scale(1)':'scale(0.6)')+';transition:opacity 0.2s, transform 0.2s;filter:drop-shadow(0 0 3px rgba(193,176,133,0.9));"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
            '</div>'+
            '<span class="lalb" style="font-family:Cinzel,serif;font-size:16px;letter-spacing:2px;color:'+(on?'#c1b085':'#9a8d7a')+';transition:all 0.3s;'+(on?'text-shadow:0 0 12px rgba(193,176,133,0.3);':'')+'">'+P[pi].i[ii]+'</span>'+
          '</label>'+
        '</div>'+
        '<div>'+
          '<input type="checkbox" id="na'+pi+'-'+ii+'" class="lana" '+(na?'checked':'')+'>'+
          '<label for="na'+pi+'-'+ii+'" class="lana-btn" onclick="window.__la.pick('+pi+','+ii+',\'na\')" style="font-family:Cinzel,serif;font-size:12px;font-weight:600;color:'+(na?'#c1b085':'#7A6842')+';border:1px solid '+(na?'#7A6842':'#342a1c')+';padding:6px 12px;border-radius:2px;cursor:pointer;transition:all 0.3s;background:'+(na?'#342a1c':'transparent')+';">N/A</label>'+
        '</div>'+
      '</div>';
  }

  function businessGateHTML(){
    var yesOn=OB===true;
    var noOn=OB===false;
    var glow='0 0 12px rgba(193,176,133,0.45), 0 0 24px rgba(193,176,133,0.18)';
    return ''+
      '<div style="margin:28px 0 20px;padding:24px;border:1px solid rgba(193,176,133,0.12);text-align:center;">'+
        '<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:4px;color:#c1b085;margin-bottom:16px;">DO YOU OWN A BUSINESS?</div>'+
        '<div style="display:flex;justify-content:center;gap:16px;">'+
          '<button class="lab" onclick="window.__la.ob(true)" style="background:'+(yesOn?'#c1b085':'transparent')+';color:'+(yesOn?'#100d0a':'#c1b085')+';border:1px solid '+(yesOn?'#c1b085':'#7A6842')+';padding:12px 26px;font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;cursor:pointer;box-shadow:'+(yesOn?glow:'none')+';">YES</button>'+
          '<button class="lab" onclick="window.__la.ob(false)" style="background:'+(noOn?'#c1b085':'transparent')+';color:'+(noOn?'#100d0a':'#c1b085')+';border:1px solid '+(noOn?'#c1b085':'#7A6842')+';padding:12px 26px;font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;cursor:pointer;box-shadow:'+(noOn?glow:'none')+';">NO</button>'+
        '</div>'+
        '<div style="margin-top:14px;font-family:Bodoni Moda,serif;font-size:15px;font-style:italic;color:#bfa57a;">'+
          (OB===true?'All 7 pillars will be included in your audit.':OB===false?'Your score will be calculated across 6 pillars.':'')+
        '</div>'+
      '</div>';
  }

  function pillarHTML(pi){
    var pl=P[pi];
    var isP5=pi===4;
    var isLast=pi===6;
    var rows='';

    for(var ii=0;ii<6;ii++) rows+=rowHTML(pi,ii);

    var gate=isP5?businessGateHTML():'';

    var nextBtn;
    if(isP5) nextBtn='CONTINUE';
    else if(isLast) nextBtn='SEE RESULTS';
    else nextBtn='NEXT PILLAR';

    var backTarget=pi===1?1:(pi===6&&OB===false?5:pi);
    var backBtn=pi===0?'':'BACK';

    return prog(pi)+
      '<div style="font-family:\'Cinzel\',serif;font-size:11px;letter-spacing:5px;color:#b8984e;text-align:center;margin-bottom:4px;">PILLAR '+(pi+1)+' OF 7</div>'+
      '<div style="font-family:\'Cinzel\',serif;font-size:24px;font-weight:700;color:#fdfcfa;text-align:center;letter-spacing:3px;margin-bottom:10px;">'+pl.n.toUpperCase()+'</div>'+
      '<div style="font-family:\'Bodoni Moda\',serif;font-size:16px;font-style:italic;color:#b0a494;text-align:center;margin-bottom:28px;line-height:1.5;">'+pl.d+'</div>'+
      counterHTML(pi)+
      '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:52px;">'+rows+'</div>'+
      gate+
      '<div style="display:flex;justify-content:center;gap:34px;margin-top:30px;">'+
        (backBtn?'<button class="lab" onclick="window.__la.bk('+backTarget+')" style="background:none;border:none;color:#b8984e;font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;cursor:pointer;">'+backBtn+'</button>':'<span></span>')+
        '<button class="lab" onclick="window.__la.go('+(pi+2)+')" style="background:#c1b085;border:none;color:#100d0a;padding:15px 36px;font-family:Cinzel,serif;font-size:15px;font-weight:700;letter-spacing:3px;cursor:pointer;">'+nextBtn+'</button>'+
      '</div>';
  }

  function detailHTML(){
    var h='<div style="margin-top:42px;"><div style="font-family:Cinzel,serif;font-size:15px;letter-spacing:6px;color:#b9a57b;text-align:center;margin-bottom:24px;">YOUR FULL BREAKDOWN</div>';
    for(var pi=0;pi<7;pi++){
      if(pi===5&&OB===false) continue;

      var c=getCount(pi);
      var act=getActiveTotal(pi);

      h+='<div style="margin-bottom:24px;">'+
          '<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:4px;color:#c1b085;text-align:center;margin-bottom:16px;">'+P[pi].n.toUpperCase()+' '+c+'/'+act+'</div>';

      for(var ii=0;ii<6;ii++){
        var state=ST[pi][ii];
        var icon=state===-1
          ? '<div style="font-family:Cinzel,serif;font-size:12px;color:#7A6842;">N/A</div>'
          : state===1
          ? '<div style="font-family:Cinzel,serif;font-size:16px;color:#c1b085;">✓</div>'
          : '<div style="font-family:Cinzel,serif;font-size:16px;color:#8d6d5e;">✕</div>';

        h+='<div style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(193,176,133,0.08);">'+
              '<div style="width:24px;display:flex;justify-content:center;">'+icon+'</div>'+
              '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;color:'+(state===-1?'#7A6842':state===1?'#c1b085':'#9a8d7a')+';">'+P[pi].i[ii]+'</div>'+
            '</div>';
      }
      h+='</div>';
    }
    return h+'</div>';
  }

  function resultsHTML(){
    getPg1State();

    var tot=0, mx=0;
    for(var i=0;i<7;i++){
      if(i===5&&OB===false) continue;
      ST[i].forEach(function(v){
        if(v===1) tot++;
        if(v!==-1) mx++;
      });
    }

    var pct=mx>0?Math.round((tot/mx)*100):0;
    var pts=tot;

    var desc,tier,tierDesc,tierRec;
    if(pts<=10){
      desc='Critical gaps identified';
      tier='LEAN & READY';
      tierDesc='Minimal digital and legal silos. A standard continuity plan would cover this.';
      tierRec='Most people in this range start with The Vault.';
    } else if(pts<=22){
      desc='Significant gaps remain';
      tier='LEGACY AT RISK';
      tierDesc='Some documentation exists, but access gaps and single points of failure remain.';
      tierRec='Most people in this range benefit from The Archive.';
    } else if(pts<=30){
      desc='Partially documented';
      tier='CRITICAL COMPLEXITY';
      tierDesc='High-value, multi-layered responsibilities. Risk of permanent asset loss without a clear system.';
      tierRec='Most people in this range need The Legacy.';
    } else if(pts<36){
      desc='Well organized';
      tier='WELL STRUCTURED';
      tierDesc='Strong foundation in place. A few remaining gaps to close.';
      tierRec='A focused session can identify what is missing.';
    } else if(pts===36){
      desc='All scored areas in place';
      tier='WELL STRUCTURED';
      tierDesc='All scored areas are currently in place.';
      tierRec='A focused review can confirm everything is current and accessible.';
    } else {
      desc='Strongly organized';
      tier='COMPREHENSIVE';
      tierDesc='Thorough documentation across all pillars. Successor readiness is high.';
      tierRec='An annual review keeps this current.';
    }

    var brows='';
    for(var idx=0;idx<7;idx++){
      if(idx===5&&OB===false) continue;
      var c=getCount(idx);
      var act=getActiveTotal(idx);
      var w=act>0?Math.round((c/act)*100):100;
      var mxPillar=(c===act&&act>0);

      brows+='<div style="display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 0;border-bottom:1px solid rgba(193,176,133,0.10);">'+
        '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:3px;color:#9a8d7a;">'+P[idx].n.toUpperCase()+'</div>'+
        '<div style="display:flex;align-items:center;gap:14px;min-width:140px;justify-content:flex-end;">'+
          '<div style="width:130px;height:2px;background:rgba(193,176,133,0.12);position:relative;overflow:hidden;">'+
            '<div style="position:absolute;left:0;top:0;height:100%;width:'+w+'%;background:'+(mxPillar?'#c1b085':'#7A6842')+';"></div>'+
          '</div>'+
          '<div style="font-family:Bodoni Moda,serif;font-size:15px;font-style:italic;color:#c1b085;min-width:32px;text-align:right;">'+c+'/'+act+'</div>'+
        '</div>'+
      '</div>';
    }

    return ''+
      '<div style="max-width:620px;margin:0 auto;padding-top:8px;">'+
        '<div style="font-family:Cinzel,serif;font-size:11px;letter-spacing:6px;color:#b8984e;text-align:center;margin-bottom:10px;">AUDIT COMPLETE</div>'+
        '<div style="font-family:Cinzel,serif;font-size:24px;font-weight:700;letter-spacing:3px;color:#fdfcfa;text-align:center;margin-bottom:26px;">YOUR CONTINUITY SCORE</div>'+
        '<div style="display:flex;justify-content:center;margin-bottom:30px;">'+
          '<div style="width:260px;height:260px;border-radius:50%;border:1px solid rgba(193,176,133,0.18);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:inset 0 0 24px rgba(193,176,133,0.04);">'+
            '<div style="font-family:Cinzel,serif;font-size:12px;letter-spacing:6px;color:#8f7a4d;margin-bottom:10px;">CONTINUITY</div>'+
            '<div style="display:flex;align-items:flex-end;line-height:1;">'+
              '<span style="font-family:Cinzel,serif;font-size:78px;font-weight:700;color:#c1b085;">'+pct+'</span>'+
              '<span style="font-family:Bodoni Moda,serif;font-size:28px;font-style:italic;color:#c1b085;margin-left:6px;">%</span>'+
            '</div>'+
            '<div style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#cfc3b0;margin-top:12px;text-align:center;">'+desc+'</div>'+
          '</div>'+
        '</div>'+
        '<div style="text-align:center;margin-bottom:10px;font-family:Cinzel,serif;font-size:15px;letter-spacing:5px;color:#b9a57b;">'+tot+' OF '+mx+' APPLICABLE POINTS</div>'+
        '<div style="text-align:center;margin-bottom:10px;font-family:Cinzel,serif;font-size:28px;font-weight:700;letter-spacing:3px;color:#e7d7b2;">'+tier+'</div>'+
        '<div style="max-width:500px;margin:0 auto 14px;text-align:center;font-family:Bodoni Moda,serif;font-size:18px;font-style:italic;line-height:1.7;color:#d1c4b0;">'+tierDesc+'</div>'+
        '<div style="max-width:500px;margin:0 auto 34px;text-align:center;font-family:Bodoni Moda,serif;font-size:17px;font-style:italic;line-height:1.7;color:#bfa57a;">'+tierRec+'</div>'+
        '<div style="margin-top:18px;margin-bottom:20px;font-family:Cinzel,serif;font-size:15px;letter-spacing:6px;color:#9f8754;text-align:center;">PILLAR BREAKDOWN</div>'+
        '<div style="margin-bottom:34px;">'+brows+'</div>'+
        '<div id="la-email-sec" style="margin-top:8px;padding-top:24px;border-top:1px solid rgba(193,176,133,0.12);">'+
          '<div style="font-family:Cinzel,serif;font-size:15px;letter-spacing:6px;color:#b9a57b;text-align:center;margin-bottom:14px;">GET YOUR FULL BREAKDOWN</div>'+
          '<div style="max-width:520px;margin:0 auto 18px;text-align:center;font-family:Bodoni Moda,serif;font-size:18px;font-style:italic;line-height:1.7;color:#d1c4b0;">Your results show gaps across multiple systems. Enter your email to receive your full breakdown and checklist.</div>'+
          '<div style="display:flex;gap:16px;justify-content:center;align-items:stretch;flex-wrap:wrap;">'+
            '<input id="la-em" type="email" placeholder="Email" style="width:100%;max-width:360px;background:transparent;border:1px solid #7A6842;color:#fdfcfa;padding:16px 18px;font-family:Bodoni Moda,serif;font-size:16px;outline:none;border-radius:0;">'+
            '<button class="lab" onclick="window.__la.sub()" style="min-width:220px;background:#c1b085;color:#100d0a;border:none;padding:16px 22px;font-family:Cinzel,serif;font-size:14px;font-weight:700;letter-spacing:2px;cursor:pointer;">SEND ME MY RESULTS</button>'+
          '</div>'+
          '<div id="la-msg" style="margin-top:14px;text-align:center;font-family:Bodoni Moda,serif;font-size:14px;font-style:italic;color:#bfa57a;"></div>'+
        '</div>'+
        '<div style="display:flex;justify-content:center;gap:34px;margin-top:34px;">'+
          '<button onclick="window.__la.bk(7)" style="background:none;border:none;color:#b8984e;font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;cursor:pointer;">BACK</button>'+
          '<button onclick="window.__la.rs()" style="background:none;border:none;color:#7b6a47;font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;cursor:pointer;">START OVER</button>'+
        '</div>'+
      '</div>';
  }

  function showRest(html){
    var el=document.getElementById('pg-rest');
    if(!el) return;
    el.innerHTML=html;
    el.style.animation='none';
    void el.offsetWidth;
    el.style.animation='la-in 0.4s ease';    return h+'</div>';
  }

  function rowHTML(pi,ii){
    var on=ST[pi][ii]===1;
    var na=ST[pi][ii]===-1;
    return ''+
      '<div id="wrap'+pi+'-'+ii+'" class="la-item-wrap '+(na?'is-na':'')+'" style="display:flex;align-items:center;justify-content:space-between;gap:12px;transition:opacity 0.3s;">'+
        '<div style="flex:1;">'+
          '<input type="checkbox" id="c'+pi+'-'+ii+'" class="lacb" '+(on?'checked':'')+'>'+
          '<label for="c'+pi+'-'+ii+'" class="larow" onclick="window.__la.pick('+pi+','+ii+',\'check\')" style="display:flex;align-items:center;gap:18px;padding:16px 8px;border:1px solid '+(on?'rgba(193,176,133,0.12)':'transparent')+';border-radius:2px;cursor:pointer;transition:all 0.3s;flex-grow:1;background:'+(on?'rgba(193,176,133,0.03)':'transparent')+';opacity:'+(na?'0.4':'1')+';filter:'+(na?'grayscale(100%)':'none')+';">'+
            '<div class="lash" style="width:24px;height:24px;flex-shrink:0;border:1px solid '+(on?'#c1b085':'#7A6842')+';border-radius:2px;background:transparent;display:flex;align-items:center;justify-content:center;transition:all 0.3s;box-shadow:'+(on?'0 0 12px rgba(193,176,133,0.6), 0 0 24px rgba(193,176,133,0.25), inset 0 0 8px rgba(193,176,133,0.1)':'none')+';">'+
              '<svg class="lamk" width="14" height="11" viewBox="0 0 14 11" fill="none" style="opacity:'+(on?'1':'0')+';transform:'+(on?'scale(1)':'scale(0.6)')+';transition:opacity 0.2s, transform 0.2s;filter:drop-shadow(0 0 3px rgba(193,176,133,0.9));"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
            '</div>'+
            '<span class="lalb" style="font-family:Cinzel,serif;font-size:16px;letter-spacing:2px;color:'+(on?'#c1b085':'#9a8d7a')+';transition:all 0.3s;'+(on?'text-shadow:0 0 12px rgba(193,176,133,0.3);':'')+'">'+P[pi].i[ii]+'</span>'+
          '</label>'+
        '</div>'+
        '<div>'+
          '<input type="checkbox" id="na'+pi+'-'+ii+'" class="lana" '+(na?'checked':'')+'>'+
          '<label for="na'+pi+'-'+ii+'" class="lana-btn" onclick="window.__la.pick('+pi+','+ii+',\'na\')" style="font-family:Cinzel,serif;font-size:12px;font-weight:600;color:'+(na?'#c1b085':'#7A6842')+';border:1px solid '+(na?'#7A6842':'#342a1c')+';padding:6px 12px;border-radius:2px;cursor:pointer;transition:all 0.3s;background:'+(na?'#342a1c':'transparent')+';">N/A</label>'+
        '</div>'+
      '</div>';
  }

  function businessGateHTML(){
    var yesOn=OB===true;
    var noOn=OB===false;
    var glow='0 0 12px rgba(193,176,133,0.45), 0 0 24px rgba(193,176,133,0.18)';
    return ''+
      '<div style="margin:28px 0 20px;padding:24px;border:1px solid rgba(193,176,133,0.12);text-align:center;">'+
        '<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:4px;color:#c1b085;margin-bottom:16px;">DO YOU OWN A BUSINESS?</div>'+
        '<div style="display:flex;justify-content:center;gap:16px;">'+
          '<button class="lab" onclick="window.__la.ob(true)" style="background:'+(yesOn?'#c1b085':'transparent')+';color:'+(yesOn?'#100d0a':'#c1b085')+';border:1px solid '+(yesOn?'#c1b085':'#7A6842')+';padding:12px 26px;font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;cursor:pointer;box-shadow:'+(yesOn?glow:'none')+';">YES</button>'+
          '<button class="lab" onclick="window.__la.ob(false)" style="background:'+(noOn?'#c1b085':'transparent')+';color:'+(noOn?'#100d0a':'#c1b085')+';border:1px solid '+(noOn?'#c1b085':'#7A6842')+';padding:12px 26px;font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;cursor:pointer;box-shadow:'+(noOn?glow:'none')+';">NO</button>'+
        '</div>'+
        '<div style="margin-top:14px;font-family:Bodoni Moda,serif;font-size:15px;font-style:italic;color:#bfa57a;">'+
          (OB===true?'All 7 pillars will be included in your audit.':OB===false?'Your score will be calculated across 6 pillars.':'')+
        '</div>'+
      '</div>';
  }

  function pillarHTML(pi){
    var pl=P[pi];
    var isP5=pi===4;
    var isLast=pi===6;
    var rows='';

    for(var ii=0;ii<6;ii++) rows+=rowHTML(pi,ii);

    var gate=isP5?businessGateHTML():'';

    var nextBtn;
    if(isP5) nextBtn='CONTINUE';
    else if(isLast) nextBtn='SEE RESULTS';
    else nextBtn='NEXT PILLAR';

    var backTarget=pi===1?1:(pi===6&&OB===false?5:pi);
    var backBtn=pi===0?'':'BACK';

    return prog(pi)+
      '<div style="font-family:\'Cinzel\',serif;font-size:11px;letter-spacing:5px;color:#b8984e;text-align:center;margin-bottom:4px;">PILLAR '+(pi+1)+' OF 7</div>'+
      '<div style="font-family:\'Cinzel\',serif;font-size:24px;font-weight:700;color:#fdfcfa;text-align:center;letter-spacing:3px;margin-bottom:10px;">'+pl.n.toUpperCase()+'</div>'+
      '<div style="font-family:\'Bodoni Moda\',serif;font-size:16px;font-style:italic;color:#b0a494;text-align:center;margin-bottom:28px;line-height:1.5;">'+pl.d+'</div>'+
      counterHTML(pi)+
      '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:52px;">'+rows+'</div>'+
      gate+
      '<div style="display:flex;justify-content:center;gap:34px;margin-top:30px;">'+
        (backBtn?'<button class="lab" onclick="window.__la.bk('+backTarget+')" style="background:none;border:none;color:#b8984e;font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;cursor:pointer;">'+backBtn+'</button>':'<span></span>')+
        '<button class="lab" onclick="window.__la.go('+(pi+2)+')" style="background:#c1b085;border:none;color:#100d0a;padding:15px 36px;font-family:Cinzel,serif;font-size:15px;font-weight:700;letter-spacing:3px;cursor:pointer;">'+nextBtn+'</button>'+
      '</div>';
  }

  function detailHTML(){
    var h='<div style="margin-top:42px;"><div style="font-family:Cinzel,serif;font-size:15px;letter-spacing:6px;color:#b9a57b;text-align:center;margin-bottom:24px;">YOUR FULL BREAKDOWN</div>';
    for(var pi=0;pi<7;pi++){
      if(pi===5&&OB===false) continue;

      var c=getCount(pi);
      var act=getActiveTotal(pi);

      h+='<div style="margin-bottom:24px;">'+
          '<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:4px;color:#c1b085;text-align:center;margin-bottom:16px;">'+P[pi].n.toUpperCase()+' '+c+'/'+act+'</div>';

      for(var ii=0;ii<6;ii++){
        var state=ST[pi][ii];
        var icon=state===-1
          ? '<div style="font-family:Cinzel,serif;font-size:12px;color:#7A6842;">N/A</div>'
          : state===1
          ? '<div style="font-family:Cinzel,serif;font-size:16px;color:#c1b085;">✓</div>'
          : '<div style="font-family:Cinzel,serif;font-size:16px;color:#8d6d5e;">✕</div>';

        h+='<div style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(193,176,133,0.08);">'+
              '<div style="width:24px;display:flex;justify-content:center;">'+icon+'</div>'+
              '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;color:'+(state===-1?'#7A6842':state===1?'#c1b085':'#9a8d7a')+';">'+P[pi].i[ii]+'</div>'+
            '</div>';
      }
      h+='</div>';
    }
    return h+'</div>';
  }

  function resultsHTML(){
    getPg1State();

    var tot=0, mx=0;
    for(var i=0;i<7;i++){
      if(i===5&&OB===false) continue;
      ST[i].forEach(function(v){
        if(v===1) tot++;
        if(v!==-1) mx++;
      });
    }

    var pct=mx>0?Math.round((tot/mx)*100):0;
    var pts=tot;

    var desc,tier,tierDesc,tierRec;
    if(pts<=10){
      desc='Critical gaps identified';
      tier='LEAN & READY';
      tierDesc='Minimal digital and legal silos. A standard continuity plan would cover this.';
      tierRec='Most people in this range start with The Vault.';
    } else if(pts<=22){
      desc='Significant gaps remain';
      tier='LEGACY AT RISK';
      tierDesc='Some documentation exists, but access gaps and single points of failure remain.';
      tierRec='Most people in this range benefit from The Archive.';
    } else if(pts<=30){
      desc='Partially documented';
      tier='CRITICAL COMPLEXITY';
      tierDesc='High-value, multi-layered responsibilities. Risk of permanent asset loss without a clear system.';
      tierRec='Most people in this range need The Legacy.';
    } else if(pts<36){
      desc='Well organized';
      tier='WELL STRUCTURED';
      tierDesc='Strong foundation in place. A few remaining gaps to close.';
      tierRec='A focused session can identify what is missing.';
    } else if(pts===36){
      desc='All scored areas in place';
      tier='WELL STRUCTURED';
      tierDesc='All scored areas are currently in place.';
      tierRec='A focused review can confirm everything is current and accessible.';
    } else {
      desc='Strongly organized';
      tier='COMPREHENSIVE';
      tierDesc='Thorough documentation across all pillars. Successor readiness is high.';
      tierRec='An annual review keeps this current.';
    }

    var brows='';
    for(var idx=0;idx<7;idx++){
      if(idx===5&&OB===false) continue;
      var c=getCount(idx);
      var act=getActiveTotal(idx);
      var w=act>0?Math.round((c/act)*100):100;
      var mxPillar=(c===act&&act>0);

      brows+='<div style="display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 0;border-bottom:1px solid rgba(193,176,133,0.10);">'+
        '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:3px;color:#9a8d7a;">'+P[idx].n.toUpperCase()+'</div>'+
        '<div style="display:flex;align-items:center;gap:14px;min-width:140px;justify-content:flex-end;">'+
          '<div style="width:130px;height:2px;background:rgba(193,176,133,0.12);position:relative;overflow:hidden;">'+
            '<div style="position:absolute;left:0;top:0;height:100%;width:'+w+'%;background:'+(mxPillar?'#c1b085':'#7A6842')+';"></div>'+
          '</div>'+
          '<div style="font-family:Bodoni Moda,serif;font-size:15px;font-style:italic;color:#c1b085;min-width:32px;text-align:right;">'+c+'/'+act+'</div>'+
        '</div>'+
      '</div>';
    }

    return ''+
      '<div style="max-width:620px;margin:0 auto;padding-top:8px;">'+
        '<div style="font-family:Cinzel,serif;font-size:11px;letter-spacing:6px;color:#b8984e;text-align:center;margin-bottom:10px;">AUDIT COMPLETE</div>'+
        '<div style="font-family:Cinzel,serif;font-size:24px;font-weight:700;letter-spacing:3px;color:#fdfcfa;text-align:center;margin-bottom:26px;">YOUR CONTINUITY SCORE</div>'+
        '<div style="display:flex;justify-content:center;margin-bottom:30px;">'+
          '<div style="width:260px;height:260px;border-radius:50%;border:1px solid rgba(193,176,133,0.18);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:inset 0 0 24px rgba(193,176,133,0.04);">'+
            '<div style="font-family:Cinzel,serif;font-size:12px;letter-spacing:6px;color:#8f7a4d;margin-bottom:10px;">CONTINUITY</div>'+
            '<div style="display:flex;align-items:flex-end;line-height:1;">'+
              '<span style="font-family:Cinzel,serif;font-size:78px;font-weight:700;color:#c1b085;">'+pct+'</span>'+
              '<span style="font-family:Bodoni Moda,serif;font-size:28px;font-style:italic;color:#c1b085;margin-left:6px;">%</span>'+
            '</div>'+
            '<div style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#cfc3b0;margin-top:12px;text-align:center;">'+desc+'</div>'+
          '</div>'+
        '</div>'+
        '<div style="text-align:center;margin-bottom:10px;font-family:Cinzel,serif;font-size:15px;letter-spacing:5px;color:#b9a57b;">'+tot+' OF '+mx+' APPLICABLE POINTS</div>'+
        '<div style="text-align:center;margin-bottom:10px;font-family:Cinzel,serif;font-size:28px;font-weight:700;letter-spacing:3px;color:#e7d7b2;">'+tier+'</div>'+
        '<div style="max-width:500px;margin:0 auto 14px;text-align:center;font-family:Bodoni Moda,serif;font-size:18px;font-style:italic;line-height:1.7;color:#d1c4b0;">'+tierDesc+'</div>'+
        '<div style="max-width:500px;margin:0 auto 34px;text-align:center;font-family:Bodoni Moda,serif;font-size:17px;font-style:italic;line-height:1.7;color:#bfa57a;">'+tierRec+'</div>'+
        '<div style="margin-top:18px;margin-bottom:20px;font-family:Cinzel,serif;font-size:15px;letter-spacing:6px;color:#9f8754;text-align:center;">PILLAR BREAKDOWN</div>'+
        '<div style="margin-bottom:34px;">'+brows+'</div>'+
        '<div id="la-email-sec" style="margin-top:8px;padding-top:24px;border-top:1px solid rgba(193,176,133,0.12);">'+
          '<div style="font-family:Cinzel,serif;font-size:15px;letter-spacing:6px;color:#b9a57b;text-align:center;margin-bottom:14px;">GET YOUR FULL BREAKDOWN</div>'+
          '<div style="max-width:520px;margin:0 auto 18px;text-align:center;font-family:Bodoni Moda,serif;font-size:18px;font-style:italic;line-height:1.7;color:#d1c4b0;">Your results show gaps across multiple systems. Enter your email to receive your full breakdown and checklist.</div>'+
          '<div style="display:flex;gap:16px;justify-content:center;align-items:stretch;flex-wrap:wrap;">'+
            '<input id="la-em" type="email" placeholder="Email" style="width:100%;max-width:360px;background:transparent;border:1px solid #7A6842;color:#fdfcfa;padding:16px 18px;font-family:Bodoni Moda,serif;font-size:16px;outline:none;border-radius:0;">'+
            '<button class="lab" onclick="window.__la.sub()" style="min-width:220px;background:#c1b085;color:#100d0a;border:none;padding:16px 22px;font-family:Cinzel,serif;font-size:14px;font-weight:700;letter-spacing:2px;cursor:pointer;">SEND ME MY RESULTS</button>'+
          '</div>'+
          '<div id="la-msg" style="margin-top:14px;text-align:center;font-family:Bodoni Moda,serif;font-size:14px;font-style:italic;color:#bfa57a;"></div>'+
        '</div>'+
        '<div style="display:flex;justify-content:center;gap:34px;margin-top:34px;">'+
          '<button onclick="window.__la.bk(7)" style="background:none;border:none;color:#b8984e;font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;cursor:pointer;">BACK</button>'+
          '<button onclick="window.__la.rs()" style="background:none;border:none;color:#7b6a47;font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;cursor:pointer;">START OVER</button>'+
        '</div>'+
      '</div>';
  }

  function showRest(html){
    var el=document.getElementById('pg-rest');
    if(!el) return;
    el.innerHTML=html;
    el.style.animation='none';
    void el.offsetWidth;
    el.style.animation='la-in 0.4s ease';
    scrollToAudit();
  }

  function showPg1(){
    var pg1=document.getElementById('pg1');
    if(pg1) pg1.style.display='';
  }

  function 
