/* eslint-disable no-undef */

(function () {
  function $(id) { return document.getElementById(id); }

  fetch('/api/1yc/me', { method: 'GET', credentials: 'include' }).then(function (res) { return res.json(); }).then(function (data) {
    if (data.status === 200) {
      $('yc-user-name').textContent = data.data.fname || data.data.user || '';
      $('fname').value = data.data.fname || '';
      $('lname').value = data.data.lname || '';
      $('email').value = data.data.email || '';
      $('user').value = data.data.user || '';
      if (data.data.admin) {
        $('yc-management-link').classList.remove('d-none');
      }
    } else {
      console.log(data);
      window.location.href = '/';
    }
  });

  $('yc-logout-link').addEventListener('click', function (event) {
    event.preventDefault();
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then(function () { window.location.href = '/'; });
  });

  $('btn-edit-profile').addEventListener('click', function () {
    const status = $('profile-status');
    const reg = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    if (!$('fname').value.trim()) { alert('Please enter your Firstname.'); $('fname').focus(); return; }
    if (!$('lname').value.trim()) { alert('Please enter your Lastname.'); $('lname').focus(); return; }
    if (!$('email').value.trim()) { alert('Please enter your email.'); $('email').focus(); return; }
    if (!reg.test($('email').value.trim())) { alert('Please enter valid email.'); $('email').focus(); return; }

    fetch('/api/1yc/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        fname: $('fname').value.trim(),
        lname: $('lname').value.trim(),
        email: $('email').value.trim()
      })
    }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status === 200) {
        status.innerHTML = '<span class="text-success">' + data.data.message + '</span>';
        setTimeout(function () { window.location.reload(); }, 1000);
      } else {
        console.log(data);
        status.innerHTML = '<span class="text-danger">' + (data.message || 'Some problem occurred') + '</span>';
      }
    });
  });

  $('btn-edit-account').addEventListener('click', function () {
    const status = $('account-status');
    const u = $('user').value.trim();
    const p = $('pass').value.trim();
    const rp = $('repass').value.trim();
    if (!u) { alert('Please enter your Username.'); $('user').focus(); return; }
    if (!p) { alert('Please enter your New Password.'); $('pass').focus(); return; }
    if (p.length <= 7 || p.length > 20) { alert('Password must have 8-20 Characters long.'); $('pass').focus(); return; }
    if (!rp) { alert('Please enter your Re - New Password.'); $('repass').focus(); return; }
    if (rp !== p) { alert('Re-New Password is not same your New Password.'); $('repass').focus(); return; }

    fetch('/api/1yc/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ user: u, pass: p, repass: rp })
    }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status === 200) {
        status.innerHTML = '<span class="text-success">' + data.data.message + '</span>';
        setTimeout(function () { window.location.reload(); }, 1000);
      } else {
        console.log(data);
        status.innerHTML = '<span class="text-danger">' + (data.message || 'Some problem occurred') + '</span>';
      }
    });
  });

  function serverDate(nowTime) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const currentTime = new Date(new Date(nowTime).getTime() + 1000);
    $('server_time').innerHTML = currentTime.getHours() + ':' + ('0' + currentTime.getMinutes()).slice(-2);
    $('mount').innerHTML = currentTime.getDate() + '  ' + monthNames[currentTime.getMonth()];
    $('year').innerHTML = currentTime.getFullYear();
    setTimeout(function () { serverDate(currentTime.getTime()); }, 1000);
  }

  setTimeout(function () { serverDate(new Date().getTime()); }, 1000);
}());
