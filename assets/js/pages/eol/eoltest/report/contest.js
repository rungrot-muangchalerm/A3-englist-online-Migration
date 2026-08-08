const params = new URLSearchParams(window.location.search);
const memberId = params.get('member_id') || '';
const resultId = params.get('result_id') || '';
const type = params.get('type') || '1';
const start = params.get('start') || '';
const stop = params.get('stop') || '';

const memberIdParam = memberId ? `&member_id=${encodeURIComponent(memberId)}` : '';
const memberIdQuery = memberId ? `?member_id=${encodeURIComponent(memberId)}` : '';

function showList() {
  const el = document.getElementById('report-contest-layout');
  if (el) el.style.display = '';
}

function showDetail() {
  const el = document.getElementById('report-contest-detail');
  if (el) el.style.display = '';
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

function renderContestLayout() {
  const layout = document.getElementById('report-contest-layout');
  if (!layout) return;
  const backArea = layout.querySelector('.back-area');
  if (backArea) backArea.href = `/eol/eoltest/report${memberIdQuery}`;
}

function renderContestList(listData) {
  clearContainerKeepTemplates('contest-items-wrap');

  const container = document.getElementById('report-contest-layout');
  let inputA;
  let inputB;
  if (container) {
    inputA = container.querySelector('#popup_container_contest_a');
    inputB = container.querySelector('#popup_container_contest_b');
    if (inputA) inputA.value = listData.start ? listData.start.slice(0, 10) : '';
    if (inputB) inputB.value = listData.stop ? listData.stop.slice(0, 10) : '';
    const viewBtn = container.querySelector('.btn-view-contest');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        const aVal = (inputA && inputA.value) || '';
        const bVal = (inputB && inputB.value) || '';
        window.location.href = `/eol/eoltest/report/contest?start=${encodeURIComponent(aVal)}&stop=${encodeURIComponent(bVal)}${memberIdParam}`;
      });
    }
  }

  const itemsWrap = document.getElementById('contest-items-wrap');
  const emptyTemplate = document.getElementById('report-contest-empty-template');
  const tableTemplate = document.getElementById('report-contest-table-template');
  const rowTemplate = document.getElementById('report-contest-row-template');
  if (!itemsWrap) return;

  if (!listData.items || listData.items.length === 0) {
    if (emptyTemplate) itemsWrap.appendChild(emptyTemplate.content.cloneNode(true));
  } else if (tableTemplate && rowTemplate) {
    const tableClone = tableTemplate.content.cloneNode(true);
    const table = tableClone.querySelector('.tb-list-score-contest');
    listData.items.forEach((item) => {
      const rowClone = rowTemplate.content.cloneNode(true);
      const link = rowClone.querySelector('.contest-link');
      if (link) {
        link.href = `/eol/eoltest/report/contest?result_id=${encodeURIComponent(item.resultId)}&type=1${memberIdParam}`;
        link.textContent = item.createDate;
        link.setAttribute('title', item.examName);
      }
      const percent = rowClone.querySelector('.contest-percent');
      if (percent) percent.textContent = `${item.percent}%`;
      const bar = rowClone.querySelector('.contest-bar');
      if (bar) {
        bar.style.width = `${item.percent}%`;
        bar.setAttribute('title', item.examName);
      }
      if (table) table.appendChild(rowClone);
    });
    itemsWrap.appendChild(tableClone);
  }

  if (typeof window.Epoch === 'function') {
    try {
      if (inputA) new window.Epoch('epoch_popup', 'popup', inputA);
      if (inputB) new window.Epoch('epoch_popup', 'popup', inputB);
    } catch (e) {
      // ignore
    }
  }
}

