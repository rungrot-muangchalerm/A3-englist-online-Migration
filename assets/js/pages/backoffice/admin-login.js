document.getElementById('admin-login-btn').addEventListener('click', () => {
  const form = document.getElementById('loginForm');
  const msg = document.getElementById('loginMsg');
  msg.style.display = 'none';
  fetch('/api/backoffice/login?section=admin', {
    method: 'POST',
    credentials: 'include',
    body: new URLSearchParams(new FormData(form))
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        window.location.href = '/backoffice/mainoffice/admin/dashboard';
      } else {
        msg.style.display = '';
        msg.style.color = 'red';
        msg.style.fontSize = '12px';
        msg.style.fontWeight = 'bold';
        msg.textContent = data.message || 'Login failed';
      }
    });
});
