/* LA Digital Audit v17 - audit7.js
   Changes from v16:
   - Results reordered: 52% stat -> pillar breakdown -> continuity score
   - Removed all em dashes
   - Removed section borders on results page
   - Embedded Cal.com inline calendar (replaces schedule button)
   - Added workbook CTA with promo image
   - Removed Founding Families section (links to #pricing instead)
   - Removed duplicate Schedule/Start Over buttons
   - Life Manual bolded throughout, trademark on first mention only
   - One link to #workbook, one to #pricing
*/
(function(){
  var lnk=document.createElement('link');
  lnk.rel='stylesheet';
  lnk.href='https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,300;1,6..96,400&display=swap';
  document.head.appendChild(lnk);

  /* ── Cal.com embed loader ──────────────────────── */
  var WORKBOOK_IMG='https://cdn.jsdelivr.net/gh/LegacyArchitectRVA/la-audit@main/workbook-promo.jpg';

  (function(C,A,L){
    var p=function(a,ar){a.q.push(ar);};
    var d=C.document;
    C.Cal=C.Cal||function(){
      var cal=C.Cal;var ar=arguments;
      if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement('script')).src=A;cal.loaded=true;}
      if(ar[0]===L){var api=function(){p(api,arguments);};var ns=ar[1];api.q=api.q||[];if(typeof ns==='string'){cal.ns[ns]=cal.ns[ns]||api;p(cal.ns[ns],ar);p(cal,['initNamespace',ns]);}else p(cal,ar);return;}
      p(cal,ar);
    };
  })(window,'https://app.cal.com/embed/embed.js','init');
  Cal('init','private-conversation',{origin:'https://app.cal.com'});

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
  var NA=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
  var OB=null;
  var lastP1Cnt=-1;
  var lastP1Na=-1;

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
    for(var i=0;i<6;i++){
      var cb=document.getElementById('c0-'+i);
      ST[0][i]=(cb&&cb.checked)?1:0;
      var naCb=document.getElementById('na0-'+i);
      NA[0][i]=(naCb&&naCb.checked)?1:0;
    }
  }

  /* ── pillar scoring helpers ────────────────────── */

  function pillarChecked(pi){
    return ST[pi].reduce(function(a,v){return a+v;},0);
  }

  function pillarNa(pi){
    return NA[pi].reduce(function(a,v){return a+v;},0);
  }

  function pillarMax(pi){
    return 6-pillarNa(pi);
  }

  /* ── glowing counter ───────────────────────────── */

  function ctrStyles(cnt,mx){
    var f=mx>0&&cnt===mx;
    return {
      border: f?'#c1b085': cnt>0?'rgba(193,176,133,'+(0.3+cnt*0.1).toFixed(1)+')':'#342a1c',
      shadow: cnt>0?'0 0 '+(8+cnt*4)+'px rgba(193,176,133,'+(0.15+cnt*0.05).toFixed(2)+')'+(f?',0 0 32px rgba(193,176,133,0.3)':''):'none',
      bg: 'rgba(193,176,133,'+(f?'0.06':'0.02')+')',
      numColor: f?'#c1b085': cnt>0?'#b8984e':'#6b5a38',
      numShadow: f?'0 0 16px rgba(193,176,133,0.5)':'none'
    };
  }

  function counterHTML(pi){
    var cnt=pillarChecked(pi);
    var mx=pillarMax(pi);
    var s=ctrStyles(cnt,mx);
    return '<div id="la-ctr-'+pi+'" style="display:flex;align-items:center;justify-content:center;margin-bottom:32px;">'+
      '<div style="display:inline-flex;align-items:baseline;gap:8px;padding:14px 32px;'+
        'border:1px solid '+s.border+';border-radius:2px;'+
        'background:'+s.bg+';'+
        'box-shadow:'+s.shadow+';'+
        'transition:border-color 0.3s,box-shadow 0.4s,background 0.3s;">'+
        '<span id="la-ctr-num-'+pi+'" style="font-family:Cinzel,serif;font-size:28px;font-weight:700;color:'+s.numColor+';line-height:1;'+
          'text-shadow:'+s.numShadow+';transition:color 0.3s,text-shadow 0.3s;">'+cnt+'</span>'+
        '<span style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#8a7240;line-height:1;">of </span>'+
        '<span id="la-ctr-mx-'+pi+'" style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#8a7240;line-height:1;">'+mx+'</span>'+
      '</div>'+
    '</div>';
  }

  function updateCtr(pi){
    var cnt=pillarChecked(pi);
    var mx=pillarMax(pi);
    var wrap=document.getElementById('la-ctr-'+pi);
    if(!wrap)return;
    var box=wrap.firstElementChild; if(!box)return;
    var num=document.getElementById('la-ctr-num-'+pi);
    var mxEl=document.getElementById('la-ctr-mx-'+pi);
    var s=ctrStyles(cnt,mx);
    box.style.borderColor=s.border;
    box.style.boxShadow=s.shadow;
    box.style.background=s.bg;
    if(num){num.textContent=cnt;num.style.color=s.numColor;num.style.textShadow=s.numShadow;}
    if(mxEl){mxEl.textContent=mx;}
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

  /* ── N/A button style helpers ──────────────────── */

  function naStyle(isNa){
    return 'display:inline-flex;align-items:center;justify-content:center;'+
      'width:auto;min-width:42px;height:24px;padding:0 8px;flex-shrink:0;'+
      'border:1px solid '+(isNa?'#6b5a38':'#342a1c')+';border-radius:2px;cursor:pointer;'+
      'background:'+(isNa?'rgba(107,90,56,0.12)':'transparent')+';'+
      'box-shadow:'+(isNa?'0 0 10px rgba(107,90,56,0.4)':'none')+';'+
      'transition:border-color 0.2s,background 0.2s,box-shadow 0.2s;';
  }

  /* ── pillar page ───────────────────────────────── */

  function pillarHTML(pi){
    var pl=P[pi],isP5=pi===4,isLast=pi===6;
    var rows='';
    for(var ii=0;ii<6;ii++){
      var on=ST[pi][ii];
      var isNa=NA[pi][ii];
      var rowOpacity=isNa?'0.35':'1';
      rows+=
        '<div id="r'+pi+'-'+ii+'" style="display:flex;align-items:center;gap:12px;padding:13px 16px;border:1px solid '+(on?'rgba(193,176,133,0.12)':'transparent')+';border-radius:2px;background:'+(on?'rgba(193,176,133,0.03)':'transparent')+';opacity:'+rowOpacity+';transition:opacity 0.25s,border-color 0.2s,background 0.2s;">'+
          /* checkbox area */
          '<div onclick="__la.t('+pi+','+ii+')" style="display:flex;align-items:center;gap:18px;flex:1;cursor:pointer;">'+
            '<div id="sh'+pi+'-'+ii+'" style="width:24px;height:24px;flex-shrink:0;border:1px solid '+(on?'#c1b085':'#7A6842')+';border-radius:2px;display:flex;align-items:center;justify-content:center;box-shadow:'+(on?'0 0 12px rgba(193,176,133,0.6),0 0 24px rgba(193,176,133,0.25),inset 0 0 8px rgba(193,176,133,0.1)':'none')+';transition:border-color 0.2s,box-shadow 0.2s;">'+
              '<svg id="mk'+pi+'-'+ii+'" width="14" height="11" viewBox="0 0 14 11" fill="none" style="opacity:'+(on?'1':'0')+';transform:'+(on?'scale(1)':'scale(0.6)')+';transition:opacity 0.2s,transform 0.2s;filter:drop-shadow(0 0 3px rgba(193,176,133,0.9));"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
            '</div>'+
            '<div id="lb'+pi+'-'+ii+'" style="font-family:Cinzel,serif;font-size:16px;letter-spacing:2px;color:'+(on?'#c1b085':'#9a8d7a')+';'+(on?'text-shadow:0 0 12px rgba(193,176,133,0.3);':'')+'transition:color 0.2s,text-shadow 0.2s;">'+pl.i[ii]+'</div>'+
          '</div>'+
          /* N/A button */
          '<div id="na'+pi+'-'+ii+'" onclick="__la.na('+pi+','+ii+')" style="'+naStyle(isNa)+'">'+
            '<span style="font-family:Cinzel,serif;font-size:10px;letter-spacing:1.5px;font-weight:700;color:'+(isNa?'#b8984e':'#4a3d28')+';line-height:1;transition:color 0.2s;">N/A</span>'+
          '</div>'+
        '</div>';
    }

    /* business-owner gate on Pillar 5 */
    var gate='';
    if(isP5){
      gate='<div style="margin-top:36px;padding-top:32px;border-top:1px solid #2a2218;margin-bottom:52px;">'+
        '<div style="font-family:Cinzel,serif;font-size:16px;letter-spacing:3px;color:#b8984e;margin-bottom:20px;">DO YOU OWN A BUSINESS?</div>'+
        '<div style="display:flex;gap:12px;">'+
          '<button id="by" onclick="__la.by()" style="font-family:Cinzel,serif;font-size:14px;font-weight:700;letter-spacing:3px;padding:13px 32px;border:1px solid '+(OB===true?'#c1b085':'#4a3d28')+';background:'+(OB===true?'rgba(193,176,133,0.05)':'transparent')+';color:'+(OB===true?'#c1b085':'#8a7240')+';cursor:pointer;border-radius:1px;box-shadow:'+(OB===true?'0 0 18px rgba(193,176,133,0.5),inset 0 0 12px rgba(193,176,133,0.08)':'none')+';transition:all 0.25s;">YES</button>'+
          '<button id="bn" onclick="__la.bn()" style="font-family:Cinzel,serif;font-size:14px;font-weight:700;letter-spacing:3px;padding:13px 32px;border:1px solid '+(OB===false?'#c1b085':'#4a3d28')+';background:'+(OB===false?'rgba(193,176,133,0.05)':'transparent')+';color:'+(OB===false?'#c1b085':'#8a7240')+';cursor:pointer;border-radius:1px;box-shadow:'+(OB===false?'0 0 18px rgba(193,176,133,0.5),inset 0 0 12px rgba(193,176,133,0.08)':'none')+';transition:all 0.25s;">NO</button>'+
        '</div>'+
        '<div id="bh" style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:'+(OB!==null?'#9a8d7a':'transparent')+';margin-top:14px;min-height:18px;">'+
          (OB===true?'All 7 pillars will be included in your audit.':OB===false?'Your score will be calculated across 6 pillars.':'')+
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

  /* Full item-by-item breakdown */
  function detailHTML(){
    var h='<div style="font-family:Cinzel,serif;font-size:15px;letter-spacing:4px;color:#b8984e;margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid #2a2218;">YOUR FULL BREAKDOWN</div>';
    for(var pi=0;pi<7;pi++){
      if(pi===5&&OB===false)continue;
      var c=pillarChecked(pi);
      var mx=pillarMax(pi);
      h+='<div style="margin-bottom:28px;">'+
        '<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:2px;color:#c1b085;margin-bottom:14px;">'+P[pi].n.toUpperCase()+' <span style="color:#8a7240;font-size:12px;margin-left:8px;">'+c+'/'+mx+'</span></div>';
      for(var ii=0;ii<6;ii++){
        var on=ST[pi][ii];
        var isNa=NA[pi][ii];
        if(isNa){
          h+='<div style="display:flex;align-items:center;gap:14px;padding:8px 0;border-bottom:1px solid #1a1610;opacity:0.35;">'+
            '<div style="width:18px;height:18px;flex-shrink:0;border:1px solid #342a1c;border-radius:2px;display:flex;align-items:center;justify-content:center;">'+
              '<span style="font-family:Cinzel,serif;font-size:8px;color:#4a3d28;font-weight:700;">N/A</span>'+
            '</div>'+
            '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:1.5px;color:#4a3d28;text-decoration:line-through;">'+P[pi].i[ii]+'</div>'+
          '</div>';
        }else{
          h+='<div style="display:flex;align-items:center;gap:14px;padding:8px 0;border-bottom:1px solid #1a1610;">'+
            '<div style="width:18px;height:18px;flex-shrink:0;border:1px solid '+(on?'#c1b085':'#4a3d28')+';border-radius:2px;display:flex;align-items:center;justify-content:center;'+(on?'box-shadow:0 0 8px rgba(193,176,133,0.4);':'')+'">'+
              (on?'<svg width="12" height="9" viewBox="0 0 14 11" fill="none"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>':
                   '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2L8 8M8 2L2 8" stroke="#4a3d28" stroke-width="1.2" stroke-linecap="round"/></svg>')+
            '</div>'+
            '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:1.5px;color:'+(on?'#c1b085':'#6b5a38')+';">'+P[pi].i[ii]+'</div>'+
          '</div>';
        }
      }
      h+='</div>';
    }
    return h;
  }


  var GD=[
    [/* Digital Life */
      "Email is the recovery method for nearly every other account. Without access, password resets fail across the board.",
      "Without a centralized credential system, a successor would need to recover each account individually - a process that can take weeks or months, with some accounts lost permanently.",
      "Family photos, documents, and personal files stored in the cloud can become permanently inaccessible if credentials are lost.",
      "If 2FA is enabled without stored recovery keys, accounts become permanently inaccessible. This is the single most common cause of irreversible digital lockout.",
      "Without designated legacy contacts, social media accounts may be memorialized, deleted, or hijacked - with no way to recover meaningful content.",
      "Digital purchases, streaming libraries, and media collections are tied to accounts. Without access documentation, they disappear."
    ],
    [/* Financial & Assets */
      "Without account documentation, a successor may not know which institutions to contact, leading to missed payments, penalties, and frozen funds.",
      "Retirement and brokerage accounts each have different beneficiary and access requirements. Gaps here can mean months of legal process.",
      "Cryptocurrency without documented recovery keys is permanently lost. There is no institution to call, no reset to request.",
      "Automated payments continue after incapacitation or death. Without a list, successors discover them only when accounts overdraft or services are cut.",
      "Tax history is required for estate settlement, insurance claims, and financial transfers. Missing records create delays and potential legal exposure.",
      "Undocumented debts can lead to collection actions, credit damage, and unexpected liabilities for the estate."
    ],
    [/* Household & Property */
      "Without accessible deeds, property transfers require title searches, legal fees, and significant delays.",
      "Vehicle transfers require title documentation. Missing titles mean DMV processes, potential lien searches, and delays.",
      "Warranty information, service contracts, and maintenance schedules prevent costly duplicate work and protect property value.",
      "Utilities left unmanaged can result in service interruptions, damage to property, and unnecessary charges.",
      "Without an inventory, valuable items can be overlooked, undervalued, or lost during estate settlement.",
      "Storage units with unknown contents or lost access can result in forfeiture of personal property."
    ],
    [/* Health & Medical */
      "Without insurance documentation, medical decisions may be delayed and coverage may lapse during a critical period.",
      "A complete medical history is essential for treatment decisions. Gaps can lead to dangerous drug interactions or repeated procedures.",
      "A current medication list prevents dangerous interactions and ensures continuity of care during transitions.",
      "Without a directive, medical decisions may not reflect your wishes, and family members may face agonizing choices without guidance.",
      "Documented preferences prevent confusion and ensure your wishes are honored in time-sensitive situations.",
      "A clear emergency contact list ensures the right people are reached immediately - not hours or days later."
    ],
    [/* Legal & Estate */
      "Without a will, state intestacy laws determine asset distribution - which may not align with your intentions.",
      "Trusts without accessible documentation may not function as intended, potentially triggering probate for assets meant to avoid it.",
      "Without a Power of Attorney, even a spouse may not have legal authority to act on financial, medical, or legal matters during incapacitation.",
      "Undiscovered policies are more common than most people realize. Billions in life insurance go unclaimed every year.",
      "Without documented guardianship preferences, courts decide who cares for your dependents.",
      "A business without a succession plan risks operational collapse, employee displacement, and loss of client relationships."
    ],
    [/* Business Continuity */
      "Articles of incorporation, EINs, and operating documents are required for continuity. Without them, basic business functions stall.",
      "Business accounts often have different access requirements than personal. Without documentation, cash flow stops.",
      "Operating agreements define authority. Without them, partners and successors may have no legal standing to act.",
      "Business insurance lapses can expose the entity to liability during a transition period.",
      "Relationships are assets. Without a contact list, critical vendor and client relationships may be lost.",
      "Without operational documentation, institutional knowledge leaves with the owner."
    ],
    [/* Legacy & Wishes */
      "Words left unsaid become the things people wish they had. Letters provide closure that no legal document can.",
      "An ethical will captures values, beliefs, and life lessons - the intangible inheritance that matters most to many families.",
      "Without documented preferences, families make difficult decisions under emotional pressure, often second-guessing themselves.",
      "A prepared obituary ensures accuracy and reflects your life as you would want it told.",
      "Objects carry meaning, but only if the stories behind them are preserved. Without documentation, heirlooms become just things.",
      "Documented giving preferences ensure your philanthropic intentions continue."
    ]
  ];

  var TP=[
    {/* LEAN & READY */
      t:"LEAN & READY",
      p:[
        "Your audit revealed <strong style=\"color:#c1b085;\">critical gaps</strong> across most pillars. This is not unusual. Most people have never been asked to think about continuity in structured terms.",
        "What it means practically: if something happened to you tomorrow, the people you trust most would face significant confusion. Access to accounts, knowledge of obligations, location of key documents. These are the things that fall through the cracks when there is no system in place.",
        "The gaps you have are common, and they are fixable. A foundational continuity plan would cover the highest-risk areas first: digital access, emergency contacts, and essential documents."
      ]
    },
    {/* LEGACY AT RISK */
      t:"LEGACY AT RISK",
      p:[
        "You have some documentation in place, but <strong style=\"color:#c1b085;\">significant gaps remain</strong>. The items you checked show awareness. The unchecked ones represent single points of failure.",
        "This is the range where risk is most deceptive. You have enough organized that it feels manageable, but not enough that a successor could act without guesswork. Financial accounts without documented access pathways, insurance policies without location records, digital accounts without recovery options. These are the gaps that create months of confusion.",
        "An expanded continuity plan would close these gaps systematically, covering not just the basics but the financial, legal, and household layers that hold everything together."
      ]
    },
    {/* CRITICAL COMPLEXITY */
      t:"CRITICAL COMPLEXITY",
      p:[
        "Your audit shows <strong style=\"color:#c1b085;\">multi-layered responsibilities</strong> across most pillars. You have significant documentation, but the complexity of your situation means the remaining gaps carry outsized risk.",
        "At this level, the issue is not awareness but architecture. Individual items may be documented, but without a unified system that a successor can follow step by step, even well-organized people leave critical gaps. Cryptocurrency keys, business operating agreements, trust documentation, advanced healthcare directives. These are items where a single missing piece can mean permanent loss.",
        "A comprehensive continuity plan would bring every pillar into a single, navigable system, including business operations if applicable."
      ]
    },
    {/* WELL STRUCTURED */
      t:"WELL STRUCTURED",
      p:[
        "You are <strong style=\"color:#c1b085;\">well organized</strong>. Your audit shows a strong foundation across most pillars, with only a few remaining gaps.",
        "At this level, the value is not in building from scratch. It is in validation and completion. The items you have not checked may represent things you have not gotten to yet, or things you assumed were covered but are not. Either way, a focused review would identify exactly what is missing and ensure everything is accessible, current, and connected.",
        "Most people at this level benefit from a structured review session rather than a full engagement."
      ]
    },
    {/* COMPREHENSIVE */
      t:"COMPREHENSIVE",
      p:[
        "Your documentation is <strong style=\"color:#c1b085;\">thorough</strong>. This is rare. Most people who take this audit score well below where you are.",
        "The question at this level is not what is missing, but whether what exists is current, accessible, and structured in a way that a successor could actually use. Documents can exist without being findable. Accounts can be listed without access being transferable.",
        "An annual review ensures nothing drifts out of date, and that the people who may need this information know where to find it."
      ]
    }
  ];

  /* ── scoring calculation ───────────────────────── */

  function calcScore(){
    getPg1State();
    var tot=0,mx=0;
    for(var i=0;i<7;i++){
      if(i===5&&OB===false)continue;
      tot+=pillarChecked(i);
      mx+=pillarMax(i);
    }
    return {total:tot,max:mx,pct:mx>0?Math.round(tot/mx*100):0};
  }

  function getTier(tot,mx){
    var pct=mx>0?Math.round(tot/mx*100):0;
    if(pct<=25) return 0;
    if(pct<=50) return 1;
    if(pct<=70) return 2;
    if(pct<=85) return 3;
    return 4;
  }


  function initCalEmbed(){
    if(typeof Cal==='undefined')return;
    try{
      Cal.ns['private-conversation']('inline',{
        elementOrSelector:'#la-cal-embed',
        config:{layout:'month_view',useSlotsViewOnSmallScreen:'true'},
        calLink:'legacyarchitectrva/private-conversation'
      });
      Cal.ns['private-conversation']('ui',{
        cssVarsPerTheme:{light:{'cal-brand':'#292929'},dark:{'cal-brand':'#C4AB93'}},
        hideEventTypeDetails:false,
        layout:'month_view'
      });
    }catch(e){}
  }

  /* ── conversion-optimized results page ─────────── */

  /* Full results (shown AFTER email submission) */
  function fullResultsHTML(){
    var sc=calcScore();
    var tot=sc.total,mx=sc.max,pct=sc.pct;
    var ti=getTier(tot,mx);
    var tp=TP[ti];

    var h='';

    /* what your score means */
    h+='<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:4px;color:#b8984e;padding-bottom:14px;border-bottom:1px solid #2a2218;margin-bottom:22px;">WHAT YOUR SCORE MEANS</div>';
    for(var pp=0;pp<tp.p.length;pp++){
      h+='<div style="font-family:Bodoni Moda,serif;font-size:17px;font-style:italic;color:#b0a494;line-height:1.8;margin-bottom:18px;">'+tp.p[pp]+'</div>';
    }

    /* key gaps */
    var gaps=[];
    var priority=[4,3,1,0,2,6,5];
    for(var gi=0;gi<priority.length&&gaps.length<5;gi++){
      var gp=priority[gi];
      if(gp===5&&OB===false)continue;
      for(var gj=0;gj<6&&gaps.length<5;gj++){
        if(!ST[gp][gj]&&!NA[gp][gj]) gaps.push({pi:gp,ii:gj});
      }
    }

    if(gaps.length>0){
      h+='<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:4px;color:#b8984e;margin-top:40px;padding-bottom:14px;border-bottom:1px solid #2a2218;margin-bottom:22px;">YOUR KEY GAPS</div>';
      h+='<div style="font-family:Bodoni Moda,serif;font-size:17px;font-style:italic;color:#b0a494;line-height:1.8;margin-bottom:24px;">Based on your responses, these are the areas with the highest impact if left unaddressed:</div>';
      for(var gk=0;gk<gaps.length;gk++){
        var g=gaps[gk];
        h+='<div style="padding:14px 0;border-bottom:1px solid #1a1510;">'+
          '<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:2px;color:#c1b085;margin-bottom:8px;">\u2717 '+P[g.pi].i[g.ii]+'</div>'+
          '<div style="font-family:Bodoni Moda,serif;font-size:15px;font-style:italic;color:#8a7d6a;line-height:1.7;">'+GD[g.pi][g.ii]+'</div>'+
        '</div>';
      }
    }

    /* full item-by-item breakdown */
    h+='<div style="margin-top:44px;">'+detailHTML()+'</div>';

    /* CTA */
    h+='<div style="padding:40px 0;margin-top:48px;text-align:center;">'+
      '<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:4px;color:#b8984e;margin-bottom:16px;">YOUR RECOMMENDED NEXT STEP</div>'+
      '<div style="font-family:Bodoni Moda,serif;font-size:19px;font-style:italic;color:#c1b085;line-height:1.6;margin-bottom:8px;">A <strong>Life Manual</strong>\u2122 closes these gaps before someone else has to.</div>'+
      '<div style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#b0a494;line-height:1.7;margin-bottom:28px;">It does not replace a will or a trust. It makes them usable. It tells the people you trust not just what they have authority to do, but how to actually do it.</div>'+
    '</div>';

    /* Workbook CTA with image */
    h+='<div style="text-align:center;margin-top:40px;padding-top:32px;border-top:1px solid #2a2218;">'+
      '<div style="font-family:Bodoni Moda,serif;font-size:17px;font-style:italic;color:#b0a494;line-height:1.6;margin-bottom:20px;">Or explore at your own pace:</div>'+
      '<a href="https://legacyarchitectrva.com/#workbook" target="_blank" style="text-decoration:none;display:inline-block;">'+
        '<img src="'+WORKBOOK_IMG+'" alt="7-Pillar Continuity Workbook" style="max-width:400px;width:100%;border-radius:2px;margin-bottom:16px;">'+
      '</a>'+
      '<div style="margin-bottom:20px;"><a href="https://legacyarchitectrva.com/#workbook" target="_blank" style="font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:3px;color:#100d0a;background:#c1b085;text-decoration:none;display:inline-block;padding:14px 36px;border-radius:1px;">DOWNLOAD THE FREE WORKBOOK</a></div>'+
      '<a href="https://legacyarchitectrva.com/#pricing" target="_blank" style="font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:3px;color:#c1b085;text-decoration:none;padding:14px 36px;border:1px solid #c1b085;border-radius:1px;display:inline-block;">VIEW PACKAGES & PRICING</a>'+
    '</div>';

    /* Cal.com inline embed */
    h+='<div style="margin-top:48px;padding-top:32px;border-top:1px solid #2a2218;">'+
      '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:4px;color:#b8984e;text-align:center;margin-bottom:8px;">BOOK A PRIVATE CONVERSATION</div>'+
      '<div style="font-family:Bodoni Moda,serif;font-size:15px;font-style:italic;color:#8a7240;text-align:center;margin-bottom:20px;">No obligation. 100% confidential.</div>'+
      '<div id="la-cal-embed" style="width:100%;min-height:500px;overflow:auto;"></div>'+
    '</div>';

    return h;
  }

  /* Pre-email results page */
  function resultsHTML(){
    var sc=calcScore();
    var tot=sc.total,mx=sc.max,pct=sc.pct;
    var ti=getTier(tot,mx);
    var tp=TP[ti];

    var desc=tot<=10?'Critical gaps identified':tot<=22?'Significant gaps remain':tot<=30?'Partially documented':tot<=36?'Well organized':'Strongly organized';

    var h='';

    /* 52% urgency stat - FIRST */
    h+='<div style="padding:28px 32px;margin-bottom:40px;text-align:center;background:rgba(193,176,133,0.02);">'+
        '<div style="font-family:Cinzel,serif;font-size:42px;font-weight:700;color:#c1b085;line-height:1;margin-bottom:8px;">52%</div>'+
        '<div style="font-family:Bodoni Moda,serif;font-size:17px;font-style:italic;color:#b0a494;line-height:1.6;">of adults have <strong style=\'color:#c1b085;\'>no plan</strong> for their digital assets. The gaps below show where your family would be left guessing.</div>'+
      '</div>';

    /* pillar breakdown bars - SECOND */
    var brows='';
    for(var idx=0;idx<7;idx++){
      if(idx===5&&OB===false)continue;
      var c=pillarChecked(idx);
      var pmx=pillarMax(idx);
      var w=pmx>0?Math.round(c/pmx*100):0;
      var full=pmx>0&&c===pmx;
      brows+='<div style="display:flex;align-items:center;gap:16px;padding:11px 0;border-bottom:1px solid #2a2218;">'+
        '<div style="font-family:Cinzel,serif;font-size:12px;letter-spacing:1.5px;color:#c1b085;width:170px;flex-shrink:0;">'+P[idx].n.toUpperCase()+'</div>'+
        '<div style="flex:1;height:2px;background:#342a1c;position:relative;">'+
          '<div class="lab" data-w="'+w+'" style="position:absolute;top:0;left:0;height:100%;width:0%;background:'+(full?'#c1b085':'#8a7030')+';transition:width 1.2s cubic-bezier(0.4,0,0.2,1);box-shadow:'+(full?'0 0 8px rgba(193,176,133,0.5)':'0 0 4px rgba(138,112,48,0.4)')+';"></div>'+
        '</div>'+
        '<div style="font-family:Bodoni Moda,serif;font-size:18px;font-style:italic;color:'+(full?'#c1b085':'#b8984e')+';width:42px;text-align:right;flex-shrink:0;">'+c+'/'+pmx+'</div>'+
      '</div>';
    }

    h+='<div style="margin-bottom:48px;">'+
      '<div style="font-family:Cinzel,serif;font-size:15px;letter-spacing:4px;color:#b8984e;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid #2a2218;">PILLAR BREAKDOWN</div>'+
      brows+
    '</div>';

    /* AUDIT COMPLETE + YOUR CONTINUITY SCORE headers */
    h+='<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:5px;color:#b8984e;text-align:center;margin-bottom:14px;">AUDIT COMPLETE</div>'+
      '<div style="font-family:Cinzel,serif;font-size:23px;font-weight:600;color:#fdfcfa;letter-spacing:3px;text-align:center;margin-bottom:56px;">YOUR CONTINUITY SCORE</div>';

    /* animated score ring */
    h+='<div style="display:flex;justify-content:center;margin-bottom:40px;">'+
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
      '<div style="text-align:center;margin-bottom:48px;">'+
        '<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:3px;color:#c1b085;margin-bottom:8px;">'+tot+' OF '+mx+' POINTS</div>'+
        '<div style="font-family:Cinzel,serif;font-size:20px;font-weight:700;color:#c1b085;letter-spacing:2px;margin-bottom:12px;">'+tp.t+'</div>'+
      '</div>';

    /* email gate - no outer border */
    h+='<div style="padding:40px 32px;text-align:center;background:rgba(193,176,133,0.03);">'+
        '<div id="la-email-sec">'+
          '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:3px;color:#c1b085;margin-bottom:12px;">GET YOUR FULL RESULTS</div>'+
          '<div style="font-family:Bodoni Moda,serif;font-size:17px;font-style:italic;color:#b0a494;margin-bottom:8px;line-height:1.6;">Your score is above, but the real insight is in the details.</div>'+
          '<div style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#b0a494;margin-bottom:24px;line-height:1.6;">Enter your email to unlock your personalized gap analysis, risk explanations, and recommended next steps.</div>'+
          '<div style="display:flex;gap:10px;max-width:400px;margin:0 auto;">'+
            '<input id="la-email" type="email" placeholder="Email" style="flex:1;padding:13px 16px;background:transparent;border:1px solid #6b5a38;border-radius:1px;color:#c1b085;font-family:Bodoni Moda,serif;font-size:15px;outline:none;">'+
            '<button onclick="__la.sub()" style="font-family:Cinzel,serif;font-size:11px;font-weight:700;letter-spacing:2px;color:#100d0a;background:#c1b085;border:none;cursor:pointer;padding:13px 24px;border-radius:1px;white-space:nowrap;">UNLOCK RESULTS</button>'+
          '</div>'+
          '<div id="la-email-msg" style="font-family:Bodoni Moda,serif;font-size:14px;font-style:italic;color:#b8984e;margin-top:12px;min-height:20px;"></div>'+
        '</div>'+
      '</div>';

    /* single back / start over */
    h+='<div style="display:flex;justify-content:center;gap:32px;margin-top:28px;">'+
      '<button onclick="__la.go(7)" style="font-family:Cinzel,serif;font-size:11px;font-weight:700;letter-spacing:3px;color:#b8984e;background:none;border:none;cursor:pointer;text-transform:uppercase;padding:0;">BACK</button>'+
      '<div onclick="__la.rs()" style="font-family:Cinzel,serif;font-size:11px;letter-spacing:3px;color:#8a7240;cursor:pointer;">START OVER</div>'+
    '</div>';

    /* footer */
    h+='<div style="border-top:1px solid #2a2218;margin-top:40px;padding-top:32px;text-align:center;">'+
      '<div style="font-family:Bodoni Moda,serif;font-size:18px;font-style:italic;color:#c1b085;line-height:1.6;margin-bottom:4px;">\u201COrder in Your Absence\u201D</div>'+
      '<div style="font-family:Cinzel,serif;font-size:13px;color:#6b5a38;margin-top:16px;">Legacy Architect RVA</div>'+
    '</div>';

    return h;
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

    /* toggle checkbox — also unsets N/A */
    t:function(pi,ii){
      if(NA[pi][ii]){return;} /* if N/A is active, clicking the checkbox does nothing */
      ST[pi][ii]=ST[pi][ii]?0:1; var on=ST[pi][ii];
      var r=document.getElementById('r'+pi+'-'+ii);
      var s=document.getElementById('sh'+pi+'-'+ii);
      var m=document.getElementById('mk'+pi+'-'+ii);
      var l=document.getElementById('lb'+pi+'-'+ii);
      if(r){r.style.borderColor=on?'rgba(193,176,133,0.12)':'transparent';r.style.background=on?'rgba(193,176,133,0.03)':'transparent';}
      if(s){s.style.borderColor=on?'#c1b085':'#7A6842';s.style.boxShadow=on?'0 0 12px rgba(193,176,133,0.6),0 0 24px rgba(193,176,133,0.25),inset 0 0 8px rgba(193,176,133,0.1)':'none';}
      if(m){m.style.opacity=on?'1':'0';m.style.transform=on?'scale(1)':'scale(0.6)';}
      if(l){l.style.color=on?'#c1b085':'#9a8d7a';l.style.textShadow=on?'0 0 12px rgba(193,176,133,0.3)':'none';}
      updateCtr(pi);
    },

    /* toggle N/A — also unsets checkbox */
    na:function(pi,ii){
      NA[pi][ii]=NA[pi][ii]?0:1;
      var isNa=NA[pi][ii];

      /* if turning ON N/A, clear the checkbox */
      if(isNa&&ST[pi][ii]){
        ST[pi][ii]=0;
        var s=document.getElementById('sh'+pi+'-'+ii);
        var m=document.getElementById('mk'+pi+'-'+ii);
        var l=document.getElementById('lb'+pi+'-'+ii);
        if(s){s.style.borderColor='#7A6842';s.style.boxShadow='none';}
        if(m){m.style.opacity='0';m.style.transform='scale(0.6)';}
        if(l){l.style.color='#9a8d7a';l.style.textShadow='none';}
      }

      /* update row opacity */
      var r=document.getElementById('r'+pi+'-'+ii);
      if(r){
        r.style.opacity=isNa?'0.35':'1';
        r.style.borderColor='transparent';
        r.style.background='transparent';
      }

      /* update N/A button style */
      var naBtn=document.getElementById('na'+pi+'-'+ii);
      if(naBtn){
        naBtn.style.borderColor=isNa?'#6b5a38':'#342a1c';
        naBtn.style.background=isNa?'rgba(107,90,56,0.12)':'transparent';
        naBtn.style.boxShadow=isNa?'0 0 10px rgba(107,90,56,0.4)':'none';
        var span=naBtn.querySelector('span');
        if(span) span.style.color=isNa?'#b8984e':'#4a3d28';
      }

      updateCtr(pi);
    },

    /* business owner: YES */
    by:function(){
      OB=true;
      var y=document.getElementById('by'),n=document.getElementById('bn'),h=document.getElementById('bh');
      if(y){y.style.borderColor='#c1b085';y.style.color='#c1b085';y.style.background='rgba(193,176,133,0.05)';y.style.boxShadow='0 0 18px rgba(193,176,133,0.5),inset 0 0 12px rgba(193,176,133,0.08)';}
      if(n){n.style.borderColor='#4a3d28';n.style.color='#8a7240';n.style.background='transparent';n.style.boxShadow='none';}
      if(h){h.textContent='All 7 pillars will be included in your audit.';h.style.color='#9a8d7a';}
    },

    /* business owner: NO — now with matching gold glow */
    bn:function(){
      OB=false;
      var y=document.getElementById('by'),n=document.getElementById('bn'),h=document.getElementById('bh');
      if(n){n.style.borderColor='#c1b085';n.style.color='#c1b085';n.style.background='rgba(193,176,133,0.05)';n.style.boxShadow='0 0 18px rgba(193,176,133,0.5),inset 0 0 12px rgba(193,176,133,0.08)';}
      if(y){y.style.borderColor='#4a3d28';y.style.color='#8a7240';y.style.background='transparent';y.style.boxShadow='none';}
      if(h){h.textContent='Your score will be calculated across 6 pillars.';h.style.color='#9a8d7a';}
    },

    p5:function(){if(OB===null){var h=document.getElementById('bh');if(h){h.textContent='Please answer before continuing.';h.style.color='#b8984e';}return;}window.__la.go(OB?6:7);},

    /* email submit — now optional, results already visible */
    sub:function(){
      var em=document.getElementById('la-email');
      var msg=document.getElementById('la-email-msg');
      if(!em||!em.value||em.value.indexOf('@')<1){if(msg)msg.textContent='Please enter a valid email.';return;}
      var email=em.value;
      if(msg)msg.textContent='Sending\u2026';

      var sc=calcScore();
      var tot=sc.total,mx=sc.max,pct=sc.pct;
      var tier=getTier(tot,mx);
      var tierName=TP[tier].t;
      var rec=tier===0?'The Vault':tier===1?'The Archive':tier===2?'The Legacy':tier===3?'Focused session':'Annual review';

      /* pillar totals */
      var bd='';
      for(var j=0;j<7;j++){
        if(j===5&&OB===false)continue;
        var c=pillarChecked(j);
        var pmx=pillarMax(j);
        bd+=P[j].n+': '+c+'/'+pmx+'\n';
      }

      /* item-level detail */
      var detail='\nDETAILED ITEM BREAKDOWN\n';
      for(var k=0;k<7;k++){
        if(k===5&&OB===false)continue;
        var pc=pillarChecked(k);
        var pmx2=pillarMax(k);
        detail+='\n'+P[k].n.toUpperCase()+': '+pc+'/'+pmx2+'\n';
        for(var m2=0;m2<6;m2++){
          if(NA[k][m2]){detail+='  - '+P[k].i[m2]+' (N/A)\n';}
          else{detail+='  '+(ST[k][m2]?'\u2713':'\u2717')+' '+P[k].i[m2]+'\n';}
        }
      }

      var body='DIGITAL LIFE AUDIT RESULTS\n\nScore: '+pct+'% ('+tot+' of '+mx+' points)\nTier: '+tierName+'\nBusiness Owner: '+(OB?'Yes':'No')+'\n\nPILLAR BREAKDOWN\n'+bd+'\nRecommended: '+rec+detail;

      var xhr=new XMLHttpRequest();
      xhr.open('POST','https://api.hsforms.com/submissions/v3/integration/submit/244990054/8def8d38-97f9-4c65-8c3e-fd5b4653c121');
      xhr.setRequestHeader('Content-Type','application/json');
      xhr.onload=function(){
        if(xhr.status>=200&&xhr.status<300){
          var sec=document.getElementById('la-email-sec');
          if(sec)sec.parentElement.outerHTML=fullResultsHTML();
          /* re-trigger bar animations + init Cal embed */
          setTimeout(function(){
            var b=document.querySelectorAll('.lab');for(var i=0;i<b.length;i++)b[i].style.width=b[i].getAttribute('data-w')+'%';
            initCalEmbed();
          },200);
        }else{
          if(msg)msg.textContent='Something went wrong. Please try again.';
        }
      };
      xhr.onerror=function(){if(msg)msg.textContent='Connection error. Please try again.';};
      xhr.send(JSON.stringify({fields:[{name:'email',value:email},{name:'message',value:body}]}));
    },

    rs:function(){
      ST=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
      NA=[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
      OB=null; lastP1Cnt=-1; lastP1Na=-1;
      showPg1(); showRest('');
      /* reset page 1 checkboxes and N/A */
      for(var i=0;i<6;i++){
        var cb=document.getElementById('c0-'+i);if(cb)cb.checked=false;
        var naCb=document.getElementById('na0-'+i);if(naCb)naCb.checked=false;
        /* reset Page 1 N/A visual state via Carrd classes */
        var wrap=document.querySelector('[data-item="'+i+'"]')||document.getElementById('r0-'+i);
        if(wrap)wrap.classList.remove('is-na');
      }
      updateCtr(0);
      scrollToAudit();
    }
  };

  /* ── polling: nav checkbox + page 1 counter ────── */
  setInterval(function(){
    var c=document.getElementById('la-go');
    if(c&&c.checked){c.checked=false;getPg1State();window.__la.go(2);}

    /* update page 1 counter when visible */
    var pg1=document.getElementById('pg1');
    if(pg1&&pg1.style.display!=='none'){
      var cnt=0,naCnt=0;
      for(var i=0;i<6;i++){
        var cb=document.getElementById('c0-'+i);
        if(cb&&cb.checked)cnt++;
        var naCb=document.getElementById('na0-'+i);
        if(naCb&&naCb.checked)naCnt++;
      }
      if(cnt!==lastP1Cnt||naCnt!==lastP1Na){
        lastP1Cnt=cnt;
        lastP1Na=naCnt;
        for(var j=0;j<6;j++){
          var cb2=document.getElementById('c0-'+j);
          ST[0][j]=(cb2&&cb2.checked)?1:0;
          var naCb2=document.getElementById('na0-'+j);
          NA[0][j]=(naCb2&&naCb2.checked)?1:0;
        }
        updateCtr(0);
      }
    }
  },150);

})();
