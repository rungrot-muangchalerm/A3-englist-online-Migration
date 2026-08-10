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
      <div id="pic_profile">
        <img src="${htmlEscape(member.avatar)}" alt=""
          onerror="this.onerror=null;this.src='${htmlEscape(member.fallbackAvatar)}'">
      </div>
      <div id="user_text">
        <p class="ms-3 fw-bold">
          ${htmlEscape(member.fname)}&nbsp;&nbsp;&nbsp;&nbsp;${htmlEscape(member.lname)}
        </p>
        <div id="account-info-text">${account.infoText || ''}</div>
      </div>
      <div id="logoutPic">
        <a href="#" id="system-logout">
          <img src="/assets/images/image2/eol system/button/logout-06.png" class="mt-3">
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
    const lineClass = {
      manage_admin: 'border-dark',
      edit_profile: 'border-info',
      refill: 'border-warning',
      statistics: 'border-secondary',
      'e-test': 'border-danger',
      corporate: 'border-danger',
      eol_system: 'border-warning',
    };
    const bottomClass = lineClass[page] || lineClass.eol_system;

    const isMaster = account.type === 'master';
    const isAdmin = account.isAdmin;
    const isCorporate = account.corporate;
    const isUsable = account.usable;
    const isExpired = account.type === 'expired';

    let items = '';

    if (isAdmin) {
      items += `<li class="${page === 'manage_admin' ? 'active' : ''}" id="tab_admin"><a href="/eol/eoltest/manage_admin">Admin</a></li>`;
    }

    items += `<li class="${page === 'edit_profile' ? 'active' : ''}" id="tab_profile"><a href="/eol/eoltest/edit_profile">Profile</a></li>`;

    if (!isMaster) {
      items += `<li class="${page === 'refill' ? 'active' : ''}" id="tab_refill"><a href="/eol/eoltest/refill">Refill</a></li>`;
    }

    if (isMaster) {
      items += `<li class="${page === 'statistics' ? 'active' : ''}" id="tab_statistics"><a href="/eol/eoltest/statistics?view=group">Statistics</a></li>`;
      items += `<li class="${page === 'e-test' ? 'active' : ''}" id="tab_corporate"><a href="/eol/eoltest/e-test">Add Test & Lesson</a></li>`;
    } else if (isCorporate && isUsable && !isExpired) {
      items += `<li class="${page === 'corporate' ? 'active' : ''}" id="tab_corporate"><a href="/corporate/ecop">Multi - Learning</a></li>`;
    }

    items += `<li class="${!page ? 'active' : ''}" id="tab_eolsystem"><a href="/eol/eoltest">SYSTEM Page</a></li>`;

    container.innerHTML = `
      <div class="tabbed border-bottom border-4 ${bottomClass}">
        <ul>${items}</ul>
      </div>
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
