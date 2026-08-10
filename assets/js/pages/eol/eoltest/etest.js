(function () {
  function reloadCurrent(extra) {
    const q = new URLSearchParams(window.location.search);
    if (extra) {
      for (const [k, v] of Object.entries(extra)) {
        if (v === null || v === undefined || v === '') q.delete(k);
        else q.set(k, v);
      }
    }
    window.location.href = `${window.location.pathname}?${q.toString()}`;
  }
  function showView(id) {
    const views = document.querySelectorAll('.eol-view');
    views.forEach((v) => { v.classList.add('d-none'); });
    const target = document.getElementById(id);
    if (target) target.classList.remove('d-none');
  }

  function renderEtestDetail(exam, groups, container) {
    const template = document.getElementById('etest-detail-template');
    const clone = template.content.cloneNode(true);
    const form = clone.querySelector('.etest-detail-form');
    form.querySelector('.etest-exam-id').value = exam.examId;
    form.querySelector('.etest-exam-name').value = exam.examName;
    form.querySelector('.etest-create-date').textContent = exam.createDate;
    form.querySelector('.etest-amount').textContent = exam.amount;
    form.querySelector('.etest-testtime').value = exam.testtime;
    form.querySelector(`input[name="test_type"][value="${exam.testType}"]`).checked = true;
    form.querySelector('.etest-active-check').checked = exam.active;

    const groupsDiv = clone.querySelector('.etest-groups');
    const groupTemplate = document.getElementById('etest-group-checkbox-template');

    const noneLabel = groupTemplate.content.cloneNode(true);
    const noneCb = noneLabel.querySelector('.etest-group-check');
    noneCb.value = '0';
    noneCb.checked = exam.allowGroups.indexOf('0') !== -1;
    noneLabel.querySelector('span').textContent = ' nonegroup';
    groupsDiv.appendChild(noneLabel);

    groups.forEach((g) => {
      const gclone = groupTemplate.content.cloneNode(true);
      const cb = gclone.querySelector('.etest-group-check');
      cb.value = g.type_id;
      cb.checked = exam.allowGroups.indexOf(String(g.type_id)) !== -1;
      gclone.querySelector('span').textContent = ` ${g.name}`;
      groupsDiv.appendChild(gclone);
    });

    clone.querySelector('.etest-save-btn').addEventListener('click', () => {
      const msg = clone.querySelector('.etest-message');
      msg.textContent = '';
      const body = new URLSearchParams(new FormData(form));
      fetch('/api/eol/etest/update', {
        method: 'POST',
        credentials: 'include',
        body
      })
        .then((res) => res.json())
        .then((resp) => {
          if (resp.status === 200) {
            window.location.reload();
          } else {
            msg.textContent = resp.message || 'Error';
          }
        });
    });

    clone.querySelector('.etest-delete-btn').addEventListener('click', () => {
      if (!confirm('คุณต้องการลบชุดข้อสอบหรือไม่')) return;
      fetch('/api/eol/etest/delete', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ exam_id: exam.examId }).toString(),
      })
        .then((res) => res.json())
        .then((resp) => {
          if (resp.status === 200) {
            reloadCurrent({ exam_id: null, etest_action: null });
          } else {
            alert(resp.message || 'Error');
          }
        });
    });

    container.innerHTML = '';
    container.appendChild(clone);
  }

  function renderEtestList(apiData) {
    const content = document.getElementById('etest-content');
    content.innerHTML = '';
    const template = document.getElementById('etest-list-template');
    const clone = template.content.cloneNode(true);
    const tbody = clone.querySelector('.etest-list-body');
    const rowTemplate = document.getElementById('etest-row-template');
    const detailPanel = clone.querySelector('#etest-detail-panel');

    if (apiData.list.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="5" class="p-3 text-center text-danger">ไม่มีชุดข้อสอบ</td>';
      tbody.appendChild(emptyRow);
    } else {
      apiData.list.forEach((exam, idx) => {
        const rowClone = rowTemplate.content.cloneNode(true);
        const tr = rowClone.querySelector('tr');
        if (apiData.selectedExam && exam.examId === apiData.selectedExam.examId) {
          tr.classList.add('table-info');
        } else if (idx % 2 === 1) {
          tr.classList.add('table-light');
        }
        rowClone.querySelector('.etest-select').textContent = exam.examName;
        rowClone.querySelector('.etest-select').addEventListener('click', (e) => {
          e.preventDefault();
          reloadCurrent({ exam_id: exam.examId, etest_action: null });
        });
        rowClone.querySelector('.etest-view').addEventListener('click', (e) => {
          e.preventDefault();
          reloadCurrent({ exam_id: exam.examId, etest_action: null });
        });
        rowClone.querySelector('.etest-amount').textContent = exam.amount;
        rowClone.querySelector('.etest-time').textContent = exam.testtime;
        rowClone.querySelector('.etest-active').innerHTML = exam.active
          ? '<span class="text-info">ON</span>'
          : '<span class="text-warning">OFF</span>';
        tbody.appendChild(rowClone);
      });
    }

    clone.querySelectorAll('.etest-action').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const action = link.dataset.action;
        reloadCurrent({ etest_action: action, exam_id: null });
      });
    });

    if (apiData.selectedExam) {
      renderEtestDetail(apiData.selectedExam, apiData.groups, detailPanel);
    } else {
      detailPanel.innerHTML = '<div class="p-3 text-secondary text-center">กรุณาเลือกชุดข้อสอบ</div>';
    }

    content.appendChild(clone);
  }

  function bindCreateCustomForm(customExamId, questionCount) {
    const content = document.getElementById('etest-content');
    const form = content.querySelector('.etest-create-custom-form');
    const qNoSpan = content.querySelector('.etest-q-no');
    const addBtn = content.querySelector('.etest-add-question-btn');
    const finishBtn = content.querySelector('.etest-finish-custom-btn');
    const msg = content.querySelector('.etest-message');

    function updateState(id, count) {
      customExamId = id;
      questionCount = count;
      qNoSpan.textContent = count + 1;
      finishBtn.disabled = count < 10;
      if (customExamId) {
        form.querySelector('input[name="exam_name"]').disabled = true;
      }
    }

    addBtn.addEventListener('click', () => {
      msg.textContent = '';
      const formData = new FormData(form);
      const url = customExamId ? '/api/eol/etest/question' : '/api/eol/etest/create/custom';
      const body = new URLSearchParams(formData);
      if (customExamId) body.set('exam_id', customExamId);
      fetch(url, {
        method: 'POST',
        credentials: 'include',
        body
      })
        .then((res) => res.json())
        .then((resp) => {
          if (resp.status === 200) {
            updateState(resp.data.detail.examId, resp.data.detail.amount);
            form.querySelector('textarea[name="question"]').value = '';
            form.querySelectorAll('textarea[name="choice[]"]').forEach((t) => { t.value = ''; });
            form.querySelectorAll('input[name="correct"]').forEach((r) => { r.checked = false; });
          } else {
            msg.textContent = resp.message || 'Error';
          }
        });
    });

    finishBtn.addEventListener('click', () => {
      reloadCurrent({ etest_action: null, exam_id: customExamId });
    });

    content.querySelector('.etest-back').addEventListener('click', (e) => {
      e.preventDefault();
      reloadCurrent({ etest_action: null, exam_id: null });
    });
  }

  function renderEtestCreateCustom() {
    const content = document.getElementById('etest-content');
    content.innerHTML = '';
    content.appendChild(document.getElementById('etest-create-custom-template').content.cloneNode(true));
    bindCreateCustomForm('', 0);
  }

  function renderEtestCreateSystem(topics) {
    const content = document.getElementById('etest-content');
    content.innerHTML = '';
    content.appendChild(document.getElementById('etest-create-system-template').content.cloneNode(true));
    const tbody = content.querySelector('.etest-system-rows tbody');
    const rowTemplate = document.getElementById('etest-system-row-template');

    function fillTopics(select, skillId, selectedTopic) {
      select.innerHTML = '';
      topics.forEach((t) => {
        if (String(t.SKILL_ID) !== String(skillId)) return;
        const opt = document.createElement('option');
        opt.value = t.DETAIL_ID;
        opt.textContent = (t.DETAIL_NAME || '').slice(0, 48);
        if (String(t.DETAIL_ID) === String(selectedTopic)) opt.selected = true;
        select.appendChild(opt);
      });
    }

    function addRow(skillId, level, topic, num) {
      const rowClone = rowTemplate.content.cloneNode(true);
      const skillSelect = rowClone.querySelector('.etest-skill-select');
      const levelSelect = rowClone.querySelector('.etest-level-select');
      const topicSelect = rowClone.querySelector('.etest-topic-select');
      const numInput = rowClone.querySelector('input[name="num[]"]');
      if (skillId) skillSelect.value = skillId;
      if (level) levelSelect.value = level;
      if (num) numInput.value = num;
      fillTopics(topicSelect, skillSelect.value, topic);
      skillSelect.addEventListener('change', () => { fillTopics(topicSelect, skillSelect.value, ''); });
      rowClone.querySelector('.etest-remove-row-btn').addEventListener('click', () => {
        tbody.removeChild(rowClone.querySelector('tr'));
      });
      tbody.appendChild(rowClone);
    }

    addRow(1, 1, '');

    content.querySelector('.etest-add-row-btn').addEventListener('click', () => { addRow(1, 1, ''); });
    content.querySelector('.etest-create-system-submit').addEventListener('click', () => {
      const msg = content.querySelector('.etest-message');
      msg.textContent = '';
      const form = content.querySelector('.etest-create-system-form');
      fetch('/api/eol/etest/create/system', {
        method: 'POST',
        credentials: 'include',
        body: new URLSearchParams(new FormData(form)),
      })
        .then((res) => res.json())
        .then((resp) => {
          if (resp.status === 200) {
            reloadCurrent({ etest_action: null, exam_id: resp.data.detail.examId });
          } else {
            msg.textContent = resp.message || 'Error';
          }
        });
    });
    content.querySelector('.etest-back').addEventListener('click', (e) => {
      e.preventDefault();
      reloadCurrent({ etest_action: null, exam_id: null });
    });
  }

  function renderEtestLessonPlaceholder() {
    const content = document.getElementById('etest-content');
    content.innerHTML = '';
    content.appendChild(document.getElementById('etest-lesson-placeholder-template').content.cloneNode(true));
    content.querySelector('.etest-back').addEventListener('click', (e) => {
      e.preventDefault();
      reloadCurrent({ etest_action: null, exam_id: null });
    });
  }

  function renderEtest(apiData) {
    const action = apiData.etestAction;
    if (action === 'create_customize') {
      showView('view-e-test');
      renderEtestCreateCustom();
    } else if (action === 'create') {
      showView('view-e-test');
      renderEtestCreateSystem(apiData.topics || []);
    } else if (action === 'view_lesson' || action === 'create_lesson' || action === 'view_detail_lesson' || action === 'edit_lesson' || action === 'delete_lesson') {
      showView('view-e-test');
      renderEtestLessonPlaceholder();
    } else {
      showView('view-e-test');
      renderEtestList(apiData);
    }
  }

  // ---------- Statistics helpers ----------
  document.addEventListener('DOMContentLoaded', function () {
      showView('view-e-test');
      fetch(`/api/eol/etest${window.location.search}`, {
        credentials: 'include'
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== 200) {
            console.log(data);
            return;
          }
          renderEtest(data.data);
        });
  });
})();
