/* eslint-disable no-undef */

{
const ICON_MAP = {
  'fa-map-location-dot': 'bi-geo-alt',
};

const params = new URLSearchParams(window.location.search);
const search = params.get('search') || '';
const round = params.get('round') || '-1';

fetch(`/api/teoc/rounds?search=${encodeURIComponent(search)}&round=${encodeURIComponent(round)}`, {
  credentials: 'include',
  method: 'GET',
}).then(res => res.json()).then(data => {
  if (data.status !== 200) {
    console.log(data);
    return;
  }

  const app = document.getElementById('teoc-app');
  app.textContent = '';

  if (!data.data || !data.data.rounds) {
    app.textContent = 'ไม่พบข้อมูล';
    return;
  }

  const roundTemplate = document.getElementById('teoc-round-template');
  const emptyTemplate = document.getElementById('teoc-empty-template');
  const contentTemplate = document.getElementById('teoc-content-template');
  const provinceCardTemplate = document.getElementById('teoc-province-card-template');
  const resultRowTemplate = document.getElementById('teoc-result-row-template');
  const searchAlertSuccessTemplate = document.getElementById('teoc-search-alert-success-template');
  const searchAlertWarningTemplate = document.getElementById('teoc-search-alert-warning-template');
  const clearButtonTemplate = document.getElementById('teoc-clear-button-template');

  data.data.rounds.forEach((r) => {
    const clone = roundTemplate.content.cloneNode(true);
    const panel = clone.querySelector('.round-panel');
    panel.id = `round-${r.index}`;
    clone.querySelector('.round-icon').classList.add(ICON_MAP[r.icon] || r.icon);
    clone.querySelector('.round-name').textContent = r.name;
    clone.querySelector('.round-subtitle').textContent = r.subtitle;

    const body = clone.querySelector('.round-body');
    if (r.total === 0) {
      body.appendChild(emptyTemplate.content.cloneNode(true));
    } else {
      const content = contentTemplate.content.cloneNode(true);
      content.querySelectorAll('.round-total').forEach((el) => {
        el.textContent = r.total;
      });
      content.querySelector('.round-total-bottom').textContent = r.total;

      content.querySelector('.search-input').value = data.data.search;
      content.querySelector('.round-index-input').value = r.index;

      const isSearchActive = data.data.search && Number(data.data.round) === r.index;
      const foundCount = isSearchActive ? r.results.length : 0;
      if (isSearchActive) {
        content.querySelector('.clear-button-container').appendChild(clearButtonTemplate.content.cloneNode(true));
      }

      if (data.data.search) {
        const alertContainer = content.querySelector('.search-alert-container');
        if (foundCount > 0) {
          const alertClone = searchAlertSuccessTemplate.content.cloneNode(true);
          alertClone.querySelector('.found-count').textContent = foundCount;
          alertClone.querySelector('.search-term').textContent = data.data.search;
          alertClone.querySelector('.total-count').textContent = r.total;
          alertContainer.appendChild(alertClone);
        } else {
          const alertClone = searchAlertWarningTemplate.content.cloneNode(true);
          alertClone.querySelector('.search-term').textContent = data.data.search;
          alertContainer.appendChild(alertClone);
        }
      }

      if (r.provinceCounts && r.provinceCounts.length > 0) {
        content.querySelector('.province-summary-title').classList.remove('d-none');
        const row = content.querySelector('.province-summary-row');
        row.classList.remove('d-none');
        r.provinceCounts.forEach((item) => {
          const isUnknown = item.province === 'ไม่ทราบจังหวัด';
          const cardClone = provinceCardTemplate.content.cloneNode(true);
          const card = cardClone.querySelector('.province-card');
          if (isUnknown) {
            card.classList.add('province-unknown');
            cardClone.querySelector('.province-title').classList.add('text-warning');
            cardClone.querySelector('.province-count-value').classList.add('text-danger');
          } else {
            cardClone.querySelector('.province-title').classList.add('text-dark');
            cardClone.querySelector('.province-count-value').classList.add('province-count');
          }
          cardClone.querySelector('.province-icon').classList.add(isUnknown ? 'bi-question-circle' : 'bi-geo-alt');
          cardClone.querySelector('.province-name').textContent = item.province;
          cardClone.querySelector('.province-count-value').textContent = item.count;
          row.appendChild(cardClone);
        });
      }

      const table = content.querySelector('.round-results-table');
      const tbody = table.querySelector('tbody');
      const hasTie = r.results.some((item) => String(item.rank).includes('*'));
      r.results.forEach((item) => {
        const rowClone = resultRowTemplate.content.cloneNode(true);
        rowClone.querySelector('.rank-badge').textContent = item.rank;
        rowClone.querySelector('.rank-badge').classList.add(item.rankClass);
        rowClone.querySelector('.member-id-badge').textContent = item.memberId;
        rowClone.querySelector('.member-name').textContent = item.fullName;
        rowClone.querySelector('.member-province').textContent = item.province;
        rowClone.querySelector('.score-badge').textContent = `${Number(item.score).toFixed(2)}%`;
        rowClone.querySelector('.exam-date').textContent = item.date;
        tbody.appendChild(rowClone);
      });

      if (hasTie) {
        content.querySelector('.tie-note').classList.remove('d-none');
      }

      body.appendChild(content);
    }

    app.appendChild(clone);
  });

  if (data.data.search && data.data.round !== -1) {
    const target = document.getElementById(`round-${Number(data.data.round)}`);

    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add('round-highlight');
      setTimeout(() => {
        target.classList.remove('round-highlight');
      }, 2000);
    }, 300);
  }
});
}
