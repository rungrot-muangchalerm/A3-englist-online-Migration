/* eslint-disable no-undef */

fetch('/api/certificate/me', {
  credentials: 'include',
  method: 'GET',
}).then(res => res.json()).then(data => {
  if (data.status === 200) {
    document.querySelector('#certificate-app .loading').classList.add('d-none');if (data.data.allPassed) {
      document.querySelector('#certificate-app .certificate-passed').classList.remove('d-none');document.querySelector('#certificate-app .full-name').textContent = data.data.fullName || ''
      document.getElementById('download-pdf').addEventListener('click', () => {
        const cert = document.querySelector('.certificate')
        html2canvas(cert, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png')
          const pdf = new window.jspdf.jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [cert.offsetWidth, cert.offsetHeight],
          })
          pdf.addImage(imgData, 'PNG', 0, 0, cert.offsetWidth, cert.offsetHeight)
          pdf.save('certificate.pdf')
        })
      })
    } else {
      document.querySelector('#certificate-app .certificate-missing').classList.remove('d-none');document.querySelector('#certificate-app .missing-skills').textContent = data.data.missingSkillsText
    }
  } else if (data.status === 401) {
    window.location.href = '/'
  } else {
    console.log(data)
  }
})
