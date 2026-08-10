document.getElementById('office-login-btn').addEventListener('click', () => {
  const form = document.getElementById('loginForm');
  const msg = document.getElementById('loginMsg');
  msg.classList.add('d-none');
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
        msg.classList.remove('d-none');
        msg.innerHTML = `<span class="text-danger"><b>${data.message || 'Login failed'}</b></span>`;
      }
    });
});
