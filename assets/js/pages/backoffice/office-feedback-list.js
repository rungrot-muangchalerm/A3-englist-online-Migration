(function () {
  const params = new URLSearchParams(window.location.search);
  const menu = params.get('menu') === '2' ? '2' : '1';
  const page = params.get('page') || '1';
  const baseUrl = document.querySelector('.main[data-list-url]').dataset.listUrl;
  const list = document.getElementById('feedback-list');
  const pages = document.getElementById('feedback-pages');
  const form = document.getElementById('feedback-add-form');
  const text = document.getElementById('feedback-text');
  const message = document.getElementById('feedback-message');

  function setMessage(value) {
    message.textContent = value || '';
  }

  function pageUrl(nextPage) {
    return `${baseUrl}?menu=${encodeURIComponent(menu)}&page=${encodeURIComponent(nextPage)}`;
  }

  function renderPages(data) {
    pages.innerHTML = '';
    for (let i = 1; i <= data.allPages; i++) {
      const link = document.createElement('a');
      const pageText = document.createElement('span');
      link.href = pageUrl(i);
      pageText.className = data.page === i ? 'text-danger' : 'text-warning';
      pageText.textContent = i;
      link.appendChild(pageText);
      pages.appendChild(document.createTextNode('  '));
      pages.appendChild(link);
      pages.appendChild(document.createTextNode('  '));
      if (i % 20 === 0) pages.appendChild(document.createElement('br'));
    }
  }

  function renderRows(data) {
    list.innerHTML = '';
    const template = document.getElementById('feedback-row-template');
    const emptyTemplate = document.getElementById('feedback-empty-template');

    if (!data.rows.length) {
      list.appendChild(emptyTemplate.content.cloneNode(true));
      return;
    }

    data.rows.forEach(function (row) {
      const clone = template.content.cloneNode(true);
      clone.querySelector('[data-role="id"]').textContent = row.id;
      clone.querySelector('[data-role="text"]').innerHTML = row.text || '';
      clone.querySelector('[data-role="active"]').textContent = row.activeState.label;
      clone.querySelector('[data-role="active"]').closest('font').setAttribute('color', row.activeState.color);
      clone.querySelector('[data-role="toggle"]').addEventListener('click', function (event) {
        event.preventDefault();
        fetch(`/api/backoffice/office/feedback/${encodeURIComponent(menu)}/${encodeURIComponent(row.id)}/toggle-active`, {
          method: 'POST',
          credentials: 'include'
        }).then(function (res) { return res.json(); }).then(function (json) {
          if (json.status === 200) window.location.reload();
          else setMessage('Toggle failed');
        });
      });
      clone.querySelector('[data-role="delete"]').addEventListener('click', function () {
        if (!confirm(`Are you sure ? want delete this ${data.labels.deleteName} ?`)) return;
        fetch(`/api/backoffice/office/feedback/${encodeURIComponent(menu)}/${encodeURIComponent(row.id)}`, {
          method: 'DELETE',
          credentials: 'include'
        }).then(function (res) { return res.json(); }).then(function (json) {
          if (json.status === 200) window.location.reload();
          else setMessage('Delete failed');
        });
      });
      list.appendChild(clone);
    });
  }

  function render(data) {
    document.querySelectorAll('[data-menu-link]').forEach(function (link) {
      link.classList.toggle('text-danger', link.dataset.menuLink === menu);
    });
    document.getElementById('feedback-header-id').textContent = data.labels.headerId;
    document.getElementById('feedback-header-text').textContent = data.labels.headerText;
    document.getElementById('feedback-field-label').textContent = data.labels.fieldLabel;
    document.getElementById('feedback-add-button').value = data.labels.addButton;
    text.name = data.labels.fieldName;
    text.rows = data.labels.rows;
    renderRows(data);
    renderPages(data);
  }

  function load() {
    fetch(`/api/backoffice/office/feedback?menu=${encodeURIComponent(menu)}&page=${encodeURIComponent(page)}`, {
      credentials: 'include'
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.status !== 200) {
          setMessage('Load failed');
          return;
        }
        render(json.data);
      })
      .catch(function () {
        setMessage('Load failed');
      });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    fetch(`/api/backoffice/office/feedback?menu=${encodeURIComponent(menu)}`, {
      method: 'POST',
      credentials: 'include',
      body: new URLSearchParams(new FormData(form))
    }).then(function (res) { return res.json(); }).then(function (json) {
      if (json.status === 201) {
        window.location.href = pageUrl(1);
        return;
      }
      setMessage(json.message || 'Add failed');
    }).catch(function () {
      setMessage('Add failed');
    });
  });

  load();
})();
