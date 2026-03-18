const quotes = [
  {
    carrier: 'Summit Specialty',
    badge: 'Balanced package',
    business: 'contractor',
    focus: 'liability',
    annualPremium: '$14,820',
    monthlyPremium: '$1,235/mo',
    deductible: '$2,500 property',
    appetite: 'Artisan contractors up to $5M revenue',
    liabilityLimit: '$1M / $2M',
    propertyLimit: '$500K blanket',
    cyber: '$100K included',
    notes: 'Includes additional insured blanket wording and primary/non-contributory endorsement.',
    highlight: true,
  },
  {
    carrier: 'Harbor Mutual',
    badge: 'Property-first option',
    business: 'retail',
    focus: 'property',
    annualPremium: '$11,460',
    monthlyPremium: '$955/mo',
    deductible: '$1,000 all peril',
    appetite: 'Main street retail with light stock exposure',
    liabilityLimit: '$1M / $2M',
    propertyLimit: '$850K replacement cost',
    cyber: '$50K add-on',
    notes: 'Business income coverage includes 12 months actual loss sustained for scheduled locations.',
    highlight: false,
  },
  {
    carrier: 'Northstar Digital',
    badge: 'Cyber-forward package',
    business: 'professional',
    focus: 'cyber',
    annualPremium: '$9,780',
    monthlyPremium: '$815/mo',
    deductible: '$5,000 cyber retention',
    appetite: 'Professional firms with SaaS or client data exposure',
    liabilityLimit: '$2M aggregate',
    propertyLimit: '$150K business personal property',
    cyber: '$1M primary',
    notes: 'Bundles tech E&O, privacy liability, and incident response vendors.',
    highlight: false,
  },
];

const quoteGrid = document.getElementById('quote-grid');
const businessFilter = document.getElementById('business-filter');
const coverageFilter = document.getElementById('coverage-filter');
const submissionForm = document.getElementById('submission-form');
const submissionSummary = document.getElementById('submission-summary');

function renderQuotes() {
  const business = businessFilter.value;
  const focus = coverageFilter.value;

  const filteredQuotes = quotes.filter((quote) => {
    const businessMatch = business === 'all' || quote.business === business;
    const focusMatch = focus === 'all' || quote.focus === focus;
    return businessMatch && focusMatch;
  });

  if (!filteredQuotes.length) {
    quoteGrid.innerHTML = '<div class="empty-state">No quote packages match the selected filters. Try a different business profile or coverage focus.</div>';
    return;
  }

  quoteGrid.innerHTML = filteredQuotes
    .map(
      (quote) => `
        <article class="quote-card ${quote.highlight ? 'highlight' : ''}">
          <div class="quote-card-header">
            <div>
              <span class="quote-badge">${quote.badge}</span>
              <h3>${quote.carrier}</h3>
            </div>
            <p class="quote-meta">${quote.appetite}</p>
          </div>
          <div class="quote-price">
            <div>
              <span class="quote-meta">Estimated annual premium</span>
              <strong>${quote.annualPremium}</strong>
            </div>
            <span class="quote-meta">${quote.monthlyPremium}</span>
          </div>
          <ul class="quote-feature-list">
            <li><span>General liability</span> <strong>${quote.liabilityLimit}</strong></li>
            <li><span>Property</span> <strong>${quote.propertyLimit}</strong></li>
            <li><span>Cyber / tech</span> <strong>${quote.cyber}</strong></li>
            <li><span>Deductible / retention</span> <strong>${quote.deductible}</strong></li>
          </ul>
          <footer>${quote.notes}</footer>
        </article>
      `,
    )
    .join('');
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount) || amount <= 0) return 'Not provided';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function summarizeForm(event) {
  event.preventDefault();
  const data = new FormData(submissionForm);
  const selectedCoverages = data.getAll('coverages');

  submissionSummary.innerHTML = `
    <div>
      <p class="eyebrow">Submission summary</p>
      <h3 class="summary-title">${data.get('businessName')} · ${data.get('industry')}</h3>
      <ul class="summary-list">
        <li><span>Primary contact</span><strong>${data.get('contactName')}</strong></li>
        <li><span>Email</span><strong>${data.get('email')}</strong></li>
        <li><span>Phone</span><strong>${data.get('phone')}</strong></li>
        <li><span>States</span><strong>${data.get('states')}</strong></li>
        <li><span>Revenue</span><strong>${formatCurrency(data.get('revenue'))}</strong></li>
        <li><span>Payroll</span><strong>${formatCurrency(data.get('payroll'))}</strong></li>
        <li><span>Employees</span><strong>${data.get('employees')}</strong></li>
        <li><span>Effective date</span><strong>${data.get('effectiveDate') || 'Not provided'}</strong></li>
        <li><span>Claims history</span><strong>${data.get('claimsHistory')}</strong></li>
        <li><span>Requested lines</span><strong>${selectedCoverages.length ? selectedCoverages.join(', ') : 'No lines selected'}</strong></li>
        <li><span>Vehicles</span><strong>${data.get('vehicles') || '0'}</strong></li>
        <li><span>Property values</span><strong>${formatCurrency(data.get('propertyValue'))}</strong></li>
      </ul>
      <p class="summary-footnote"><strong>Operations:</strong> ${data.get('operations')}</p>
      <p class="summary-footnote"><strong>Underwriting notes:</strong> ${data.get('notes') || 'No additional notes provided.'}</p>
    </div>
  `;
}

businessFilter.addEventListener('change', renderQuotes);
coverageFilter.addEventListener('change', renderQuotes);
submissionForm.addEventListener('submit', summarizeForm);
submissionForm.addEventListener('reset', () => {
  window.setTimeout(() => {
    submissionSummary.innerHTML = `
    <div>
      <p class="eyebrow">Submission summary</p>
      <h3>Your intake summary will appear here.</h3>
      <p>
        Complete the form to generate a concise overview that a broker or account manager can
        use for the next step in the quoting workflow.
      </p>
    </div>`;
  }, 0);
});

renderQuotes();
