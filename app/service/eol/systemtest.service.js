const systemtestModel = require('../../model/eol/systemtest.model');

const SKILL_NAMES = {
  1: 'Reading Comprehension',
  2: 'Listening Comprehension',
  3: 'Semi-Speaking',
  4: 'Semi-Writing',
  5: 'Grammar',
  6: 'Intergrated Skill : Cloze Test',
  7: 'Vocabulary',
  10: 'Multiple Skills',
};

const LEVEL_NAMES = {
  1: 'Beginner',
  2: 'Lower Intermediate',
  3: 'Intermediate',
  4: 'Upper Intermediate',
  5: 'Advanced',
};

const VALID_SKILLS = new Set([1, 2, 3, 4, 5, 7, 10]);
const ALL_SINGLE_SKILLS = [1, 2, 3, 4, 5, 7];

function isValidSession(session) {
  return VALID_SKILLS.has(Number(session.xSkillId)) && Number(session.xLevelId) >= 1 && Number(session.xLevelId) <= 5;
}

function normalizeSelectedSkills(skillId, selected) {
  if (Number(skillId) !== 10) return [Number(skillId)];
  if (!Array.isArray(selected) || selected.length === 0) return [...ALL_SINGLE_SKILLS];
  return selected
    .map((s) => Number(s))
    .filter((s) => ALL_SINGLE_SKILLS.includes(s))
    .sort((a, b) => a - b);
}

function distributeAmount(amount, skills, counts) {
  const skillAmounts = {};
  skills.forEach((s) => { skillAmounts[s] = 0; });
  let used = 0;
  while (used < amount) {
    for (const skill of skills) {
      if (used >= amount) break;
      if (skillAmounts[skill] < counts[skill]) {
        skillAmounts[skill] += 1;
        used += 1;
      }
    }
    // safety: if no skill can be increased, break to avoid infinite loop
    const canGrow = skills.some((s) => skillAmounts[s] < counts[s]);
    if (!canGrow) break;
  }
  return skillAmounts;
}

function formatRelatedMedia(media) {
  if (!media) return null;
  const type = Number(media.GQUESTION_TYPE_ID);
  const rawText = media.GQUESTION_TEXT || '';
  if (type === 1) {
    return { type: 'text', content: rawText };
  }
  if (type === 2) {
    let src = rawText
      .replace('/home/engtest/domains/engtest.net/public_html/', '')
      .replace('/home/engtest/domains/engtest.net/public_html', '');
    src = `/${src}`; // absolute from domain root
    return { type: 'image', src };
  }
  if (type === 3) {
    let src = rawText
      .replace('/home/engtest/domains/engtest.net/public_html/files/sound/', '')
      .replace('/home/engtest/domains/engtest.net/public_html/files/sound', '');
    src = src.replace(/\.flv$/i, '.mp3');
    src = `/files/sound/${src}`;
    return { type: 'audio', src };
  }
  return null;
}

async function getStatus(session) {
  if (!isValidSession(session)) {
    return { hasSession: false };
  }
  const quizCount = Array.isArray(session.quizIds) ? session.quizIds.length - 1 : 0;
  const answeredNumbers = session.answers ? Object.keys(session.answers).map((n) => Number(n)) : [];
  return {
    hasSession: true,
    skillId: session.xSkillId,
    skillName: SKILL_NAMES[session.xSkillId],
    levelId: session.xLevelId,
    levelName: LEVEL_NAMES[session.xLevelId],
    amount: session.amount || 0,
    quizCount,
    answeredCount: answeredNumbers.length,
    answeredNumbers,
    timeLeft: session.timeLeft || 0,
    isMultiple: Number(session.xSkillId) === 10,
  };
}

async function createTest(session, amount, selectedSkills) {
  if (!isValidSession(session)) {
    throw Object.assign(new Error('Invalid test session'), { status: 400 });
  }
  const totalAmount = Number(amount);
  if (!Number.isInteger(totalAmount) || totalAmount < 10 || totalAmount > 50) {
    throw Object.assign(new Error('Amount must be an integer between 10 and 50'), { status: 400 });
  }

  const skillId = Number(session.xSkillId);
  const levelId = Number(session.xLevelId);
  const skills = normalizeSelectedSkills(skillId, selectedSkills);

  // Count available questions per skill
  const counts = {};
  for (const s of skills) {
    counts[s] = await systemtestModel.countQuestions(s, levelId);
  }
  const totalAvailable = Object.values(counts).reduce((a, b) => a + b, 0);
  if (totalAvailable < totalAmount) {
    throw Object.assign(new Error('Not enough questions for the selected criteria'), { status: 400 });
  }

  const skillAmounts = distributeAmount(totalAmount, skills, counts);

  // Fetch random questions per skill and combine sequentially by skill
  const quizIds = [null];
  for (const s of skills) {
    const needed = skillAmounts[s];
    if (needed <= 0) continue;
    const rows = await systemtestModel.getRandomQuestions(s, levelId, needed);
    if (rows.length < needed) {
      throw Object.assign(new Error(`Not enough questions for skill ${s}`), { status: 400 });
    }
    rows.forEach((r) => quizIds.push(r.QUESTIONS_ID));
  }

  session.amount = totalAmount;
  session.quizIds = quizIds;
  session.answers = {};
  session.timeLeft = totalAmount * 60;

  return {
    amount: totalAmount,
    timeMinutes: totalAmount,
    questionCount: totalAmount,
  };
}

