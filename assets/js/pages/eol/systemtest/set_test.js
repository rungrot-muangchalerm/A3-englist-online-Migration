/* eslint-disable no-undef */
(function () {
  function api(path, opts = {}) {
    return fetch(path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    }).then((res) => res.json());
  }

  function post(path, body) {
    return api(path, { method: 'POST', body: JSON.stringify(body) });
  }

  function get(path) {
    return api(path, { method: 'GET' });
  }

  function redirect(url) {
    window.location.href = url;
  }

  window.toggleMultiSkills = function () {
    const box = document.getElementById('multi-skills-box');
    const text = document.getElementById('multi-skills-toggle-text');
    if (box.style.display === 'none') {
      box.style.display = 'block';
      text.innerHTML = '&laquo; Advanced Setting';
    } else {
      box.style.display = 'none';
      text.innerHTML = '&raquo; Advanced Setting';
    }
  };

  function init() {
    get('/api/eol/systemtest/status')
      .then((data) => {
        if (data.status !== 200 || !data.data.hasSession) {
          redirect('/eol/eoltest/academic');
          return;
        }
        const s = data.data;
        document.querySelector('#set-test-app .skill-name').textContent = s.skillName;
        document.querySelector('#set-test-app .level-name').textContent = s.levelName;
        if (s.isMultiple) {
          document.getElementById('multi-skills-section').style.display = 'block';
        }
        document.getElementById('create-test-form').addEventListener('submit', onCreateSubmit);
        document.getElementById('start-test-btn').addEventListener('click', () => {
          redirect('/eol/systemtest/test?quiz_id=1');
        });
      })
      .catch(() => redirect('/eol/eoltest/academic'));
  }

  function onCreateSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('amount-input');
    const amt = Number(input.value);
    if (!Number.isInteger(amt) || amt < 10 || amt > 50) {
      alert('จำนวนข้อสอบต้องอยู่ระหว่าง 10 - 50 ข้อ');
      return;
    }
    const body = { amount: amt };
    const multiSection = document.getElementById('multi-skills-section');
    if (multiSection && multiSection.style.display !== 'none') {
      const checked = Array.from(document.querySelectorAll('.skill-checkbox:checked')).map((cb) => Number(cb.value));
      if (checked.length === 0) {
        alert('กรุณาเลือกอย่างน้อย 1 skill');
        return;
      }
      body.skills = checked;
    }
    post('/api/eol/systemtest/create', body)
      .then((data) => {
        if (data.status !== 200) {
          alert(data.message || 'สร้างแบบทดสอบไม่สำเร็จ');
          return;
        }
        document.querySelector('.summary-amount').textContent = data.data.amount;
        document.querySelector('.summary-time').textContent = data.data.timeMinutes;
        document.getElementById('test-summary').style.display = 'block';
        input.disabled = true;
      })
      .catch(() => alert('เกิดข้อผิดพลาด'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
