document.getElementById('admin-login-btn').addEventListener('click', () => {
  const form = document.getElementById('loginForm');
  const msg = document.getElementById('loginMsg');
  msg.classList.add('d-none');
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
        msg.classList.remove('d-none');
        msg.classList.add('text-danger');
        msg.classList.add('small');
        msg.classList.add('fw-bold');
        msg.textContent = data.message || 'Login failed';
      }
    });
});
