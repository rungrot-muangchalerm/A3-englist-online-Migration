/* eslint-disable no-undef */
(function () {
  const params = new URLSearchParams(window.location.search);
  let currentPage = Number(params.get('page')) || 1;
  let pageCount = 1;
  let amount = 0;
  let timeLeft = 0;
  let timerInterval = null;
  let finishing = false;
  const answeredPages = new Set();

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

  function get(path) {
    return api(path, { method: 'GET' });
  }

  function redirect(url) {
    window.location.href = url;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function init() {
    loadPage(currentPage);
  }

  function loadPage(page) {
    if (page < 1) page = 1;
    if (pageCount && page > pageCount) page = pageCount;
    currentPage = page;

    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.history.replaceState({}, '', url.toString());

    get(`/api/eol/standardtest/page?page=${page}`)
      .then((res) => {
        if (res.status !== 200) {
          redirect('/eol/standardtest/set_test');
          return;
        }
        render(res.data);
        startTimer();
      })
      .catch(() => redirect('/eol/standardtest/set_test'));
  }

  function render(data) {
    pageCount = data.pageCount || 1;
    amount = data.amount || 0;
    if (data.timeLeft > 0 && !timeLeft) timeLeft = data.timeLeft;

    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    data.questions.forEach((q) => {
      const mediaHtml = buildMedia(q);
      const answersHtml = buildAnswers(q);

      const html = `
        ${mediaHtml}
        <table class="table table-sm question-table">
          <tr class="align-top">
            <td width="5%" rowspan="2" class="text-center"><span>${q.number}.</span></td>
            <td width="95%" class="text-start"><span>${q.questionText}</span></td>
          </tr>
          <tr height="25" class="align-middle">
            <td>${answersHtml}</td>
          </tr>
        </table>
        <br>
      `;
      container.insertAdjacentHTML('beforeend', html);
    });

    attachAnswerHandlers();
    renderPageNumbers();

    document.getElementById('back-btn').onclick = () => recordAndGo(currentPage - 1);
    document.getElementById('next-btn').onclick = () => recordAndGo(currentPage + 1);
    document.getElementById('finish-btn').onclick = onFinishClick;
  }

  function buildMedia(q) {
    if (!q.media) return '';
    if (q.media.type === 'text') {
      return `<div class="media-box"><span>${escapeHtml(q.media.content)}</span></div>`;
    }
    if (q.media.type === 'image') {
      return `<div class="media-box"><img src="${escapeHtml(q.media.src)}" width="300"></div>`;
    }
    if (q.media.type === 'audio') {
      if (q.soundPlayed) {
        return `<div class="media-box"><span class="played-msg">คุณได้ฟังเสียงนี้ไปแล้ว</span></div>`;
      }
      const audioId = `audio_${q.number}`;
      const boxId = `audio_box_${q.number}`;
      const playedInputId = `played_${q.number}`;
      return `
        <div class="media-box">
          <div id="${boxId}">
            <div class="audio-trigger" data-audio="${audioId}" data-box="${boxId}">
              <span><b>กดที่นี่เพื่อฟังเสียง สามารถฟังได้เพียงครั้งเดียวเท่านั้น</b></span>
            </div>
          </div>
          <div id="${audioId}_wrap" class="d-none">
            <audio id="${audioId}" controls preload="auto" data-box="${boxId}" data-wrap="${audioId}_wrap">
              <source src="${escapeHtml(q.media.src)}" type="audio/mpeg">
            </audio>
          </div>
          <input type="hidden" id="${playedInputId}" name="${playedInputId}" value="0">
        </div>
      `;
    }
    return '';
  }

  function buildAnswers(q) {
    if (!q.answers || q.answers.length === 0) return '';
    const rows = q.answers.map((ans, idx) => {
      const k = idx + 1;
      const checked = q.currentAnswer && q.currentAnswer.includes(ans.answerId) ? 'checked' : '';
      return `
        <tr class="align-top">
          <td class="text-start">
            <input type="checkbox" name="ans_${q.number}_${k}" id="ans_${q.number}_${k}" value="${ans.answerId}" ${checked} data-q="${q.number}" data-k="${k}">
          </td>
          <td data-q="${q.number}" data-k="${k}" class="answer-text text-start">
            <span>${ans.text}</span>
          </td>
        </tr>
      `;
    }).join('');
    return `<table class="table table-sm text-start">${rows}</table>`;
  }

  function attachAnswerHandlers() {
    document.querySelectorAll('input[type="checkbox"][id^="ans_"]').forEach((cb) => {
      cb.addEventListener('click', function () {
        const q = this.getAttribute('data-q');
        const k = this.getAttribute('data-k');
        if (this.checked) {
          for (let i = 1; i <= 4; i += 1) {
            if (String(i) !== k) {
              const other = document.getElementById(`ans_${q}_${i}`);
              if (other) other.checked = false;
            }
          }
        }
      });
    });

    document.querySelectorAll('.answer-text').forEach((cell) => {
      cell.addEventListener('click', function () {
        const q = this.getAttribute('data-q');
        const k = this.getAttribute('data-k');
        const cb = document.getElementById(`ans_${q}_${k}`);
        if (!cb) return;
        const willCheck = !cb.checked;
        for (let i = 1; i <= 4; i += 1) {
          const other = document.getElementById(`ans_${q}_${i}`);
          if (other) other.checked = (String(i) === k) ? willCheck : false;
        }
      });
    });

    document.querySelectorAll('.audio-trigger').forEach((trigger) => {
      trigger.addEventListener('click', function () {
        const audioId = this.getAttribute('data-audio');
        const boxId = this.getAttribute('data-box');
        const wrap = document.getElementById(`${audioId}_wrap`);
        const audio = document.getElementById(audioId);
        if (!audio) return;
        document.getElementById(boxId).classList.add('d-none');
        if (wrap) wrap.classList.remove('d-none');
        audio.play();
      });
    });

    document.querySelectorAll('audio').forEach((audio) => {
      audio.addEventListener('play', function () {
        const wrapId = this.getAttribute('data-wrap');
        const qNum = wrapId.replace('audio_', '').replace('_wrap', '');
        const playedInput = document.getElementById(`played_${qNum}`);
        if (playedInput) playedInput.value = '1';
      });
      audio.addEventListener('ended', function () {
        const boxId = this.getAttribute('data-box');
        const wrapId = this.getAttribute('data-wrap');
        const wrap = document.getElementById(wrapId);
        if (wrap) wrap.classList.add('d-none');
        const box = document.getElementById(boxId);
        if (box) {
          box.classList.remove('d-none');
          box.innerHTML = '<span class="played-msg">คุณได้ฟังเสียงนี้ไปแล้ว</span>';
        }
      });
    });
  }

  function renderPageNumbers() {
    const nav = document.getElementById('page-numbers');
    nav.innerHTML = '';
    for (let i = 1; i <= pageCount; i += 1) {
      const num = i <= 9 ? `[0${i}]` : `[${i}]`;
      const cls = i === currentPage ? 'current' : 'other';
      const a = document.createElement('a');
      a.className = cls;
      a.innerHTML = `<span>${num}</span>`;
      a.onclick = () => recordAndGo(i);
      nav.appendChild(a);
      if (i % 10 === 0) nav.appendChild(document.createElement('br'));
    }
  }

  function collectFormData() {
    const form = document.getElementById('quiz-form');
    const fd = new FormData(form);
    const body = { page: currentPage, time_left: timeLeft };
    fd.forEach((value, key) => {
      body[key] = value;
    });
    return body;
  }

  function recordAndGo(nextPage) {
    if (nextPage < 1) nextPage = pageCount;
    if (nextPage > pageCount) nextPage = 1;

    const body = collectFormData();
    post('/api/eol/standardtest/record', body)
      .then((res) => {
        if (res.status !== 200) {
          alert(res.message || 'บันทึกคำตอบไม่สำเร็จ');
          return;
        }
        answeredPages.add(currentPage);
        loadPage(nextPage);
      })
      .catch(() => alert('เกิดข้อผิดพลาด'));
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft < 0) timeLeft = 0;
      updateTimerDisplay();
      const hidden = document.getElementById('time-left-input');
      if (hidden) hidden.value = timeLeft;
      if (timeLeft <= 1 && !finishing) {
        finishing = true;
        clearInterval(timerInterval);
        doFinish();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    const min = Math.floor(timeLeft / 60);
    const sec = String(timeLeft % 60).padStart(2, '0');
    if (display) {
      display.innerHTML = `<b><span>เวลาที่เหลือ : <span class="text-danger">${min}</span> นาที กับ <span class="text-danger">${sec}</span> วินาที</span></b>`;
    }
  }

  function onFinishClick() {
    if (!confirm('Do you want to finish this EOL Standard Test ?')) return;
    if (finishing) return;
    finishing = true;
    if (timerInterval) clearInterval(timerInterval);
    doFinish();
  }

  function doFinish() {
    const body = collectFormData();
    post('/api/eol/standardtest/record', body)
      .then(() => post('/api/eol/standardtest/finish', { time_left: timeLeft }))
      .then((res) => {
        if (res.status !== 200) {
          alert(res.message || 'ประเมินผลไม่สำเร็จ');
          redirect('/eol/standardtest');
          return;
        }
        redirect(res.data.redirect);
      })
      .catch(() => redirect('/eol/standardtest'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