function renderContestDetail(d) {
  const container = document.getElementById('report-contest-detail');
  if (!container) return;
  clearContainerKeepTemplates('contest-detail-header');
  clearContainerKeepTemplates('contest-detail-content');

  const headerContainer = document.getElementById('contest-detail-header');
  const headerTemplate = document.getElementById('report-detail-header-template');
  if (headerTemplate && headerContainer) {
    const headerClone = headerTemplate.content.cloneNode(true);
    const avatar = headerClone.querySelector('.detail-avatar');
    if (avatar) {
      avatar.src = d.avatar;
      avatar.height = d.avatarHeight;
      avatar.onerror = function () {
        this.onerror = null;
        this.src = `/assets/2010/member_images/icon_user_0${d.gender || 1}.jpg`;
      };
    }
    const fname = headerClone.querySelector('.detail-fname');
    if (fname) fname.textContent = d.fname;
    const lname = headerClone.querySelector('.detail-lname');
    if (lname) lname.textContent = d.lname;
    const dateEl = headerClone.querySelector('.detail-date');
    if (dateEl) dateEl.textContent = d.createDate;
    const sectionEl = headerClone.querySelector('.detail-section');
    if (sectionEl) sectionEl.textContent = d.sectionText;
    const amountEl = headerClone.querySelector('.detail-amount');
    if (amountEl) amountEl.textContent = d.amount;
    const totalEl = headerClone.querySelector('.detail-total');
    if (totalEl) totalEl.textContent = d.totalAmount;
    const percentEl = headerClone.querySelector('.detail-percent');
    if (percentEl) percentEl.textContent = d.percent;
    headerContainer.appendChild(headerClone);
  }

  const tabsTemplate = document.getElementById('report-type-tabs-template');
  if (tabsTemplate && headerContainer) {
    const tabsClone = tabsTemplate.content.cloneNode(true);
    const link1 = tabsClone.querySelector('.tab-link-1');
    if (link1) link1.href = `/eol/eoltest/report/contest?result_id=${encodeURIComponent(resultId)}&type=1${memberIdParam}`;
    const link2 = tabsClone.querySelector('.tab-link-2');
    if (link2) link2.href = `/eol/eoltest/report/contest?result_id=${encodeURIComponent(resultId)}&type=2${memberIdParam}`;
    const link3 = tabsClone.querySelector('.tab-link-3');
    if (link3) link3.href = `/eol/eoltest/report/contest?result_id=${encodeURIComponent(resultId)}&type=3${memberIdParam}`;
    headerContainer.appendChild(tabsClone);
  }

  const target = document.getElementById('contest-detail-content');
  if (!target) return;

  if (type === '2' && d.contestDetail) {
    const qTemplate = document.getElementById('report-contest-custom-question-template');
    const aTemplate = document.getElementById('report-contest-answer-template');
    const msgTemplate = document.getElementById('report-contest-msg-template');
    const iconTemplate = document.getElementById('report-contest-icon-template');
    if (!qTemplate) return;
    d.contestDetail.questions.forEach((q) => {
      const qClone = qTemplate.content.cloneNode(true);
      const qNo = qClone.querySelector('.q-no');
      if (qNo) qNo.textContent = q.no;
      const qText = qClone.querySelector('.q-text');
      if (qText) qText.textContent = q.questionText;
      const answersBody = qClone.querySelector('.answers-body');
      q.answers.forEach((a) => {
        const aClone = aTemplate.content.cloneNode(true);
        const radio = aClone.querySelector('.answer-radio');
        if (radio) radio.checked = a.selected;
        const text = aClone.querySelector('.answer-text');
        if (text) text.textContent = a.text;
        if (answersBody) answersBody.appendChild(aClone);
      });
      const msgClone = msgTemplate.content.cloneNode(true);
      const msgText = msgClone.querySelector('.msg-text');
      if (msgText) {
        msgText.setAttribute('color', q.isCorrect ? 'green' : 'red');
        msgText.textContent = q.isCorrect ? "It's a correct answer." : "It's an incorrect answer.";
      }
      const msgCell = qClone.querySelector('.msg-cell');
      if (msgCell) msgCell.appendChild(msgClone);
      const iconClone = iconTemplate.content.cloneNode(true);
      const img = iconClone.querySelector('img');
      if (img) img.src = q.isCorrect ? '/assets/2010/temp_images/icon_correct.jpg' : '/assets/2010/temp_images/icon_incorrect.jpg';
      const iconCell = qClone.querySelector('.icon-cell');
      if (iconCell) iconCell.appendChild(iconClone);
      target.appendChild(qClone);
    });
  } else if (type === '2' && d.testDetail) {
    const qTemplate = document.getElementById('report-test-question-template');
    const aTemplate = document.getElementById('report-test-answer-template');
    const iconTemplate = document.getElementById('report-test-icon-template');
    const msgTemplate = document.getElementById('report-test-msg-template');
    if (!qTemplate) return;
    d.testDetail.questions.forEach((q) => {
      const qClone = qTemplate.content.cloneNode(true);
      const relateCell = qClone.querySelector('.relate-cell');
      const relateRow = qClone.querySelector('.relate-row');
      if (q.relateType === 1) {
        if (relateRow) relateRow.style.display = '';
        const tClone = document.getElementById('report-test-relate-text-template').content.cloneNode(true);
        const t = tClone.querySelector('.relate-text');
        if (t) t.textContent = q.relateText;
        if (relateCell) relateCell.appendChild(tClone);
      } else if (q.relateType === 2) {
        if (relateRow) relateRow.style.display = '';
        const tClone = document.getElementById('report-test-relate-image-template').content.cloneNode(true);
        const img = tClone.querySelector('img');
        if (img) img.src = q.relateText;
        if (relateCell) relateCell.appendChild(tClone);
      } else if (q.relateType === 3) {
        if (relateRow) relateRow.style.display = '';
        const tClone = document.getElementById('report-test-relate-audio-template').content.cloneNode(true);
        const source = tClone.querySelector('source');
        if (source) source.src = `https://www.engtest.net/files/sound/${q.relateText}`;
        if (relateCell) relateCell.appendChild(tClone);
      }
      const qNo = qClone.querySelector('.q-no');
      if (qNo) qNo.textContent = q.no;
      const qText = qClone.querySelector('.q-text');
      if (qText) qText.textContent = q.questionText;

      const answersContainer = qClone.querySelector('.answers');
      q.answers.forEach((a) => {
        const aClone = aTemplate.content.cloneNode(true);
        const textEl = aClone.querySelector('.answer-text');
        if (textEl) {
          textEl.textContent = `${a.index}.  ${a.text}`;
          if (a.selected) {
            textEl.setAttribute('color', 'orange');
            textEl.style.fontWeight = 'bold';
          }
        }
        if (answersContainer) answersContainer.appendChild(aClone);
      });

      const msgAEl = qClone.querySelector('.msg-a');
      const msgBEl = qClone.querySelector('.msg-b');
      if (q.unanswered) {
        if (msgAEl) msgAEl.textContent = "It's unanswered";
      } else {
        if (msgAEl) msgAEl.textContent = `Your answer is ${q.selectedIndex}. `;
        const msgClone = msgTemplate.content.cloneNode(true);
        const msgText = msgClone.querySelector('.msg-text');
        if (msgText) {
          msgText.setAttribute('color', q.isCorrect ? 'green' : 'red');
          msgText.textContent = q.isCorrect ? "It's a correct answer." : "It's an incorrect answer.";
        }
        if (msgBEl) msgBEl.appendChild(msgClone);
      }

      const iconCell = qClone.querySelector('.icon-cell');
      if (iconCell) {
        const iconClone = iconTemplate.content.cloneNode(true);
        const img = iconClone.querySelector('img');
        if (img) img.src = q.isCorrect ? '/assets/2010/temp_images/icon_correct.jpg' : '/assets/2010/temp_images/icon_incorrect.jpg';
        iconCell.appendChild(iconClone);
      }

      const reasonName = qClone.querySelector('.reason-name');
      if (reasonName) reasonName.textContent = q.reasonName;
      const lessonLink = qClone.querySelector('.lesson-link');
      if (lessonLink) lessonLink.href = `/eol/elearning_switch?reason_id=${q.detailId}&skill_id=${q.skillId}`;
      if (q.description) {
        qClone.querySelectorAll('.description-row').forEach((row) => { row.style.display = ''; });
        const desc = qClone.querySelector('.description-text');
        if (desc) desc.textContent = q.description;
      }
      target.appendChild(qClone);
    });
  } else if (type === '3' && d.viewGroup) {
    if (d.viewGroup.total === 0) {
      const emptyTemplate = document.getElementById('report-view-group-empty-template');
      if (emptyTemplate) target.appendChild(emptyTemplate.content.cloneNode(true));
    } else {
      const template = document.getElementById('report-view-group-template');
      const distTemplate = document.getElementById('report-view-group-distribution-template');
      const rankTemplate = document.getElementById('report-view-group-ranking-template');
      if (!template) return;
      const clone = template.content.cloneNode(true);
      const vgTotal = clone.querySelector('.vg-total');
      if (vgTotal) vgTotal.textContent = d.viewGroup.total;
      const vgMin = clone.querySelector('.vg-min');
      if (vgMin) vgMin.textContent = d.viewGroup.min;
      const vgMax = clone.querySelector('.vg-max');
      if (vgMax) vgMax.textContent = d.viewGroup.max;
      const vgAvg = clone.querySelector('.vg-average');
      if (vgAvg) vgAvg.textContent = d.viewGroup.average;
      const distTable = clone.querySelector('.distribution-table');
      const rand = Math.floor(Math.random() * 8) + 1;
      d.viewGroup.distribution.forEach((dist) => {
        const dClone = distTemplate.content.cloneNode(true);
        const label = dClone.querySelector('.dist-label');
        if (label) label.textContent = dist.label;
        const amount = dClone.querySelector('.dist-amount');
        if (amount) amount.textContent = dist.amount;
        const bar = dClone.querySelector('.dist-bar');
        if (bar) {
          bar.src = `/assets/2010/temp_images/icon_bar/bar_0${rand}.png`;
          bar.style.width = `${dist.ratio}%`;
        }
        const ratio = dClone.querySelector('.dist-ratio');
        if (ratio) ratio.textContent = dist.ratio;
        if (distTable) distTable.appendChild(dClone);
      });
      const rankTable = clone.querySelector('.ranking-table');
      d.viewGroup.ranking.forEach((r) => {
        const rClone = rankTemplate.content.cloneNode(true);
        const row = rClone.querySelector('.rank-row');
        if (row) row.setAttribute('bgcolor', r.isFocus ? '#ffd0ff' : (r.order % 2 === 1 ? '#f7f7f7' : '#f0f0f0'));
        const order = rClone.querySelector('.rank-order');
        if (order) order.textContent = r.order;
        const fname = rClone.querySelector('.rank-fname');
        if (fname) fname.textContent = r.fname;
        const lname = rClone.querySelector('.rank-lname');
        if (lname) lname.textContent = r.lname;
        const highest = rClone.querySelector('.rank-highest');
        if (highest) highest.textContent = r.highestPercent;
        const amount = rClone.querySelector('.rank-amount');
        if (amount) amount.textContent = r.amount;
        if (rankTable) rankTable.appendChild(rClone);
      });
      target.appendChild(clone);
    }
  } else {
    if (d.chartBar) {
      const barTemplate = document.getElementById('report-chart-bar-row-template');
      const avgTemplate = document.getElementById('report-chart-bar-avg-template');
      if (barTemplate) {
        d.chartBar.bars.forEach((bar) => {
          const bClone = barTemplate.content.cloneNode(true);
          const skill = bClone.querySelector('.bar-skill');
          if (skill) skill.textContent = bar.skillName;
          const percent = bClone.querySelector('.bar-percent');
          if (percent) percent.textContent = bar.percent;
          const correct = bClone.querySelector('.bar-correct');
          if (correct) correct.textContent = bar.correct;
          const total = bClone.querySelector('.bar-total');
          if (total) total.textContent = bar.total;
          const img = bClone.querySelector('.bar-image');
          if (img) {
            img.src = `/assets/2010/temp_images/icon_bar/${bar.barImage}`;
            img.style.width = `${bar.percent}%`;
          }
          target.appendChild(bClone);
        });
      }
      if (avgTemplate) {
        const avgClone = avgTemplate.content.cloneNode(true);
        const avgPercent = avgClone.querySelector('.avg-percent');
        if (avgPercent) avgPercent.textContent = d.chartBar.averagePercent;
        const avgCorrect = avgClone.querySelector('.avg-correct');
        if (avgCorrect) avgCorrect.textContent = d.chartBar.averageCorrect;
        const avgTotal = avgClone.querySelector('.avg-total');
        if (avgTotal) avgTotal.textContent = d.chartBar.averageTotal;
        const avgBar = avgClone.querySelector('.avg-bar');
        if (avgBar) avgBar.style.width = `${d.chartBar.averagePercent}%`;
        target.appendChild(avgClone);
      }
    }
    if (d.weakPoint) {
      const wpTemplate = document.getElementById('report-weak-point-template');
      const wpSkillTemplate = document.getElementById('report-weak-point-skill-template');
      const wpGroupTemplate = document.getElementById('report-weak-point-skill-group-template');
      const wpItemTemplate = document.getElementById('report-weak-point-item-template');
      if (wpTemplate && wpSkillTemplate && wpGroupTemplate && wpItemTemplate) {
        const wpClone = wpTemplate.content.cloneNode(true);
        const wpContainer = wpClone.querySelector('.weak-point-skills');
        if (wpContainer) wpContainer.appendChild(wpSkillTemplate.content.cloneNode(true));
        d.weakPoint.forEach((skill) => {
          const groupClone = wpGroupTemplate.content.cloneNode(true);
          const skillName = groupClone.querySelector('.skill-name');
          if (skillName) skillName.textContent = skill.skillName;
          const itemsContainer = groupClone.querySelector('.skill-items');
          let lastSskill = null;
          skill.items.forEach((item) => {
            const showSskill = lastSskill !== item.sskillId;
            lastSskill = item.sskillId;
            const itemClone = wpItemTemplate.content.cloneNode(true);
            const sskillName = itemClone.querySelector('.sskill-name');
            if (sskillName) sskillName.textContent = showSskill ? item.sskillName : '';
            const detailLink = itemClone.querySelector('.detail-link');
            if (detailLink) detailLink.href = `/eol/elearning_switch?reason_id=${item.detailId}&skill_id=${skill.skillId}`;
            const detailName = itemClone.querySelector('.detail-name');
            if (detailName) detailName.textContent = item.detailName;
            if (itemsContainer) itemsContainer.appendChild(itemClone);
          });
          if (wpContainer) wpContainer.appendChild(groupClone);
        });
        target.appendChild(wpClone);
      }
    }
  }
}

function renderContest() {
  const url = `/api/eol/report/contest?member_id=${encodeURIComponent(memberId)}&result_id=${encodeURIComponent(resultId)}&type=${encodeURIComponent(type)}&start=${encodeURIComponent(start)}&stop=${encodeURIComponent(stop)}`;
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
      renderContestLayout();
      if (resultId) {
        showDetail();
        renderContestDetail(data.data.detail);
      } else {
        showList();
        renderContestList(data.data.list);
      }
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderContest);
} else {
  renderContest();
}
