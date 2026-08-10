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
      setHtml(activeCell, '<span class="text-success"><b>-</b></span>');
      setHtml(editCell, '<span class="text-info"><b>-</b></span>');
    } else {
      const activeColor = user.is_active ? 'green' : 'orange';
      const activeText = user.is_active ? 'Active' : 'Not Active';
      setHtml(activeCell, `<a href="#" data-action="toggle"><span><b>${activeText}</b></span></a>`);
      setHtml(editCell, `<a href="/backoffice/mainoffice/office/user/${encodeURIComponent(user.admin_id)}/edit"><span class="text-info"><b>Edit</b></span></a>`);
    }

    if (user.admin_id === 1 || user.admin_id === adminId) {
      setHtml(deleteCell, '<span class="text-danger"><b> - </b></span>');
    } else {
      setHtml(deleteCell, '<a href="#" class="link-danger" data-action="delete"><b>Delete</b></a>');
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

    (data.users || []).forEach(function (user, index) {
      const fragment = template.content.cloneNode(true);
      const table = fragment.querySelector('table');
      table.setAttribute('bgcolor', index % 2 === 1 ? '#E3E3E3' : '#DEDEDE');
      table.setAttribute('style', `background-color:${(index % 2 === 1 ? '#E3E3E3' : '#DEDEDE')} !important;`);
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
