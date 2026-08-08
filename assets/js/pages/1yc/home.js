/* eslint-disable no-undef */

function loadMe() {
  fetch('/api/auth/me', {
    method: 'GET',
    credentials: 'include',
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data.loggedIn || !data.member || data.member.type !== '1yc') {
        window.location.href = '/';
        return;
      }
      const nameEl = document.getElementById('yc-user-name');
      if (nameEl) {
        nameEl.textContent = data.member.fname || data.member.user || '';
      }
    })
    .catch(function (err) {
      console.error(err);
      window.location.href = '/';
    });
}

document.getElementById('btn-yc-logout').addEventListener('click', function () {
  fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })
    .then(function () {
      window.location.href = '/';
    })
    .catch(function (err) {
      console.error(err);
      window.location.href = '/';
    });
});

loadMe();
