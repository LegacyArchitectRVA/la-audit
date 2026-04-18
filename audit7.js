const P = [
  { name:"Digital Life", items:[
    "Primary email access and recovery methods are documented",
    "Password management system is identified and accessible",
    "Two-factor authentication methods are recorded",
    "Key accounts (financial, utilities, subscriptions) are listed",
    "Device access (phone, laptop) can be transferred if needed",
    "Instructions exist for maintaining or closing accounts"
  ]},
  { name:"Emergency & Successor", items:[
    "A primary decision-maker is clearly identified",
    "A backup decision-maker is named and reachable",
    "Authority to act is documented and accessible",
    "Immediate action steps are defined for the first 72 hours",
    "Key contacts are centralized and easy to locate",
    "Successor understands where to find everything"
  ]},
  { name:"Financial & Assets", items:[
    "Bank accounts and institutions are listed",
    "Income sources and inflows are identified",
    "Recurring expenses and obligations are documented",
    "Insurance policies are organized and accessible",
    "Debts and liabilities are clearly outlined",
    "Asset inventory is complete"
  ]},
  { name:"Household Operations", items:[
    "Monthly bills and payment methods are documented",
    "Home systems (utilities, maintenance) are explained",
    "Vendor relationships are listed",
    "Mail handling and subscriptions are organized",
    "Vehicle information and upkeep are documented",
    "Day-to-day routines can be continued without disruption"
  ]},
  { name:"Vital Records", items:[
    "Identification documents are stored and accessible",
    "Legal documents are organized and current",
    "Medical records and providers are identified",
    "Insurance documents are centralized",
    "Secure storage location is clearly defined",
    "A trusted person knows how to access records"
  ]},
  { name:"Business Continuity", items:[
    "Business structure and ownership are documented",
    "Key roles and responsibilities are defined",
    "Revenue sources and clients are identified",
    "Access to systems and accounts is organized",
    "Operational processes are documented",
    "Transition or wind-down plan is outlined"
  ]},
  { name:"Legacy & Wishes", items:[
    "Personal wishes are clearly documented",
    "Care preferences are outlined",
    "Dependents’ needs are defined",
    "Important relationships are acknowledged",
    "Instructions for personal items or assets are included",
    "A message or intent for others is preserved"
  ]}
];

let i = 0;
let score = 0;
let hasBusiness = true;

function nextPage() {
  if (i === 4 && !hasBusiness) {
    i = 6; // skip Business Continuity
  } else {
    i++;
  }
  render();
}

function render() {
  const pillar = P[i];
  document.getElementById("title").innerText = pillar.name;
  document.getElementById("count").innerText = `Pillar ${i+1} of 7`;

  const list = document.getElementById("list");
  list.innerHTML = "";

  pillar.items.forEach((item, idx) => {
    const el = document.createElement("div");
    el.innerHTML = `
      <label>
        <input type="checkbox" onchange="updateScore(this)">
        ${item}
      </label>
    `;
    list.appendChild(el);
  });

  // Inject business toggle on pillar 5
  if (i === 4) {
    const toggle = document.createElement("div");
    toggle.innerHTML = `
      <p>Do you have a business that needs to continue or transition?</p>
      <label><input type="radio" name="biz" value="yes" checked> Yes</label>
      <label><input type="radio" name="biz" value="no"> No</label>
    `;
    list.appendChild(toggle);

    document.querySelectorAll('[name="biz"]').forEach(el=>{
      el.addEventListener("change", e=>{
        hasBusiness = e.target.value === "yes";
      });
    });
  }
}

function updateScore(cb) {
  if (cb.checked) score++;
  else score--;
}

document.getElementById("next").addEventListener("click", nextPage);

render();
