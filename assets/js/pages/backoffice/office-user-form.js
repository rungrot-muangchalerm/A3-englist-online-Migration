(function () {
  const root = document.querySelector('.main[data-mode]');
  const form = document.getElementById('office-user-form');
  const mode = root.dataset.mode;
  const userId = root.dataset.userId;
  const labels = {
    '00': 'Manage User',
    '01': 'Manage Main Menu',
    '02': 'Manage Activity and News',
    '03': 'Manage Interesting From EOL',
    '04': 'Manage News',
    '05': 'Manage Entertainment',
    '06': 'Manage English Channel',
    '07': 'Manage E-Testing',
    '10': 'Manage E-Learning',
    '11': 'Manage E-Learning Reading Comprehension',
    '12': 'Manage E-Learning Listening Comprehension',
    '13': 'Manage E-Learning Semi-Speaking',
    '14': 'Manage E-Learning Semi-Writing',
    '15': 'Manage E-Learning Grammatical Structure',
    '16': 'Manage E-Learning Integrated Skill: Cloze Test',
    '17': 'Manage E-Learning Vocabulary Items',
    '18': 'Manage EOL Contest Exam',
  };

  function field(name) {
    return form.elements[name];
  }

  function setField(name, value) {
    if (field(name)) field(name).value = value == null ? '' : String(value);
  }

  function renderUsername(user) {
    const cell = document.getElementById('office-user-username-cell');
    if (user) {
      cell.innerHTML = '<font size="2" face="tahoma" color="#cccccc"><b></b></font><input type="hidden" name="user">';
      cell.querySelector('b').textContent = user.user || '';
      cell.querySelector('input').value = user.user || '';
      return;
    }
    cell.innerHTML = '<input type="text" size="20" name="user" value="" required>';
  }

  function renderPermissions(types, permissions, user) {
    const body = document.getElementById('office-user-permissions');
    body.innerHTML = '';
    Object.keys(types || {}).sort().forEach(function (prefix) {
      const groupRow = document.createElement('tr');
      const groupCell = document.createElement('td');
      groupCell.colSpan = 2;
      groupCell.innerHTML = '<br><font size="2" face="tahoma" color="#ffff77"><b></b></font>';
      groupCell.querySelector('b').textContent = labels[prefix] || `Group ${prefix}`;
      groupRow.appendChild(groupCell);
      body.appendChild(groupRow);

      (types[prefix] || []).forEach(function (type, index) {
        let row = body.lastElementChild;
        if (index % 2 === 0) {
          row = document.createElement('tr');
          body.appendChild(row);
        }
        const cell = document.createElement('td');
        cell.width = '50%';
        const checked = permissions.indexOf(type.type_id) !== -1 ? ' checked' : '';
        const disabled = user && user.admin_id === 1 ? ' disabled' : '';
        cell.innerHTML = `<input type="checkbox" value="1"${checked}${disabled}> <font size="2" face="tahoma" color="#cccccc"><b></b></font>`;
        cell.querySelector('input').name = type.type_id;
        cell.querySelector('input').id = `chk${type.type_id}`;
        cell.querySelector('b').textContent = type.type_name;
        row.appendChild(cell);
      });
    });
  }

  function renderForm(data) {
    const user = data.user;
    document.getElementById('office-user-form-title').textContent = user ? 'Edit User' : 'Add New User';
    document.getElementById('office-user-admin-id').textContent = user ? user.admin_id : 'Auto Generate';
    document.getElementById('office-user-submit').value = user ? 'Edit Personal Data' : 'Add User';
    renderUsername(user);
    setField('prefix', user && user.prefix);
    setField('fname', user && user.fname);
    setField('lname', user && user.lname);
    setField('email', user && user.email);
    setField('nickname', user && user.nickname);
    setField('pass', user && user.pass);
    field('is_active').checked = !!(user && user.is_active);
    renderPermissions(data.types || {}, data.permissions || [], user);
  }

  function loadForm() {
    const url = mode === 'edit' ? `/api/backoffice/office/users/${encodeURIComponent(userId)}` : '/api/backoffice/office/users/create';
    fetch(url, {
      credentials: 'include'
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.status !== 200) {
          window.location.href = '/backoffice/mainoffice/office/user';
          return;
        }
        renderForm(json.data);
      });
  }

  form.addEventListener('submit', function () {
    const url = mode === 'edit' ? `/api/backoffice/office/users/${encodeURIComponent(userId)}` : '/api/backoffice/office/users';
    fetch(url, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      credentials: 'include',
      body: new URLSearchParams(new FormData(form)),
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.status === 200 || json.status === 201) {
          window.location.href = '/backoffice/mainoffice/office/user';
          return;
        }
        document.getElementById('office-user-message').textContent = 'Save failed';
      });
  });

  loadForm();
})();
