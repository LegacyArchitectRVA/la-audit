var P=[
  {
    n:'Digital Life',
    d:'Access and continuity for essential digital accounts, recovery methods, devices, and archives.',
    i:[
      'PRIMARY EMAIL ACCESS & RECOVERY METHODS',
      'PASSWORD MANAGEMENT SYSTEM',
      'TWO-FACTOR AUTHENTICATION METHODS',
      'KEY ACCOUNTS LIST',
      'DEVICE ACCESS',
      'ACCOUNT MAINTENANCE OR CLOSURE INSTRUCTIONS'
    ]
  },
  {
    n:'Emergency & Successor',
    d:'Authority, first steps, and key contacts so the right person can step in immediately.',
    i:[
      'PRIMARY DECISION-MAKER IDENTIFIED',
      'BACKUP DECISION-MAKER IDENTIFIED',
      'AUTHORITY TO ACT DOCUMENTED',
      'FIRST 72 HOURS ACTION STEPS',
      'KEY CONTACTS CENTRALIZED',
      'SUCCESSOR KNOWS WHERE TO FIND EVERYTHING'
    ]
  },
  {
    n:'Financial & Assets',
    d:'      <label><input type="radio" name="biz" value="no"> No</label>
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
