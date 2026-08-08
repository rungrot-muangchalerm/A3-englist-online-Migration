/* eslint-disable no-undef */

{
const params = new URLSearchParams(window.location.search)
const type = params.get('type') || 'school'

if (type === 'school') {
  fetch('/api/other/school', {
    credentials: 'include',
    method: 'GET',
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      const content = document.getElementById('school-content')
    const main = document.getElementById('school-main')
    const categoryTemplate = document.getElementById('school-category-template')
    const rowTemplate = document.getElementById('school-row-template')

    document.getElementById('school-title').textContent = data.data.title
    while (main.firstChild) {
      main.removeChild(main.firstChild)
    }

    data.data.categories.forEach((category) => {
      const categoryClone = categoryTemplate.content.cloneNode(true)
      categoryClone.querySelector('.school-category-title').textContent = category.title

      const body = categoryClone.querySelector('.school-category-body')
      const items = category.items || []
      const pairs = []
      for (let i = 0; i < items.length; i += 2) {
        pairs.push([items[i], items[i + 1] || null])
      }

      pairs.forEach((pair, index) => {
        const rowClone = rowTemplate.content.cloneNode(true)
        rowClone.querySelector('.school-name-1').textContent = pair[0] ? pair[0].display_name : ''
        rowClone.querySelector('.school-name-2').textContent = pair[1] ? pair[1].display_name : ''

        if (index === pairs.length - 1) {
          const spacer = rowClone.querySelector('.school-spacer-row')
          if (spacer) spacer.remove()
        }

        body.appendChild(rowClone)
      })

      main.appendChild(categoryClone)
    })

      content.style.display = 'block'
    } else {
      console.log(data)
    }
  })
} else if (type === 'feedback') {
  fetch('/api/other/feedback', {
    credentials: 'include',
    method: 'GET',
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      const content = document.getElementById('feedback-content')
    const body = document.getElementById('feedback-body')
    const rowTemplate = document.getElementById('feedback-row-template')

    document.getElementById('feedback-title').textContent = data.data.title
    while (body.firstChild) {
      body.removeChild(body.firstChild)
    }

    data.data.items.forEach((item) => {
      const rowClone = rowTemplate.content.cloneNode(true)
      const cell = rowClone.querySelector('.feedback-detail')
      cell.classList.add(item.row_class)
      cell.textContent = item.detail
      body.appendChild(rowClone)
    })

      content.style.display = 'block'
    } else {
      console.log(data)
    }
  })
} else if (type === 'advertise') {
  fetch('/api/other/advertise', {
    credentials: 'include',
    method: 'GET',
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      const content = document.getElementById('advertise-content')
    const template = document.getElementById('advertise-template')

    while (content.firstChild) {
      content.removeChild(content.firstChild)
    }
      content.appendChild(template.content.cloneNode(true))
      content.style.display = 'block'
    } else {
      console.log(data)
    }
  })
}
}
