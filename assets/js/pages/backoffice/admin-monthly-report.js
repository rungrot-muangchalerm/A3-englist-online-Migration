fetch('/api/backoffice/admin/monthly-report', {
  credentials: 'include'
}).then(res => res.json()).then(data => {
  if (data.status === 200) {
    const list = document.getElementById('admin-monthly-report-list');
    data.data.forEach(row => {
      const clone = document.getElementById('admin-monthly-report-row-template').content.cloneNode(true);
      clone.querySelector('[data-role="date"]').textContent = row.date;
      clone.querySelector('[data-role="all-test"]').textContent = row.allTest;
      clone.querySelector('[data-role="evaluation"]').textContent = row.evaluation;
      clone.querySelector('[data-role="contest"]').textContent = row.contest;
      clone.querySelector('[data-role="members"]').textContent = row.members;
      list.appendChild(clone);
    });
  } else {
    console.log(data);
  }
});
