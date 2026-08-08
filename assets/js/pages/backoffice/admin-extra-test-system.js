const app = document.getElementById('admin-extra-test-app');
const mode = app.dataset.pageMode;
const params = new URLSearchParams(window.location.search);

if (mode === 'list') {
  fetch(`/api/backoffice/admin/extra-tests?page=${encodeURIComponent(params.get('page') || '1')}`, {
    credentials: 'include'
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      for (let pageNumber = 1; pageNumber <= data.data.allPages; pageNumber += 1) {
        const link = document.createElement('a');
        link.href = `/backoffice/mainoffice/admin/extra-test-system?page=${encodeURIComponent(String(pageNumber))}`;
        const font = document.createElement('font');
        font.color = pageNumber === data.data.page ? 'red' : 'blue';
        font.size = '2';
        font.className = 'f-thai';
        font.textContent = String(pageNumber);
        link.appendChild(font);
        document.getElementById('admin-extra-test-pages').appendChild(document.createTextNode('  '));
        document.getElementById('admin-extra-test-pages').appendChild(link);
        document.getElementById('admin-extra-test-pages').appendChild(document.createTextNode(' '));
        if (pageNumber % 20 === 0) {
          document.getElementById('admin-extra-test-pages').appendChild(document.createElement('br'));
          document.getElementById('admin-extra-test-pages').appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'));
        }
      }
      if (!data.data.tests.length) document.getElementById('admin-extra-test-empty').style.display = '';
      data.data.tests.forEach(test => {
        const clone = document.getElementById('admin-extra-test-row-template').content.cloneNode(true);
        clone.querySelector('[data-role="test-id"]').textContent = test.testId;
        clone.querySelector('[data-role="name"]').textContent = test.name;
        clone.querySelector('[data-role="detail-link"]').href = `/backoffice/mainoffice/admin/extra-test-system/${encodeURIComponent(test.testId)}`;
        clone.querySelector('[data-role="free"]').textContent = test.free ? 'Yes' : 'No';
        clone.querySelector('[data-role="free"]').style.color = test.free ? 'green' : 'red';
        clone.querySelector('[data-role="active"]').textContent = test.active ? 'Online' : 'Offline';
        clone.querySelector('[data-role="active"]').style.color = test.active ? 'green' : 'red';
        clone.querySelector('[data-role="est"]').textContent = test.est ? 'Yes' : 'No';
        clone.querySelector('[data-role="est"]').style.color = test.est ? 'green' : 'red';
        clone.querySelector('[data-role="time"]').textContent = test.time;
        clone.querySelector('[data-role="quiz-amount"]').textContent = test.quizAmount;
        document.getElementById('admin-extra-test-list').appendChild(clone);
      });
    } else {
      console.log(data);
    }
  });
}

if (mode === 'detail') {
  document.getElementById('admin-extra-test-list-panel').style.display = 'none';
  document.getElementById('admin-extra-test-detail-panel').style.display = '';
  fetch(`/api/backoffice/admin/extra-tests/${encodeURIComponent(app.dataset.testId)}`, {
    credentials: 'include'
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      if (data.data.test) {
        document.getElementById('admin-extra-test-detail-name').textContent = data.data.test.name;
        document.getElementById('admin-extra-test-detail-id').textContent = data.data.test.testId;
        document.getElementById('admin-extra-test-name-input').value = data.data.test.name;
        document.getElementById('admin-extra-test-time-input').value = data.data.test.time;
        document.getElementById('admin-extra-test-retest-input').value = data.data.test.retest;
        document.getElementById('admin-extra-test-start-input').value = data.data.test.start;
        document.getElementById('admin-extra-test-stop-input').value = data.data.test.stop;
        document.getElementById('admin-extra-test-quiz-amount').textContent = data.data.test.quizAmount;
      }
      data.data.questions.forEach(question => {
        const clone = document.getElementById('admin-extra-test-question-template').content.cloneNode(true);
        clone.querySelector('[data-role="path"]').textContent = question.path;
        clone.querySelector('[data-role="question-id"]').textContent = question.questionId;
        clone.querySelector('[data-role="no"]').textContent = `[${String(question.no)}]`;
        clone.querySelector('[data-role="question-text"]').textContent = question.questionText;
        question.answers.forEach(answer => {
          const answerClone = document.getElementById('admin-extra-test-answer-template').content.cloneNode(true);
          answerClone.querySelector('[data-role="answer-id"]').textContent = answer.answerId;
          answerClone.querySelector('[data-role="correct"]').textContent = answer.correct ? 'True' : 'False';
          answerClone.querySelector('[data-role="correct"]').style.color = answer.correct ? 'blue' : 'red';
          answerClone.querySelector('[data-role="answer-text"]').textContent = answer.answerText;
          clone.querySelector('[data-role="answers"]').appendChild(answerClone);
        });
        document.getElementById('admin-extra-test-question-list').appendChild(clone);
      });
    } else {
      console.log(data);
    }
  });
}
