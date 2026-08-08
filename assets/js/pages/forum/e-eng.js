/* eslint-disable no-undef */

{
const params = new URLSearchParams(window.location.search)
const type_id = params.get('type_id') || '03-01'
const page = parseInt(params.get('page'), 10) || 1

fetch(`/api/forum?type_id=${type_id}&page=${page}`, {
  credentials: 'include',
  method: 'GET',
}).then(res => res.json()).then(data => {
  if (data.status === 200) {
    document.getElementById('forum-type-name').textContent = data.data.type_name || 'One day One sentence'

    const topicList = document.getElementById('forum-topic-list')
    const topicTemplate = document.getElementById('forum-topic-template')
    const emptyTemplate = document.getElementById('forum-empty-template')
    while (topicList.firstChild) {
      topicList.removeChild(topicList.firstChild)
    }

    if ((data.data.topics || []).length === 0) {
      topicList.appendChild(emptyTemplate.content.cloneNode(true))
    } else {
      data.data.topics.forEach((row) => {
        const clone = topicTemplate.content.cloneNode(true)
        clone.querySelector('.topic-image-link').href = row.detail_url
        clone.querySelector('.topic-image').src = row.topic_image_url
        clone.querySelector('.topic-name-link').href = row.detail_url
        clone.querySelector('.topic-name').textContent = row.topic_name

        if (row.is_new) {
          const newBadge = clone.querySelector('.new-badge')
          const newBadgeImg = document.createElement('img')
          newBadgeImg.src = '/assets/images/icon_new.gif'
          newBadgeImg.border = '0'
          newBadgeImg.style.borderRadius = '5px'
          newBadge.appendChild(newBadgeImg)
        }

        clone.querySelector('.topic-headline-link').href = row.detail_url
        clone.querySelector('.topic-headline').textContent = row.topic_headline || ''
        clone.querySelector('.topic-date').textContent = row.topic_create_display
        clone.querySelector('.topic-author').textContent = row.author_nickname || '-'
        clone.querySelector('.topic-view').textContent = Number(row.topic_view || 0).toLocaleString('en-US')
        topicList.appendChild(clone)
      })
    }

    const pagination = document.getElementById('forum-pagination')
    while (pagination.firstChild) {
      pagination.removeChild(pagination.firstChild)
    }
    if (data.data.total_pages > 1) {
      const pageRange = 8
      let pageStart = page - pageRange
      let pageEnd = page + pageRange
      if (pageStart < 1) {
        pageEnd += 1 - pageStart
        pageStart = 1
      }
      if (pageEnd > data.data.total_pages) {
        const diff = pageEnd - data.data.total_pages
        pageStart -= diff
        if (pageStart < 1) pageStart = 1
        pageEnd = data.data.total_pages
      }

      if (page > 1) {
        const prev = document.createElement('a')
        prev.href = `/forum/e-eng?type_id=${type_id}&page=${page - 1}`
        prev.style.color = '#333'
        prev.style.fontWeight = 'bold'
        prev.textContent = 'Previous'
        pagination.appendChild(prev)
      }
      if (pageStart > 1) {
        const dots = document.createElement('a')
        dots.href = `/forum/e-eng?type_id=${type_id}&page=${pageStart - 1}`
        dots.style.fontWeight = 'bold'
        dots.textContent = '......'
        pagination.appendChild(dots)
      }
      for (let i = pageStart; i <= pageEnd; i++) {
        if (i === page) {
          const current = document.createElement('b')
          current.textContent = i
          pagination.appendChild(current)
        } else {
          const link = document.createElement('a')
          link.href = `/forum/e-eng?type_id=${type_id}&page=${i}`
          link.textContent = i
          pagination.appendChild(link)
        }
      }
      if (pageEnd < data.data.total_pages) {
        const dots = document.createElement('a')
        dots.href = `/forum/e-eng?type_id=${type_id}&page=${pageEnd + 1}`
        dots.style.fontWeight = 'bold'
        dots.textContent = '......'
        pagination.appendChild(dots)
      }
      if (page < data.data.total_pages) {
        const next = document.createElement('a')
        next.href = `/forum/e-eng?type_id=${type_id}&page=${page + 1}`
        next.style.color = '#333'
        next.style.fontWeight = 'bold'
        next.textContent = 'Next'
        pagination.appendChild(next)
      }
    }
  } else {
    console.log(data)
  }
})
}
