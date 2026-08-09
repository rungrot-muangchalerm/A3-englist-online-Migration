document.getElementById('office-login-btn').addEventListener('click', () => {
  const form = document.getElementById('loginForm');
  const msg = document.getElementById('loginMsg');
  msg.style.display = 'none';
  fetch('/api/backoffice/login?section=office', {
    method: 'POST',
    credentials: 'include',
    body: new URLSearchParams(new FormData(form))
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        window.location.href = '/backoffice/mainoffice/office/dashboard';
      } else {
        msg.style.display = '';
        msg.innerHTML = `<font size="2" color="red"><b>${data.message || 'Login failed'}</b></font>`;
      }
    });
});
