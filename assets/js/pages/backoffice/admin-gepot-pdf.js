const params = new URLSearchParams(window.location.search);
const username = params.get('username') || '';
const startUsername = params.get('start_username') || '';
const endUsername = params.get('end_username') || '';

document.getElementById('admin-gepot-pdf-username').value = username;
document.getElementById('admin-gepot-pdf-start-username').value = startUsername;
document.getElementById('admin-gepot-pdf-end-username').value = endUsername;

function setExportField(selector, value, disabled) {
  const field = document.querySelector(selector);
  field.value = value;
  field.disabled = disabled;
}

function setExportButton(data) {
  if (data.rows.length === 0) return;
  document.getElementById('admin-gepot-pdf-export-button').classList.remove('d-none');
  if (data.mode === 'single') {
    setExportField('[data-export="pdf-member-id"]', data.rows[0].memberId, false);
    setExportField('[data-export="pdf-start-username"]', '', true);
    setExportField('[data-export="pdf-end-username"]', '', true);
  }
  if (data.mode === 'range') {
    setExportField('[data-export="pdf-member-id"]', '', true);
    setExportField('[data-export="pdf-start-username"]', data.startUsername, false);
    setExportField('[data-export="pdf-end-username"]', data.endUsername, false);
  }
}

function applyTextColor(el, color) {
  const value = String(color || '').toLowerCase();
  const cls = value === 'red' ? 'text-danger'
    : value === 'green' ? 'text-success'
      : value === 'blue' ? 'text-primary'
        : value === 'brown' || value === 'orange' ? 'text-warning'
          : 'text-dark';
  el.classList.add(cls);
}

function renderSkill(container, skill) {
  const clone = document.getElementById('admin-gepot-pdf-skill-template').content.cloneNode(true);
  clone.querySelector('[data-role="skill-name"]').textContent = skill.name;
  clone.querySelector('[data-role="skill-correct"]').textContent = skill.correct;
  clone.querySelector('[data-role="skill-wrong"]').textContent = skill.wrong;
  clone.querySelector('[data-role="skill-unanswered"]').textContent = skill.unanswered;
  clone.querySelector('[data-role="skill-score"]').textContent = skill.score;
  clone.querySelector('[data-role="skill-total"]').textContent = skill.total;
  clone.querySelector('[data-role="skill-level"]').textContent = skill.level.text;
  applyTextColor(clone.querySelector('[data-role="skill-level"]'), skill.level.color);
  clone.querySelector('[data-role="skill-cefr"]').textContent = skill.cefr.text;
  applyTextColor(clone.querySelector('[data-role="skill-cefr"]'), skill.cefr.color);
  const tbody = clone.querySelector('tbody');
  while (tbody.firstChild) {
    container.appendChild(tbody.firstChild);
  }
}

function renderCard(row) {
  const clone = document.getElementById('admin-gepot-pdf-card-template').content.cloneNode(true);
  clone.querySelector('[data-role="no"]').textContent = row.no || '';
  clone.querySelector('[data-role="full-name"]').textContent = row.fullName;
  clone.querySelector('[data-role="date"]').textContent = row.date;
  clone.querySelector('[data-role="test-type"]').textContent = row.testType;
  clone.querySelector('[data-role="correct"]').textContent = row.correct;
  clone.querySelector('[data-role="wrong"]').textContent = row.wrong;
  clone.querySelector('[data-role="unanswered"]').textContent = row.unanswered;
  clone.querySelector('[data-role="percent"]').textContent = row.percent;
  const skills = clone.querySelector('[data-role="skills"]');
  row.skills.forEach(skill => renderSkill(skills, skill));
  document.getElementById('admin-gepot-pdf-report-list').appendChild(clone);
}

if (username || startUsername || endUsername) {
  fetch(`/api/backoffice/admin/export-report-gepot-pdf?${params.toString()}`, {
    credentials: 'include'
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      if (data.data.rows.length === 0) {
        document.getElementById('admin-gepot-pdf-not-found').classList.remove('d-none');
        return;
      }
      setExportButton(data.data);
      data.data.rows.forEach(row => renderCard(row));
    } else {
      console.log(data);
    }
  });
}
