/* eslint-disable no-undef */
(function () {
  const ICON_CORRECT = '/assets/2010/temp_images/icon_correct.jpg';
  const ICON_INCORRECT = '/assets/2010/temp_images/icon_incorrect.jpg';

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
          document.getElementById('status-msg').textContent = res.message || 'ไม่สามารถโหลดสถานะได้';
          return;
        }
        render(res.data);
      })
      .catch(() => {
        document.getElementById('status-msg').textContent = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
      });
  }

  function render(data) {
    const tbody = document.getElementById('skill-status-body');
    tbody.innerHTML = '';

    data.skillStatus.forEach((skill) => {
      const tr = document.createElement('tr');
      tr.height = 30;
      tr.innerHTML = `<td class="skill-cell text-center"><span><b>${escapeHtml(skill.skillName)}</b></span></td>`
        + skill.levels.map((lvl) => {
          const icon = lvl.passed ? ICON_CORRECT : ICON_INCORRECT;
          return `<td class="icon-cell text-center"><img src="${icon}" width="25"></td>`;
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
      document.getElementById('status-msg').innerHTML = '<span class="text-danger"><b>คุณยังไม่มีสิทธิ์เข้าใช้งาน EST กรุณาผ่านแบบทดสอบ Single Skill ทั้งหมด 18 ระดับ หรือรอให้ครบเงื่อนไขที่กำหนด</b></span>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
