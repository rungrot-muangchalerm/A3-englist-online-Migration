(function () {
  const parts = window.location.pathname.split('/');
  const examId = parts[parts.length - 1];

  const els = {
    name: document.getElementById('contest-exam-name'),
    type: document.getElementById('contest-test-type'),
    amount: document.getElementById('contest-amount'),
    time: document.getElementById('contest-time'),
    note: document.getElementById('contest-note-row'),
    startBtn: document.getElementById('contest-start-btn'),
  };

  function htmlEscape(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function setLoading() {
    els.name.textContent = 'Loading...';
    els.startBtn.disabled = true;
  }

  function setError(msg) {
    els.name.innerHTML = `<span class="text-danger">${htmlEscape(msg)}</span>`;
    els.startBtn.disabled = true;
  }

  setLoading();

  fetch('/api/eol/eoltest/eolcontest/start', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ examId: examId }).toString(),
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.status !== 200) {
        setError(data.message || 'Cannot start contest');
        return;
      }
      const info = data.data;
      els.name.textContent = htmlEscape(info.examName);
      els.type.textContent = Number(info.testType) === 2 ? 'การแข่งขัน' : 'สอบเก็บคะแนน';
      els.amount.textContent = `${info.amount} ข้อ`;
      els.time.textContent = `${info.timeSeconds} วินาที (${info.timeSeconds / 60} นาที)`;
      if (Number(info.testType) === 2) {
        els.note.classList.remove('d-none');
      }
      els.startBtn.disabled = false;
      els.startBtn.addEventListener('click', function () {
        window.location.href = `/eol/eoltest/eolcontest/${encodeURIComponent(info.examId)}/test`;
      });
    })
    .catch(function (err) {
      setError(err.message || 'Network error');
    });
})();
