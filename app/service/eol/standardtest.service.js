const standardtestModel = require('../../model/eol/standardtest.model');

const SKILL_NAMES = {
  1: 'Reading Comprehension',
  2: 'Listening Comprehension',
  3: 'Semi-Speaking',
  4: 'Semi-Writing',
  5: 'Grammar',
  7: 'Vocabulary Items',
};

const LEVEL_NAMES = {
  1: 'Beginner',
  2: 'Lower Intermediate',
  3: 'Intermediate',
};

const TEST_SKILLS = [1, 2, 3, 4, 5, 7];
const SET_TEST_ORDER = [2, 1, 5, 4];

const SPECIAL_MEMBER_IDS = new Set([
  30112, 41294, 37013, 52026, 52027, 52028, 52029, 52030, 52031, 52032,
  52033, 52034, 52035, 52036, 52037, 52055, 52056, 52057, 52058, 52061,
  52062, 52063, 52064, 104913,
]);

function nowString() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function dateDiffDays(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  const ms = db - da;
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function buildProgressivePassMap(passRows) {
  const passMap = {};
  passRows.forEach((r) => {
    const skillId = Number(r.skill_id);
    const levelId = Number(r.level_id);
    if (!TEST_SKILLS.includes(skillId) || levelId < 1) return;

    const maxLevel = Math.min(levelId, 3);
    for (let id = 1; id <= maxLevel; id += 1) {
      passMap[`${skillId}-${id}`] = true;
    }
  });
  return passMap;
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

async function getPreTestStatus(memberId) {
  const member = await standardtestModel.getMemberById(memberId);
  if (!member) {
    const err = new Error('Member not found');
    err.code = 'MEMBER_NOT_FOUND';
    throw err;
  }

  const passRows = await standardtestModel.getPassedResults(memberId, 50);
  const passMap = buildProgressivePassMap(passRows);

  const skillStatus = TEST_SKILLS.map((skillId) => ({
    skillId,
    skillName: SKILL_NAMES[skillId],
    levels: [1, 2, 3].map((levelId) => ({
      levelId,
      levelName: LEVEL_NAMES[levelId],
      passed: !!passMap[`${skillId}-${levelId}`],
    })),
  }));

  const passCount = TEST_SKILLS.reduce((count, skillId) => (
    count + [1, 2, 3].filter((levelId) => passMap[`${skillId}-${levelId}`]).length
  ), 0);
  const allPassed = passCount === 18;

  const estRows = await standardtestModel.getEstEtests();
  const etestIds = estRows.map((r) => r.ETEST_ID);

  let eventPass = 0;
  let lastTestMessage = '';
  let waitDays = 0;

  if (etestIds.length > 0) {
    const now = nowString();
    const nowDate = now.slice(0, 10);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sinceDate = thirtyDaysAgo.toISOString().slice(0, 19).replace('T', ' ');

    const lastWithin30 = await standardtestModel.getLastEstResult(memberId, etestIds, sinceDate);
    if (lastWithin30) {
      const diff = dateDiffDays(lastWithin30.create_date.slice(0, 10), nowDate);
      waitDays = 30 - diff;
      lastTestMessage = `${lastWithin30.create_date} [ กรุณารออีก ${waitDays} วัน เพื่อใช้งานใหม่อีกครั้ง ]`;
    } else {
      const anyLast = await standardtestModel.getAnyEstResult(memberId, etestIds);
      if (anyLast) {
        lastTestMessage = `${anyLast.create_date} [ สามารถใช้งานได้ทันที หากเงื่อนไขด้านบนครบถ้วน ]`;
        eventPass = 1;
      } else {
        lastTestMessage = 'ไม่พบข้อมูลการใช้งาน EST [ สามารถใช้งานได้ทันที หากเงื่อนไขด้านบนครบถ้วน ]';
        eventPass = 1;
      }
    }
  }

  if (allPassed && eventPass === 1) {
    eventPass = 1;
  } else if (SPECIAL_MEMBER_IDS.has(Number(memberId))) {
    eventPass = 1;
  } else {
    eventPass = 0;
  }

  return {
    skillStatus,
    passCount,
    allPassed,
    lastTestMessage,
    eventPass,
  };
}

async function createTest(session, memberId, eventPass) {
  if (Number(eventPass) !== 1) {
    const err = new Error('Not eligible for EST');
    err.code = 'NOT_ELIGIBLE';
    throw err;
  }

  const member = await standardtestModel.getMemberById(memberId);
  if (!member) {
    const err = new Error('Member not found');
    err.code = 'MEMBER_NOT_FOUND';
    throw err;
  }

  const estRows = await standardtestModel.getEstEtests();
  if (estRows.length === 0) {
    const err = new Error('No EST test available');
    err.code = 'NO_EST';
    throw err;
  }

  const rand = Math.floor(Math.random() * estRows.length);
  const etest = estRows[rand];
  const etestId = etest.ETEST_ID;
  const allTime = Number(etest.ETEST_TIME || 0) * 60;

  const quiz = { id: [null], skillId: [null], relateId: [null] };
  const pages = [null];
  let count = 0;

  for (let k = 0; k < SET_TEST_ORDER.length; k += 1) {
    const skillId = SET_TEST_ORDER[k];
    const rows = await standardtestModel.getEstQuestions(etestId, skillId);

    const withRelate = rows.filter((r) => r.GQUESTION_ID);
    const withoutRelate = rows.filter((r) => !r.GQUESTION_ID);

    const usedIds = new Set();

    for (let i = 0; i < withRelate.length; i += 1) {
      const row = withRelate[i];
      if (usedIds.has(row.QUESTIONS_ID)) continue;
      usedIds.add(row.QUESTIONS_ID);
      count += 1;
      quiz.id[count] = row.QUESTIONS_ID;
      quiz.skillId[count] = row.SKILL_ID;
      quiz.relateId[count] = row.GQUESTION_ID;

      const prevCount = count - 1;
      const prevRelateId = quiz.relateId[prevCount];
      const pageStart = pages[pages.length - 1] || 0;
      if (
        count - pageStart >= 4
        || count === 1
        || quiz.skillId[prevCount] !== row.SKILL_ID
      ) {
        if (row.GQUESTION_ID !== prevRelateId) {
          pages.push(count);
        }
      }
    }

    const remaining = withoutRelate.filter((r) => !usedIds.has(r.QUESTIONS_ID));

    for (let i = 0; i < remaining.length; i += 1) {
      const row = remaining[i];
      count += 1;
      quiz.id[count] = row.QUESTIONS_ID;
      quiz.skillId[count] = row.SKILL_ID;
      quiz.relateId[count] = 'none';

      const prevRelateId = quiz.relateId[count - 1];
      const currentPageStart = pages[pages.length - 1] || 0;
      if (quiz.relateId[count] !== prevRelateId) {
        pages.push(count);
      }
      if (currentPageStart + 5 <= count) {
        pages.push(count);
      }
    }
  }

  session.standardtest = {
    tester: memberId,
    etestId,
    amount: count,
    quiz,
    pages,
    answers: {},
    sound: {},
    timeLeft: allTime,
    fnTime: allTime,
    started: false,
  };

  return {
    amount: count,
    etestId,
    timeSeconds: allTime,
  };
}

function requireSession(session) {
  const st = session.standardtest;
  if (!st || !st.tester) {
    const err = new Error('No active test');
    err.code = 'NO_SESSION';
    throw err;
  }
  return st;
}

async function getTestPage(session, pageNum) {
  const st = requireSession(session);
  const count = st.pages.length - 1;
  let page = Number(pageNum) || 1;
  if (page < 1) page = 1;
  if (page > count) page = count;

  const start = st.pages[page];
  let stop = st.pages[page + 1] - 1;
  if (stop <= 0) stop = st.amount;

  const questions = [];
  if (start >= 1 && stop >= 1 && start <= stop) {
    for (let i = start; i <= stop; i += 1) {
      const questionId = st.quiz.id[i];
      const relateId = st.quiz.relateId[i];
      const prevRelateId = st.quiz.relateId[i - 1];

      let media = null;
      if (relateId && relateId !== 'none' && relateId !== prevRelateId) {
        const raw = await standardtestModel.getRelatedMedia(relateId);
        media = formatRelatedMedia(raw);
      }

      const q = await standardtestModel.getQuestionText(questionId);
      const answers = await standardtestModel.getAnswers(questionId);
      const currentAnswer = st.answers[i] || [];

      questions.push({
        number: i,
        questionId,
        questionText: q ? q.QUESTIONS_TEXT : '',
        skillName: SKILL_NAMES[q ? q.SKILL_ID : 0],
        media,
        answers: answers.map((a) => ({
          answerId: a.ANSWERS_ID,
          text: a.ANSWERS_TEXT,
        })),
        currentAnswer,
        soundPlayed: !!st.sound[i],
      });
    }
  }

  return {
    page,
    pageCount: count,
    amount: st.amount,
    timeLeft: st.timeLeft,
    questions,
  };
}

async function recordAnswers(session, pageNum, body) {
  const st = requireSession(session);
  const page = Number(pageNum) || 1;
  const start = st.pages[page];
  let stop = st.pages[page + 1] - 1;
  if (stop <= 0) stop = st.amount;

  if (start >= 1 && stop >= 1 && start <= stop) {
    for (let i = start; i <= stop; i += 1) {
      st.answers[i] = [];
      for (let k = 1; k <= 4; k += 1) {
        const val = body[`ans_${i}_${k}`];
        if (val && Number(val) >= 1) {
          st.answers[i].push(Number(val));
        }
      }
      const played = body[`played_${i}`];
      if (played === '1') {
        st.sound[i] = 1;
      }
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
  if (st.tester !== memberId) {
    const err = new Error('Invalid tester');
    err.code = 'INVALID_TESTER';
    throw err;
  }

  let sum = 0;
  const details = [];
  for (let i = 1; i <= st.amount; i += 1) {
    const questionId = st.quiz.id[i];
    const selected = st.answers[i] || [];
    let ansId = 0;
    let isCorrect = false;

    if (selected.length > 0) {
      ansId = selected[0];
      const answers = await standardtestModel.getAnswers(questionId);
      const correctAnswer = answers.find((a) => a.ANSWERS_CORRECT === 1);
      if (correctAnswer && Number(correctAnswer.ANSWERS_ID) === ansId) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      sum += 1;
    } else if (ansId > 0) {
      sum -= 0.25;
    }

    details.push({ quizId: questionId, ansId });
  }

  const resultId = await standardtestModel.getNextResultId();
  const now = nowString();
  await standardtestModel.insertResult(resultId, memberId, st.etestId, sum, now);

  let detailId = await standardtestModel.getNextResultDetailId();
  for (const item of details) {
    await standardtestModel.insertResultDetail(detailId, resultId, item.quizId, item.ansId);
    detailId += 1;
  }

  delete session.standardtest;

  return {
    resultId,
    percent: sum,
    redirect: `/eol/eoltest/report/standard?result_id=${resultId}`,
  };
}

module.exports = {
  getPreTestStatus,
  createTest,
  getTestPage,
  recordAnswers,
  finishTest,
};
