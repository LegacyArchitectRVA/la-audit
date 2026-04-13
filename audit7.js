/* LA Digital Audit v15 - audit7.js
   Changes from v14:
   - Scroll fix: scrolls to #la-wrap instead of page top
   - Visual consistency: all font sizes match Page 1 HTML (16px labels/buttons, 18px descriptions)
   - Checkbox border color unified to #7A6842
   - Glowing counter box on every pillar page (updates live)
   - Page 1 counter updated via polling
   - Item-level detail appended to HubSpot submission
   - Removed inline "X of 6" text (replaced by counter box)

   Added in this version:
   - N/A button on every page
   - Stronger glow on business owner yes/no selection
   - Initial results only until email is entered
   - After email: "YOUR RESULTS ARE BELOW"
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
  var NA=[false,false,false,false,false,false,false];
  var lastP1Cnt=-1;

  function scrollToAudit(){
    var el=document.getElementById('la-wrap');
    if(!el) return;
    var rect=el.getBoundingClientRect();
    var scrollY=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;
    var target=rect.top+scrollY-10;
    try{window.scrollTo({top:target,behavior:'smooth'});}catch(e){window.scrollTo(0,target);}
  }

  function getPg1State(){
    if(NA[0]){
      for(var i=0;i<6;i++) ST[0][i]=0;
      return;
    }
    for(var i=0;i<6;i++){
      var cb=document.getElementById('c0-'+i);
      ST[0][i]=(cb&&cb.checked)?1:0;
    }
  }

  function ctrStyles(cnt){
    var f=cnt===6;
    return {
      border:f?'#c1b085':cnt>0?'rgba(193,176,133,'+(0.3+cnt*0.1).toFixed(1)+')':'#342a1c',
      shadow:cnt>0?'0 0 '+(8+cnt*4)+'px rgba(193,176,133,'+(0.15+cnt*0.05).toFixed(2)+')'+(f?',0 0 32px rgba(193,176,133,0.3)':''):'none',
      bg:'rgba(193,176,133,'+(f?'0.06':'0.02')+')',
      numColor:f?'#c1b085':cnt>0?'#b8984e':'#6b5a38',
      numShadow:f?'0 0 16px rgba(193,176,133,0.5)':'none'
    };
  }

  function counterHTML(pi){
    if(NA[pi]){
      return '<div id="la-ctr-'+pi+'" style="display:flex;align-items:center;justify-content:center;margin-bottom:32px;">'+
        '<div style="display:inline-flex;align-items:center;gap:8px;padding:14px 32px;border:1px solid #6b5a38;border-radius:2px;background:rgba(78,58,25,0.06);">'+
          '<span style="font-family:Cinzel,serif;font-size:24px;font-weight:700;color:#8a7240;line-height:1;">N/A</span>'+
          '<span style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#8a7240;line-height:1;">excluded</span>'+
        '</div>'+
      '</div>';
    }
    var cnt=ST[pi].reduce(function(a,v){return a+v;},0);
    var s=ctrStyles(cnt);
    return '<div id="la-ctr-'+pi+'" style="display:flex;align-items:center;justify-content:center;margin-bottom:32px;">'+
      '<div style="display:inline-flex;align-items:baseline;gap:8px;padding:14px 32px;border:1px solid '+s.border+';border-radius:2px;background:'+s.bg+';box-shadow:'+s.shadow+';transition:border-color 0.3s,box-shadow 0.4s,background 0.3s;">'+
        '<span style="font-family:Cinzel,serif;font-size:28px;font-weight:700;color:'+s.numColor+';line-height:1;text-shadow:'+s.numShadow+';transition:color 0.3s,text-shadow 0.3s;">'+cnt+'</span>'+
        '<span style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#8a7240;line-height:1;">of 6</span>'+
      '</div>'+
    '</div>';
  }

  function updateCtr(pi){
    var wrap=document.getElementById('la-ctr-'+pi);
    if(!wrap)return;
    var box=wrap.firstElementChild;if(!box)return;
    var num=box.firstElementChild;if(!num)return;

    if(NA[pi]){
      box.style.borderColor='#6b5a38';
      box.style.boxShadow='none';
      box.style.background='rgba(78,58,25,0.06)';
      num.textContent='N/A';
      num.style.color='#8a7240';
      num.style.textShadow='none';
      if(num.nextElementSibling) num.nextElementSibling.textContent='excluded';
      return;
    }

    var cnt=ST[pi].reduce(function(a,v){return a+v;},0);
    var s=ctrStyles(cnt);
    box.style.borderColor=s.border;
    box.style.boxShadow=s.shadow;
    box.style.background=s.bg;
    num.textContent=cnt;
    num.style.color=s.numColor;
    num.style.textShadow=s.numShadow;
    if(num.nextElementSibling) num.nextElementSibling.textContent='of 6';
  }

  function prog(active){
    var h='<div style="display:flex;gap:6px;margin-bottom:52px;">';
    for(var s=0;s<7;s++){
      var bg=s<active?'#8a7030':s===active?'#c1b085':'#342a1c';
      var sh=s===active?'0 0 8px rgba(193,176,133,0.6)':'none';
      h+='<div style="height:2px;flex:1;background:'+bg+';border-radius:1px;box-shadow:'+sh+';"></div>';
    }
    return h+'</div>';
  }

  function pillarHTML(pi){
    var pl=P[pi],isP5=pi===4,isLast=pi===6;
    var rows='';

    for(var ii=0;ii<6;ii++){
      var on=ST[pi][ii];
      var na=NA[pi];
      rows+=
        '<div id="r'+pi+'-'+ii+'" onclick="'+(na?'':'__la.t('+pi+','+ii+')')+'" style="display:flex;align-items:center;gap:18px;padding:13px 16px;border:1px solid '+(on?'rgba(193,176,133,0.12)':'transparent')+';border-radius:2px;cursor:'+(na?'default':'pointer')+';background:'+(on?'rgba(193,176,133,0.03)':'transparent')+';opacity:'+(na?'0.35':'1')+';pointer-events:'+(na?'none':'auto')+';">'+
          '<div id="sh'+pi+'-'+ii+'" style="width:24px;height:24px;flex-shrink:0;border:1px solid '+(on?'#c1b085':'#7A6842')+';border-radius:2px;display:flex;align-items:center;justify-content:center;box-shadow:'+(on?'0 0 12px rgba(193,176,133,0.6),0 0 24px rgba(193,176,133,0.25),inset 0 0 8px rgba(193,176,133,0.1)':'none')+';">'+
            '<svg id="mk'+pi+'-'+ii+'" width="14" height="11" viewBox="0 0 14 11" fill="none" style="opacity:'+(on?'1':'0')+';transform:'+(on?'scale(1)':'scale(0.6)')+';transition:opacity 0.2s,transform 0.2s;filter:drop-shadow(0 0 3px rgba(193,176,133,0.9));"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
          '</div>'+
          '<div id="lb'+pi+'-'+ii+'" style="font-family:Cinzel,serif;font-size:16px;letter-spacing:2px;color:'+(on?'#c1b085':'#9a8d7a')+';'+(on?'text-shadow:0 0 12px rgba(193,176,133,0.3);':'')+'">'+pl.i[ii]+'</div>'+
        '</div>';
    }

    var gate='';
    if(isP5){
      gate='<div style="margin-top:36px;padding-top:32px;border-top:1px solid #2a2218;margin-bottom:52px;">'+
        '<div style="font-family:Cinzel,serif;font-size:16px;letter-spacing:3px;color:#b8984e;margin-bottom:20px;">DO YOU OWN A BUSINESS?</div>'+
        '<div style="display:flex;gap:12px;">'+
          '<button id="by" onclick="__la.by()" style="font-family:Cinzel,serif;font-size:14px;font-weight:700;letter-spacing:3px;padding:13px 32px;border:1px solid '+(OB===true?'#c1b085':'#4a3d28')+';background:'+(OB===true?'rgba(193,176,133,0.05)':'transparent')+';color:'+(OB===true?'#c1b085':'#8a7240')+';cursor:pointer;border-radius:1px;box-shadow:'+(OB===true?'0 0 28px rgba(193,176,133,0.7),0 0 48px rgba(193,176,133,0.35),inset 0 0 14px rgba(193,176,133,0.12)':'none')+';transition:box-shadow 0.2s,border-color 0.2s,background 0.2s;">YES</button>'+
          '<button id="bn" onclick="__la.bn()" style="font-family:Cinzel,serif;font-size:14px;font-weight:700;letter-spacing:3px;padding:13px 32px;border:1px solid '+(OB===false?'#6b5a38':'#4a3d28')+';background:'+(OB===false?'rgba(78,58,25,0.08)':'transparent')+';color:#8a7240;cursor:pointer;border-radius:1px;box-shadow:'+(OB===false?'0 0 24px rgba(107,90,56,0.6),0 0 42px rgba(107,90,56,0.3),inset 0 0 12px rgba(107,90,56,0.12)':'none')+';transition:box-shadow 0.2s,border-color 0.2s,background 0.2s;">NO</button>'+
        '</div>'+
        '<div id="bh" style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:'+(OB!==null?'#9a8d7a':'transparent')+';margin-top:14px;min-height:18px;">'+
          (OB===true?'All 7 pillars will be included in your audit.':OB===false?'Your score will be calculated across 6 pillars.':'')+
        '</div></div>';
    }

    var naBtn=
      '<div style="margin-top:24px;margin-bottom:32px;text-align:center;">'+
        '<button onclick="__la.na('+pi+')" style="font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:3px;padding:12px 20px;border:1px solid '+(NA[pi]?'#c1b085':'#4a3d28')+';background:'+(NA[pi]?'rgba(193,176,133,0.05)':'transparent')+';color:'+(NA[pi]?'#c1b085':'#8a7240')+';cursor:pointer;border-radius:1px;">'+
          (NA[pi]?'REMOVE N/A':'MARK THIS PILLAR N/A')+
        '</button>'+
      '</div>';

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
      '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:'+(isP5?'0':'24px')+';">'+rows+'</div>'+
      naBtn+
      gate+
      '<div style="display:flex;justify-content:'+(pi===0?'flex-end':'space-between')+';align-items:center;">'+
        backBtn+
        nextBtn+
      '</div>';
  }

  function detailHTML(){
    var h='<div style="font-family:Cinzel,serif;font-size:15px;letter-spacing:4px;color:#b8984e;margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid #2a2218;">YOUR FULL BREAKDOWN</div>';
    for(var pi=0;pi<7;pi++){
      if((pi===5&&OB===false)||NA[pi])continue;
      var c=ST[pi].reduce(function(a,v){return a+v;},0);
      h+='<div style="margin-bottom:28px;">'+
        '<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:2px;color:#c1b085;margin-bottom:14px;">'+P[pi].n.toUpperCase()+' <span style="color:#8a7240;font-size:12px;margin-left:8px;">'+c+'/6</span></div>';
      for(var ii=0;ii<6;ii++){
        var on=ST[pi][ii];
        h+='<div style="display:flex;align-items:center;gap:14px;padding:8px 0;border-bottom:1px solid #1a1610;">'+
          '<div style="width:18px;height:18px;flex-shrink:0;border:1px solid '+(on?'#c1b085':'#4a3d28')+';border-radius:2px;display:flex;align-items:center;justify-content:center;'+(on?'box-shadow:0 0 8px rgba(193,176,133,0.4);':'')+'">'+
            (on?'<svg width="12" height="9" viewBox="0 0 14 11" fill="none"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>':
                 '<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2L8 8M8 2L2 8" stroke="#4a3d28" stroke-width="1.2" stroke-linecap="round"/></svg>')+
          '</div>'+
          '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:1.5px;color:'+(on?'#c1b085':'#6b5a38')+';">'+P[pi].i[ii]+'</div>'+
        '</div>';
      }
      h+='</div>';
    }
    return h;
  }

  var GD=[
    [
      "Email is the recovery method for nearly every other account. Without access, password resets fail across the board.",
      "Without a centralized credential system, a successor would need to recover each account individually - a process that can take weeks or months, with some accounts lost permanently.",
      "Family photos, documents, and personal files stored in the cloud can become permanently inaccessible if credentials are lost.",
      "If 2FA is enabled without stored recovery keys, accounts become permanently inaccessible. This is the single most common cause of irreversible digital lockout.",
      "Without designated legacy contacts, social media accounts may be memorialized, deleted, or hijacked - with no way to recover meaningful content.",
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
      "A clear emergency contact list ensures the right people are reached immediately - not hours or days later."
    ],
    [
      "Without a will, state intestacy laws determine asset distribution - which may not align with your intentions.",
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
      "An ethical will captures values, beliefs, and life lessons - the intangible inheritance that matters most to many families.",
      "Without documented preferences, families make difficult decisions under emotional pressure, often second-guessing themselves.",
      "A prepared obituary ensures accuracy and reflects your life as you would want it told.",
      "Objects carry meaning, but only if the stories behind them are preserved. Without documentation, heirlooms become just things.",
      "Documented giving preferences ensure your philanthropic intentions continue."
    ]
  ];

  var TP=[
    {
      t:"LEAN & READY",
      p:[
        "Your audit revealed <strong style=\"color:#c1b085;\">critical gaps</strong> across most pillars. This is not unusual - most people have never been asked to think about continuity in structured terms.",
        "What it means practically: if something happened to you tomorrow, the people you trust most would face significant confusion. Access to accounts, knowledge of obligations, location of key documents - these are the things that fall through the cracks when there is no system in place.",
        "The gaps you have are common - and they are fixable. A foundational continuity plan would cover the highest-risk areas first: digital access, emergency contacts, and essential documents."
      ]
    },
    {
      t:"LEGACY AT RISK",
      p:[
        "You have some documentation in place, but <strong style=\"color:#c1b085;\">significant gaps remain</strong>. The items you checked show awareness - the unchecked ones represent single points of failure.",
        "This is the range where risk is most deceptive. You have enough organized that it feels manageable, but not enough that a successor could act without guesswork. Financial accounts without documented access pathways, insurance policies without location records, digital accounts without recovery options - these are the gaps that create months of confusion.",
        "An expanded continuity plan would close these gaps systematically, covering not just the basics but the financial, legal, and household layers that hold everything together."
      ]
    },
    {
      t:"CRITICAL COMPLEXITY",
      p:[
        "Your audit shows <strong style=\"color:#c1b085;\">multi-layered responsibilities</strong> across most pillars. You have significant documentation, but the complexity of your situation means the remaining gaps carry outsized risk.",
        "At this level, the issue is not awareness but architecture. Individual items may be documented, but without a unified system that a successor can follow step by step, even well-organized people leave critical gaps. Cryptocurrency keys, business operating agreements, trust documentation, advanced healthcare directives - these are items where a single missing piece can mean permanent loss.",
        "A comprehensive continuity plan would bring every pillar into a single, navigable system - including business operations if applicable."
      ]
    },
    {
      t:"WELL STRUCTURED",
      p:[
        "You are <strong style=\"color:#c1b085;\">well organized</strong>. Your audit shows a strong foundation across most pillars, with only a few remaining gaps.",
        "At this level, the value is not in building from scratch - it is in validation and completion. The items you have not checked may represent things you have not gotten to yet, or things you assumed were covered but are not. Either way, a focused review would identify exactly what is missing and ensure everything is accessible, current, and connected.",
        "Most people at this level benefit from a structured review session rather than a full engagement."
      ]
    },
    {
      t:"COMPREHENSIVE",
      p:[
        "Your documentation is <strong style=\"color:#c1b085;\">thorough</strong>. This is rare - most people who take this audit score well below where you are.",
        "The question at this level is not what is missing, but whether what exists is current, accessible, and structured in a way that a successor could actually use. Documents can exist without being findable. Accounts can be listed without access being transferable.",
        "An annual review ensures nothing drifts out of date - and that the people who may need this information know where to find it."
      ]
    }
  ];

  function fullResultsHTML(){
    getPg1State();
    var tot=0,u=0;
    for(var i=0;i<7;i++){
      if((i===5&&OB===false)||NA[i])continue;
      ST[i].forEach(function(v){tot+=v;});
      u++;
    }
    var mx=u*6,pct=mx?Math.round(tot/mx*100):0;
    var ti=tot<=10?0:tot<=22?1:tot<=30?2:tot<=36?3:4;
    var tp=TP[ti];

    var h='<div style="border:1px solid #c1b085;background:rgba(193,176,133,0.03);padding:36px;text-align:center;margin-bottom:36px;">'+
      '<div style="font-family:Cinzel,serif;font-size:12px;letter-spacing:5px;color:#b8984e;margin-bottom:10px;">CONTINUITY SCORE</div>'+
      '<div style="font-family:Cinzel,serif;font-size:62px;font-weight:700;color:#c1b085;line-height:1;">'+pct+'<span style="font-size:26px;color:#b8984e;">%</span></div>'+
      '<div style="font-family:Cinzel,serif;font-size:15px;letter-spacing:2px;color:#a09484;margin-top:8px;">'+tot+' OF '+mx+' POINTS</div>'+
      '<div style="width:60px;height:1px;background:#c1b085;margin:18px auto;"></div>'+
      '<div style="font-family:Cinzel,serif;font-size:20px;font-weight:700;letter-spacing:3px;color:#c1b085;">'+tp.t+'</div>'+
    '</div>';

    h+='<div style="font-family:Cinzel,serif;font-size:14px;letter-spacing:4px;color:#b8984e;padding-bottom:14px;border-bottom:1px solid #2a2218;margin-bottom:4px;">PILLAR BREAKDOWN</div>';
    for(var pi=0;pi<7;pi++){
