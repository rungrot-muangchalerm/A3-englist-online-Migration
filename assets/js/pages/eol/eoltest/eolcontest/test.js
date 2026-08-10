(function () {
  const pathParts = window.location.pathname.split('/');
  const examId = pathParts[pathParts.length - 2];

  let currentPage = 1;
  let amount = 0;
  let timeLeft = 0;
  let testType = 1;
  let timerId = null;
  const answers = {};

  const els = {
    timer: document.getElementById('contest-timer'),
    skillName: document.getElementById('contest-skill-name'),
    questionNo: document.getElementById('contest-question-no'),
    media: document.getElementById('contest-media'),
    questionText: document.getElementById('contest-question-text'),
    answers: document.getElementById('contest-answers'),
    recordBtn: document.getElementById('contest-record-btn'),
    grid: document.getElementById('contest-question-grid'),
    backBtn: document.getElementById('contest-back-btn'),
    nextBtn: document.getElementById('contest-next-btn'),
    finishBtn: document.getElementById('contest-finish-btn'),
  };

  function htmlEscape(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function updateTimerDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    if (min !== 0) {
      els.timer.innerHTML = `เวลาที่เหลือ : <span class="text-danger">${min}</span> นาที กับ <span class="text-danger">${sec}</span> วินาที`;
    } else if (sec === 0) {
      els.timer.innerHTML = 'หมดเวลา';
    } else {
      els.timer.innerHTML = `เวลาที่เหลือ <span class="text-danger">${sec}</span> วินาที`;
    }
  }

  function startTimer() {
    if (timerId) clearInterval(timerId);
    updateTimerDisplay();
    timerId = setInterval(function () {
      if (timeLeft > 0) {
        timeLeft -= 1;
        updateTimerDisplay();
      }
      if (timeLeft <= 0) {
        clearInterval(timerId);
        doFinish(true);
      }
    }, 1000);
  }

  function renderGrid() {
    let html = '';
    for (let i = 1; i <= amount; i += 1) {
      const answered = !!answers[i];
      const cls = answered ? 'answered' : 'unanswered';
      const label = i < 10 ? `&nbsp;&nbsp;${i}&nbsp;&nbsp;` : (i < 100 ? `&nbsp;${i}&nbsp;` : i);
      html += `<button class="qnum-btn ${cls}" data-page="${i}">${label}</button>`;
      if (i % 20 === 0) html += '<br>';
    }
    els.grid.innerHTML = html;
    els.grid.querySelectorAll('.qnum-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        goPage(Number(btn.dataset.page));
      });
    });
  }

  function getSelectedAnswer() {
    const checked = els.answers.querySelector('input[name="choose"]:checked');
    return checked ? Number(checked.value) : 0;
  }

  function renderPage(data) {
    currentPage = data.page;
    amount = data.amount;
    timeLeft = data.timeLeft;
    testType = Number(data.testType);

    if (data.question.currentAnswer) {
      answers[currentPage] = data.question.currentAnswer;
    }

    els.skillName.innerHTML = data.question.skillName ? `<b>${htmlEscape(data.question.skillName)}</b>` : '';
    els.questionNo.textContent = `No. ${data.question.number}`;

    if (data.question.media) {
      if (data.question.media.type === 'text') {
        els.media.innerHTML = `<span>${htmlEscape(data.question.media.content)}</span>`;
      } else if (data.question.media.type === 'image') {
        els.media.innerHTML = `<div class="text-center"><img src="${htmlEscape(data.question.media.src)}" width="300"></div>`;
      } else if (data.question.media.type === 'audio') {
        els.media.innerHTML = `<div class="text-center"><audio controls><source src="${htmlEscape(data.question.media.src)}"></audio></div>`;
      } else {
        els.media.innerHTML = '';
      }
    } else {
      els.media.innerHTML = '';
    }

    els.questionText.innerHTML = `<span>${data.question.questionText || ''}</span>`;

    let ansHtml = '';
    const locked = testType === 2 && !!answers[currentPage];
    data.question.answers.forEach(function (a) {
      const checked = answers[currentPage] === Number(a.answerId) ? 'checked' : '';
      const disabled = locked ? 'disabled' : '';
      ansHtml += `<div class="answer-row"><label><input type="radio" name="choose" value="${a.answerId}" ${checked} ${disabled}> <span>${htmlEscape(a.text)}</span></label></div>`;
    });
    els.answers.innerHTML = ansHtml;

    if (locked ) els.recordBtn.classList.add('d-none'); else els.recordBtn.classList.remove('d-none');

    renderGrid();
    updateTimerDisplay();
  }

  function goPage(page) {
    if (page < 1) page = amount;
    if (page > amount) page = 1;
    fetch(`/api/eol/eoltest/eolcontest/page?page=${page}`, {
      credentials: 'include'
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.status !== 200) {
          alert(data.message || 'Error loading page');
          return;
        }
        renderPage(data.data);
      })
      .catch(function (err) {
        alert(err.message || 'Network error');
      });
  }

  function recordAndAdvance() {
    const selected = getSelectedAnswer();
    if (!selected) {
      alert('กรุณาเลือกคำตอบ');
      return;
    }
    answers[currentPage] = selected;

    const body = new URLSearchParams();
    body.set('page', currentPage);
    body.set(`ans_${currentPage}`, selected);
    body.set('time_left', timeLeft);

    fetch('/api/eol/eoltest/eolcontest/record', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.status !== 200) {
          alert(data.message || 'Error recording answer');
          return;
        }
        let next = currentPage + 1;
        if (next > amount) next = 1;
        goPage(next);
      })
      .catch(function (err) {
        alert(err.message || 'Network error');
      });
  }

  function doFinish(auto) {
    if (!auto && !confirm('ต้องการสิ้นสุดการทำแบบทดสอบ?')) return;
    if (timerId) clearInterval(timerId);

    const body = new URLSearchParams();
    body.set('time_left', timeLeft);

    fetch('/api/eol/eoltest/eolcontest/finish', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.status !== 200) {
          alert(data.message || 'Error finishing test');
          return;
        }
        window.location.href = data.data.redirect;
      })
      .catch(function (err) {
        alert(err.message || 'Network error');
      });
  }

  els.recordBtn.addEventListener('click', recordAndAdvance);
  els.backBtn.addEventListener('click', function () { goPage(currentPage - 1); });
  els.nextBtn.addEventListener('click', function () { goPage(currentPage + 1); });
  els.finishBtn.addEventListener('click', function () { doFinish(false); });

  goPage(1);
  startTimer();
})();
