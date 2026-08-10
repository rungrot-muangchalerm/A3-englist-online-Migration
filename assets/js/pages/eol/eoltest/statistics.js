(function () {
  function htmlEscape(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function showView(id) {
    const views = document.querySelectorAll('.eol-view');
    views.forEach((v) => { v.classList.add('d-none'); });
    const target = document.getElementById(id);
    if (target) target.classList.remove('d-none');
  }
  function reloadCurrent(extra) {
    const q = new URLSearchParams(window.location.search);
    q.delete('status');
    q.delete('action');
    if (extra) {
      for (const [k, v] of Object.entries(extra)) {
        if (v === null || v === undefined || v === '') q.delete(k);
        else q.set(k, v);
      }
    }
    const qs = q.toString();
    window.location.href = window.location.pathname + (qs ? `?${qs}` : '');
  }

  function formatStatisticsDateInput(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function getStatisticsDefaultRange() {
    const stop = new Date();
    stop.setDate(stop.getDate() + 1);
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start: formatStatisticsDateInput(start), stop: formatStatisticsDateInput(stop) };
  }

  function renderStatisticsOverview(apiData) {
    const range = apiData.start && apiData.stop ? { start: apiData.start, stop: apiData.stop } : getStatisticsDefaultRange();
    document.getElementById('statistics-start').value = range.start;
    document.getElementById('statistics-stop').value = range.stop;

    const groupSelect = document.getElementById('statistics-group-id');
    while (groupSelect.options.length > 0) groupSelect.remove(0);
    (apiData.groups || []).forEach((g) => {
      const opt = document.createElement('option');
      opt.value = g.type_id;
      opt.textContent = `${g.name} [ ${g.count} ]`;
      if (String(g.type_id) === String(apiData.selectedGroupId)) opt.selected = true;
      groupSelect.appendChild(opt);
    });

    const container = document.getElementById('statistics-members');
    while (container.firstChild) container.removeChild(container.firstChild);

    const members = apiData.members || [];
    if (members.length === 0) {
      document.getElementById('statistics-empty').classList.remove('d-none');
      document.getElementById('statistics-export').classList.add('d-none');
    } else {
      document.getElementById('statistics-empty').classList.add('d-none');
      document.getElementById('statistics-export').classList.remove('d-none');

      const memberTemplate = document.getElementById('statistics-member-template');
      const headerTemplate = document.getElementById('statistics-member-header-template');
      const skillRowTemplate = document.getElementById('statistics-skill-row-template');
      const historyTemplate = document.getElementById('statistics-history-template');
      const historyRowTemplate = document.getElementById('statistics-history-row-template');

      members.forEach((m, idx) => {
        const memberClone = memberTemplate.content.cloneNode(true);
        const memberBody = memberClone.querySelector('.statistics-member-body');

        const headerClone = headerTemplate.content.cloneNode(true);
        headerClone.querySelector('[data-role="no"]').textContent = `${idx + 1}.`;
        headerClone.querySelector('[data-role="name"]').textContent = `${m.fname || ''} \u00A0\u00A0 ${m.lname || ''}`;
        headerClone.querySelector('[data-role="report-link"]').href = `/eol/eoltest/report?member_id=${encodeURIComponent(m.member_id)}`;
        memberBody.appendChild(headerClone);

        (m.skills || []).forEach((skill) => {
          const skillClone = skillRowTemplate.content.cloneNode(true);
          skillClone.querySelector('[data-role="skill-name"]').textContent = `${skill.name} \u00A0\u00A0`;
          skill.levels.forEach((lvl) => {
            const cell = skillClone.querySelector(`[data-role="level-${lvl.level_id}"]`);
            cell.textContent = `${lvl.most_percent + 0} % [ ${lvl.amount + 0} ] \u00A0`;
          });
          memberBody.appendChild(skillClone);
        });

        const expandRow = document.createElement('tr');
        expandRow.innerHTML = `
          <td width="5%" class="text-center bg-secondary-subtle">
            <img data-member="${m.member_id}" data-role="icon-plus" class="pe-auto" src="/assets/2010/temp_images/icon_plus.jpg" width="20" title="Click Here to view refill history">
            <img data-member="${m.member_id}" data-role="icon-sub" class="d-none pe-auto" src="/assets/2010/temp_images/icon_sub.jpg" width="20">
          </td>
          <td colspan="6" class="bg-body-secondary"></td>
        `;
        memberBody.appendChild(expandRow);

        const historyClone = historyTemplate.content.cloneNode(true);
        const historyTable = historyClone.querySelector('[data-role="history-table"]');
        historyTable.id = `statistics-history-${m.member_id}`;
        const historyRowsContainer = historyClone.querySelector('[data-role="history-rows"]');
        if (!m.history || !m.history.rows || m.history.rows.length === 0) {
          const emptyRow = document.createElement('tr');
          emptyRow.innerHTML = '<td colspan="5" class="text-center"><span class="text-danger">ไม่พบข้อมูล</span></td>';
          historyRowsContainer.appendChild(emptyRow);
        } else {
          m.history.rows.forEach((row) => {
            const rowClone = historyRowTemplate.content.cloneNode(true);
            rowClone.querySelector('[data-role="date-text"]').textContent = row.date_text;
            rowClone.querySelector('[data-role="start-time"]').textContent = row.start_time;
            rowClone.querySelector('[data-role="stop-time"]').textContent = row.stop_time;
            const tests = Array.isArray(row.tests) ? row.tests : [row.tests];
            rowClone.querySelector('[data-role="tests"]').innerHTML = tests.map((t) => htmlEscape(t)).join('<br>');
            rowClone.querySelector('[data-role="duration-text"]').innerHTML = row.duration_text || '';
            historyRowsContainer.appendChild(rowClone);
          });
          historyClone.querySelector('[data-role="total-text"]').innerHTML = m.history.total_text || '';
        }

        const historyRow = document.createElement('tr');
        historyRow.classList.add('d-none');
        historyRow.dataset.role = 'history-row';
        historyRow.dataset.member = m.member_id;
        const historyCell = document.createElement('td');
        historyCell.colSpan = 7;
        historyCell.appendChild(historyTable);
        historyRow.appendChild(historyCell);
        memberBody.appendChild(historyRow);

        container.appendChild(memberClone);
      });
    }
  }

  function bindStatisticsEvents() {
    const viewBtn = document.getElementById('statistics-view-btn');
    const exportOverviewBtn = document.getElementById('statistics-export-overview-btn');
    const exportUsageBtn = document.getElementById('statistics-export-usage-btn');
    if (exportOverviewBtn) {
      exportOverviewBtn.addEventListener('click', () => {
        window.open('/EOL/export_overview_test_and_evaluation.php');
      });
    }
    if (exportUsageBtn) {
      exportUsageBtn.addEventListener('click', () => {
        window.open('/EOL/export_usage_history.php', '_blank');
      });
    }
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        const start = document.getElementById('statistics-start').value;
        const stop = document.getElementById('statistics-stop').value;
        const groupId = document.getElementById('statistics-group-id').value;
        reloadCurrent({ view: 'group', start, stop, group_id: groupId });
      });
    }

    const evaluationViewBtn = document.getElementById('evaluation-view-btn');
    if (evaluationViewBtn) {
      evaluationViewBtn.addEventListener('click', () => {
        const start = document.getElementById('evaluation-start').value;
        const stop = document.getElementById('evaluation-stop').value;
        const groupId = document.getElementById('evaluation-group-id').value;
        const skillId = document.getElementById('evaluation-skill-id').value;
        const levelId = document.getElementById('evaluation-level-id').value;
        const sort = document.getElementById('evaluation-sort').value;
        reloadCurrent({ view: 'graph', start, stop, group_id: groupId, skill_id: skillId, level_id: levelId, sortdata: sort });
      });
    }

    const contestViewBtn = document.getElementById('contest-view-btn');
    if (contestViewBtn) {
      contestViewBtn.addEventListener('click', () => {
        const start = document.getElementById('contest-start').value;
        const stop = document.getElementById('contest-stop').value;
        const groupId = document.getElementById('contest-group-id').value;
        const examId = document.getElementById('contest-exam-id').value;
        reloadCurrent({ view: 'contest', start, stop, group_id: groupId, group_con: examId });
      });
    }

    const tabs = document.querySelectorAll('#view-statistics .tabs li');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.role;
        if (target === 'tab-overview') {
          reloadCurrent({ view: 'group' });
          return;
        }
        if (target === 'tab-evaluation') {
          reloadCurrent({ view: 'graph' });
          return;
        }
        if (target === 'tab-contest') {
          reloadCurrent({ view: 'contest' });
          return;
        }
      });
    });

    const membersContainer = document.getElementById('statistics-members');
    if (membersContainer) {
      membersContainer.addEventListener('click', (e) => {
        const plus = e.target.closest('[data-role="icon-plus"]');
        const sub = e.target.closest('[data-role="icon-sub"]');
        if (!plus && !sub) return;
        const memberId = (plus || sub).dataset.member;
        const row = membersContainer.querySelector(`tr[data-role="history-row"][data-member="${memberId}"]`);
        if (!row) return;
        const icons = membersContainer.querySelectorAll(`img[data-member="${memberId}"]`);
        if (plus) {
          row.classList.remove('d-none');
          icons.forEach((img) => {
            if (img.dataset.role === 'icon-plus') img.classList.add('d-none');
            if (img.dataset.role === 'icon-sub') img.classList.remove('d-none');
          });
        } else {
          row.classList.add('d-none');
          icons.forEach((img) => {
            if (img.dataset.role === 'icon-plus') img.classList.remove('d-none');
            if (img.dataset.role === 'icon-sub') img.classList.add('d-none');
          });
        }
      });
    }
  }

  function initStatisticsOverview() {
    bindStatisticsEvents();
    fetch(`/api/eol/statistics/overview${window.location.search}`, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== 200) {
          console.log(data);
          return;
        }
        renderStatisticsOverview(data.data);
        if (typeof window.Epoch === 'function') {
          try {
            new window.Epoch('epoch_popup', 'popup', document.getElementById('statistics-start'));
            new window.Epoch('epoch_popup', 'popup', document.getElementById('statistics-stop'));
          } catch (e) { /* ignore */ }
        }
      });
  }

  function renderStatisticsEvaluation(apiData) {
    document.getElementById('evaluation-start').value = apiData.start || '';
    document.getElementById('evaluation-stop').value = apiData.stop || '';
    document.getElementById('evaluation-skill-id').value = String(apiData.selectedSkillId || 1);
    document.getElementById('evaluation-level-id').value = String(apiData.selectedLevelId || 1);
    document.getElementById('evaluation-sort').value = String(apiData.sortData || 1);
    document.querySelector('[data-role="evaluation-title"]').textContent = ` ${apiData.skillName || ''} ➤ ${apiData.levelName || ''} `;

    const groupSelect = document.getElementById('evaluation-group-id');
    while (groupSelect.options.length > 0) groupSelect.remove(0);
    (apiData.groups || []).forEach((g) => {
      const opt = document.createElement('option');
      opt.value = g.type_id;
      opt.textContent = `${g.name} [ ${g.count} ]`;
      if (String(g.type_id) === String(apiData.selectedGroupId)) opt.selected = true;
      groupSelect.appendChild(opt);
    });

    const rowsContainer = document.getElementById('evaluation-rows');
    while (rowsContainer.firstChild) rowsContainer.removeChild(rowsContainer.firstChild);

    const results = apiData.results || [];
    if (results.length === 0) {
      document.getElementById('evaluation-empty').classList.remove('d-none');
    } else {
      document.getElementById('evaluation-empty').classList.add('d-none');
      const rowTemplate = document.getElementById('statistics-evaluation-row-template');
      results.forEach((r, idx) => {
        const clone = rowTemplate.content.cloneNode(true);
        clone.querySelector('[data-role="no"]').textContent = idx + 1;
        clone.querySelector('[data-role="date"]').textContent = r.create_date;
        clone.querySelector('[data-role="name"]').textContent = `${r.fname || ''}    ${r.lname || ''}`;
        clone.querySelector('[data-role="percent"]').textContent = `${r.percent} %`;
        clone.querySelector('[data-role="score"]').textContent = `${r.correct} / ${r.total} ข้อ`;
        const bar = clone.querySelector('[data-role="bar"]');
        bar.width = Math.max(0, r.percent * 4);
        const reportLink = clone.querySelector('[data-role="report-link"]');
        reportLink.href = `/eol/eoltest/report/academic?result_id=${encodeURIComponent(r.result_id)}&member_id=${encodeURIComponent(r.member_id)}`;
        rowsContainer.appendChild(clone);
      });
    }
  }

  function initStatisticsEvaluation() {
    bindStatisticsEvents();
    document.querySelectorAll('#view-statistics .tabs li').forEach((t) => t.classList.remove('active'));
    const evalTab = document.querySelector('[data-role="tab-evaluation"]');
    if (evalTab) evalTab.classList.add('active');
    document.querySelector('[data-role="statistics-overview-panel"]').classList.add('d-none');
    document.querySelector('[data-role="statistics-evaluation-panel"]').classList.remove('d-none');
    document.querySelector('[data-role="statistics-contest-panel"]').classList.add('d-none');

    fetch(`/api/eol/statistics/evaluation${window.location.search}`, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== 200) {
          console.log(data);
          return;
        }
        renderStatisticsEvaluation(data.data);
        if (typeof window.Epoch === 'function') {
          try {
            new window.Epoch('epoch_popup', 'popup', document.getElementById('evaluation-start'));
            new window.Epoch('epoch_popup', 'popup', document.getElementById('evaluation-stop'));
          } catch (e) { /* ignore */ }
        }
      });
  }

  function renderStatisticsContest(apiData) {
    document.getElementById('contest-start').value = apiData.start || '';
    document.getElementById('contest-stop').value = apiData.stop || '';

    const groupSelect = document.getElementById('contest-group-id');
    while (groupSelect.options.length > 0) groupSelect.remove(0);
    (apiData.groups || []).forEach((g) => {
      const opt = document.createElement('option');
      opt.value = g.type_id;
      opt.textContent = `${g.name} [ ${g.count} ]`;
      if (String(g.type_id) === String(apiData.selectedGroupId)) opt.selected = true;
      groupSelect.appendChild(opt);
    });

    const examSelect = document.getElementById('contest-exam-id');
    while (examSelect.options.length > 0) examSelect.remove(0);
    (apiData.contests || []).forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c.exam_id;
      opt.textContent = c.exam_name;
      if (String(c.exam_id) === String(apiData.selectedContestId)) opt.selected = true;
      examSelect.appendChild(opt);
    });

    document.querySelector('[data-role="contest-head"]').textContent = `\u00A0${apiData.examName || ''}`;

    const rowsContainer = document.getElementById('contest-rows');
    while (rowsContainer.firstChild) rowsContainer.removeChild(rowsContainer.firstChild);

    const results = apiData.results || [];
    const emptyRows = document.querySelectorAll('[data-role="contest-empty"]');
    emptyRows.forEach((row) => { if (results.length === 0 ) row.classList.remove('d-none'); else row.classList.add('d-none'); });

    if (results.length > 0) {
      results.forEach((r, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'align-middle';
        tr.innerHTML = `
          <td width="2%" class="text-center"><span><b>${idx + 1}</b></span></td>
          <td width="20%" class="text-center">
            <span>
              <a target="_blank" href="/eol/eoltest/report/contest?result_id=${encodeURIComponent(r.result_id)}&member_id=${encodeURIComponent(r.member_id)}">
                <b>${htmlEscape(r.create_date)}</b>
              </a>
            </span>
          </td>
          <td width="20%" class="text-center"><span>${htmlEscape(`${r.fname || ''}    ${r.lname || ''}`)}</span></td>
          <td class="text-start"><img src="/assets/2010/temp_images/icon_bar/bar_07.png" width="${Math.max(0, (r.percent || 0) * 4)}" height="20" class="rounded"></td>
          <td width="10%" class="text-center"><span><b>${(r.percent || 0)} %</b></span></td>
        `;
        rowsContainer.appendChild(tr);
      });
    }

    const scoreboardLink = document.querySelector('[data-role="contest-scoreboard-link"]');
    if (scoreboardLink) {
      scoreboardLink.href = apiData.scoreboardUrl || '';
      if (apiData.scoreboardUrl ) scoreboardLink.classList.remove('d-none'); else scoreboardLink.classList.add('d-none');
    }

    const exportForm = document.getElementById('contest-export-form');
    if (exportForm) {
      if (results.length > 0 ) exportForm.classList.remove('d-none'); else exportForm.classList.add('d-none');
      const groupInput = exportForm.querySelector('[data-role="contest-export-group"]');
      const startInput = exportForm.querySelector('[data-role="contest-export-start"]');
      const stopInput = exportForm.querySelector('[data-role="contest-export-stop"]');
      const nameInput = exportForm.querySelector('[data-role="contest-export-exam-name"]');
      const idInput = exportForm.querySelector('[data-role="contest-export-exam-id"]');
      if (groupInput) groupInput.value = apiData.selectedGroupId || '';
      if (startInput) startInput.value = apiData.start || '';
      if (stopInput) stopInput.value = apiData.stop || '';
      if (nameInput) nameInput.value = apiData.examName || '';
      if (idInput) idInput.value = apiData.selectedContestId || '';
    }
  }

  function initStatisticsContest() {
    bindStatisticsEvents();
    document.querySelectorAll('#view-statistics .tabs li').forEach((t) => t.classList.remove('active'));
    const contestTab = document.querySelector('[data-role="tab-contest"]');
    if (contestTab) contestTab.classList.add('active');
    document.querySelector('[data-role="statistics-overview-panel"]').classList.add('d-none');
    document.querySelector('[data-role="statistics-evaluation-panel"]').classList.add('d-none');
    document.querySelector('[data-role="statistics-contest-panel"]').classList.remove('d-none');

    fetch(`/api/eol/statistics/contest${window.location.search}`, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== 200) {
          console.log(data);
          return;
        }
        renderStatisticsContest(data.data);
        if (typeof window.Epoch === 'function') {
          try {
            new window.Epoch('epoch_popup', 'popup', document.getElementById('contest-start'));
            new window.Epoch('epoch_popup', 'popup', document.getElementById('contest-stop'));
          } catch (e) { /* ignore */ }
        }
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') || 'group';
    if (window.location.pathname.startsWith('/eol/eoltest/statistics')) {
      showView('view-statistics');
      if (view === 'graph') {
        initStatisticsEvaluation();
      } else if (view === 'contest') {
        initStatisticsContest();
      } else {
        initStatisticsOverview();
      }
    }
  });
})();
