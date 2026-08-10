(function () {
  const app = document.getElementById('contest-exam-app');
  if (!app) return;

  const apiUrl = app.dataset.apiUrl;
  const listBody = document.getElementById('contest-exam-list');
  const detailPanel = document.getElementById('contest-exam-detail');
  const pages = document.getElementById('contest-exam-pages');
  const rowTemplate = document.getElementById('contest-exam-row-template');
  const detailTemplate = document.getElementById('contest-exam-detail-template');
  const emptyTemplate = document.getElementById('contest-empty-template');

  let state = {
    page: Number(new URLSearchParams(window.location.search).get('page')) || 1,
    selectedExamId: '',
  };

  function setText(node, value) {
    if (node) node.textContent = value == null ? '' : String(value);
  }

  async function request(url, options) {
    const response = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || 'Request failed');
    }
    return payload.data;
  }

  function renderRows(exams) {
    listBody.textContent = '';
    if (!exams.length) {
      listBody.appendChild(emptyTemplate.content.cloneNode(true));
      return;
    }

    exams.forEach((exam, index) => {
      const row = rowTemplate.content.cloneNode(true);
      const tr = row.querySelector('tr');
      if (index % 2 === 0) tr.classList.add('even');
      if (String(exam.examId) === String(state.selectedExamId)) {
        tr.classList.add('selected');
      }

      const select = row.querySelector('[data-role="select"]');
      setText(select, exam.examName);
      select.addEventListener('click', (event) => {
        event.preventDefault();
        state.selectedExamId = exam.examId;
        load();
      });

      const amount = row.querySelector('[data-role="amount"]');
      setText(amount, exam.amount);
      amount.addEventListener('click', (event) => {
        event.preventDefault();
      });

      setText(row.querySelector('[data-role="creator"]'), exam.creatorName);
      setText(row.querySelector('[data-role="time"]'), exam.testtime);
      const active = row.querySelector('[data-role="active"]');
      setText(active, exam.active ? 'ON' : 'OFF');
      active.classList.add(exam.active ? 'text-info' : 'text-warning');

      listBody.appendChild(row);
    });
  }

  function renderPages(data) {
    pages.textContent = '';
    const totalPages = Number(data.allPages) || 1;
    const currentPage = Number(data.page) || 1;
    const pageBlockSize = 20;
    const blockEnd = Math.ceil(currentPage / pageBlockSize) * pageBlockSize;
    const blockStart = ((Math.ceil(currentPage / pageBlockSize) - 1) * pageBlockSize) + 1;
    const endPage = Math.min(blockEnd, totalPages);

    const appendPage = (page, label, className) => {
      const item = document.createElement('li');
      if (className) item.className = className;
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = String(label || page);
      link.addEventListener('click', (event) => {
        event.preventDefault();
        state.page = page;
        load();
      });
      item.appendChild(link);
      pages.appendChild(item);
    };

    if (blockStart >= pageBlockSize) appendPage(1, '«');
    if (blockStart > pageBlockSize) appendPage(blockStart - 1, 'Previous');

    for (let page = blockStart; page <= endPage; page += 1) {
      appendPage(page, page, page === currentPage ? 'active' : '');
    }

    if (endPage < totalPages) appendPage(endPage + 1, 'Next');
    if (endPage + pageBlockSize < totalPages) appendPage(totalPages, '»');
  }

  function renderDetail(exam, isAdmin) {
    detailPanel.textContent = '';
    if (!exam) return;

    const detail = detailTemplate.content.cloneNode(true);
    const form = detail.querySelector('#contest-exam-form');
    form.querySelector('[data-role="exam-id"]').value = exam.examId;
    form.querySelector('[data-role="exam-name"]').value = exam.examName;
    form.querySelector('[data-role="testtime"]').value = exam.testtime;
    form.querySelector(`[name="test_type"][value="${String(exam.testType || 1)}"]`).checked = true;
    const activeInput = form.querySelector('[data-role="active"]');
    const activeToggle = detail.querySelector('[data-role="active-toggle"]');
    const activeToggleLabel = detail.querySelector('[data-role="active-toggle-label"]');
    const syncActiveToggle = () => {
      const isActive = activeInput.checked;
      activeToggle.classList.toggle('is-on', isActive);
      activeToggle.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      setText(activeToggleLabel, isActive ? 'ON' : 'OFF');
    };
    activeInput.checked = Boolean(exam.active);
    syncActiveToggle();
    activeToggle.addEventListener('click', () => {
      activeInput.checked = !activeInput.checked;
      syncActiveToggle();
    });
    setText(form.querySelector('[data-role="create-date"]'), exam.createDate);
    setText(form.querySelector('[data-role="amount"]'), exam.amount);

    const groups = form.querySelector('[data-role="groups"]');
    const noneLabel = document.createElement('label');
    noneLabel.classList.remove('d-none');
    const noneCheck = document.createElement('input');
    noneCheck.type = 'checkbox';
    noneCheck.name = 'allowgroup';
    noneCheck.value = '0';
    noneCheck.className = 'checkbok_group';
    noneCheck.checked = Boolean(exam.noneGroup);
    noneLabel.appendChild(noneCheck);
    noneLabel.appendChild(document.createTextNode(' nonegroup'));
    groups.appendChild(noneLabel);

    (exam.groups || []).forEach((group) => {
      const label = document.createElement('label');
      label.classList.remove('d-none');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'allowgroup';
      checkbox.value = group.typeId;
      checkbox.className = 'checkbok_group';
      checkbox.checked = Boolean(group.allowed);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(`${group.name}`));
      groups.appendChild(label);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const message = form.querySelector('[data-role="message"]');
      setText(message, '');
      const allowgroup = Array.from(form.querySelectorAll('[name="allowgroup"]:checked')).map(input => input.value);
      try {
        await request(`${apiUrl}/${encodeURIComponent(exam.examId)}`, {
          method: 'PUT',
          body: JSON.stringify({
            exam_name: form.querySelector('[data-role="exam-name"]').value,
            testtime: form.querySelector('[data-role="testtime"]').value,
            test_type: form.querySelector('[name="test_type"]:checked')?.value || '1',
            active: activeInput.checked ? '1' : '0',
            allowgroup,
          }),
        });
        setText(message, 'Saved');
        await load();
      } catch (error) {
        setText(message, error.message);
      }
    });

    const deleteButton = detail.querySelector('[data-role="delete"]');
    if (!isAdmin) {
      deleteButton.disabled = true;
      deleteButton.title = 'Admin permission required';
    }
    deleteButton.addEventListener('click', async () => {
      if (!window.confirm('คุณต้องการลบชุดข้อสอบหรือไม่')) return;
      try {
        await request(`${apiUrl}/${encodeURIComponent(exam.examId)}`, { method: 'DELETE' });
        state.selectedExamId = '';
        await load();
      } catch (error) {
        setText(detail.querySelector('[data-role="message"]'), error.message);
      }
    });

    detailPanel.appendChild(detail);
  }

  async function load() {
    try {
      const params = new URLSearchParams({ page: String(state.page) });
      if (state.selectedExamId) params.set('exam_id', state.selectedExamId);
      const data = await request(`${apiUrl}?${params.toString()}`);
      if (!state.selectedExamId && data.selectedExam) {
        state.selectedExamId = data.selectedExam.examId;
      }
      renderRows(data.exams || []);
      renderDetail(data.selectedExam, Boolean(data.isAdmin));
      renderPages(data);
    } catch (error) {
      listBody.textContent = '';
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 5;
      cell.classList.add('text-center');
      cell.textContent = error.message;
      row.appendChild(cell);
      listBody.appendChild(row);
    }
  }

  load();
})();
