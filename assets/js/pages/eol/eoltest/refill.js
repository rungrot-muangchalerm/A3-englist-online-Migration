(function () {
  function htmlEscape(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function showView(id) {
    const views = document.querySelectorAll('.eol-view');
    views.forEach((v) => { v.classList.add('d-none'); });
    const target = document.getElementById(id);
    if (target) target.classList.remove('d-none');
  }
  document.addEventListener('DOMContentLoaded', function () {
    const refillBtn = document.getElementById('refill-account-btn');
    const refillHistoryBtn = document.getElementById('refill-history-show-btn');
    if (refillHistoryBtn) {
      refillHistoryBtn.addEventListener('click', () => {
        document.getElementById('refill_history').classList.remove('d-none');
      });
    }
    if (refillBtn) {
      refillBtn.addEventListener('click', () => {
        const form = document.getElementById('refillForm');
        const msg = document.getElementById('refillMsg');
        msg.classList.add('d-none');
        fetch('/api/eol/refill', {
          method: 'POST',
          credentials: 'include',
          body: new URLSearchParams(new FormData(form))
        })
          .then((res) => res.json())
          .then((data) => {
            msg.classList.remove('d-none');
            const message = data.data && data.data.message ? data.data.message : data.message;
            msg.innerHTML = `<span><b><br>${htmlEscape(message)}<br>&nbsp;</b></span>`;
            if (data.status === 200) {
              form.reset();
              setTimeout(function () { window.location.reload(); }, 1500);
            }
          });
      });
    }
      showView('view-refill');
      fetch('/api/eol/refill', {
        credentials: 'include'
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== 200) {
            console.log(data);
            return;
          }
          document.getElementById('refill-verify-token').value = data.data.challenge.token;
          document.getElementById('refill-challenge-label').textContent = data.data.challenge.label;

          const container = document.getElementById('refill_history');
          while (container.firstChild) container.removeChild(container.firstChild);
          const tableTemplate = document.getElementById('refill-history-table-template');
          const tableClone = tableTemplate.content.cloneNode(true);
          const tbody = tableClone.querySelector('[data-role="body"]');
          const isPersonal = data.data.accountType === 'personal';

          if (isPersonal) {
            tbody.appendChild(document.getElementById('refill-history-personal-header-template').content.cloneNode(true));
            if (!data.data.refillHistory || data.data.refillHistory.length === 0) {
              tbody.appendChild(document.getElementById('refill-history-empty4-template').content.cloneNode(true));
            } else {
              const rowTemplate = document.getElementById('refill-history-card-row-template');
              data.data.refillHistory.forEach((r) => {
                const clone = rowTemplate.content.cloneNode(true);
                clone.querySelector('[data-role="date"]').textContent = r.createDate;
                clone.querySelector('[data-role="label"]').textContent = r.label;
                tbody.appendChild(clone);
              });
            }
          }

          tbody.appendChild(document.getElementById(isPersonal ? 'refill-history-main-header-personal-template' : 'refill-history-main-header-template').content.cloneNode(true));
          if (isPersonal) {
            tbody.appendChild(document.getElementById('refill-history-main-subheader-template').content.cloneNode(true));
          }

          if (!data.data.history || data.data.history.length === 0) {
            tbody.appendChild(document.getElementById(isPersonal ? 'refill-history-empty4-template' : 'refill-history-empty2-template').content.cloneNode(true));
          } else {
            const rowTemplate = document.getElementById(isPersonal ? 'refill-history-main-row-personal-template' : 'refill-history-main-row-corporate-template');
            data.data.history.forEach((r) => {
              const clone = rowTemplate.content.cloneNode(true);
              clone.querySelector('[data-role="date"]').textContent = r.createDate;
              clone.querySelector('[data-role="label"]').textContent = r.label;
              if (isPersonal) {
                clone.querySelector('[data-role="start"]').textContent = r.start;
                clone.querySelector('[data-role="stop"]').textContent = r.stop;
              }
              tbody.appendChild(clone);
            });
          }

          container.appendChild(tableClone);
          container.querySelector('.refill-history-hide').addEventListener('click', (e) => {
            e.preventDefault();
            container.classList.add('d-none');
          });
        });
  });
})();
