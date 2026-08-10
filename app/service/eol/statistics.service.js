const statisticsData = require('../../model/eol/statistics.model');

const SKILL_NAME = {
  1: 'Reading Comprehension',
  2: 'Listening Comprehension',
  3: 'Semi - Speaking',
  4: 'Semi - Writing',
  5: 'Grammar',
  7: 'Vocabulary',
  10: 'Multiple Skills',
};

const SKILL_ORDER = [1, 2, 3, 4, 5, 7, 10];

const LEVEL_NAME = {
  1: 'Beginner',
  2: 'Lower Intermediate',
  3: 'Intermediate',
  4: 'Upper Intermediate',
  5: 'Advanced',
};

function defaultRange() {
  const stop = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return {
    start: formatDateInput(start),
    stop: formatDateInput(stop),
  };
}

function formatDateInput(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function toDateTimeEnd(dateStr) {
  return `${dateStr} 23:59:59`;
}

function diffMinutes(start, stop) {
  const s = new Date(String(start).replace(' ', 'T'));
  const e = new Date(String(stop).replace(' ', 'T'));
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
  return Math.max(0, Math.round((e - s) / 1000 / 60));
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  let htxt = '';
  if (hours > 0) htxt = `${hours} ชั่วโมง `;
  return `<span class="text-success"> ${htxt}${mins} นาที </span>`;
}

async function buildOverview(masterId, query) {
  const selectedGroupId = query.group_id !== undefined ? Number(query.group_id) : 0;
  const range = defaultRange();
  const start = query.start || range.start;
  const stop = query.stop || range.stop;
  const stopWithTime = toDateTimeEnd(stop);

  const rawGroups = await statisticsData.getGroups(masterId);
  const groups = [];
  groups.push({
    type_id: 0,
    name: 'None Group',
    count: await statisticsData.getGroupCount(masterId, 0),
  });
  for (const g of rawGroups) {
    groups.push({
      type_id: g.type_id,
      name: g.name,
      count: await statisticsData.getGroupCount(masterId, g.type_id),
    });
  }

  const rawMembers = await statisticsData.getSubMembers(masterId, selectedGroupId);
  const members = [];
  for (const m of rawMembers) {
    const stats = await statisticsData.getMemberStatistics(m.member_id, start, stopWithTime);
    const mostPercent = {};
    const amount = {};
    for (let level = 1; level <= 5; level += 1) {
      mostPercent[level] = {};
      amount[level] = {};
      for (const skillId of SKILL_ORDER) {
        mostPercent[level][skillId] = 0;
        amount[level][skillId] = 0;
      }
    }
    for (const row of stats) {
      const level = Number(row.level_id);
      const skill = Number(row.skill_id);
      if (mostPercent[level] && mostPercent[level][skill] !== undefined) {
        mostPercent[level][skill] = Number(row.most_percent) || 0;
        amount[level][skill] = Number(row.amount) || 0;
      }
    }

    const skills = SKILL_ORDER.map((skillId) => ({
      skill_id: skillId,
      name: SKILL_NAME[skillId],
      levels: [1, 2, 3, 4, 5].map((level) => ({
        level_id: level,
        name: LEVEL_NAME[level],
        most_percent: mostPercent[level][skillId],
        amount: amount[level][skillId],
      })),
    }));

    const history = await buildLoginHistory(m.member_id, start, stopWithTime);

    members.push({
      member_id: m.member_id,
      user: m.user,
      fname: m.fname,
      lname: m.lname,
      skills,
      history,
    });
  }

  return {
    selectedGroupId,
    groups,
    members,
    start,
    stop,
  };
}

async function buildLoginHistory(memberId, start, stop) {
  const rows = await statisticsData.getLoginHistory(memberId, start, stop);
  const history = [];
  for (const row of rows) {
    const minutes = diffMinutes(row.logdate, row.outdate);
    const tests = await buildSessionTests(memberId, row.logdate, row.outdate);
    history.push({
      logdate: row.logdate,
      outdate: row.outdate,
      date_text: processDate(row.logdate),
      start_time: row.logdate ? row.logdate.split(' ')[1] : '',
      stop_time: row.outdate ? row.outdate.split(' ')[1] : '',
      duration_text: formatDuration(minutes),
      minutes,
      tests,
    });
  }
  const totalMinutes = history.reduce((sum, h) => sum + h.minutes, 0);
  return {
    rows: history,
    total_text: formatDuration(totalMinutes),
  };
}

function processDate(value) {
  const d = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return value;
  const thMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const date = d.getDate();
  const month = thMonths[d.getMonth()];
  const year = d.getFullYear() + 543;
  const time = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  const currentYear = new Date().getFullYear();
  const datePart = d.getFullYear() === currentYear ? `${date} ${month}` : `${date} ${month} ${year}`;
  return `${datePart} เวลา ${time} น.`;
}

async function buildSessionTests(memberId, start, stop) {
  const rows = await statisticsData.getTestsInSession(memberId, start, stop);
  const tests = [];
  const seen = new Set();
  for (const row of rows) {
    const etestId = Number(row.etest_id);
    if (etestId === 0) {
      const key = `${row.skill_id}-${row.level_id}`;
      if (!seen.has(key)) {
        seen.add(key);
        tests.push(`${SKILL_NAME[row.skill_id] || ''} - ${LEVEL_NAME[row.level_id] || ''}`);
      }
    } else if (etestId > 0) {
      const name = await statisticsData.getContestName(etestId);
      if (name && !seen.has(name)) {
        seen.add(name);
        tests.push(name);
      }
    }
  }
  const hasEst = await statisticsData.getEstTestsInSession(memberId, start, stop);
  if (hasEst && !seen.has('EOL Standard Test')) {
    tests.push('EOL Standard Test');
  }
  return tests.length ? tests : ['-'];
}

async function buildEvaluation(masterId, query) {
  const selectedGroupId = query.group_id !== undefined ? Number(query.group_id) : 0;
  const selectedSkillId = query.skill_id !== undefined ? Number(query.skill_id) : 1;
  const selectedLevelId = query.level_id !== undefined ? Number(query.level_id) : 1;
  const sortData = query.sortdata !== undefined ? Number(query.sortdata) : 1;
  const range = defaultRange();
  const start = query.start || range.start;
  const stop = query.stop || range.stop;

  const rawGroups = await statisticsData.getGroups(masterId);
  const groups = [];
  groups.push({
    type_id: 0,
    name: 'None Group',
    count: await statisticsData.getGroupCount(masterId, 0),
  });
  for (const g of rawGroups) {
    groups.push({
      type_id: g.type_id,
      name: g.name,
      count: await statisticsData.getGroupCount(masterId, g.type_id),
    });
  }

  const results = await statisticsData.getEvaluationResults(
    masterId,
    selectedGroupId,
    selectedSkillId,
    selectedLevelId,
    start,
    stop,
    sortData,
  );

  const evaluatedResults = [];
  for (const r of results) {
    const details = await statisticsData.getResultDetails(r.result_id);
    const seenQuiz = new Map();
    for (const d of details) {
      const quizId = String(d.quiz_id);
      if (!seenQuiz.has(quizId)) {
        seenQuiz.set(quizId, String(d.ans_id));
      }
    }
    const quizIds = Array.from(seenQuiz.keys());
    const correctRows = await statisticsData.getCorrectAnswers(quizIds);
    const correctMap = new Map();
    for (const c of correctRows) {
      correctMap.set(String(c.quiz_id), String(c.ans_id));
    }

    let correct = 0;
    for (const [quizId, ansId] of seenQuiz) {
      if (correctMap.get(quizId) === ansId) {
        correct += 1;
      }
    }

    evaluatedResults.push({
      result_id: r.result_id,
      member_id: r.member_id,
      fname: r.fname,
      lname: r.lname,
      percent: Number(r.percent) || 0,
      create_date: r.create_date,
      total: quizIds.length,
      correct,
    });
  }

  return {
    selectedGroupId,
    selectedSkillId,
    selectedLevelId,
    sortData,
    groups,
    results: evaluatedResults,
    start,
    stop,
    skillName: SKILL_NAME[selectedSkillId] || '',
    levelName: LEVEL_NAME[selectedLevelId] || '',
  };
}

async function buildContest(masterId, query) {
  const selectedGroupId = query.group_id !== undefined ? Number(query.group_id) : 0;
  const range = defaultRange();
  const start = query.start || range.start;
  const stop = query.stop || range.stop;

  const rawGroups = await statisticsData.getGroups(masterId);
  const groups = [];
  groups.push({
    type_id: 0,
    name: 'None Group',
    count: await statisticsData.getGroupCount(masterId, 0),
  });
  for (const g of rawGroups) {
    groups.push({
      type_id: g.type_id,
      name: g.name,
      count: await statisticsData.getGroupCount(masterId, g.type_id),
    });
  }

  const contests = await statisticsData.getContestsByMaster(masterId);
  const selectedContestId = query.group_con !== undefined
    ? Number(query.group_con)
    : (contests[0] ? contests[0].exam_id : 0);

  let results = [];
  let examName = '';
  if (selectedContestId) {
    await statisticsData.recalcContestPercents(masterId, selectedGroupId, selectedContestId);
    results = await statisticsData.getContestResults(masterId, selectedGroupId, selectedContestId, start, stop);
    examName = await statisticsData.getContestName(selectedContestId);
  }

  return {
    selectedGroupId,
    selectedContestId,
    groups,
    contests,
    results,
    start,
    stop,
    examName,
    scoreboardUrl: selectedContestId
      ? `/EOL/liveScore/live_score_realtime.php?exam_id=${encodeURIComponent(selectedContestId)}&type_id=${encodeURIComponent(selectedGroupId)}`
      : '',
  };
}

module.exports = {
  buildOverview,
  buildEvaluation,
  buildContest,
};
