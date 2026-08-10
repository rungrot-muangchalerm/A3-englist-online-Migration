const params = new URLSearchParams(window.location.search);
const memberId = params.get('member_id') || '';
const resultId = params.get('result_id') || '';
const start = params.get('start') || '';
const stop = params.get('stop') || '';

const memberIdParam = memberId ? `&member_id=${encodeURIComponent(memberId)}` : '';
const memberIdQuery = memberId ? `?member_id=${encodeURIComponent(memberId)}` : '';

function showList() {
  const el = document.getElementById('report-standard-layout');
  if (el) el.classList.remove('d-none');
}

function showDetail() {
  const el = document.getElementById('report-standard-detail');
  if (el) el.classList.remove('d-none');
}

function clearContainerKeepTemplates(id) {
  const container = document.getElementById(id);
  if (!container) return;
  Array.from(container.childNodes).forEach((node) => {
    if (node.nodeName !== 'TEMPLATE') node.remove();
  });
}

function renderFocusBar(focus) {
  const container = document.getElementById('report-focus-bar');
  const template = document.getElementById('report-focus-bar-template');
  if (!container || !template) return;
  Array.from(container.childNodes).forEach((node) => {
    if (node.nodeName !== 'TEMPLATE') node.remove();
  });
  const clone = template.content.cloneNode(true);
  const focusName = clone.querySelector('.focus-name');
  if (focusName) {
    focusName.textContent = `${focus.fname || ''} ${focus.lname || ''}`.trim();
  }
  container.appendChild(clone);
}

function renderStandardLayout() {
  const layout = document.getElementById('report-standard-layout');
  if (!layout) return;
  const backArea = layout.querySelector('.back-area');
  if (backArea) backArea.href = `/eol/eoltest/report${memberIdQuery}`;
}

function renderStandardList(listData) {
  clearContainerKeepTemplates('standard-items-wrap');

  const container = document.getElementById('report-standard-layout');
  if (container) {
    const inputA = container.querySelector('#popup_eolstandard_a');
    const inputB = container.querySelector('#popup_eolstandard_b');
    if (inputA) inputA.value = listData.start;
    if (inputB) inputB.value = listData.stop;
    const viewBtn = container.querySelector('.btn-view-standard');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        const aVal = (inputA && inputA.value) || '';
        const bVal = (inputB && inputB.value) || '';
        window.location.href = `/eol/eoltest/report/standard?start=${encodeURIComponent(aVal)}&stop=${encodeURIComponent(bVal)}${memberIdParam}`;
      });
    }
  }

  const itemsWrap = document.getElementById('standard-items-wrap');
  const emptyTemplate = document.getElementById('report-standard-empty-template');
  const tableTemplate = document.getElementById('report-standard-list-table-template');
  const rowTemplate = document.getElementById('report-standard-row-template');
  if (!itemsWrap) return;

  if (!listData.items || listData.items.length === 0) {
    if (emptyTemplate) itemsWrap.appendChild(emptyTemplate.content.cloneNode(true));
  } else if (tableTemplate && rowTemplate) {
    const tableClone = tableTemplate.content.cloneNode(true);
    const tbody = tableClone.querySelector('.items-body');
    listData.items.forEach((item) => {
      const rowClone = rowTemplate.content.cloneNode(true);
      const dateEl = rowClone.querySelector('.std-date');
      if (dateEl) dateEl.textContent = item.createDate;
      const percentEl = rowClone.querySelector('.std-percent');
      if (percentEl) percentEl.textContent = item.percent;
      const link = rowClone.querySelector('.std-link');
      if (link) link.href = `/eol/eoltest/report/standard?result_id=${encodeURIComponent(item.resultId)}${memberIdParam}`;
      if (tbody) tbody.appendChild(rowClone);
    });
    itemsWrap.appendChild(tableClone);
  }

  if (typeof window.Epoch === 'function') {
    try {
      const aInput = container && container.querySelector('#popup_eolstandard_a');
      const bInput = container && container.querySelector('#popup_eolstandard_b');
      if (aInput) new window.Epoch('epoch_popup', 'popup', aInput);
      if (bInput) new window.Epoch('epoch_popup', 'popup', bInput);
    } catch (e) {
      // ignore
    }
  }
}

