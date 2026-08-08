fetch('/api/backoffice/admin/questions/amount', {
  credentials: 'include'
}).then(res => res.json()).then(data => {
  if (data.status === 200) {
    const list = document.getElementById('admin-question-amount-list');
    const template = document.getElementById('admin-question-amount-template');
    data.data.rows.forEach(row => {
      const clone = template.content.cloneNode(true);
      clone.querySelector('[data-role="skill-name"]').textContent = row.skillName;
      row.levels.forEach(level => {
        clone.querySelector(`[data-role="level-${level.level}-online"]`).textContent = level.online;
        clone.querySelector(`[data-role="level-${level.level}-offline"]`).textContent = level.offline;
        clone.querySelector(`[data-role="level-${level.level}-total"]`).textContent = level.total;
      });
      clone.querySelector('[data-role="online-total"]').textContent = row.onlineTotal;
      clone.querySelector('[data-role="offline-total"]').textContent = row.offlineTotal;
      clone.querySelector('[data-role="total"]').textContent = row.total;
      list.appendChild(clone);
    });

    const descriptionList = document.getElementById('admin-question-description-list');
    const descriptionTemplate = document.getElementById('admin-question-description-template');
    data.data.descriptions.forEach((description, index) => {
      const clone = descriptionTemplate.content.cloneNode(true);
      clone.querySelector('[data-role="skill-name"]').textContent = description.skillName;
      clone.querySelector('[data-role="amount"]').textContent = description.amount;
      if (index === data.data.descriptions.length - 1) {
        clone.querySelector('[data-role="separator"]').textContent = '';
      }
      descriptionList.appendChild(clone);
    });
  } else {
    console.log(data);
  }
});
