/* eslint-disable no-undef */
(function () {
  function api(path, opts) {
    return fetch(path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    }).then((res) => res.json());
  }

  function get(path) {
    return api(path, { method: 'GET' });
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function init() {
    get('/api/eol/standardtest/status')
      .then((res) => {
        if (res.status !== 200 || !res.data) {
          const msg = document.getElementById('status-msg');
          msg.textContent = res.message || 'ไม่สามารถโหลดสถานะได้';
          msg.classList.remove('d-none');
          return;
        }
        render(res.data);
      })
      .catch(() => {
        const msg = document.getElementById('status-msg');
        msg.textContent = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
        msg.classList.remove('d-none');
      });
  }

  function render(data) {
    const tbody = document.getElementById('skill-status-body');
    tbody.innerHTML = '';

    data.skillStatus.forEach((skill) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><span class="fw-semibold">${escapeHtml(skill.skillName)}</span></td>`
        + skill.levels.map((lvl) => {
          const icon = lvl.passed ? 'bi-check-circle-fill' : 'bi-x-circle-fill';
          const color = lvl.passed ? 'text-success' : 'text-danger';
          const label = lvl.passed ? 'Passed' : 'Missing';
          return `<td class="text-center"><span class="${color}"><i class="bi ${icon}"></i> ${label}</span></td>`;
        }).join('');
      tbody.appendChild(tr);
    });

    document.getElementById('last-test-cell').innerHTML = data.lastTestMessage || '-';

    const btn = document.getElementById('start-btn');
    if (data.eventPass === 1) {
      btn.disabled = false;
      btn.addEventListener('click', function () {
        window.location.href = '/eol/standardtest/set_test';
      });
    } else {
      btn.disabled = true;
      const msg = document.getElementById('status-msg');
      msg.innerHTML = '<strong>คุณยังไม่มีสิทธิ์เข้าใช้งาน EST</strong><div>กรุณาผ่านแบบทดสอบ Single Skill ทั้งหมด 18 ระดับ หรือรอให้ครบเงื่อนไขที่กำหนด</div>';
      msg.classList.remove('d-none');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
