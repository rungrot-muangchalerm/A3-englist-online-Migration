/* eslint-disable no-undef */

document.getElementById('btnsend').addEventListener('click', (event) => {
  event.preventDefault()
  fetch('/api/contact/send', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementsByName('name')[0].value,
      email: document.getElementsByName('email')[0].value,
      telephone: document.getElementsByName('telephone')[0].value,
      detail: document.getElementsByName('detail')[0].value,
    }),
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      alert(data.message || 'Send message is successfully.')
      window.location.href = '/'
    } else {
      console.log(data)
    }
  })
})