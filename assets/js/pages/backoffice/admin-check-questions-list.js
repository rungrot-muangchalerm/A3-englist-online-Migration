const app = document.getElementById('admin-question-list-app');
const pageMode = app.dataset.pageMode;
const params = new URLSearchParams(window.location.search);
const page = params.get('page') || '1';
let apiUrl = '';

if (pageMode === 'show-questions') apiUrl = `/api/backoffice/admin/questions/list/show?page=${encodeURIComponent(page)}`;
if (pageMode === 'hidden-questions') apiUrl = `/api/backoffice/admin/questions/list/hidden?page=${encodeURIComponent(page)}`;
if (pageMode === 'show-related') apiUrl = `/api/backoffice/admin/questions/related/show?page=${encodeURIComponent(page)}&related_type=${encodeURIComponent(params.get('related_type') || '1')}`;
if (pageMode === 'hidden-related') apiUrl = `/api/backoffice/admin/questions/related/hidden?page=${encodeURIComponent(page)}&related_type=${encodeURIComponent(params.get('related_type') || '1')}`;
if (pageMode === 'search') {
  document.getElementById('admin-question-search-panel').classList.remove('d-none');
  document.getElementById('admin-question-search-id').value = params.get('question_id') || '';
  document.getElementById('admin-question-search-keyword').value = params.get('keyword') || '';
  apiUrl = `/api/backoffice/admin/questions/search?page=${encodeURIComponent(page)}&question_id=${encodeURIComponent(params.get('question_id') || '')}&keyword=${encodeURIComponent(params.get('keyword') || '')}`;
}
if (pageMode === 'add-question' || pageMode === 'add-related-item') {
  document.getElementById('admin-question-list-title').textContent = pageMode === 'add-question' ? 'Add Questions' : 'Add Related Item';
}

document.getElementById('admin-question-search-button').addEventListener('click', () => {
  window.location.href = `/backoffice/mainoffice/admin/check-questions-list/search?question_id=${encodeURIComponent(document.getElementById('admin-question-search-id').value)}&keyword=${encodeURIComponent(document.getElementById('admin-question-search-keyword').value)}`;
});

document.querySelectorAll('[data-role="related-type"]').forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = `/backoffice/mainoffice/admin/check-questions-list/${pageMode}?related_type=${encodeURIComponent(link.dataset.typeId)}`;
  });
});

if (apiUrl) {
  fetch(apiUrl, {
    credentials: 'include'
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      document.getElementById('admin-question-list-title').textContent = '';
      const title = document.createElement('span');
      title.className = data.data.mode === 'hidden-questions' || data.data.mode === 'hidden-related' ? 'fs-5 text-warning' : 'fs-5 text-success';
      const bold = document.createElement('b');
      bold.textContent = `${data.data.title} [${data.data.total} Items]`;
      title.appendChild(bold);
      document.getElementById('admin-question-list-title').appendChild(document.createElement('br'));
      document.getElementById('admin-question-list-title').appendChild(title);
      document.getElementById('admin-question-list-title').appendChild(document.createElement('br'));

      document.getElementById('admin-question-pages-table').classList.remove('d-none');
      for (let pageNumber = 1; pageNumber <= data.data.allPages; pageNumber += 1) {
        const pageLink = document.createElement('a');
        pageLink.href = `${window.location.pathname}?${new URLSearchParams({ ...Object.fromEntries(params), page: String(pageNumber) }).toString()}`;
        const pageText = document.createElement('span');
        pageText.className = pageNumber === data.data.page ? 'f-thai text-danger' : 'f-thai text-primary';
        pageText.textContent = String(pageNumber);
        pageLink.appendChild(pageText);
        document.getElementById('admin-question-pages').appendChild(document.createTextNode('  '));
        document.getElementById('admin-question-pages').appendChild(pageLink);
        document.getElementById('admin-question-pages').appendChild(document.createTextNode(' '));
        if (pageNumber % 20 === 0) document.getElementById('admin-question-pages').appendChild(document.createElement('br'));
      }

      if (data.data.mode === 'show-related' || data.data.mode === 'hidden-related') {
        document.getElementById('admin-related-type-menu').classList.remove('d-none');
        data.data.related.forEach(item => {
          const clone = document.getElementById('admin-related-template').content.cloneNode(true);
          clone.querySelector('[data-role="related-id"]').textContent = item.relatedId;
          clone.querySelector('[data-role="type-name"]').textContent = item.typeName;
          clone.querySelector('[data-role="reference-name"]').textContent = item.referenceName;
          clone.querySelector('[data-role="related-text"]').textContent = item.text;
          clone.querySelector('[data-role="active-action"]').textContent = item.active ? '[Set Hidden Item]' : '[Set Show Item]';
          clone.querySelector('[data-role="question-ids"]').textContent = item.questionIds.length ? item.questionIds.join('  ') : 'None Relate Question !!!';
          document.getElementById('admin-related-list').appendChild(clone);
        });
      } else {
        if (!data.data.questions.length && data.data.mode === 'search') document.getElementById('admin-question-empty').classList.remove('d-none');
        data.data.questions.forEach((question, index) => {
          const clone = document.getElementById('admin-question-template').content.cloneNode(true);
          clone.querySelector('[data-role="path"]').textContent = question.path;
          clone.querySelector('[data-role="question-id"]').textContent = question.questionId;
          clone.querySelector('[data-role="active-action"]').textContent = question.active ? 'Set Hidden' : 'Set Show';
          clone.querySelector('[data-role="no"]').textContent = `[${String(index + 1)}]`;
          clone.querySelector('[data-role="question-text"]').textContent = question.questionText;
          question.answers.forEach(answer => {
            const answerClone = document.getElementById('admin-answer-template').content.cloneNode(true);
            answerClone.querySelector('[data-role="answer-id"]').textContent = answer.answerId;
            answerClone.querySelector('[data-role="correct"]').textContent = answer.correct ? 'True' : 'False';
            answerClone.querySelector('[data-role="correct"]').classList.add(answer.correct ? 'text-primary' : 'text-danger');
            answerClone.querySelector('[data-role="answer-text"]').textContent = answer.answerText;
            clone.querySelector('[data-role="answers"]').appendChild(answerClone);
          });
          if (question.description) {
            clone.querySelector('[data-role="description"]').textContent = question.description;
          } else {
            clone.querySelector('[data-role="no-description"]').classList.remove('d-none');
          }
          document.getElementById('admin-question-list').appendChild(clone);
        });
      }
    } else {
      console.log(data);
    }
  });
}