async function getQuestion(session, quizNum) {
  if (!isValidSession(session) || !session.amount || !Array.isArray(session.quizIds)) {
    throw Object.assign(new Error('No active test'), { status: 400 });
  }
  const num = Number(quizNum);
  if (!Number.isInteger(num) || num < 1 || num > session.amount) {
    throw Object.assign(new Error('Invalid question number'), { status: 400 });
  }
  const quizId = session.quizIds[num];
  if (!quizId) {
    throw Object.assign(new Error('Question not found in session'), { status: 400 });
  }

  const question = await systemtestModel.getQuestion(quizId);
  if (!question) {
    throw Object.assign(new Error('Question not found'), { status: 404 });
  }

  const answers = await systemtestModel.getAnswers(quizId);
  const related = await systemtestModel.getRelatedMedia(quizId);
  const media = formatRelatedMedia(related);

  return {
    amount: session.amount,
    quizId: num,
    questionId: quizId,
    skillName: SKILL_NAMES[question.SKILL_ID],
    questionText: question.QUESTIONS_TEXT,
    media,
    answers: answers.map((a) => ({
      answerId: a.ANSWERS_ID,
      text: a.ANSWERS_TEXT,
    })),
    currentAnswer: session.answers[num] || null,
    timeLeft: session.timeLeft || session.amount * 60,
  };
}

async function recordAnswer(session, quizNum, answerId, timeLeft) {
  if (!isValidSession(session) || !session.amount) {
    throw Object.assign(new Error('No active test'), { status: 400 });
  }
  const num = Number(quizNum);
  if (!Number.isInteger(num) || num < 1 || num > session.amount) {
    throw Object.assign(new Error('Invalid question number'), { status: 400 });
  }

  session.answers = session.answers || {};
  if (answerId !== undefined && answerId !== null && answerId !== '') {
    session.answers[num] = Number(answerId);
  }

  const time = Number(timeLeft);
  if (Number.isFinite(time) && time >= 0) {
    session.timeLeft = time;
  }

  let next = num + 1;
  if (next > session.amount) next = 1;
  return { nextQuizId: next };
}

async function finishTest(session, memberId) {
  if (!isValidSession(session) || !session.amount || !Array.isArray(session.quizIds)) {
    throw Object.assign(new Error('No active test'), { status: 400 });
  }

  const amount = Number(session.amount);
  let correct = 0;
  const detailChecks = [];
  for (let i = 1; i <= amount; i += 1) {
    const quizId = session.quizIds[i];
    const ansId = session.answers[i] || 0;
    const correctId = await systemtestModel.getCorrectAnswerId(quizId);
    const isCorrect = correctId && Number(correctId) === Number(ansId);
    if (isCorrect) correct += 1;
    detailChecks.push({ quizId, ansId });
  }

  const percent = Number(((correct / amount) * 100).toFixed(2));
  const resultId = await systemtestModel.getNextResultId();
  await systemtestModel.insertResult(
    resultId,
    memberId,
    session.xSkillId,
    session.xLevelId,
    percent,
  );

  let detailId = await systemtestModel.getNextResultDetailId();
  for (const item of detailChecks) {
    await systemtestModel.insertResultDetail(detailId, resultId, item.quizId, item.ansId);
    detailId += 1;
  }

  // Clear test state from session (like PHP unset)
  delete session.xSkillId;
  delete session.xLevelId;
  delete session.amount;
  delete session.quizIds;
  delete session.answers;
  delete session.timeLeft;

  return {
    resultId,
    percent,
    redirect: `/eol/eoltest/report/academic?result_id=${resultId}`,
  };
}

module.exports = {
  getStatus,
  createTest,
  getQuestion,
  recordAnswer,
  finishTest,
};
