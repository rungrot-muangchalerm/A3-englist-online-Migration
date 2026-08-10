const app = document.getElementById('admin-quiz-comment-app');
const mode = app.dataset.pageMode;
const params = new URLSearchParams(window.location.search);

function setStateClass(el, active, trueClass, falseClass) {
  el.classList.add(active ? trueClass : falseClass);
}

function renderPages(data) {
  for (let pageNumber = 1; pageNumber <= data.allPages; pageNumber += 1) {
    const link = document.createElement('a');
    link.href = `/backoffice/mainoffice/admin/quiz-comment?page=${encodeURIComponent(String(pageNumber))}`;
    const pageText = document.createElement('span');
    pageText.className = pageNumber === data.page ? 'f-thai text-danger' : 'f-thai text-primary';
    pageText.textContent = String(pageNumber);
    link.appendChild(pageText);
    document.getElementById('admin-quiz-comment-pages').appendChild(document.createTextNode('  '));
    document.getElementById('admin-quiz-comment-pages').appendChild(link);
    document.getElementById('admin-quiz-comment-pages').appendChild(document.createTextNode(' '));
    if (pageNumber % 20 === 0) {
      document.getElementById('admin-quiz-comment-pages').appendChild(document.createElement('br'));
      document.getElementById('admin-quiz-comment-pages').appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'));
    }
  }
}

if (mode === 'list') {
  fetch(`/api/backoffice/admin/quiz-comments?page=${encodeURIComponent(params.get('page') || '1')}`, {
    credentials: 'include'
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      renderPages(data.data);
      document.getElementById('admin-quiz-comment-total').textContent = data.data.total;
      data.data.rows.forEach(row => {
        const clone = document.getElementById('admin-quiz-comment-row-template').content.cloneNode(true);
        clone.querySelector('[data-role="row"]').classList.add('bg-light');
        clone.querySelector('[data-role="no"]').textContent = row.no;
        clone.querySelector('[data-role="quiz-id"]').textContent = row.quizId;
        clone.querySelector('[data-role="skill-name"]').textContent = row.skillName;
        clone.querySelector('[data-role="level-name"]').textContent = row.levelName;
        clone.querySelector('[data-role="unanswered"]').textContent = row.unanswered;
        clone.querySelector('[data-role="answered"]').textContent = row.answered;
        clone.querySelector('[data-role="detail-link"]').href = `/backoffice/mainoffice/admin/quiz-comment/${encodeURIComponent(row.quizId)}`;
        clone.querySelector('[data-role="status"]').textContent = row.status;
        setStateClass(clone.querySelector('[data-role="status"]'), row.status !== 'New', 'text-success', 'text-danger');
        clone.querySelector('[data-role="status"]').classList.add(row.status === 'New' ? 'fs-6' : 'small');
        document.getElementById('admin-quiz-comment-list').appendChild(clone);
      });
    } else {
      console.log(data);
    }
  });
}

if (mode === 'detail') {
  document.getElementById('admin-quiz-comment-list-panel').classList.add('d-none');
  document.getElementById('admin-quiz-comment-detail-panel').classList.remove('d-none');
  fetch(`/api/backoffice/admin/quiz-comments/${encodeURIComponent(app.dataset.quizId)}`, {
    credentials: 'include'
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      if (data.data.question) {
        document.getElementById('admin-quiz-comment-path').textContent = data.data.question.path;
        document.getElementById('admin-quiz-comment-question-id').textContent = data.data.question.questionId;
        document.getElementById('admin-quiz-comment-question-text').textContent = data.data.question.questionText;
        if (data.data.question.description) {
          document.getElementById('admin-quiz-comment-description').textContent = data.data.question.description;
        } else {
          document.getElementById('admin-quiz-comment-no-description').classList.remove('d-none');
        }
      }
      data.data.answers.forEach(answer => {
        const clone = document.getElementById('admin-quiz-comment-answer-template').content.cloneNode(true);
        clone.querySelector('[data-role="answer-id"]').textContent = answer.answerId;
        clone.querySelector('[data-role="correct"]').textContent = answer.correct ? 'True' : 'False';
        setStateClass(clone.querySelector('[data-role="correct"]'), answer.correct, 'text-primary', 'text-danger');
        clone.querySelector('[data-role="answer-text"]').textContent = answer.answerText;
        document.getElementById('admin-quiz-comment-answer-list').appendChild(clone);
      });
      data.data.comments.forEach(comment => {
        const clone = document.getElementById('admin-quiz-comment-detail-template').content.cloneNode(true);
        clone.querySelector('[data-role="name"]').textContent = comment.name;
        clone.querySelector('[data-role="email"]').textContent = comment.email;
        clone.querySelector('[data-role="date"]').textContent = comment.date;
        clone.querySelector('[data-role="text"]').textContent = comment.text;
        clone.querySelector('[data-role="status"]').textContent = comment.answered ? '[O]' : '[X]';
        setStateClass(clone.querySelector('[data-role="status"]'), comment.answered, 'text-success', 'text-danger');
        clone.querySelector('[data-role="status"]').classList.add('fw-bold');
        document.getElementById('admin-quiz-comment-detail-list').appendChild(clone);
      });
    } else {
      console.log(data);
    }
  });
}
