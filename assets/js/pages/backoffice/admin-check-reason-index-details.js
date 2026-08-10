const app = document.getElementById('admin-reason-app');
const mode = app.dataset.pageMode;
let apiPath = '/api/backoffice/admin/reasons';
if (mode === 'skill') apiPath = `/api/backoffice/admin/reasons/${encodeURIComponent(app.dataset.skillPath)}`;
if (mode === 'detail') apiPath = `/api/backoffice/admin/reasons/detail/${encodeURIComponent(app.dataset.detailId)}`;
if (mode === 'quiz') apiPath = `/api/backoffice/admin/reasons/quiz/${encodeURIComponent(app.dataset.quizId)}`;

fetch(apiPath, {
  credentials: 'include'
}).then(res => res.json()).then(data => {
  if (data.status === 200) {
    if (data.data.mode === 'list') {
      document.getElementById('admin-reason-list-amount').textContent = data.data.amount;
      data.data.details.forEach(detail => {
        const clone = document.getElementById('admin-reason-list-template').content.cloneNode(true);
        clone.querySelector('[data-role="no"]').textContent = detail.no;
        clone.querySelector('[data-role="detail-id"]').textContent = detail.detailId;
        clone.querySelector('[data-role="sskill-id"]').textContent = detail.sskillId;
        clone.querySelector('[data-role="sskill-name"]').textContent = detail.sskillName;
        clone.querySelector('[data-role="detail-code"]').textContent = detail.detailCode;
        clone.querySelector('[data-role="detail-name"]').textContent = `${detail.detailName}`;
        clone.querySelector('[data-role="detail-link"]').href = `/backoffice/mainoffice/admin/check-reason-index-details/detail/${encodeURIComponent(detail.detailId)}`;
        document.getElementById('admin-reason-list').appendChild(clone);
      });
    }

    if (data.data.mode === 'skill') {
      document.getElementById('admin-reason-list-table').classList.add('d-none');
      document.getElementById('admin-reason-skill-table').classList.remove('d-none');
      document.getElementById('admin-reason-skill-title').classList.remove('d-none');
      document.getElementById('admin-reason-skill-name').textContent = data.data.selectedSkillName;
      document.getElementById('admin-reason-skill-amount').textContent = data.data.amount;
      data.data.details.forEach(detail => {
        const clone = document.getElementById('admin-reason-skill-template').content.cloneNode(true);
        clone.querySelector('[data-role="no"]').textContent = detail.no;
        clone.querySelector('[data-role="detail-id"]').textContent = detail.detailId;
        clone.querySelector('[data-role="sskill-id"]').textContent = detail.sskillId;
        clone.querySelector('[data-role="sskill-name"]').textContent = detail.sskillName;
        clone.querySelector('[data-role="detail-name"]').textContent = `${detail.detailName}`;
        clone.querySelector('[data-role="detail-link"]').href = `/backoffice/mainoffice/admin/check-reason-index-details/detail/${encodeURIComponent(detail.detailId)}`;
        clone.querySelector('[data-role="level-1"]').textContent = detail.levels[0];
        clone.querySelector('[data-role="level-2"]').textContent = detail.levels[1];
        clone.querySelector('[data-role="level-3"]').textContent = detail.levels[2];
        clone.querySelector('[data-role="level-4"]').textContent = detail.levels[3];
        clone.querySelector('[data-role="level-5"]').textContent = detail.levels[4];
        document.getElementById('admin-reason-skill-list').appendChild(clone);
      });
    }

    if (data.data.mode === 'detail') {
      document.getElementById('admin-reason-list-table').classList.add('d-none');
      document.getElementById('admin-reason-detail-table').classList.remove('d-none');
      document.getElementById('admin-reason-detail-title').classList.remove('d-none');
      document.getElementById('admin-reason-detail-heading').textContent = `Found Quiz By Detail ID : ${data.data.detail.detailName} [ ${data.data.detail.detailId} ] : ${data.data.detail.amount} Quizes`;
      data.data.questions.forEach(question => {
        const clone = document.getElementById('admin-reason-detail-template').content.cloneNode(true);
        clone.querySelector('[data-role="no"]').textContent = question.no;
        clone.querySelector('[data-role="question-id"]').textContent = question.questionId;
        clone.querySelector('[data-role="quiz-link"]').href = `/backoffice/mainoffice/admin/check-reason-index-details/quiz/${encodeURIComponent(question.questionId)}`;
        clone.querySelector('[data-role="test-name"]').textContent = question.testName;
        clone.querySelector('[data-role="level-name"]').textContent = question.levelName;
        clone.querySelector('[data-role="skill-id"]').textContent = question.skillId;
        clone.querySelector('[data-role="skill-name"]').textContent = question.skillName;
        clone.querySelector('[data-role="sskill-id"]').textContent = question.sskillId;
        clone.querySelector('[data-role="sskill-name"]').textContent = question.sskillName;
        document.getElementById('admin-reason-detail-list').appendChild(clone);
      });
    }

    if (data.data.mode === 'quiz') {
      document.getElementById('admin-reason-list-table').classList.add('d-none');
      document.getElementById('admin-reason-quiz-table').classList.remove('d-none');
      if (data.data.question) {
        document.getElementById('admin-reason-quiz-path').textContent = data.data.question.path;
        document.getElementById('admin-reason-quiz-id').textContent = data.data.question.questionId;
        document.getElementById('admin-reason-quiz-text').textContent = data.data.question.questionText;
      }
      data.data.answers.forEach(answer => {
        const clone = document.getElementById('admin-reason-answer-template').content.cloneNode(true);
        clone.querySelector('[data-role="answer-id"]').textContent = answer.answerId;
        clone.querySelector('[data-role="correct"]').textContent = answer.correct ? 'True' : 'False';
        clone.querySelector('[data-role="correct"]').classList.add(answer.correct ? 'text-primary' : 'text-danger');
        clone.querySelector('[data-role="answer-text"]').textContent = answer.answerText;
        document.getElementById('admin-reason-answer-list').appendChild(clone);
      });
      if (data.data.description) {
        document.getElementById('admin-reason-description').textContent = data.data.description;
      } else {
        document.getElementById('admin-reason-no-description').classList.remove('d-none');
      }
    }
  } else {
    console.log(data);
  }
});
