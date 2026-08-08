/* eslint-disable no-undef */
(function () {
  function api(path, opts) {
    return fetch(path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    }).then((res) => res.json());
  }

  function post(path, body) {
    return api(path, { method: 'POST', body: JSON.stringify(body) });
  }

  function redirect(url) {
    window.location.href = url;
  }

  function init() {
    const btn = document.getElementById('start-btn');
    const loading = document.getElementById('loading-text');

    btn.addEventListener('click', function () {
      btn.disabled = true;
      loading.style.display = 'block';

      post('/api/eol/standardtest/create', { event_pass: 1 })
        .then((res) => {
          if (res.status !== 200) {
            alert(res.message || 'ไม่สามารถสร้างแบบทดสอบได้');
            btn.disabled = false;
            loading.style.display = 'none';
            return;
          }
          redirect('/eol/standardtest/test?page=1');
        })
        .catch(() => {
          alert('เกิดข้อผิดพลาด');
          btn.disabled = false;
          loading.style.display = 'none';
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
