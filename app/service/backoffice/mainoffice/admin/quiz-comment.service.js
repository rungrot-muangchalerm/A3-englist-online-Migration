const quizCommentModel = require('../../../../model/backoffice/mainoffice/admin/quiz-comment.model');

const PER_PAGE = 20;

const SKILLS = {
  1: 'Reading',
  2: 'Listening',
  3: 'Speaking',
  4: 'Writing',
  5: 'Grammatical',
  6: 'Integrated Skill',
  7: 'Vocabulary',
};

const LEVELS = {
  1: 'Beginner',
  2: 'Lower Intermediate',
  3: 'Intermediate',
  4: 'Upper Intermediate',
  5: 'Advanced',
};

function cleanInt(value, fallback) {
  const number = parseInt(value, 10);
  return Number.isNaN(number) ? fallback : number;
}

function decodeText(value) {
  return String(value || '').replace(/&#039;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function pageInfo(total, page) {
  const allPages = Math.max(Math.ceil(total / PER_PAGE), 1);
  const currentPage = Math.min(Math.max(cleanInt(page, 1), 1), allPages);
  return {
    page: currentPage,
    allPages,
    offset: (currentPage - 1) * PER_PAGE,
  };
}

async function buildList(page) {
  const total = await quizCommentModel.countCommentedQuizzes();
  const paging = pageInfo(total, page);
  const rows = await quizCommentModel.findCommentedQuizzes(paging.offset, PER_PAGE);
  return {
    total,
    page: paging.page,
    allPages: paging.allPages,
    rows: rows.map((row, index) => ({
      no: index + 1,
      quizId: row.quiz_id,
      skillName: SKILLS[row.SKILL_ID] || '',
      levelName: LEVELS[row.LEVEL_ID] || '',
      unanswered: Number(row.unanswered) || 0,
      answered: Number(row.answered) || 0,
      status: Number(row.unanswered) >= 1 ? 'New' : 'Old',
      rowColor: index % 2 === 1 ? '#f0ffff' : '#fffff0',
    })),
  };
}

async function buildDetail(questionId) {
  const [question, answers, comments] = await Promise.all([
    quizCommentModel.findQuestion(questionId),
    quizCommentModel.findAnswers(questionId),
    quizCommentModel.findComments(questionId),
  ]);

  return {
    question: question ? {
      questionId: question.QUESTIONS_ID,
      questionText: decodeText(question.QUESTIONS_TEXT),
      path: [
        question.TEST_NAME || '',
        question.LEVEL_NAME || '',
        question.SKILL_NAME || '',
        question.SSKILL_NAME || '',
        question.DETAIL_NAME || '',
      ].filter(Boolean).join(' » '),
      description: question.DESCRIPTION_TEXT || '',
    } : null,
    answers: answers.map(row => ({
      answerId: row.ANSWERS_ID,
      answerText: decodeText(row.ANSWERS_TEXT),
      correct: row.ANSWERS_CORRECT == 1,
    })),
    comments: comments.map(row => ({
      memberId: row.mem_id,
      email: row.email || '',
      name: [row.fname || '', row.lname || ''].join(' ').trim(),
      date: row.date instanceof Date ? row.date.toISOString().slice(0, 19).replace('T', ' ') : String(row.date || ''),
      text: row.text || '',
      answered: row.status == 1,
    })),
  };
}

module.exports = {
  buildList,
  buildDetail,
};
