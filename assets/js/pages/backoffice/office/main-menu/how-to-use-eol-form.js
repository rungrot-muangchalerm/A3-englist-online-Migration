const mainMenuFormRoot = document.querySelector('.main[data-topic-id]');
const mainMenuForm = document.getElementById('office-topic-form');
const mainMenuFormTopicId = mainMenuFormRoot.dataset.topicId;
const mainMenuFormPage = new URLSearchParams(window.location.search).get('page') || '1';
const mainMenuFormListUrl = '/backoffice/mainoffice/office/main-menu/how-to-use-eol';
const mainMenuFormBackUrl = `${mainMenuFormListUrl}?page=${encodeURIComponent(mainMenuFormPage)}`;

document.getElementById('office-topic-back-link').href = mainMenuFormBackUrl;

if (window.CKEDITOR) {
    CKEDITOR.replace('topic_detail', {
        filebrowserUploadUrl: '/api/backoffice/ckeditor-upload',
        filebrowserImageUploadUrl: '/api/backoffice/ckeditor-upload/image'
    })
}

fetch(`/api/backoffice/office/topics/01-05/${encodeURIComponent(mainMenuFormTopicId)}`, {
  credentials: 'include'
}).then(res => res.json()).then(data => {
    if (data.status === 200) {
        mainMenuForm.elements.topic_name.value = data.data.topic.topic_name || ''
        mainMenuForm.elements.topic_headline.value = data.data.topic.topic_headline || ''
        if (window.CKEDITOR && CKEDITOR.instances.topic_detail) {
            CKEDITOR.instances.topic_detail.setData(data.data.topic.topic_detail || '')
        } else {
            mainMenuForm.elements.topic_detail.value = data.data.topic.topic_detail || ''
        }
    } else {
        console.log(data)
    }
})

mainMenuForm.addEventListener('submit', () => {
    const body = new URLSearchParams(new FormData(mainMenuForm))
    if (window.CKEDITOR && CKEDITOR.instances.topic_detail) {
        body.set('topic_detail', CKEDITOR.instances.topic_detail.getData())
    }
    fetch(`/api/backoffice/office/topics/01-05/${encodeURIComponent(mainMenuFormTopicId)}`, {
        method: 'PUT',
        credentials: 'include',
        body
    }).then(res => res.json()).then(data => {
        if (data.status === 200) {
            window.location.href = mainMenuFormBackUrl
        } else {
            console.log(data)
            document.getElementById('office-topic-form-message').textContent = data.message || 'Save failed'
        }
    })
})
