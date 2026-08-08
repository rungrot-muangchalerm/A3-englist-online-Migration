const officeTopicDetailRoot = document.querySelector('.main[data-topic-id]');
const officeTopicDetailTopicId = officeTopicDetailRoot.dataset.topicId;
const officeTopicDetailListUrl = '/backoffice/mainoffice/office/e-learning-vocabulary/beginner';

fetch(`/api/backoffice/office/topics/17-01/${encodeURIComponent(officeTopicDetailTopicId)}`, {
  credentials: 'include'
}).then(res => res.json()).then(data => {
    if (data.status === 200) {
        document.getElementById('office-admin-name').textContent = (data.data.currentAdmin ? `${data.data.currentAdmin.prefix} ${data.data.currentAdmin.fname} ${data.data.currentAdmin.lname} [${data.data.currentAdmin.nickname}]` : '')
        document.getElementById('office-topic-back-link').href = officeTopicDetailListUrl
        document.getElementById('office-topic-id').textContent = data.data.topic.topic_id
        document.getElementById('office-topic-name').textContent = data.data.topic.topic_name
        document.getElementById('office-topic-date').textContent = data.data.topic.topic_create
        document.getElementById('office-topic-headline').textContent = data.data.topic.topic_headline
        document.getElementById('office-topic-detail').innerHTML = data.data.topic.topic_detail || ''
    } else {
        console.log(data)
    }
})
