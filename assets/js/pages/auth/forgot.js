/* eslint-disable no-undef */

document.getElementById('btn-forgot').addEventListener('click', (event) => {
  event.preventDefault()
  fetch('/api/auth/forgot', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      recaptchaToken: document.getElementsByName('g-recaptcha-response')[0].value,
    }),
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      alert(data.message || 'Your new password has been sent! Please check your email!')
      window.location.href = '/'
    } else {
      console.log(data)
    }
  })
})
