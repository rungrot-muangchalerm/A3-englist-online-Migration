/* eslint-disable no-undef */

const form = document.getElementById('register-form')
const checkAccept = document.getElementById('check_accept')
const btnRegister = document.getElementById('btnregister')

if (checkAccept && btnRegister) {
  checkAccept.addEventListener('change', () => {
    btnRegister.disabled = !checkAccept.checked
  })
}

btnRegister.addEventListener('click', (event) => {
  event.preventDefault()
  fetch('/api/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fname: form.fname.value,
      lname: form.lname.value,
      user: form.user.value,
      pass: form.pass.value,
      email: form.email.value,
      tel: form.tel.value,
      gender: form.gender.value,
      datebirth: form.datebirth.value,
      recaptchaToken: document.getElementsByName('g-recaptcha-response')[0].value,
      check_accept: form.check_accept.checked,
    }),
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      alert(data.message || 'สมัครสมาชิกสำเร็จ')
      window.location.href = '/'
    } else {
      console.log(data)
    }
  })
})
