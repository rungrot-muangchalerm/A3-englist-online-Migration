const mainMenuDetailRoot = document.querySelector('.main[data-topic-id]');
const mainMenuDetailTopicId = mainMenuDetailRoot.dataset.topicId;
const mainMenuDetailListUrl = '/backoffice/mainoffice/office/main-menu/product';

fetch(`/api/backoffice/office/topics/01-04/${encodeURIComponent(mainMenuDetailTopicId)}`, {
  credentials: 'include'
}).then(res => res.json()).then(data => {
    if (data.status === 200) {
        document.getElementById('office-admin-name').textContent = (data.data.currentAdmin ? `${data.data.currentAdmin.prefix} ${data.data.currentAdmin.fname} ${data.data.currentAdmin.lname} [${data.data.currentAdmin.nickname}]` : '')
        document.getElementById('office-topic-back-link').href = mainMenuDetailListUrl
        document.getElementById('office-topic-id').textContent = data.data.topic.topic_id
        document.getElementById('office-topic-name').textContent = data.data.topic.topic_name
        document.getElementById('office-topic-date').textContent = data.data.topic.topic_create
        document.getElementById('office-topic-headline').textContent = data.data.topic.topic_headline
        document.getElementById('office-topic-detail').innerHTML = data.data.topic.topic_detail || ''
    } else {
        console.log(data)
    }
})
