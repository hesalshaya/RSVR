

function displayResults(response) {
  const formMessage = document.getElementById('formMessage');

// Fallback table (not used in card version, kept for legacy)

// If no data returned
  if (!response.tableHeader || !response.tableRows) {
    formMessage.innerHTML = '<p>No results found.</p>';
    return;
  }


// Build HTML table
  let html = `
    <h3>Verification Results (First 5)</h3>
    <table border="1" cellpadding="5">
      <thead>${response.tableHeader}</thead>
      <tbody>${response.tableRows}</tbody>
    </table>
  `;


  // Show note if more data exists
  if (response.moreData) {
    html += '<p>⚠️ More results are available in your email.</p>';
  }
  formMessage.innerHTML = html;
}

function validateProduct() {
  const productInput = document.getElementById('product');
  if (productInput.value.trim() === '') {
    productInput.classList.add('error');
    return false;
  } else {
    productInput.classList.remove('error');
    return true;
  }
}


function validateEmail() {
  const emailInput = document.getElementById('email');
  const emailHelp = document.getElementById('emailHelp');
  const email = emailInput.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(email)) {
    emailInput.classList.add('error');
    emailHelp.style.display = 'block';
    return false;
  } else {
    emailInput.classList.remove('error');
    emailHelp.style.display = 'none';
    return true;
  }
}

