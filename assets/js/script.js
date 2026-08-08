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
      const certNav = document.getElementById('nav-certificate');

      if (!widget) return;

      widget.innerHTML = '';

      if (data.loggedIn && data.member) {
        setVisible(certNav, true);
        widget.appendChild(buildLoggedInWidget(data.member));
      } else {
        setVisible(certNav, false);
        widget.appendChild(buildLoginWidget());
      }

      if (typeof attachHeaderLogin === 'function') {
        attachHeaderLogin();
      }
    });

  function $(id) {
    return document.getElementById(id);
  }

  function setVisible(element, visible) {
    if (!element) return;
    element.style.display = visible ? 'inline-block' : 'none';
  }

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
      class: 'user-avatar',
      src: member.avatar || member.fallbackAvatar || '',
      alt: ''
    });

    img.addEventListener('error', function () {
      img.onerror = null;
      img.src = member.fallbackAvatar || '';
    });

    return createElement('div', { class: 'user-avatar-wrap' }, [img]);
  }

  function buildUserDetails(member) {
    const nameText = String(member.fname || '') + '\u00A0\u00A0\u00A0\u00A0' + String(member.lname || '');

    return createElement('div', { class: 'user-details' }, [
      createElement('span', { class: 'user-name', text: nameText }),
      createElement('br'),
      createElement('span', { class: 'user-profile', text: member.profile || '' })
    ]);
  }

  function buildEnterAction(member) {
    const isYc = member.type === '1yc';
    const href = isYc ? YC_ENTRY : EOL_ENTRY;
    const imgSrc = isYc
      ? '/assets/images/image2/mainpage/button/enter eol.png'
      : '/assets/images/image2/mainpage/button/enter eol.png';
    const alt = isYc ? 'Enter 1 Year Course' : 'Enter EOL';

    return createElement('div', { class: 'user-action' }, [
      createElement('a', { href: href }, [
        createElement('img', {
          class: 'enter-eol-img',
          src: imgSrc,
          alt: alt
        })
      ])
    ]);
  }

  function buildLogoutAction() {
    const logoutLink = createElement('a', { href: '#', id: 'logout-link' }, [
      createElement('img', {
        class: 'logout-img',
        src: '/assets/images/image2/eol system/button/logout-06.png',
        alt: 'Logout'
      })
    ]);

    logoutLink.addEventListener('click', function (event) {
      event.preventDefault();
      fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      }).then(function () {
        window.location.reload();
      });
    });

    return createElement('div', { class: 'user-action' }, [logoutLink]);
  }

  function buildLoggedInWidget(member) {
    return createElement('div', { class: 'user-widget-logged' }, [
      buildAvatar(member),
      buildUserDetails(member),
      buildEnterAction(member),
      buildLogoutAction()
    ]);
  }

  function buildLoginField(side, inputAttrs, linkAttrs, linkText) {
    const className = 'login-field login-field-' + side;

    return createElement('div', { class: className }, [
      createElement('input', inputAttrs),
      createElement('br'),
      createElement('a', linkAttrs, [linkText])
    ]);
  }

  function buildLoginWidget() {
    const usernameInput = {
      type: 'text',
      name: 'username',
      id: 'header-username',
      class: 'form-control login-input',
      placeholder: 'Username',
      required: true
    };
    const signupLink = {
      href: '/auth/register_account',
      class: 'over_a login-link',
      id: 'signup'
    };

    const passwordInput = {
      type: 'password',
      name: 'password',
      id: 'header-password',
      class: 'form-control login-input',
      placeholder: 'Password',
      autocomplete: 'on',
      required: true
    };
    const forgotLink = {
      href: '/auth/forgot',
      class: 'over_a login-link',
      id: 'forgot'
    };

    return createElement('form', {
      id: 'header-login-form',
      method: 'post',
      action: '/api/auth/login',
      class: 'header-login-form'
    }, [
      buildLoginField('left', usernameInput, signupLink, 'Sign Up / Register'),
      buildLoginField('right', passwordInput, forgotLink, 'Forgot Password?'),
      createElement('div', { class: 'login-button-wrap' }, [
        createElement('button', { type: 'submit', class: 'btn login-button' }, ['LOGIN'])
      ])
    ]);
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