function renderStandardDetail(d) {
  const container = document.getElementById('report-standard-detail');
  if (!container) return;

  const avatar = container.querySelector('.detail-avatar');
  if (avatar) {
    avatar.src = d.avatar;
    avatar.height = d.avatarHeight;
    avatar.onerror = function () {
      this.onerror = null;
      this.src = `/assets/2010/member_images/icon_user_0${d.gender || 1}.jpg`;
    };
  }
  const fname = container.querySelector('.detail-fname');
  if (fname) fname.textContent = d.fname;
  const lname = container.querySelector('.detail-lname');
  if (lname) lname.textContent = d.lname;
  const dateEl = container.querySelector('.detail-date');
  if (dateEl) dateEl.textContent = d.createDate;
  const testType = container.querySelector('.detail-test-type');
  if (testType) testType.textContent = d.testType;
  const pass = container.querySelector('.detail-pass');
  if (pass) pass.textContent = d.allPass;
  const wrong = container.querySelector('.detail-wrong');
  if (wrong) wrong.textContent = d.allWrong;
  const unans = container.querySelector('.detail-unans');
  if (unans) unans.textContent = d.allUnans;
  const percent = container.querySelector('.detail-percent');
  if (percent) percent.textContent = d.percent;

  const skillsTable = document.getElementById('standard-skills-table');
  if (skillsTable) {
    const rows = skillsTable.querySelectorAll('tr');
    rows.forEach((tr, idx) => { if (idx > 0) tr.remove(); });
    const skillTemplate = document.getElementById('report-standard-skill-template');
    if (skillTemplate && d.skills) {
      d.skills.forEach((s) => {
        const sClone = skillTemplate.content.cloneNode(true);
        const label = sClone.querySelector('.skill-label');
        if (label) label.textContent = s.label;
        const correct = sClone.querySelector('.skill-correct');
        if (correct) correct.textContent = s.correct;
        const wrongEl = sClone.querySelector('.skill-wrong');
        if (wrongEl) wrongEl.textContent = s.wrong;
        const unansEl = sClone.querySelector('.skill-unans');
        if (unansEl) unansEl.textContent = s.unans;
        const level = sClone.querySelector('.skill-level');
        if (level) level.innerHTML = s.level;
        const score = sClone.querySelector('.skill-score');
        if (score) score.textContent = s.score;
        const total = sClone.querySelector('.skill-total');
        if (total) total.textContent = s.total;
        skillsTable.appendChild(sClone);
      });
    }
  }

  clearContainerKeepTemplates('score-comparison-wrap');
  const scoreTemplate = document.getElementById('report-score-comparison-template');
  const scoreWrap = document.getElementById('score-comparison-wrap');
  if (scoreTemplate && scoreWrap && d.scoreTable) {
    const scoreClone = scoreTemplate.content.cloneNode(true);
    const c = d.scoreTable.eol;
    const m = d.scoreTable.toeic;
    const g = d.scoreTable.cutepToeflItpToeflIbtIelts;
    const cc = d.scoreTable.cefr;

    const topEl = scoreClone.querySelector('.score-top');
    if (topEl) {
      const value = d.scoreTable.topScoreColor;
      if (value === 'bgcolor_ffe0e0') topEl.classList.add('bg-light');
      else if (value === 'bgcolor_C4FAFC') topEl.classList.add('bg-light');
      else if (value === 'bgcolor_E2F9F9') topEl.classList.add('bg-light');
      else topEl.classList.add('bg-light');
    }
    for (let i = 1; i <= 11; i += 1) {
      const el = scoreClone.querySelector(`.score-c-${i}`);
      if (el && c) {
        const value = c[i];
        if (value === 'bgcolor_ffe0e0') el.classList.add('bg-light');
        else if (value === 'bgcolor_C4FAFC') el.classList.add('bg-light');
        else if (value === 'bgcolor_E2F9F9') el.classList.add('bg-light');
        else el.classList.add('bg-light');
      }
    }
    for (let i = 1; i <= 7; i += 1) {
      const el = scoreClone.querySelector(`.score-m-${i}`);
      if (el && m) {
        const value = m[i];
        if (value === 'bgcolor_ffe0e0') el.classList.add('bg-light');
        else if (value === 'bgcolor_C4FAFC') el.classList.add('bg-light');
        else if (value === 'bgcolor_E2F9F9') el.classList.add('bg-light');
        else el.classList.add('bg-light');
      }
    }
    for (let i = 1; i <= 5; i += 1) {
      const el = scoreClone.querySelector(`.score-g-${i}`);
      if (el && g) {
        const value = g[i];
        if (value === 'bgcolor_ffe0e0') el.classList.add('bg-light');
        else if (value === 'bgcolor_C4FAFC') el.classList.add('bg-light');
        else if (value === 'bgcolor_E2F9F9') el.classList.add('bg-light');
        else el.classList.add('bg-light');
      }
    }
    for (let i = 1; i <= 6; i += 1) {
      const el = scoreClone.querySelector(`.score-cc-${i}`);
      if (el && cc) {
        const value = cc[i];
        if (value === 'bgcolor_ffe0e0') el.classList.add('bg-light');
        else if (value === 'bgcolor_C4FAFC') el.classList.add('bg-light');
        else if (value === 'bgcolor_E2F9F9') el.classList.add('bg-light');
        else el.classList.add('bg-light');
      }
    }
    scoreWrap.appendChild(scoreClone);
  }
}

function renderStandard() {
  const url = `/api/eol/report/standard?member_id=${encodeURIComponent(memberId)}&result_id=${encodeURIComponent(resultId)}&start=${encodeURIComponent(start)}&stop=${encodeURIComponent(stop)}`;
  fetch(url, {
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status !== 200) {
        console.log(data);
        return;
      }
      renderFocusBar(data.data.focus);
      renderStandardLayout();
      if (resultId) {
        document.getElementById('report-standard-layout').classList.add('d-none');
        showDetail();
        renderStandardDetail(data.data.detail);
      } else {
        document.getElementById('report-standard-detail').classList.add('d-none');
        showList();
        renderStandardList(data.data.list);
      }
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderStandard);
} else {
  renderStandard();
}
