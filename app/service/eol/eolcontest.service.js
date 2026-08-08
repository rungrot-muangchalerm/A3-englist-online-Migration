const eolcontestModel = require('../../model/eol/eolcontest.model');

const SKILL_NAMES = {
  1: 'Reading Comprehension',
  2: 'Listening Comprehension',
  3: 'Semi-Speaking',
  4: 'Semi-Writing',
  5: 'Grammar',
  6: 'Intergrated Skill : Cloze Test',
  7: 'Vocabulary',
};

function nowString() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function shuffleArray(arr) {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
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
    src = `/assets/${src}`;
    return { type: 'image', src };
  }
  if (type === 3) {
    let src = rawText
      .replace('/home/engtest/domains/engtest.net/public_html/files/sound/', '')
      .replace('/home/engtest/domains/engtest.net/public_html/files/sound', '');
    src = src.replace(/\.flv$/i, '.mp3');
    src = `/assets/files/sound/${src}`;
    return { type: 'audio', src };
  }
  return null;
}

async function getExams(memberId, masterId, groupType) {
  const headerRows = await eolcontestModel.findExamsByMaster(masterId);
  const exams = [];
  for (const row of headerRows) {
    const allow = await eolcontestModel.findAllowgroup(row.exam_id, groupType);
    const amount = row.exam_type == 2
      ? await eolcontestModel.countCustomQuestions(row.exam_id)
      : await eolcontestModel.countSystemQuestions(row.exam_id);
    exams.push({
      examId: row.exam_id,
      examName: row.exam_name,
      testtime: row.testtime,
      testType: row.test_type,
      active: row.active,
      examType: row.exam_type,
      amount,
      allowed: !!allow,
    });
  }
  return exams;
}

