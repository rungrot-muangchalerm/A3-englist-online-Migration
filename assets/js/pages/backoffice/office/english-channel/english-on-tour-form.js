const officeTopicFormRoot = document.querySelector('.main[data-topic-id]');
const officeTopicForm = document.getElementById('office-topic-form');
const officeTopicFormTopicId = officeTopicFormRoot.dataset.topicId;
const officeTopicFormPage = new URLSearchParams(window.location.search).get('page') || '1';
const officeTopicFormListUrl = '/backoffice/mainoffice/office/english-channel/english-on-tour';
const officeTopicFormBackUrl = `${officeTopicFormListUrl}?page=${encodeURIComponent(officeTopicFormPage)}`;

document.getElementById('office-topic-back-link').href = officeTopicFormBackUrl;

if (window.CKEDITOR) {
    CKEDITOR.replace('topic_detail', {
        filebrowserUploadUrl: '/api/backoffice/ckeditor-upload',
        filebrowserImageUploadUrl: '/api/backoffice/ckeditor-upload/image'
    })
}

fetch(`/api/backoffice/office/topics/06-01/${encodeURIComponent(officeTopicFormTopicId)}`, {
  credentials: 'include'
}).then(res => res.json()).then(data => {
    if (data.status === 200) {
        officeTopicForm.elements.topic_name.value = data.data.topic.topic_name || ''
        officeTopicForm.elements.topic_headline.value = data.data.topic.topic_headline || ''
        if (window.CKEDITOR && CKEDITOR.instances.topic_detail) {
            CKEDITOR.instances.topic_detail.setData(data.data.topic.topic_detail || '')
        } else {
            officeTopicForm.elements.topic_detail.value = data.data.topic.topic_detail || ''
        }
    } else {
        console.log(data)
    }
})

officeTopicForm.addEventListener('submit', () => {
    const body = new URLSearchParams(new FormData(officeTopicForm))
    if (window.CKEDITOR && CKEDITOR.instances.topic_detail) {
        body.set('topic_detail', CKEDITOR.instances.topic_detail.getData())
    }
    fetch(`/api/backoffice/office/topics/06-01/${encodeURIComponent(officeTopicFormTopicId)}`, {
        method: 'PUT',
        credentials: 'include',
        body
    }).then(res => res.json()).then(data => {
        if (data.status === 200) {
            window.location.href = officeTopicFormBackUrl
        } else {
            console.log(data)
            document.getElementById('office-topic-form-message').textContent = data.message || 'Save failed'
        }
    })
})
