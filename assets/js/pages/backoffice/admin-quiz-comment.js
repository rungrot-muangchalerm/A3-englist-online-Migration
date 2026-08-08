const app = document.getElementById('admin-quiz-comment-app');
const mode = app.dataset.pageMode;
const params = new URLSearchParams(window.location.search);

function renderPages(data) {
  for (let pageNumber = 1; pageNumber <= data.allPages; pageNumber += 1) {
    const link = document.createElement('a');
    link.href = `/backoffice/mainoffice/admin/quiz-comment?page=${encodeURIComponent(String(pageNumber))}`;
    const font = document.createElement('font');
    font.color = pageNumber === data.page ? 'red' : 'blue';
    font.size = '2';
    font.className = 'f-thai';
    font.textContent = String(pageNumber);
    link.appendChild(font);
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
        clone.querySelector('[data-role="row"]').style.backgroundColor = row.rowColor;
        clone.querySelector('[data-role="no"]').textContent = row.no;
        clone.querySelector('[data-role="quiz-id"]').textContent = row.quizId;
        clone.querySelector('[data-role="skill-name"]').textContent = row.skillName;
        clone.querySelector('[data-role="level-name"]').textContent = row.levelName;
        clone.querySelector('[data-role="unanswered"]').textContent = row.unanswered;
        clone.querySelector('[data-role="answered"]').textContent = row.answered;
        clone.querySelector('[data-role="detail-link"]').href = `/backoffice/mainoffice/admin/quiz-comment/${encodeURIComponent(row.quizId)}`;
        clone.querySelector('[data-role="status"]').textContent = row.status;
        clone.querySelector('[data-role="status"]').style.color = row.status === 'New' ? 'red' : 'green';
        clone.querySelector('[data-role="status"]').style.fontSize = row.status === 'New' ? '16px' : '12px';
        document.getElementById('admin-quiz-comment-list').appendChild(clone);
      });
    } else {
      console.log(data);
    }
  });
}

if (mode === 'detail') {
  document.getElementById('admin-quiz-comment-list-panel').style.display = 'none';
  document.getElementById('admin-quiz-comment-detail-panel').style.display = '';
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
          document.getElementById('admin-quiz-comment-no-description').style.display = '';
        }
      }
      data.data.answers.forEach(answer => {
        const clone = document.getElementById('admin-quiz-comment-answer-template').content.cloneNode(true);
        clone.querySelector('[data-role="answer-id"]').textContent = answer.answerId;
        clone.querySelector('[data-role="correct"]').textContent = answer.correct ? 'True' : 'False';
        clone.querySelector('[data-role="correct"]').style.color = answer.correct ? 'blue' : 'red';
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
        clone.querySelector('[data-role="status"]').style.color = comment.answered ? 'green' : 'red';
        clone.querySelector('[data-role="status"]').style.fontWeight = 'bold';
        document.getElementById('admin-quiz-comment-detail-list').appendChild(clone);
      });
    } else {
      console.log(data);
    }
  });
}
