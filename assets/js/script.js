/* eslint-disable no-undef */

/**
 * Header user widget for public pages.
 *
 * 1) The first IIFE fetches /api/auth/me and renders the header widget.
 * 2) The second IIFE attaches the login form handler using
 *    document.getElementById('header-login-form').addEventListener(...).
 *
 * Coding standards:
 *  - Vanilla JS + fetch() with credentials: 'include'
 *  - Promise chain (.then) only; no async/await and no .catch()
 *  - DOM built with createElement/textContent instead of innerHTML strings
 */

const EOL_ENTRY = '/eol/eoltest';
const YC_ENTRY = '/1yc';
let attachHeaderLogin;

(function () {
  const API_ME = '/api/auth/me';

  fetch(API_ME, { credentials: 'include', method: 'GET' })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      const widget = document.getElementById('user-widget');

      if (!widget) return;

      widget.innerHTML = '';

      if (data.loggedIn && data.member) {
        widget.appendChild(buildLoggedInDropdown(data.member));
      } else {
        widget.appendChild(buildLoginButton());
      }

      if (typeof attachHeaderLogin === 'function') {
        attachHeaderLogin();
      }
    });

  function createElement(tag, attrs, children) {
    const element = document.createElement(tag);

    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        const value = attrs[key];
        if (key === 'text') {
          element.textContent = value;
        } else if (key === 'html') {
          element.innerHTML = value;
        } else if (value === true) {
          element.setAttribute(key, key);
        } else if (value !== false && value !== null && value !== undefined) {
          element.setAttribute(key, value);
        }
      });
    }

    if (children) {
      children.forEach(function (child) {
        if (child === null || child === undefined) return;
        element.appendChild(
          typeof child === 'string' ? document.createTextNode(child) : child
        );
      });
    }

    return element;
  }

  function buildAvatar(member) {
    const img = createElement('img', {
      class: 'rounded-circle border border-warning border-2',
      src: member.avatar || member.fallbackAvatar || '',
      width: '32',
      height: '32',
      alt: ''
    });

    img.onerror = function () {
      img.onerror = null;
      img.src = member.fallbackAvatar || '';
    };

    return img;
  }

  function buildDropdownItem(label, href) {
    return createElement('li', null, [
      createElement('a', { class: 'dropdown-item', href: href, text: label })
    ]);
  }

  function buildLogoutItem() {
    const item = createElement('li', null, [
      createElement('a', {
        href: '#',
        class: 'dropdown-item',
        text: 'Logout'
      })
    ]);

    item.querySelector('a').addEventListener('click', function (event) {
      event.preventDefault();
      fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      }).then(function () {
        window.location.reload();
      });
    });

    return item;
  }

  function buildLoggedInDropdown(member) {
    const isYc = member.type === '1yc';
    const entryHref = isYc ? YC_ENTRY : EOL_ENTRY;
    const entryLabel = isYc ? 'Enter 1 Year Course' : 'Enter EOL';

    const dropdown = createElement('div', { class: 'dropdown' });

    const toggle = createElement('button', {
      type: 'button',
      class: 'btn btn-dark dropdown-toggle d-flex align-items-center gap-2',
      'data-bs-toggle': 'dropdown',
      'aria-expanded': 'false'
    }, [
      buildAvatar(member),
      createElement('span', {
        class: 'd-none d-md-inline small',
        text: member.fname || member.user || 'User'
      })
    ]);

    const menu = createElement('ul', {
      class: 'dropdown-menu dropdown-menu-dark dropdown-menu-end'
    });

    const nameHeader = createElement('li', null, [
      createElement('span', {
        class: 'dropdown-item-text small text-white-50',
        text: (String(member.fname || '') + ' ' + String(member.lname || '')).trim() || member.user
      })
    ]);

    menu.appendChild(nameHeader);
    menu.appendChild(createElement('li', null, [createElement('hr', { class: 'dropdown-divider' })]));
    menu.appendChild(buildDropdownItem(entryLabel, entryHref));
    menu.appendChild(buildDropdownItem('Certificate', '/certificate'));
    menu.appendChild(createElement('li', null, [createElement('hr', { class: 'dropdown-divider' })]));
    menu.appendChild(buildLogoutItem());

    dropdown.appendChild(toggle);
    dropdown.appendChild(menu);

    return dropdown;
  }

  function buildLoginButton() {
    return createElement('button', {
      type: 'button',
      class: 'btn btn-warning btn-sm fw-bold',
      'data-bs-toggle': 'modal',
      'data-bs-target': '#loginModal'
    }, ['LOGIN']);
  }
}());

(function () {
  const API_LOGIN = '/api/auth/login';

  attachHeaderLogin = function () {
    const form = document.getElementById('header-login-form');
    if (!form || form._headerLoginBound) return;
    form._headerLoginBound = true;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const username = document.getElementById('header-username').value;
      const password = document.getElementById('header-password').value;

      fetch(API_LOGIN, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            const params = new URLSearchParams(window.location.search);
            const fallback = (data.member && data.member.type === '1yc') ? YC_ENTRY : EOL_ENTRY;
            window.location.href = params.get('redirect') || fallback;
          } else {
            alert(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
          }
        });
    });
  };
}());
