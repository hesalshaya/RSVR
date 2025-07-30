
/*function displayResults(response) {
    const formMessage = document.getElementById('formMessage');

    if (!response.tableHeader || !response.tableRows) {
        formMessage.innerHTML = '<p>No results found.</p>';
        return;
    }

    let html = `
    <h3>Verification Results (First 5)</h3>
    <table border="1" cellpadding="5">
      <thead>${response.tableHeader}</thead>
      <tbody>${response.tableRows}</tbody>
    </table>
  `;

    if (response.moreData) {
        html += '<p>⚠️ More results are available in your email.</p>';
    }

    formMessage.innerHTML = html;
}

// ✅ تعريف STWH
async function STWH(options = {}) {
    const productInput = document.getElementById('product');
    const emailInput = document.getElementById('email');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.querySelector('.button');
    const loadingIndicator = document.getElementById('loadingIndicator');

    try {
        const product = productInput.value.trim();
        const email = emailInput.value.trim();
        const fromLink = options.fromLink || false;

        const bodyData = fromLink ? { product } : { product, email };

        const response = await fetch('https://malik2025.app.n8n.cloud/webhook-test/verify-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
        });

        const jsonData = await response.json();
        document.getElementById("noResult").style.display = "none";

        const resultContainer = document.getElementById('resultContainer');
        if (jsonData[0]?.data && jsonData[0].data.length > 0) {
            const firstFive = jsonData[0].data;
            const allKeys = Array.from(new Set(firstFive.flatMap(obj => Object.keys(obj))))
                .filter(key => !['row_number', 'Arabic Common Name(s)', 'ReferenceNumber', 'Old register Number', 'Sub-Type', 'StrengthUnit', 'AtcCode2', 'Size', 'SizeUnit', 'Storage Condition Arabic', 'Secondry package  manufacture', 'Third agent', 'Last Update'].includes(key));

            const tableHeader = `<tr>${allKeys.map(key => `<th>${key}</th>`).join('')}</tr>`;
            const tableRows = firstFive.map(obj => `<tr>${allKeys.map(key => `<td>${obj[key] ?? '-'}</td>`).join('')}</tr>`).join('');

            resultContainer.innerHTML = `
        <h2 class="results-title">Verification Results</h2>
        <div id="tableWrapper" class="table-wrapper">
          <table class="results-table">
            <thead>${tableHeader}</thead>
            <tbody>${tableRows}</tbody>
          </table>
          ${jsonData[0].moreData ? '<p class="more-data-note">⚠️ Only first 5 results are shown. Please check your email for the full report.</p>' : ''}
        </div>
      `;

            document.getElementById('downloadExcelBtn').style.display = 'inline-block';
            document.getElementById('downloadExcelBtn').addEventListener('click', function () {
                const wb = XLSX.utils.book_new();
                const ws_data = [];

                const headers = [];
                document.querySelectorAll('#tableWrapper thead th').forEach(th => headers.push(th.textContent.trim()));
                ws_data.push(headers);

                document.querySelectorAll('#tableWrapper tbody tr').forEach(tr => {
                    const row = [];
                    tr.querySelectorAll('td').forEach(td => row.push(td.textContent.trim()));
                    ws_data.push(row);
                });

                const ws = XLSX.utils.aoa_to_sheet(ws_data);
                XLSX.utils.book_append_sheet(wb, ws, 'Results');
                XLSX.writeFile(wb, 'VerificationResults.xlsx');
            });

        } else {
            document.getElementById("noResult").style.display = "block";
            resultContainer.innerHTML = '';
            document.getElementById("downloadExcelBtn").style.display = "none";
        }

    } catch (error) {
        console.error('❌ Error fetching from webhook:', error);
        formMessage.textContent = 'Error contacting the server.';
    } finally {
        loadingIndicator.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.display = 'inline-block';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.querySelector('.button');
    const loadingIndicator = document.getElementById('loadingIndicator');

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const productInput = document.getElementById('product');
        const emailInput = document.getElementById('email');
        const formMessage = document.getElementById('formMessage');

        let isValid = true;
        formMessage.textContent = '';

        if (productInput.value.trim() === '') {
            productInput.classList.add('error');
            isValid = false;
        } else {
            productInput.classList.remove('error');
        }

        if (emailInput.value.trim() === '') {
            emailInput.classList.add('error');
            isValid = false;
        } else {
            emailInput.classList.remove('error');
        }

        if (!isValid) return;

        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        loadingIndicator.style.display = 'block';

        STWH();
    });

    document.getElementById('languageIcon').addEventListener('click', function () {
        window.location.href = 'indexAR.html';
    });

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
});*/
// Display results inside #resultContainer based on response data
function displayResults(response) {
    const formMessage = document.getElementById('formMessage');

    if (!response.tableHeader || !response.tableRows) {
        formMessage.innerHTML = '<p>No results found.</p>';
        return;
    }

    let html = `
    <h3>Verification Results (First 5)</h3>
    <table border="1" cellpadding="5">
      <thead>${response.tableHeader}</thead>
      <tbody>${response.tableRows}</tbody>
    </table>
  `;

    if (response.moreData) {
        html += '<p>⚠️ More results are available in your email.</p>';
    }

    formMessage.innerHTML = html;
}

