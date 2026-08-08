/* eslint-disable no-undef */

// ============================================================
// 1. Activity list (type_id 02-01)
// ============================================================
fetch('/api/topic?type_id=02-01&limit=3', {
  credentials: 'include',
  method: 'GET'
}).then(res => res.json()).then(data => {
  if (data.status === 200) {
    const Container = document.getElementById('activity-container')
    const Template = document.getElementById('activity-row-template')
    data.data.forEach(item => {
      const clone = Template.content.cloneNode(true)
      clone.querySelector('.activity-link').href = item.detail_url
      clone.querySelector('.activity-link').title = item.topic_name
      clone.querySelector('.activity-img').src = item.image_url
      clone.querySelector('.activity-link-text').href = item.detail_url
      clone.querySelector('.activity-link-text').title = item.topic_name
      clone.querySelector('.activity-link-text').textContent = item.display_name
      Container.appendChild(clone)
    })
  } else {
    console.log(data)
  }
})

// ============================================================
// 2. News, Gallery & Events list (type_id 02-02)
// ============================================================
fetch('/api/topic?type_id=02-02&limit=3', {
  credentials: 'include',
  method: 'GET'
}).then(res => res.json()).then(data => {
  if (data.status === 200) {
    const Container = document.getElementById('news-events-container')
    const Template = document.getElementById('news-events-row-template')
    data.data.forEach(item => {
      const clone = Template.content.cloneNode(true)
      clone.querySelector('.news-events-link').href = item.detail_url
      clone.querySelector('.news-events-link').title = item.topic_name
      clone.querySelector('.news-events-img').src = item.image_url
      clone.querySelector('.news-events-link-text').href = item.detail_url
      clone.querySelector('.news-events-link-text').title = item.topic_name
      clone.querySelector('.news-events-link-text').textContent = item.display_name
      Container.appendChild(clone)
    })
  } else {
    console.log(data)
  }
})

// ============================================================
// 3. Magazine showcase
// ============================================================
fetch('/api/topic/magazine-showcase', {
  credentials: 'include',
  method: 'GET'
}).then(res => res.json()).then(data => {
  if (data.status === 200) {
    document.getElementById('magazine-link').href = data.data.detail_url
    document.getElementById('magazine-img').src = data.data.image_url
    document.getElementById('magazine-link-text').href = data.data.detail_url
    document.getElementById('magazine-name').textContent = data.data.topic_name
    document.getElementById('magazine-headline').textContent = data.data.headline
    document.getElementById('magazine-author').textContent = data.data.author_name
    document.getElementById('magazine-view').textContent = data.data.view_count
  } else {
    console.log(data)
  }
})

// ============================================================
// 4. EOL English Room cards (1 topic per card, rich format)
// ============================================================
fetch('/api/topic/english-room', {
  credentials: 'include',
  method: 'GET'
}).then(res => res.json()).then(data => {
  if (data.status === 200) {
    const Container = document.getElementById('english-room-container')
    const Template = document.getElementById('english-room-card-template')
    data.data.rows.forEach(item => {
      const clone = Template.content.cloneNode(true)
      clone.querySelectorAll('.english-room-category-link').forEach(link => { link.href = item.category_url })
      clone.querySelector('.english-room-icon').classList.add(item.icon)
      clone.querySelector('.english-room-image').src = item.image
      clone.querySelector('.english-room-title').textContent = item.title
      clone.querySelector('.english-room-new-badge').className = `english-room-new-badge ${item.badge_class}`
      clone.querySelectorAll('.english-room-topic-link').forEach(link => {
        link.href = item.topic.detail_url
      })
      clone.querySelectorAll('.english-room-topic-link2').forEach(link => {
        link.href = item.topic.detail_url
      })
      clone.querySelector('.english-room-topic-name').textContent = item.topic.topic_name
      clone.querySelector('.english-room-topic-headline').textContent = item.topic.headline
      clone.querySelector('.english-room-date').textContent = item.topic.msg_date
      clone.querySelector('.english-room-author').textContent = item.topic.author_name
      clone.querySelector('.english-room-view').textContent = item.topic.view_count
      Container.appendChild(clone)
    })
  } else {
    console.log(data)
  }
})
