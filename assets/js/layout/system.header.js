(function () {
  function htmlEscape(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderHeader(member, account) {
    const container = document.getElementById('info_user');
    if (!container) return;

    container.innerHTML = `
      <div id="pic_profile" class="d-none d-sm-block">
        <img src="${htmlEscape(member.avatar)}" alt="" class="rounded-circle border" width="40" height="40"
          onerror="this.onerror=null;this.src='${htmlEscape(member.fallbackAvatar)}'">
      </div>
      <div id="user_text" class="small text-end">
        <p class="mb-0 fw-bold">
          ${htmlEscape(member.fname)}&nbsp;&nbsp;&nbsp;&nbsp;${htmlEscape(member.lname)}
        </p>
        <div id="account-info-text" class="text-body-secondary d-none d-md-block">${account.infoText || ''}</div>
      </div>
      <div id="logoutPic">
        <a href="#" id="system-logout" class="btn btn-outline-danger btn-sm">
          <i class="bi bi-box-arrow-right"></i> Logout
        </a>
      </div>
    `;

    const logoutBtn = document.getElementById('system-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
          .then(() => { window.location.href = '/'; })
          .catch(() => { window.location.href = '/'; });
      });
    }
  }

  function getActivePage() {
    const path = window.location.pathname;
    if (path.startsWith('/corporate/')) return 'corporate';
    const parts = path.split('/').filter(Boolean);
    // /eol/eoltest/<page> -> parts = ['eol','eoltest','<page>']
    const page = parts[2] || '';
    // report/academic are sub-views under /eol/eoltest; do not highlight any tab.
    if (page === 'report' || page === 'academic') return '';
    return page;
  }

  function renderMenu(account) {
    const container = document.getElementById('system-menu');
    if (!container) return;

    const page = getActivePage();
    const isMaster = account.type === 'master';
    const isAdmin = account.isAdmin;
    const isCorporate = account.corporate;
    const isUsable = account.usable;
    const isExpired = account.type === 'expired';

    let items = '';

    if (isAdmin) {
      items += `<li class="nav-item" id="tab_admin"><a class="nav-link ${page === 'manage_admin' ? 'active' : ''}" href="/eol/eoltest/manage_admin">Admin</a></li>`;
    }

    items += `<li class="nav-item" id="tab_profile"><a class="nav-link ${page === 'edit_profile' ? 'active' : ''}" href="/eol/eoltest/edit_profile">Profile</a></li>`;

    if (!isMaster) {
      items += `<li class="nav-item" id="tab_refill"><a class="nav-link ${page === 'refill' ? 'active' : ''}" href="/eol/eoltest/refill">Refill</a></li>`;
    }

    if (isMaster) {
      items += `<li class="nav-item" id="tab_statistics"><a class="nav-link ${page === 'statistics' ? 'active' : ''}" href="/eol/eoltest/statistics?view=group">Statistics</a></li>`;
      items += `<li class="nav-item" id="tab_corporate"><a class="nav-link ${page === 'e-test' ? 'active' : ''}" href="/eol/eoltest/e-test">Add Test & Lesson</a></li>`;
    } else if (isCorporate && isUsable && !isExpired) {
      items += `<li class="nav-item" id="tab_corporate"><a class="nav-link ${page === 'corporate' ? 'active' : ''}" href="/corporate/ecop">Multi - Learning</a></li>`;
    }

    items += `<li class="nav-item" id="tab_eolsystem"><a class="nav-link ${!page ? 'active' : ''}" href="/eol/eoltest">SYSTEM Page</a></li>`;

    container.innerHTML = `
      <nav class="navbar navbar-expand bg-body-tertiary border-bottom border-secondary">
        <div class="container">
          <ul class="nav nav-pills gap-1 flex-nowrap overflow-auto py-2">${items}</ul>
        </div>
      </nav>
    `;
  }

  function init() {
    fetch('/api/eol/account', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== 200) {
          window.location.href = '/';
          return;
        }
        window.__eolAccount = data.data.account;
        renderHeader(data.data.member, data.data.account);
        renderMenu(data.data.account);
      })
      .catch(() => {
        window.location.href = '/';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