// Cached DOM elements for reuse
const productInput = document.getElementById('product');
const emailInput = document.getElementById('email');
const emailHelp = document.getElementById('emailHelp');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.querySelector('.button');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultContainer = document.getElementById('resultContainer');
const downloadExcelBtn = document.getElementById('downloadExcelBtn');

// Email validation function with error message toggle
function validateEmail() {
    const email = emailInput.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex

    if (!pattern.test(email)) {
        emailInput.classList.add('error');
        emailHelp.classList.add('show');
        emailInput.classList.remove('valid');
        return false;
    } else {
        emailInput.classList.remove('error');
        emailHelp.classList.remove('show');
        emailInput.classList.add('valid');
        return true;
    }
}

// Validate product input function
function validateProduct() {
    if (productInput.value.trim() === '') {
        productInput.classList.add('error');
        productInput.classList.remove('valid');
        return false;
    } else {
        productInput.classList.remove('error');
        productInput.classList.add('valid');
        return true;
    }
}

// Add blur event listeners for instant validation
productInput.addEventListener('blur', validateProduct);
emailInput.addEventListener('blur', validateEmail);

// Main async function to call backend webhook and process data
async function STWH(options = {}) {
    try {
        const product = productInput.value.trim();
        const email = emailInput.value.trim();
        const fromLink = options.fromLink || false;

        const bodyData = fromLink ? { product } : { product, email };

        const response = await fetch('https://malik2025.app.n8n.cloud/webhook-test/verify-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
        });

        const jsonData = await response.json();
        document.getElementById("noResult").style.display = "none";

        if (jsonData[0]?.data && jsonData[0].data.length > 0) {
            const firstFive = jsonData[0].data;

            // Collect all keys excluding unwanted columns
            const excludedKeys = ['row_number', 'Arabic Common Name(s)', 'ReferenceNumber', 'Old register Number', 'Sub-Type', 'StrengthUnit', 'AtcCode2', 'Size', 'SizeUnit', 'Storage Condition Arabic', 'Secondry package  manufacture', 'Third agent', 'Last Update'];
            const allKeys = Array.from(new Set(firstFive.flatMap(obj => Object.keys(obj))))
                .filter(key => !excludedKeys.includes(key));

            // Create table headers and rows dynamically
            const tableHeader = `<tr>${allKeys.map(key => `<th>${key}</th>`).join('')}</tr>`;
            const tableRows = firstFive.map(obj => `<tr>${allKeys.map(key => `<td>${obj[key] ?? '-'}</td>`).join('')}</tr>`).join('');

            // Render results table
            resultContainer.innerHTML = `
                <h2 class="results-title">Verification Results</h2>
                <div id="tableWrapper" class="table-wrapper">
                  <table class="results-table">
                    <thead>${tableHeader}</thead>
                    <tbody>${tableRows}</tbody>
                  </table>
                  ${jsonData[0].moreData ? '<p class="more-data-note">⚠️ Only first 5 results are shown. Please check your email for the full report.</p>' : ''}
                </div>
            `;

            // Show and set up Excel download button
            downloadExcelBtn.style.display = 'inline-block';
            downloadExcelBtn.onclick = () => {
                const wb = XLSX.utils.book_new();
                const ws_data = [];

                // Get headers from table
                const headers = [];
                document.querySelectorAll('#tableWrapper thead th').forEach(th => headers.push(th.textContent.trim()));
                ws_data.push(headers);

                // Get rows data
                document.querySelectorAll('#tableWrapper tbody tr').forEach(tr => {
                    const row = [];
                    tr.querySelectorAll('td').forEach(td => row.push(td.textContent.trim()));
                    ws_data.push(row);
                });

                const ws = XLSX.utils.aoa_to_sheet(ws_data);
                XLSX.utils.book_append_sheet(wb, ws, 'Results');
                XLSX.writeFile(wb, 'VerificationResults.xlsx');
            };

        } else {
            // No data found
            document.getElementById("noResult").style.display = "block";
            resultContainer.innerHTML = '';
            downloadExcelBtn.style.display = "none";
        }

    } catch (error) {
        console.error('❌ Error fetching from webhook:', error);
        formMessage.textContent = 'Error contacting the server.';
    } finally {
        loadingIndicator.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.display = 'inline-block';
    }
}

// Run after DOM fully loaded
document.addEventListener('DOMContentLoaded', function () {

    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();

        formMessage.textContent = '';

        const productIsValid = validateProduct();
        const emailIsValid = validateEmail();

        if (!productIsValid || !emailIsValid) {
            return; // Stop if validation failed
        }

        // Show loading and disable submit button while fetching
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        loadingIndicator.style.display = 'block';

        STWH();
    });

    // Language icon click
    document.getElementById('languageIcon').addEventListener('click', function () {
        window.location.href = 'indexAR.html';
    });

    // Prefill fields if product & email exist in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');
    const email = urlParams.get('email');
    const id = urlParams.get('ID');

    if (product && email) {
        productInput.value = product;
        emailInput.value = email;

        if (id === '2') {
            submitBtn.style.display = 'none';
            loadingIndicator.style.display = 'block';
            STWH({ fromLink: true });
        }
    }
});
