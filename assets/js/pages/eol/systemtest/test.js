/* eslint-disable no-undef */
(function () {
  const params = new URLSearchParams(window.location.search);
  let currentQuizId = Number(params.get('quiz_id')) || 1;
  let amount = 0;
  let answeredNumbers = [];
  let timerInterval = null;
  let timeLeft = 0;
  let finishing = false;

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

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function init() {
    get('/api/eol/systemtest/status')
      .then((data) => {
        if (data.status !== 200 || !data.data.hasSession || !data.data.amount) {
          redirect('/eol/systemtest/set_test');
          return;
        }
        amount = data.data.amount;
        answeredNumbers = data.data.answeredNumbers || [];
        timeLeft = data.data.timeLeft || amount * 60;
        loadQuestion(currentQuizId);
      })
      .catch(() => redirect('/eol/systemtest/set_test'));
  }

  function loadQuestion(quizId) {
    if (quizId < 1) quizId = amount;
    if (quizId > amount) quizId = amount;
    currentQuizId = quizId;
    get(`/api/eol/systemtest/question?quiz_id=${quizId}`)
      .then((data) => {
        if (data.status !== 200) {
          redirect('/eol/systemtest/set_test');
          return;
        }
        renderQuestion(data.data);
        startTimer();
      })
      .catch(() => redirect('/eol/systemtest/set_test'));
  }

  function renderQuestion(data) {
    document.getElementById('question-skill').textContent = data.skillName;
    document.getElementById('question-number').textContent = data.quizId;
    document.getElementById('question-text').innerHTML = data.questionText;

    const mediaRow = document.getElementById('media-row');
    const mediaContent = document.getElementById('media-content');
    if (data.media) {
      mediaRow.classList.remove('d-none');
      if (data.media.type === 'text') {
        mediaContent.innerHTML = `<span>${data.media.content}</span>`;
      } else if (data.media.type === 'image') {
        mediaContent.innerHTML = `<img src="${escapeHtml(data.media.src)}" width="300">`;
      } else if (data.media.type === 'audio') {
        mediaContent.innerHTML = `<audio autoplay controls><source src="${escapeHtml(data.media.src)}" type="audio/mpeg"></audio>`;
      }
    } else {
      mediaRow.classList.add('d-none');
      mediaContent.innerHTML = '';
    }

    const list = document.getElementById('answers-list');
    list.innerHTML = '';
    data.answers.forEach((ans) => {
      const checked = Number(data.currentAnswer) === Number(ans.answerId) ? 'checked' : '';
      list.insertAdjacentHTML('beforeend', `<div class="answer-row">
        <label>
          <input type="radio" name="choose" value="${ans.answerId}" ${checked}>
          &nbsp; <span>${ans.text}</span>
        </label>
      </div>`);
    });

    document.getElementById('time-left-input').value = timeLeft;

    document.getElementById('answer-form').onsubmit = onRecordSubmit;
    document.getElementById('back-btn').onclick = () => navigateTo(currentQuizId - 1);
    document.getElementById('next-btn').onclick = () => navigateTo(currentQuizId + 1);
    document.getElementById('finish-btn').onclick = onFinishClick;

    renderNumberPad();
  }

  function renderNumberPad() {
    const pad = document.getElementById('number-pad');
    pad.innerHTML = '';
    for (let i = 1; i <= amount; i += 1) {
      const answered = answeredNumbers.includes(i);
      const btn = document.createElement('button');
      btn.className = answered ? 'answered' : 'unanswered';
      btn.textContent = i;
      btn.onclick = () => navigateTo(i);
      pad.appendChild(btn);
      if (i % 20 === 0) pad.appendChild(document.createElement('br'));
    }
  }

  function navigateTo(quizId) {
    if (quizId < 1) quizId = amount;
    if (quizId > amount) quizId = 1;
    const url = new URL(window.location.href);
    url.searchParams.set('quiz_id', quizId);
    window.history.replaceState({}, '', url.toString());
    loadQuestion(quizId);
  }

  function onRecordSubmit(e) {
    e.preventDefault();
    const selected = document.querySelector('input[name="choose"]:checked');
    const answerId = selected ? selected.value : null;
    recordAnswer(currentQuizId, answerId, timeLeft, (nextId) => navigateTo(nextId));
  }

  function recordAnswer(quizId, answerId, left, callback) {
    post('/api/eol/systemtest/record', {
      quiz_id: quizId,
      answer_id: answerId,
      time_left: left,
    })
      .then((data) => {
        if (data.status !== 200) {
          alert(data.message || 'บันทึกคำตอบไม่สำเร็จ');
          return;
        }
        if (answerId && !answeredNumbers.includes(quizId)) answeredNumbers.push(quizId);
        else if (!answerId && answeredNumbers.includes(quizId)) answeredNumbers = answeredNumbers.filter((n) => n !== quizId);
        if (callback) callback(data.data.nextQuizId);
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
    if (!confirm('ต้องการส่งคำตอบและประเมินผล?')) return;
    if (finishing) return;
    finishing = true;
    if (timerInterval) clearInterval(timerInterval);
    doFinish();
  }

  function doFinish() {
    post('/api/eol/systemtest/finish', { time_left: timeLeft })
      .then((data) => {
        if (data.status !== 200) {
          alert(data.message || 'ประเมินผลไม่สำเร็จ');
          redirect('/eol/systemtest/set_test');
          return;
        }
        redirect(data.data.redirect);
      })
      .catch(() => redirect('/eol/systemtest/set_test'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
