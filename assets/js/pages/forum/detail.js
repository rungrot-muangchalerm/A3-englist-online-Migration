/* eslint-disable no-undef */

{
const params = new URLSearchParams(window.location.search)
const type_id = params.get('type_id') || ''
const topic_id = params.get('topic_id') || ''

fetch(`/api/topic/detail?type_id=${type_id}&topic_id=${topic_id}`, {
  credentials: 'include',
  method: 'GET',
}).then(res => res.json()).then(data => {
  if (data.status === 200) {
    document.querySelector('#forum-detail-container .topic-image').src = data.data.image_url
    document.querySelectorAll('#forum-detail-container .topic-name').forEach((el) => {
      el.textContent = data.data.topic_name
    })
    document.querySelector('#forum-detail-container .category-link').href = data.data.category_url
    document.querySelector('#forum-detail-container .category-name').textContent = data.data.category_name
    document.querySelector('#forum-detail-container .topic-link').href = data.data.detail_url
    document.querySelector('#forum-detail-container .topic-name-link-text').textContent = data.data.topic_name
    document.querySelector('#forum-detail-container .topic-headline').textContent = data.data.topic_headline || ''
    document.querySelector('#forum-detail-container .topic-date').textContent = data.data.topic_create_display
    document.querySelector('#forum-detail-container .topic-view').textContent = data.data.view_count
    document.querySelector('#forum-detail-container .topic-author').textContent = data.data.author_nickname || 'EOL Admin'
    document.querySelector('#forum-detail-container .topic-detail').innerHTML = data.data.topic_detail || ''
  } else {
    console.log(data)
    const container = document.getElementById('forum-detail-container')
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }
    container.appendChild(document.getElementById('forum-not-found-template').content.cloneNode(true))
  }
})
}
