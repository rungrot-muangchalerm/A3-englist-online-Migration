const params = new URLSearchParams(window.location.search);

fetch(`/api/backoffice/admin/analyze-quiz?page=${encodeURIComponent(params.get('page') || '1')}`, {
  credentials: 'include'
}).then(res => res.json()).then(data => {
  if (data.status === 200) {
    for (let pageNumber = 1; pageNumber <= data.data.allPages; pageNumber += 1) {
      const link = document.createElement('a');
      link.href = `/backoffice/mainoffice/admin/analyze-quiz?page=${encodeURIComponent(String(pageNumber))}`;
      const font = document.createElement('font');
      font.color = pageNumber === data.data.page ? 'red' : 'blue';
      font.size = '2';
      font.className = 'f-thai';
      font.textContent = String(pageNumber);
      link.appendChild(font);
      document.getElementById('admin-analyze-pages').appendChild(document.createTextNode('  '));
      document.getElementById('admin-analyze-pages').appendChild(link);
      document.getElementById('admin-analyze-pages').appendChild(document.createTextNode(' '));
      if (pageNumber % 20 === 0) {
        document.getElementById('admin-analyze-pages').appendChild(document.createElement('br'));
        document.getElementById('admin-analyze-pages').appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'));
      }
    }

    data.data.rows.forEach(row => {
      const clone = document.getElementById('admin-analyze-row-template').content.cloneNode(true);
      clone.querySelector('[data-role="no"]').textContent = `No. ${row.no}`;
      clone.querySelector('[data-role="question-id"]').textContent = row.questionId;
      clone.querySelector('[data-role="detail-link"]').href = `/backoffice/mainoffice/admin/check-questions-list/search?question_id=${encodeURIComponent(row.questionId)}`;
      clone.querySelector('[data-role="correct-answer-id"]').textContent = row.correctAnswerId;
      clone.querySelector('[data-role="total-answers"]').textContent = row.totalAnswers;
      clone.querySelector('[data-role="summary-cell"]').style.backgroundColor = row.color;
      clone.querySelector('[data-role="answer-panel"]').style.backgroundColor = row.color;
      row.answers.forEach(answer => {
        const answerClone = document.getElementById('admin-analyze-answer-template').content.cloneNode(true);
        answerClone.querySelector('[data-role="answer-id"]').textContent = `Answer ID : ${answer.answerId}`;
        answerClone.querySelector('[data-role="amount"]').textContent = `Amount : ${answer.amount}`;
        answerClone.querySelector('[data-role="percent"]').textContent = `Percent : ${answer.percent} %`;
        if (answer.correct) {
          answerClone.querySelector('[data-role="answer-id"]').color = 'red';
          answerClone.querySelector('[data-role="amount"]').color = 'red';
          answerClone.querySelector('[data-role="percent"]').color = 'red';
        }
        clone.querySelector('[data-role="answers"]').appendChild(answerClone);
      });
      clone.querySelector('[data-role="unanswered-amount"]').textContent = row.unanswered.amount;
      clone.querySelector('[data-role="unanswered-percent"]').textContent = row.unanswered.percent;
      document.getElementById('admin-analyze-list').appendChild(clone);
    });
  } else {
    console.log(data);
  }
});