//Fetch results and display as card layout
async function STWH(options = {}) {
  const productInput = document.getElementById('product');
  const emailInput = document.getElementById('email');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = document.querySelector('.button');
  const loadingIndicator = document.getElementById('loadingIndicator');
  try {

// Get input values    
    const product = productInput.value.trim();
    const email = emailInput.value.trim();
    const fromLink = options.fromLink || false;
    const bodyData = fromLink ? { product } : { product, email };


// Call n8n webhook
    const response = await fetch('https://malik2025.app.n8n.cloud/webhook/verify-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });

    const jsonData = await response.json();
    document.getElementById("noResult").style.display = "none";
    const resultContainer = document.getElementById('resultContainer');

// Only continue if there is data
    if (jsonData[0]?.data && jsonData[0].data.length > 0) {
      const firstFive = jsonData[0].data;
      let allKeys = Array.from(new Set(firstFive.flatMap(obj => Object.keys(obj))));

// Move "Data Source" to the beginning if it exists
if (allKeys.includes("Data Source")) {
  allKeys = ["Data Source", ...allKeys.filter(key => key !== "Data Source")];
}


// Group data by "Data Source"
const grouped = {};
firstFive.forEach(row => {
  const source = row["Data Source"] || "Unknown";
  if (!grouped[source]) grouped[source] = [];
  grouped[source].push(row);
});


// Start result HTML with overview card
let finalHTML = `
  <h2 class="results-title">Verification Results</h2>
<div class="Card_container_main">
  <div class="result-card" id="MainCard">
    <div class="card-field">
      <span class="card-label">Verification Date:</span>
      <span class="card-value">${new Date().toISOString()}</span>
    </div>
    <div class="card-field">
      <span class="card-label">Email:</span>
      <span class="card-value">${email}</span>
    </div>
    <div class="card-field">
      <span class="card-label">Entered Value:</span>
      <span class="card-value"><strong>${product}</strong></span>
    </div>
    <div class="card-field">
      <span class="card-label">Overview:</span>
      <span class="card-value">
        The verification was conducted based on the entered value (<strong>${product}</strong>), using regulatory databases covering human, veterinary, and herbal products, the prohibited herbs list, and the database of active ingredients and manufacturers. This report summarizes the findings extracted from these sources.
      </span>
    </div>
  </div>
</div>
`;


//Add grouped data cards
// Loop through grouped data and build cards
Object.entries(grouped).forEach(([source, rows]) => {
  const keys = Object.keys(rows[0]);
  const allKeys = keys.includes("Data Source") ? ["Data Source", ...keys.filter(k => k !== "Data Source")] : keys;

  const limitedRows = rows.slice(0, 6);
  const extraRows = rows.length > 6 ? rows.slice(6) : [];

  const limitedCardsHTML = limitedRows.map(obj => `
    <div class="result-card">
      ${allKeys.map(k => `
        <div class="card-field">
          <span class="card-label">${k}</span>
          <span class="card-value">${obj[k] ?? '-'}</span>
        </div>
      `).join('')}
    </div>
  `).join('');

  const extraCardsHTML = extraRows.map(obj => `
    <div class="result-card extra-card" style="display:none;">
      ${allKeys.map(k => `
        <div class="card-field">
          <span class="card-label">${k}</span>
          <span class="card-value">${obj[k] ?? '-'}</span>
        </div>
      `).join('')}
    </div>
  `).join('');

  const showMoreBtn = extraRows.length > 0
  ? `<div class="button_container">
      <button class="button show-more-btn" onclick="
        const container = this.closest('.cards-group').querySelectorAll('.extra-card');
        container.forEach(card => card.style.display = 'flex');
        this.style.display = 'none';
      ">Show All</button>
    </div>`
  : '';


  finalHTML += `
    <h4 class="data-source-title">${source}</h4>
    <div class="cards-group">
      <div class="cards-container">
        ${limitedCardsHTML}
        ${extraCardsHTML}
      </div>
      ${showMoreBtn}
    </div><br/>
  `;

});

// Notice for email
if (jsonData[0].moreData) {
  finalHTML += `<p class="more-data-note">⚠️ Only first 5 results are shown. Please check your email for the full report.</p>`;
}

resultContainer.innerHTML = finalHTML;


if (jsonData[0].moreData) {
  finalHTML += `<p class="more-data-note">⚠️ Only first 5 results are shown. Please check your email for the full report.</p>`;
}

resultContainer.innerHTML = finalHTML;
document.getElementById('downloadExcelBtn').style.display = 'inline-block';


      /*document.getElementById('downloadExcelBtn').style.display = 'inline-block';*/

  //Excel Export
  document.getElementById('downloadExcelBtn').addEventListener('click', function () {
  const wb = XLSX.utils.book_new();

  // Group data by Data Source
  const grouped = {};
  jsonData[0].data.forEach(row => {
    const source = row["Data Source"] || "Unknown";
    if (!grouped[source]) grouped[source] = [];
    grouped[source].push(row);
  });

// For each group, create a sheet
  Object.entries(grouped).forEach(([source, rows]) => {
    const keys = Object.keys(rows[0]);
    const allKeys = keys.includes("Data Source")  ? ["Data Source", ...keys.filter(k => k !== "Data Source")] : keys;

    const ws_data = [allKeys]; 
    rows.forEach(row => {
      const rowData = allKeys.map(k => row[k] ?? "-");
      ws_data.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const safeSheetName = source.substring(0, 31); // Excel sheet name max 31 chars
    XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
  });

  XLSX.writeFile(wb, 'VerificationResults.xlsx');
});


    } else {

// No data found
      document.getElementById("noResult").style.display = "block";
      resultContainer.innerHTML = '';
      document.getElementById("downloadExcelBtn").style.display = "none";
    }

  } catch (error) {
    console.error('❌ Error fetching from webhook:', error);
    formMessage.textContent = 'Error contacting the server.';
  }
   finally {
    loadingIndicator.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.display = 'inline-block';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const submitBtn = document.querySelector('.button');
  const loadingIndicator = document.getElementById('loadingIndicator');
  document.getElementById('product').addEventListener('blur', validateProduct);
  document.getElementById('email').addEventListener('blur', validateEmail);


submitBtn.addEventListener('click', function (e) {
  e.preventDefault();

  const productInput = document.getElementById('product');
  const emailInput = document.getElementById('email');
  const formMessage = document.getElementById('formMessage');

  let isValid = true;
  formMessage.textContent = '';

  // Product validation
  if (productInput.value.trim() === '') {
    productInput.classList.add('error');
    isValid = false;
  } else {
    productInput.classList.remove('error');
  }

  // Email validation (using function)
  if (!validateEmail()) {
    isValid = false;
  }

  if (!isValid) return;

  // If valid: Disable button and show loader
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.6';
  loadingIndicator.style.display = 'block';
  STWH();
});



  //Auto submit from link
  const urlParams = new URLSearchParams(window.location.search);
  const product = urlParams.get('product');
  const email = urlParams.get('email');
  const id = urlParams.get('ID');

  if (product && email) {
    document.getElementById('product').value = product;
    document.getElementById('email').value = email;

    if (id === '2') {
      submitBtn.style.display = 'none';
      loadingIndicator.style.display = 'block';
      STWH({ fromLink: true });
    }
  }
});
document.getElementById('toggleDarkMode').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Optional: store preference
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
});

// Load preference on page load
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
});
