document.addEventListener('DOMContentLoaded', function() {
  // Add N/A buttons to all items
  const itemWraps = document.querySelectorAll('.la-item-wrap');
  itemWraps.forEach(wrap => {
    const naButton = document.createElement('input');
    naButton.type = 'checkbox';
    naButton.className = 'lana';
    naButton.id = `na${wrap.querySelector('.lacb').id.split('-')[1]}`;

    const naLabel = document.createElement('label');
    naLabel.htmlFor = naButton.id;
    naLabel.className = 'lana-btn';
    naLabel.textContent = 'N/A';

    wrap.appendChild(naButton);
    wrap.appendChild(naLabel);

    // Toggle "N/A" state
    naButton.addEventListener('change', function() {
      if (this.checked) {
        wrap.classList.add('is-na');
        wrap.querySelector('.lacb').checked = false;
      } else {
        wrap.classList.remove('is-na');
      }
    });

    // Disable "N/A" if Yes/No is selected
    wrap.querySelector('.lacb').addEventListener('change', function() {
      if (this.checked) {
        naButton.checked = false;
        wrap.classList.remove('is-na');
      }
    });
  });

  // Glow effect for selected items
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

  // Hide results until email submission
  const resultsSection = document.getElementById('pg-rest');
  if (resultsSection) {
    resultsSection.style.display = 'none';
  }

  // Email submission logic
  const emailForm = document.createElement('form');
  emailForm.id = 'email-form';
  emailForm.innerHTML = `
    <div style="text-align:center;margin:30px 0;">
      <label for="email" style="font-family:Bodoni Moda,serif;font-size:16px;color:#b0a494;">Enter your email to see results:</label><br>
      <input type="email" id="email" required style="padding:8px;margin:10px 0;width:200px;background:#100d0a;color:#fdfcfa;border:1px solid #342a1c;">
      <button type="submit" style="font-family:Cinzel,serif;padding:8px 16px;background:#c1b085;color:#100d0a;border:none;cursor:pointer;">Submit</button>
    </div>
  `;

  const continueButton = document.querySelector('label[for="la-go"]');
  if (continueButton) {
    continueButton.addEventListener('click', function(e) {
      if (document.getElementById('la-go').checked) {
        e.preventDefault();
        document.querySelector('#la-wrap > div').appendChild(emailForm);
        document.getElementById('la-go').checked = false;
      }
    });
  }

  emailForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (resultsSection) {
      resultsSection.style.display = 'block';
      resultsSection.innerHTML = `
        <div style="text-align:center;padding:40px;background:rgba(193,176,133,0.05);border:1px solid #342a1c;margin-top:20px;">
          <h2 id="results-message" style="font-family:Cinzel,serif;font-size:24px;color:#c1b085;margin-bottom:20px;">Your results are below.</h2>
          <p style="font-family:Bodoni Moda,serif;font-size:16px;color:#b0a494;">[Insert your results content here]</p>
        </div>
      `;
    }
  });
});
