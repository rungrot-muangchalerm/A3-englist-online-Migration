const analyzeQuizModel = require('../../../../model/backoffice/mainoffice/admin/analyze-quiz.model');

const PER_PAGE = 20;

function cleanInt(value, fallback) {
  const number = parseInt(value, 10);
  return Number.isNaN(number) ? fallback : number;
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

function percent(amount, total) {
  if (!total) return '0';
  return ((100 * amount) / total).toFixed(2).replace(/\.?0+$/, '');
}

function resultColor(total) {
  if (total >= 501) return '#ffcccc';
  if (total >= 101) return '#ffffcc';
  if (total >= 50) return '#ccffcc';
  return '#f7f7f7';
}

async function buildList(page) {
  const total = await analyzeQuizModel.countQuestionsWithResults();
  const paging = pageInfo(total, page);
  const questionRows = await analyzeQuizModel.findQuestionsWithResults(paging.offset, PER_PAGE);
  const questionIds = questionRows.map(row => row.QUESTIONS_ID);
  const [answerRows, resultRows] = await Promise.all([
    analyzeQuizModel.findAnswers(questionIds),
    analyzeQuizModel.countResults(questionIds),
  ]);

  const answersByQuestion = new Map();
  answerRows.forEach((row) => {
    const key = Number(row.QUESTIONS_ID);
    if (!answersByQuestion.has(key)) answersByQuestion.set(key, []);
    answersByQuestion.get(key).push({
      answerId: row.ANSWERS_ID,
      correct: row.ANSWERS_CORRECT == 1,
    });
  });

  const resultsByQuestion = new Map();
  resultRows.forEach((row) => {
    const key = Number(row.QUESTIONS_ID);
    if (!resultsByQuestion.has(key)) resultsByQuestion.set(key, new Map());
    resultsByQuestion.get(key).set(row.RETEST_RESULT == null ? 'null' : String(row.RETEST_RESULT), Number(row.amount) || 0);
  });

  return {
    total,
    page: paging.page,
    allPages: paging.allPages,
    rows: questionIds.map((questionId, index) => {
      const answers = answersByQuestion.get(Number(questionId)) || [];
      const resultCounts = resultsByQuestion.get(Number(questionId)) || new Map();
      const answerStats = [0, 1, 2, 3].map((answerIndex) => {
        const answer = answers[answerIndex] || { answerId: '', correct: false };
        const amount = answer.answerId ? resultCounts.get(String(answer.answerId)) || 0 : 0;
        return {
          answerId: answer.answerId,
          amount,
          percent: percent(amount, 0),
          correct: answer.correct,
        };
      });
      const unanswered = resultCounts.get('null') || 0;
      const sum = answerStats.reduce((totalAmount, answer) => totalAmount + answer.amount, 0) + unanswered;
      answerStats.forEach((answer) => {
        answer.percent = percent(answer.amount, sum);
      });
      return {
        no: index + 1,
        questionId,
        correctAnswerId: (answers.find(answer => answer.correct) || {}).answerId || '',
        totalAnswers: sum,
        color: resultColor(sum),
        answers: answerStats,
        unanswered: {
          amount: unanswered,
          percent: percent(unanswered, sum),
        },
      };
    }),
  };
}

module.exports = {
  buildList,
};
