<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Audit Form</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,300;1,6..96,400&display=swap');

    #la-wrap * { box-sizing: border-box; }
    .lacb, .lana { position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none; }
    .la-item-wrap { display: flex; align-items: center; justify-content: space-between; gap: 12px; transition: opacity 0.3s; }
    .larow { display: flex; align-items: center; gap: 18px; padding: 16px 8px; border: 1px solid transparent; border-radius: 2px; cursor: pointer; transition: all 0.3s; flex-grow: 1; }
    .lash { width: 24px; height: 24px; flex-shrink: 0; border: 1px solid #7A6842; border-radius: 2px; background: transparent; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
    .lamk { opacity: 0; transform: scale(0.6); transition: opacity 0.2s, transform 0.2s; filter: drop-shadow(0 0 3px rgba(193,176,133,0.9)); }
    .lalb { font-family: Cinzel, serif; font-size: 16px; letter-spacing: 2px; color: #9a8d7a; transition: all 0.3s; }

    .lacb:checked + .larow { border-color: rgba(193,176,133,0.12); background: rgba(193,176,133,0.03); }
    .lacb:checked + .larow .lash { border-color: #c1b085; box-shadow: 0 0 12px rgba(193,176,133,0.6), 0 0 24px rgba(193,176,133,0.25), inset 0 0 8px rgba(193,176,133,0.1); }
    .lacb:checked + .larow .lamk { opacity: 1; transform: scale(1); }
    .lacb:checked + .larow .lalb { color: #c1b085; text-shadow: 0 0 12px rgba(193,176,133,0.3); }

    .lana-btn { font-family: Cinzel, serif; font-size: 12px; font-weight: 600; color: #7A6842; border: 1px solid #342a1c; padding: 6px 12px; border-radius: 2px; cursor: pointer; transition: all 0.3s; background: transparent; }
    .lana:checked + .lana-btn { background: #342a1c; color: #c1b085; border-color: #7A6842; }

    .la-item-wrap.is-na > div:first-child { opacity: 0.4; filter: grayscale(100%); pointer-events: none; }
    .la-item-wrap.is-na .larow { opacity: 0.4; filter: grayscale(100%); }

    /* Glow effect for selected items */
    .larow.selected { border-color: rgba(193,176,133,0.25) !important; background: rgba(193,176,133,0.08) !important; box-shadow: 0 0 12px rgba(193,176,133,0.4) !important; }
    .larow.selected .lash { border-color: #c1b085 !important; box-shadow: 0 0 12px rgba(193,176,133,0.6) !important; }
    .larow.selected .lamk { opacity: 1 !important; transform: scale(1) !important; }
  </style>
</head>
<body>
  <div id="la-wrap" style="background:#100d0a;color:#fdfcfa;padding:48px 20px 60px;box-sizing:border-box;font-family:'Bodoni Moda',Georgia,serif;">
    <div style="max-width:620px;margin:0 auto;">

      <div id="pg1">
        <div style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:5px;color:#b8984e;text-align:center;margin-bottom:4px;">PILLAR 1 OF 7</div>
        <div style="font-family:'Cinzel',serif;font-size:24px;font-weight:700;color:#fdfcfa;text-align:center;letter-spacing:3px;margin-bottom:10px;">DIGITAL LIFE</div>
        <div style="font-family:'Bodoni Moda',serif;font-size:16px;font-style:italic;color:#b0a494;text-align:center;margin-bottom:28px;line-height:1.5;">Access and continuity for essential digital accounts, credentials, and archives.</div>

        <div id="la-ctr-0" style="display:flex;align-items:center;justify-content:center;margin-bottom:32px;">
          <div style="display:inline-flex;align-items:baseline;gap:8px;padding:14px 32px;border:1px solid #342a1c;border-radius:2px;background:rgba(193,176,133,0.02);box-shadow:none;transition:border-color 0.3s,box-shadow 0.4s,background 0.3s;">
            <span style="font-family:Cinzel,serif;font-size:28px;font-weight:700;color:#6b5a38;line-height:1;text-shadow:none;transition:color 0.3s,text-shadow 0.3s;">0</span>
            <span style="font-family:Bodoni Moda,serif;font-size:16px;font-style:italic;color:#8a7240;line-height:1;">of 6</span>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:52px;">
          <div class="la-item-wrap">
            <input type="checkbox" id="c0-0" class="lacb">
            <label for="c0-0" class="larow">
              <div class="lash"><svg class="lamk" width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
              <span class="lalb">PRIMARY EMAIL ACCOUNT ACCESS</span>
            </label>
          </div>
          <div class="la-item-wrap">
            <input type="checkbox" id="c0-1" class="lacb">
            <label for="c0-1" class="larow">
              <div class="lash"><svg class="lamk" width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
              <span class="lalb">MASTER PASSWORD MANAGER VAULT</span>
            </label>
          </div>
          <div class="la-item-wrap">
            <input type="checkbox" id="c0-2" class="lacb">
            <label for="c0-2" class="larow">
              <div class="lash"><svg class="lamk" width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
              <span class="lalb">CLOUD STORAGE & PHOTO ARCHIVES</span>
            </label>
          </div>
          <div class="la-item-wrap">
            <input type="checkbox" id="c0-3" class="lacb">
            <label for="c0-3" class="larow">
              <div class="lash"><svg class="lamk" width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
              <span class="lalb">TWO-FACTOR AUTH (2FA) RECOVERY KEYS</span>
            </label>
          </div>
          <div class="la-item-wrap">
            <input type="checkbox" id="c0-4" class="lacb">
            <label for="c0-4" class="larow">
              <div class="lash"><svg class="lamk" width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
              <span class="lalb">SOCIAL MEDIA LEGACY CONTACTS</span>
            </label>
          </div>
          <div class="la-item-wrap">
            <input type="checkbox" id="c0-5" class="lacb">
            <label for="c0-5" class="larow">
              <div class="lash"><svg class="lamk" width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke="#c1b085" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
              <span class="lalb">DIGITAL MEDIA ARCHIVES</span>
            </label>
          </div>
        </div>

        <div style="text-align:center;">
          <input type="checkbox" id="la-go" class="lacb">
          <label for="la-go" style="display:inline-block;padding:15px 40px;cursor:pointer;">
            <span style="font-family:'Cinzel',serif;font-size:16px;font-weight:700;letter-spacing:3px;color:#100d0a;background:#c1b085;padding:15px 40px;border-radius:1px;">CONTINUE</span>
          </label>
        </div>
      </div>

      <div id="pg-rest" style="display:none;"></div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const itemWraps = document.querySelectorAll('.la-item-wrap');
      itemWraps.forEach((wrap, index) => {
        if (!wrap.querySelector('.lana-btn')) {
          const naButton = document.createElement('input');
          naButton.type = 'checkbox';
          naButton.className = 'lana';
          naButton.id = `na0-${index}`;

          const naLabel = document.createElement('label');
          naLabel.htmlFor = naButton.id;
          naLabel.className = 'lana-btn';
          naLabel.textContent = 'N/A';
          naLabel.style.fontFamily = "'Cinzel', serif";
          naLabel.style.fontSize = "12px";
          naLabel.style.fontWeight = "600";
          naLabel.style.color = "#7A6842";
          naLabel.style.border = "1px solid #342a1c";
          naLabel.style.padding = "6px 12px";
          naLabel.style.borderRadius = "2px";
          naLabel.style.cursor = "pointer";
          naLabel.style.background = "transparent";
          naLabel.style.marginLeft = "10px";

          wrap.appendChild(naButton);
          wrap.appendChild(naLabel);

          naButton.addEventListener('change', function() {
            if (this.checked) {
              wrap.classList.add('is-na');
              const checkbox = wrap.querySelector('.lacb');
              if (checkbox) checkbox.checked = false;
            } else {
              wrap.classList.remove('is-na');
            }
          });

          const checkbox = wrap.querySelector('.lacb');
          if (checkbox) {
            checkbox.addEventListener('change', function() {
              if (this.checked) {
                naButton.checked = false;
                wrap.classList.remove('is-na');
              }
            });
          }
        }
      });

      const checkboxes = document.querySelectorAll('.lacb');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const row = this.nextElementSibling;
          if (this.checked) {
            row.classList.add('selected');
          } else {
            row.classList.remove('selected');
          }
        });
      });

      const continueButton = document.querySelector('label[for="la-go"]');
      if (continueButton) {
        continueButton.addEventListener('click', function(e) {
          const goCheckbox = document.getElementById('la-go');
          if (goCheckbox && goCheckbox.checked) {
            e.preventDefault();
            const emailForm = document.createElement('div');
            emailForm.id = 'email-form';
            emailForm.innerHTML = `
              <div style="text-align:center;margin:30px 0;">
                <label for="email" style="font-family:Bodoni Moda,serif;font-size:16px;color:#b0a494;">Enter your email to see results:</label><br>
                <input type="email" id="email" required style="padding:8px;margin:10px 0;width:200px;background:#100d0a;color:#fdfcfa;border:1px solid #342a1c;">
                <button type="submit" style="font-family:Cinzel,serif;padding:8px 16px;background:#c1b085;color:#100d0a;border:none;cursor:pointer;">Submit</button>
              </div>
            `;
            const container = document.querySelector('#la-wrap > div');
            if (container) {
              container.appendChild(emailForm);
              goCheckbox.checked = false;
            }

            emailForm.querySelector('button[type="submit"]').addEventListener('click', function(e) {
              e.preventDefault();
              const emailInput = emailForm.querySelector('#email');
              if (emailInput && emailInput.value) {
                const resultsSection = document.getElementById('pg-rest');
                if (resultsSection) {
                  resultsSection.style.display = 'block';
                  resultsSection.innerHTML = `
                    <div style="text-align:center;padding:40px;background:rgba(193,176,133,0.05);border:1px solid #342a1c;margin-top:20px;">
                      <h2 id="results-message" style="font-family:Cinzel,serif;font-size:24px;color:#c1b085;margin-bottom:20px;">Your results are below.</h2>
                      <p style="font-family:Bodoni Moda,serif;font-size:16px;color:#b0a494;">[Your results content goes here]</p>
                    </div>
                  `;
                }
              }
            });
          }
        });
      }
    });
  </script>
</body>
</html>