async function createSession(session, memberId, masterId, groupType, examId) {
  const exam = await eolcontestModel.findExamById(examId, masterId);
  if (!exam) {
    const err = new Error('Exam not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  if (Number(exam.active) !== 1) {
    const err = new Error('Exam is not active');
    err.code = 'NOT_ACTIVE';
    throw err;
  }
  const allow = await eolcontestModel.findAllowgroup(examId, groupType);
  if (!allow) {
    const err = new Error('This exam is not available for your group');
    err.code = 'NOT_ALLOWED';
    throw err;
  }

  let questionRows = [];
  if (Number(exam.exam_type) === 2) {
    questionRows = await eolcontestModel.findCustomQuestionIds(examId);
  } else {
    questionRows = await eolcontestModel.findSystemQuestionIds(examId);
  }
  if (questionRows.length === 0) {
    const err = new Error('No questions in this exam');
    err.code = 'NO_QUESTIONS';
    throw err;
  }

  let quizIds = questionRows.map((r) => ({
    questionId: Number(r.question_id),
    relateId: r.GQUESTION_ID ? Number(r.GQUESTION_ID) : null,
  }));
  if (Number(exam.test_type) === 1) {
    quizIds = shuffleArray(quizIds);
  }

  const amount = quizIds.length;
  const allTime = Number(exam.testtime || 0) * 60;

  session.eolcontest = {
    memberId,
    examId: Number(examId),
    examType: Number(exam.exam_type),
    testType: Number(exam.test_type),
    amount,
    quizIds: [null, ...quizIds],
    answers: {},
    timeLeft: allTime,
    fnTime: allTime,
    started: false,
  };

  return {
    examId: Number(examId),
    examName: exam.exam_name,
    testType: exam.test_type,
    examType: exam.exam_type,
    amount,
    timeSeconds: allTime,
  };
}

function requireSession(session) {
  const st = session.eolcontest;
  if (!st || !st.examId) {
    const err = new Error('No active contest session');
    err.code = 'NO_SESSION';
    throw err;
  }
  return st;
}

async function getPage(session, pageNum) {
  const st = requireSession(session);
  let page = Number(pageNum) || 1;
  if (page < 1) page = 1;
  if (page > st.amount) page = st.amount;

  const item = st.quizIds[page];
  const questionId = item.questionId;
  const relateId = item.relateId;

  let media = null;
  let questionText = '';
  let skillName = '';
  let answers = [];

  if (st.examType === 2) {
    const q = await eolcontestModel.getCustomQuestion(questionId);
    questionText = q ? q.question_text : '';
    const ansRows = await eolcontestModel.getCustomAnswers(questionId);
    answers = ansRows.map((a) => ({
      answerId: a.answer_id,
      text: a.answer_text,
    }));
  } else {
    if (relateId) {
      const raw = await eolcontestModel.getRelatedMedia(relateId);
      media = formatRelatedMedia(raw);
    }
    const q = await eolcontestModel.getSystemQuestion(questionId);
    questionText = q ? q.QUESTIONS_TEXT : '';
    skillName = SKILL_NAMES[q ? q.SKILL_ID : 0] || '';
    const ansRows = await eolcontestModel.getSystemAnswers(questionId);
    answers = ansRows.map((a) => ({
      answerId: a.ANSWERS_ID,
      text: a.ANSWERS_TEXT,
    }));
  }

  return {
    page,
    amount: st.amount,
    timeLeft: st.timeLeft,
    examType: st.examType,
    testType: st.testType,
    question: {
      number: page,
      questionId,
      questionText,
      skillName,
      media,
      answers,
    },
    currentAnswer: st.answers[page] || 0,
  };
}

async function recordAnswers(session, pageNum, body) {
  const st = requireSession(session);
  const page = Number(pageNum) || 1;
  if (page >= 1 && page <= st.amount) {
    const val = body[`ans_${page}`];
    if (val && Number(val) >= 1) {
      st.answers[page] = Number(val);
    }
  }
  const timeLeft = Number(body.time_left);
  if (Number.isFinite(timeLeft) && timeLeft >= 0) {
    st.timeLeft = timeLeft;
  }
  return { ok: true };
}

async function finishTest(session, memberId) {
  const st = requireSession(session);
  if (st.memberId !== memberId) {
    const err = new Error('Invalid tester');
    err.code = 'INVALID_TESTER';
    throw err;
  }

  let sum = 0;
  const details = [];
  for (let i = 1; i <= st.amount; i += 1) {
    const item = st.quizIds[i];
    const questionId = item.questionId;
    const selected = st.answers[i] || 0;
    let isCorrect = false;

    if (selected > 0) {
      if (st.examType === 2) {
        const ansRows = await eolcontestModel.getCustomAnswers(questionId);
        const correct = ansRows.find((a) => Number(a.answer) === 1 && Number(a.answer_id) === selected);
        if (correct) isCorrect = true;
      } else {
        const ansRows = await eolcontestModel.getSystemAnswers(questionId);
        const correct = ansRows.find((a) => Number(a.ANSWERS_CORRECT) === 1 && Number(a.ANSWERS_ID) === selected);
        if (correct) isCorrect = true;
      }
    }

    if (isCorrect) {
      sum += 1;
    }

    details.push({ quizId: questionId, ansId: selected });
  }

  const percent = st.amount > 0 ? Number(((sum / st.amount) * 100).toFixed(2)) : 0;
  const now = nowString();
  const resultId = await eolcontestModel.getNextResultId();
  await eolcontestModel.insertResult(resultId, memberId, st.examId, percent, now);

  let detailId = await eolcontestModel.getNextResultDetailId();
  for (const item of details) {
    await eolcontestModel.insertResultDetail(detailId, resultId, item.quizId, item.ansId);
    detailId += 1;
  }

  await eolcontestModel.upsertRealtime(memberId, st.examId, percent, now);
  delete session.eolcontest;

  return {
    resultId,
    percent,
    redirect: `/eol/eoltest/report/contest?result_id=${resultId}`,
  };
}

module.exports = {
  getExams,
  createSession,
  getPage,
  recordAnswers,
  finishTest,
};
