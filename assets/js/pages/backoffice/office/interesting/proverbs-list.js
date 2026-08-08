const officeTopicListUrl = '/backoffice/mainoffice/office/interesting/proverbs';
const officeTopicPage = new URLSearchParams(window.location.search).get('page') || '1';

fetch(`/api/backoffice/office/topics/03-16?page=${encodeURIComponent(officeTopicPage)}`, {
  credentials: 'include'
}).then(res => res.json()).then(data => {
    if (data.status === 200) {
        document.getElementById('office-admin-name').textContent = (data.data.currentAdmin ? `${data.data.currentAdmin.prefix} ${data.data.currentAdmin.fname} ${data.data.currentAdmin.lname} [${data.data.currentAdmin.nickname}]` : '')
        document.getElementById('office-topic-type-name').textContent = data.data.typeName
        document.getElementById('office-topic-add-link').href = `${officeTopicListUrl}/add`

        const head = document.getElementById('office-topic-head')
        const headTemplate = document.getElementById('office-topic-head-template')
        const headClone = headTemplate.content.cloneNode(true)
        headClone.querySelector('[data-role="topic-name-head"]').setAttribute('width', data.data.isAdmin ? '50%' : '60%')
        headClone.querySelector('[data-role="management-head"]').setAttribute('width', data.data.isAdmin ? '40%' : '30%')
        headClone.querySelector('[data-role="management-head"]').setAttribute('colspan', data.data.isAdmin ? '3' : '2')
        if (!data.data.isAdmin) {
            headClone.querySelector('[data-role="delete-head"]').remove()
        }
        head.appendChild(headClone)

        const pageContainer = document.getElementById('office-topic-pages')
        const pageTemplate = document.getElementById('office-topic-page-template')
        const pageBreakTemplate = document.getElementById('office-topic-page-break-template')
        for (let i = 1; i <= data.data.allPages; i++) {
            const pageClone = pageTemplate.content.cloneNode(true)
            pageClone.querySelector('[data-role="page-link"]').href = `${officeTopicListUrl}?page=${i}`
            pageClone.querySelector('[data-role="page-number"]').setAttribute('color', data.data.page === i ? 'red' : 'white')
            pageClone.querySelector('[data-role="page-number"]').textContent = i
            pageContainer.appendChild(document.createTextNode('  '))
            pageContainer.appendChild(pageClone)
            pageContainer.appendChild(document.createTextNode('  '))
            if (i % 20 === 0) {
                pageContainer.appendChild(pageBreakTemplate.content.cloneNode(true))
            }
        }

        const container = document.getElementById('office-topic-list')
        const template = document.getElementById('office-topic-row-template')
        if (data.data.topics.length >= 1) {
            data.data.topics.forEach(element => {
                const clone = template.content.cloneNode(true)
                clone.querySelector('[data-role="topic-id"]').textContent = element.topic_id
                clone.querySelector('[data-role="admin-name"]').textContent = element.adminName
                clone.querySelector('[data-role="topic-name"]').textContent = element.topic_name || ''
                clone.querySelector('[data-role="detail-link"]').href = `${officeTopicListUrl}/${element.topic_id}/detail?page=${data.data.page}`
                clone.querySelector('[data-role="toggle-link"]').addEventListener('click', event => {
                    event.preventDefault()
                    fetch(`/api/backoffice/office/topics/03-16/${encodeURIComponent(element.topic_id)}/toggle-active`, {
                        method: 'POST',
                        credentials: 'include'
                    }).then(res => res.json()).then(toggleData => {
                        if (toggleData.status === 200) {
                            window.location.reload()
                        } else {
                            console.log(toggleData)
                        }
                    })
                })
                clone.querySelector('[data-role="active-text"]').setAttribute('color', element.activeState.color)
                clone.querySelector('[data-role="active-text"]').textContent = element.activeState.label
                clone.querySelector('[data-role="edit-link"]').href = `${officeTopicListUrl}/${element.topic_id}/edit?page=${data.data.page}`
                if (data.data.isAdmin) {
                    clone.querySelector('[data-role="delete-link"]').addEventListener('click', () => {
                        if (confirm('Are you sure ? want delete this topic ?')) {
                            fetch(`/api/backoffice/office/topics/03-16/${encodeURIComponent(element.topic_id)}`, {
                                method: 'DELETE',
                                credentials: 'include'
                            }).then(res => res.json()).then(deleteData => {
                                if (deleteData.status === 200) {
                                    window.location.reload()
                                } else {
                                    console.log(deleteData)
                                }
                            })
                        }
                    })
                } else {
                    clone.querySelector('[data-role="delete-cell"]').remove()
                }
                container.appendChild(clone)
            })
        } else {
            const emptyTemplate = document.getElementById('office-topic-empty-template')
            const emptyClone = emptyTemplate.content.cloneNode(true)
            emptyClone.querySelector('[data-role="empty-cell"]').setAttribute('colspan', data.data.isAdmin ? '5' : '4')
            container.appendChild(emptyClone)
        }
    } else {
        console.log(data)
    }
})
