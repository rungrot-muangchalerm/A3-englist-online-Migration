(function () {
  const list = document.getElementById('office-user-list');
  const template = document.getElementById('office-user-row-template');
  const currentAdmin = document.getElementById('office-user-current-admin');

  function text(value) {
    return value == null ? '' : String(value);
  }

  function setHtml(target, html) {
    target.innerHTML = html;
  }

  function renderActionCell(row, user, adminId) {
    const activeCell = row.querySelector('[data-role="active-cell"]');
    const editCell = row.querySelector('[data-role="edit-cell"]');
    const deleteCell = row.querySelector('[data-role="delete-cell"]');

    if (user.admin_id === 1) {
      setHtml(activeCell, '<span class="text-muted">-</span>');
      setHtml(editCell, '<span class="text-muted">-</span>');
    } else {
      const activeClass = user.is_active ? 'btn-success' : 'btn-warning';
      const activeText = user.is_active ? 'Active' : 'Not Active';
      setHtml(activeCell, `<a href="#" class="btn btn-sm ${activeClass}" data-action="toggle">${activeText}</a>`);
      setHtml(editCell, `<a href="/backoffice/mainoffice/office/user/${encodeURIComponent(user.admin_id)}/edit" class="btn btn-info btn-sm text-white">Edit</a>`);
    }

    if (user.admin_id === 1 || user.admin_id === adminId) {
      setHtml(deleteCell, '<span class="text-muted">-</span>');
    } else {
      setHtml(deleteCell, '<a href="#" class="btn btn-danger btn-sm" data-action="delete">Delete</a>');
    }

    const toggle = activeCell.querySelector('[data-action="toggle"]');
    if (toggle) {
      toggle.addEventListener('click', function (event) {
        event.preventDefault();
        fetch(`/api/backoffice/office/users/${encodeURIComponent(user.admin_id)}/toggle-active`, {
          method: 'POST',
          credentials: 'include',
        }).then(loadUsers);
      });
    }

    const remove = deleteCell.querySelector('[data-action="delete"]');
    if (remove) {
      remove.addEventListener('click', function () {
        if (!confirm('Are you sure ? want delete this member ?')) return;
        fetch(`/api/backoffice/office/users/${encodeURIComponent(user.admin_id)}`, {
          method: 'DELETE',
          credentials: 'include',
        }).then(loadUsers);
      });
    }
  }

  function renderUsers(data) {
    list.innerHTML = '';
    const admin = data.currentAdmin || {};
    currentAdmin.textContent = `${text(admin.prefix)} ${text(admin.fname)} ${text(admin.lname)} [${text(admin.nickname)}]`;

    (data.users || []).forEach(function (user) {
      const fragment = template.content.cloneNode(true);
      const row = fragment.querySelector('tr');
      fragment.querySelector('[data-role="admin-id"]').textContent = text(user.admin_id);
      fragment.querySelector('[data-role="name-left"]').textContent = `${text(user.prefix)} ${text(user.fname)}`;
      fragment.querySelector('[data-role="name-middle"]').textContent = text(user.lname);
      fragment.querySelector('[data-role="nickname"]').textContent = text(user.nickname);
      renderActionCell(fragment, user, admin.admin_id);
      list.appendChild(fragment);
    });
  }

  function loadUsers() {
    return fetch('/api/backoffice/office/users', {
      credentials: 'include'
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.status !== 200) {
          window.location.href = '/backoffice/mainoffice/office/dashboard';
          return;
        }
        renderUsers(json.data);
      });
  }

  loadUsers();
})();
