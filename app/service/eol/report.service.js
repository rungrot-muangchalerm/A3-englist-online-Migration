const path = require('path');
const fs = require('fs');
const mysqli = require('../../config/mysqli.config');

const SKILL_NAMES = {
  1: 'Reading Comprehension',
  2: 'Listening Comprehension',
  3: 'Semi-Speaking',
  4: 'Semi-Writing',
  5: 'Grammar',
  6: 'Integrated Skill : Cloze Test',
  7: 'Vocabulary',
  10: 'Multiple Skills',
  11: 'EOL Contest',
};

const LEVEL_NAMES = {
  1: 'Beginner',
  2: 'Lower Intermediate',
  3: 'Intermediate',
  4: 'Upper Intermediate',
  5: 'Advanced',
};

const LEVEL_COLORS = {
  1: 'blue',
  2: '#3a879c',
  3: 'green',
  4: '#ff9c31',
  5: 'red',
};

const LEVEL_BARS = {
  1: 'bar_07.png',
  2: 'bar_06.png',
  3: 'bar_01.png',
  4: 'bar_03.png',
  5: 'bar_02.png',
};

function nowString() {
  return new Date().toISOString().slice(0, 19).replace(' ', ' ');
}

function dateString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function formatDbDateTime(value) {
  if (!value) return '-';
  if (value instanceof Date) return value.toISOString().slice(0, 19).replace('T', ' ');
  return String(value);
}

function parsePercent(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0';
  const str = num.toFixed(2);
  return str.replace(/\.00$/, '');
}

function toFixedTwoTrim(num) {
  const str = Number(num).toFixed(2);
  return str.replace(/\.00$/, '');
}

function formatDisplayDateTime(dbValue) {
  const value = formatDbDateTime(dbValue);
  const parts = value.split(' ');
  if (parts.length < 2) return value;
  const [date, time] = parts;
  const dp = date.split('-');
  if (dp.length !== 3) return value;
  return `${dp[2]}/${dp[1]}/${dp[0]} ${time}`;
}

function parseThaiDateTime(dbValue) {
  const value = formatDbDateTime(dbValue);
  const [dateStr, timeStr = ''] = value.split(' ');
  const d = new Date(dateStr.replace(/-/g, '/'));
  if (Number.isNaN(d.getTime())) return value;

  const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const day = d.getDate();
  const month = thaiMonths[d.getMonth()];
  let year = d.getFullYear() + 543;
  const currentYear = new Date().getFullYear() + 543;
  if (year === currentYear) {
    year = null;
  }
  const time = timeStr ? `เวลา ${timeStr.slice(0, 5)} น.` : '';
  return year ? `วันที่ ${day} ${month} ${year} ${time}` : `วันที่ ${day} ${month} ${time}`;
}

function resolveAvatar(memberId, gender) {
  const fallback = `/assets/2010/member_images/icon_user_0${gender || 1}.jpg`;
  const avatarPath = path.join(__dirname, '../../../assets/2010/member_images', `${memberId}.jpg`);
  const exists = fs.existsSync(avatarPath);
  let height = 100;
  if (exists) {
    try {
      const size = fs.statSync(avatarPath).size;
      if (size > 0) {
        return { src: `/assets/2010/member_images/${memberId}.jpg`, height };
      }
    } catch (e) {
      // ignore
    }
  }
  return { src: fallback, height };
}

function requireDates(start, stop) {
  let s = start;
  let e = stop;
  if (!s) s = dateString(-30);
  if (!e) e = dateString(1);
  return { start: s, stop: e };
}

function makeDateRange(start, stop) {
  let s = start;
  let e = stop;
  if (!s) s = dateString(-30);
  if (!e) e = dateString(1);
  return { start: s, stop: e };
}

async function getMember(memberId) {
  const [rows] = await mysqli.query(
    'SELECT member_id, user, fname, lname, gender FROM tbl_x_member WHERE member_id = ? LIMIT 1',
    [memberId],
  );
  return rows[0] || null;
}

async function isAllowedSub(masterId, subId) {
  if (!masterId || !subId || masterId === subId) return false;
  const [rows] = await mysqli.query(
    'SELECT sub_id FROM tbl_x_member_sub WHERE master_id = ? AND sub_id = ? LIMIT 1',
    [masterId, subId],
  );
  return rows.length > 0;
}

async function resolveFocusMember(currentMemberId, targetMemberId) {
  const allowed = await isAllowedSub(currentMemberId, targetMemberId);
  const focusId = allowed ? targetMemberId : currentMemberId;
  const member = await getMember(focusId);
  if (!member) {
    const err = new Error('Member not found');
    err.code = 'MEMBER_NOT_FOUND';
    throw err;
  }
  return {
    memberId: String(member.member_id),
    fname: member.fname || '',
    lname: member.lname || '',
    isSub: allowed,
  };
}

function getAcademicSkills() {
  return { ...SKILL_NAMES };
}

async function getAcademicResults(focusMemberId, skillId, start, stop) {
  const skill = Number(skillId) || 10;
  const dates = makeDateRange(start, stop);
  const levels = [];

  for (let levelId = 1; levelId <= 5; levelId += 1) {
    const [rows] = await mysqli.query(
      `SELECT result_id, create_date
       FROM tbl_w_result
       WHERE member_id = ? AND skill_id = ? AND level_id = ?
         AND create_date >= ? AND create_date <= ?
       ORDER BY create_date DESC`,
      [focusMemberId, skill, levelId, dates.start, dates.stop],
    );

    if (rows.length === 0) continue;

    const items = [];
    let max = 0;
    let min = 100;
    let sum = 0;

    for (const row of rows) {
      const detailRows = await mysqli.query(
        'SELECT quiz_id, ans_id FROM tbl_w_result_detail WHERE result_id = ?',
        [row.result_id],
      );
      const details = detailRows[0];
      const total = details.length;
      let correct = 0;

      if (total >= 1) {
        for (const d of details) {
          const [ansRows] = await mysqli.query(
            'SELECT * FROM tbl_answers WHERE QUESTIONS_ID = ? AND ANSWERS_ID = ? AND ANSWERS_CORRECT = ?',
            [d.quiz_id, d.ans_id, 1],
          );
          if (ansRows.length === 1) correct += 1;
        }
      }

      const percent = total > 0 ? (correct / total) * 100 : 0;
      const pctStr = parsePercent(percent);
      if (percent > max) max = percent;
      if (percent < min) min = percent;
      sum += percent;

      items.push({
        resultId: String(row.result_id),
        createDate: formatDisplayDateTime(row.create_date),
        correct,
        total,
        percent: pctStr,
      });
    }

    const average = sum / rows.length;
    levels.push({
      levelId,
      levelName: LEVEL_NAMES[levelId],
      color: LEVEL_COLORS[levelId],
      bar: LEVEL_BARS[levelId],
      items,
      min: parsePercent(min),
      max: parsePercent(max),
      average: parsePercent(average),
    });
  }

  return {
    skillName: SKILL_NAMES[skill] || SKILL_NAMES[10],
    skillId: skill,
    start: dates.start,
    stop: dates.stop,
    levels,
  };
}

async function getAcademicDetail(focusMemberId, resultId, type) {
  const [resultRows] = await mysqli.query(
    'SELECT * FROM tbl_w_result WHERE member_id = ? AND result_id = ? LIMIT 1',
    [focusMemberId, resultId],
  );
  const result = resultRows[0];
  if (!result) {
    const err = new Error('Result not found');
    err.code = 'RESULT_NOT_FOUND';
    throw err;
  }

  const member = await getMember(focusMemberId);
  if (!member) {
    const err = new Error('Member not found');
    err.code = 'MEMBER_NOT_FOUND';
    throw err;
  }

  let sectionText = `${SKILL_NAMES[result.skill_id] || ''} » ${LEVEL_NAMES[result.level_id] || ''}`;
  let etestName = null;
  let isEst = 0;
  if (result.etest_id >= 1) {
    const [etestRows] = await mysqli.query(
      'SELECT * FROM tbl_etest WHERE ETEST_ID = ? LIMIT 1',
      [result.etest_id],
    );
    if (etestRows.length === 1) {
      etestName = etestRows[0].ETEST_NAME;
      isEst = etestRows[0].IS_EST;
      sectionText = `Extra Test » ${etestName}`;
    }
  }

  const allDetailRows = await mysqli.query(
    'SELECT * FROM tbl_w_result_detail WHERE result_id = ?',
    [resultId],
  );
  const allDetails = allDetailRows[0];

  const uniqueQuizRows = await mysqli.query(
    'SELECT quiz_id, MAX(ans_id) AS ans_id FROM tbl_w_result_detail WHERE result_id = ? GROUP BY quiz_id',
    [resultId],
  );
  const uniqueDetails = uniqueQuizRows[0];
  const totalAmount = uniqueDetails.length;

  let amount = 0;
  if (totalAmount >= 1) {
    for (const d of uniqueDetails) {
      const [ansRows] = await mysqli.query(
        'SELECT ANSWERS_ID FROM tbl_answers WHERE QUESTIONS_ID = ? AND ANSWERS_CORRECT = ? LIMIT 1',
        [d.quiz_id, 1],
      );
      if (ansRows.length === 1 && String(ansRows[0].ANSWERS_ID) === String(d.ans_id)) {
        amount += 1;
      }
    }
  }

  const percent = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
  const avatar = resolveAvatar(member.member_id, member.gender);

  const detail = {
    resultId: String(result.result_id),
    memberId: String(member.member_id),
    fname: member.fname || '',
    lname: member.lname || '',
    gender: member.gender || 1,
    avatar: avatar.src,
    avatarHeight: avatar.height,
    createDate: parseThaiDateTime(result.create_date),
    sectionText,
    amount,
    totalAmount,
    percent: parsePercent(percent),
    skillId: result.skill_id,
    levelId: result.level_id,
    etestId: result.etest_id,
    etestName,
    isEst,
  };

  const viewType = Number(type) || 1;
  if (viewType === 1) {
    detail.chartBar = await buildChartBarData(resultId, amount, percent);
    detail.weakPoint = await buildWeakPointData(resultId);
  } else if (viewType === 2) {
    detail.testDetail = await buildTestDetailData(resultId);
  } else if (viewType === 3) {
    detail.viewGroup = await buildViewGroupData(result);
  }

  return detail;
}

async function buildChartBarData(resultId, precomputedAmount, precomputedPercent) {
  const [detailRows] = await mysqli.query(
    'SELECT quiz_id FROM tbl_w_result_detail WHERE result_id = ?',
    [resultId],
  );
  const details = detailRows;

  const skillTotals = {};
  const skillCorrect = {};
  let totalCorrect = 0;

  for (let i = 1; i <= 7; i += 1) {
    skillTotals[i] = 0;
    skillCorrect[i] = 0;
  }

  for (const d of details) {
    const [qRows] = await mysqli.query(
      'SELECT QUESTIONS_ID, SKILL_ID FROM tbl_questions WHERE QUESTIONS_ID = ? LIMIT 1',
      [d.quiz_id],
    );
    if (qRows.length !== 1) continue;
    const q = qRows[0];
    const sid = Number(q.SKILL_ID);
    if (!sid || sid < 1 || sid > 7) continue;

    skillTotals[sid] += 1;

    const [ansRows] = await mysqli.query(
      'SELECT ANSWERS_ID FROM tbl_answers WHERE QUESTIONS_ID = ? AND ANSWERS_CORRECT = ? LIMIT 1',
      [q.QUESTIONS_ID, 1],
    );
    if (ansRows.length === 1) {
      const correctId = String(ansRows[0].ANSWERS_ID);
      const [userRows] = await mysqli.query(
        'SELECT ans_id FROM tbl_w_result_detail WHERE result_id = ? AND quiz_id = ? AND ans_id = ? LIMIT 1',
        [resultId, q.QUESTIONS_ID, correctId],
      );
      if (userRows.length === 1) {
        skillCorrect[sid] += 1;
        totalCorrect += 1;
      }
    }
  }

  const bars = [];
  for (let i = 1; i <= 7; i += 1) {
    if (skillTotals[i] > 0) {
      const pct = (skillCorrect[i] / skillTotals[i]) * 100;
      bars.push({
        skillId: i,
        skillName: SKILL_NAMES[i],
        correct: skillCorrect[i],
        total: skillTotals[i],
        percent: parsePercent(pct),
        barImage: `bar_0${i}.png`,
      });
    }
  }

  return {
    bars,
    averageCorrect: precomputedAmount,
    averageTotal: details.length,
    averagePercent: parsePercent(precomputedPercent),
  };
}

async function buildWeakPointData(resultId) {
  const [detailRows] = await mysqli.query(
    'SELECT quiz_id, ans_id FROM tbl_w_result_detail WHERE result_id = ? ORDER BY quiz_id',
    [resultId],
  );
  const details = detailRows;

  const skillMap = {};

  for (const d of details) {
    const answerId = Number(d.ans_id);
    let isWeak = false;

    if (answerId >= 1) {
      const [ansRows] = await mysqli.query(
        'SELECT * FROM tbl_answers WHERE ANSWERS_ID = ? AND ANSWERS_CORRECT = ? LIMIT 1',
        [d.ans_id, 0],
      );
      if (ansRows.length === 1) isWeak = true;
    } else if (answerId === 0) {
      isWeak = true;
    }

    if (!isWeak) continue;

    const [qRows] = await mysqli.query(
      'SELECT QUESTIONS_ID, SKILL_ID, SSKILL_ID, DETAIL_ID FROM tbl_questions WHERE QUESTIONS_ID = ? LIMIT 1',
      [d.quiz_id],
    );
    if (qRows.length !== 1) continue;
    const q = qRows[0];
    const skillId = Number(q.SKILL_ID);
    if (!skillMap[skillId]) {
      skillMap[skillId] = {
        skillId,
        skillName: SKILL_NAMES[skillId],
        items: [],
        seen: new Set(),
      };
    }

    const key = `${q.SKILL_ID}-${q.DETAIL_ID}`;
    if (skillMap[skillId].seen.has(key)) continue;
    skillMap[skillId].seen.add(key);

    const [ssRows] = await mysqli.query(
      'SELECT * FROM tbl_item_sskill WHERE SSKILL_ID = ? GROUP BY SSKILL_ID LIMIT 1',
      [q.SSKILL_ID],
    );
    const [dtRows] = await mysqli.query(
      'SELECT * FROM tbl_item_detail WHERE DETAIL_ID = ? GROUP BY DETAIL_ID LIMIT 1',
      [q.DETAIL_ID],
    );

    skillMap[skillId].items.push({
      sskillId: q.SSKILL_ID,
      sskillName: (ssRows[0] && ssRows[0].SSKILL_NAME) || '',
      detailId: q.DETAIL_ID,
      detailName: (dtRows[0] && dtRows[0].DETAIL_NAME) || '',
    });
  }

  return Object.values(skillMap).map((s) => ({
    skillId: s.skillId,
    skillName: s.skillName,
    items: s.items,
  }));
}

async function buildTestDetailData(resultId) {
  const [detailRows] = await mysqli.query(
    'SELECT quiz_id, ans_id FROM tbl_w_result_detail WHERE result_id = ? ORDER BY quiz_id',
    [resultId],
  );
  const details = detailRows;
  const questions = [];

  for (let i = 0; i < details.length; i += 1) {
    const d = details[i];
    const [qRows] = await mysqli.query(
      'SELECT * FROM tbl_questions WHERE QUESTIONS_ID = ? LIMIT 1',
      [d.quiz_id],
    );
    if (qRows.length !== 1) continue;
    const q = qRows[0];

    const [rRows] = await mysqli.query(
      'SELECT * FROM tbl_item_detail WHERE DETAIL_ID = ? GROUP BY DETAIL_ID LIMIT 1',
      [q.DETAIL_ID],
    );
    const reasonName = (rRows[0] && rRows[0].DETAIL_NAME) || '';

    const [mapRows] = await mysqli.query(
      'SELECT * FROM tbl_questions_mapping WHERE QUESTIONS_ID = ? LIMIT 1',
      [d.quiz_id],
    );

    let relateText = '';
    let relateType = 0;
    if (mapRows.length === 1) {
      const [gRows] = await mysqli.query(
        'SELECT * FROM tbl_gquestion WHERE GQUESTION_ID = ? LIMIT 1',
        [mapRows[0].GQUESTION_ID],
      );
      if (gRows.length === 1) {
        relateType = Number(gRows[0].GQUESTION_TYPE_ID);
        relateText = gRows[0].GQUESTION_TEXT || '';
        if (relateType === 2) {
          relateText = relateText.replace('/home/engtest/domains/engtest.net/public_html/', '');
        }
        if (relateType === 3) {
          relateText = relateText
            .replace('https://www.engtest.net/files/sound/', '')
            .replace(/\.flv$/i, '.mp3');
        }
      }
    }

    const [ansRows] = await mysqli.query(
      'SELECT * FROM tbl_answers WHERE QUESTIONS_ID = ? ORDER BY ANSWERS_ID ASC',
      [d.quiz_id],
    );
    const answers = [];
    let selectedIndex = -1;
    let correctIndex = -1;
    for (let k = 0; k < ansRows.length; k += 1) {
      const a = ansRows[k];
      const selected = String(a.ANSWERS_ID) === String(d.ans_id);
      const isCorrect = Number(a.ANSWERS_CORRECT) === 1;
      answers.push({
        index: k + 1,
        answerId: String(a.ANSWERS_ID),
        text: a.ANSWERS_TEXT || '',
        correct: isCorrect,
        selected,
      });
      if (selected) selectedIndex = k + 1;
      if (isCorrect) correctIndex = k + 1;
    }

    const [desRows] = await mysqli.query(
      'SELECT * FROM tbl_description WHERE QUESTIONS_ID = ? LIMIT 1',
      [d.quiz_id],
    );
    const description = desRows.length === 1 ? desRows[0].TEXT : '';

    questions.push({
      no: i + 1,
      questionId: String(q.QUESTIONS_ID),
      questionText: q.QUESTIONS_TEXT || '',
      skillId: q.SKILL_ID,
      detailId: q.DETAIL_ID,
      reasonName,
      relateType,
      relateText,
      answers,
      selectedIndex,
      correctIndex,
      isCorrect: selectedIndex === correctIndex,
      unanswered: selectedIndex === -1,
      description,
    });
  }

  return { questions };
}

async function buildViewGroupData(result) {
  const dates = makeDateRange();
  const [rows] = await mysqli.query(
    `SELECT member_id, result_id, percent
     FROM tbl_w_result
     WHERE etest_id = ? AND level_id = ? AND skill_id = ?
       AND create_date >= ? AND create_date <= ?
     ORDER BY result_id ASC`,
    [result.etest_id, result.level_id, result.skill_id, dates.start, dates.stop],
  );

  if (rows.length === 0) {
    return { total: 0, distribution: [], ranking: [], min: 0, max: 0, average: 0 };
  }

  const rank = new Array(11).fill(0);
  let min = 100;
  let max = 0;
  let sum = 0;
  const byMember = {};

  for (const r of rows) {
    const pct = Number(r.percent) || 0;
    const bucket = Math.min(10, Math.max(0, Math.floor(pct / 10)));
    rank[bucket] += 1;
    if (pct < min) min = pct;
    if (pct > max) max = pct;
    sum += pct;

    if (!byMember[r.member_id]) byMember[r.member_id] = { max: 0, amount: 0 };
    if (pct > byMember[r.member_id].max) byMember[r.member_id].max = pct;
    byMember[r.member_id].amount += 1;
  }

  const members = Object.entries(byMember)
    .sort((a, b) => b[1].max - a[1].max)
    .map(([memberId, data]) => ({ memberId, ...data }));

  const distribution = [];
  const labels = ['00 %', '00 - 10 %', '10 - 20 %', '20 - 30 %', '30 - 40 %', '40 - 50 %', '50 - 60 %', '60 - 70 %', '70 - 80 %', '80 - 90 %', '90 - 100 %'];
  for (let i = 0; i <= 10; i += 1) {
    const ratio = rows.length ? (rank[i] / rows.length) * 100 : 0;
    distribution.push({ label: labels[i], amount: rank[i], ratio: parsePercent(ratio) });
  }

  const ranking = [];
  let order = 0;
  let prevMax = null;
  for (let i = 0; i < members.length; i += 1) {
    const m = members[i];
    const mem = await getMember(m.memberId);
    if (prevMax === null || m.max !== prevMax) {
      order = i + 1;
      prevMax = m.max;
    }
    ranking.push({
      order,
      memberId: m.memberId,
      fname: mem ? mem.fname : '',
      lname: mem ? mem.lname : '',
      highestPercent: parsePercent(m.max),
      amount: m.amount,
      isFocus: String(m.memberId) === String(result.member_id),
    });
  }

  return {
    total: rows.length,
    distribution,
    ranking,
    min: parsePercent(min),
    max: parsePercent(max),
    average: parsePercent(sum / rows.length),
  };
}

async function getStandardList(focusMemberId, start, stop) {
  const dates = makeDateRange(start, stop);
  const [etestRows] = await mysqli.query(
    'SELECT ETEST_ID FROM tbl_etest WHERE IS_EST = 1 ORDER BY ETEST_ID',
  );
  if (etestRows.length === 0) return { items: [], start: dates.start, stop: dates.stop };

  const ids = etestRows.map((e) => e.ETEST_ID);
  const placeholders = ids.map(() => '?').join(',');

  const [rows] = await mysqli.query(
    `SELECT result_id, percent, create_date
     FROM tbl_w_result_est
     WHERE create_date >= ? AND create_date <= ? AND member_id = ? AND ETEST_ID IN (${placeholders})
     ORDER BY create_date DESC`,
    [dates.start, dates.stop, focusMemberId, ...ids],
  );

  const items = rows.map((r) => ({
    resultId: String(r.result_id),
    percent: parsePercent(r.percent),
    createDate: parseThaiDateTime(r.create_date),
  }));

  return { items, start: dates.start, stop: dates.stop };
}

async function getStandardDetail(focusMemberId, resultId) {
  const [resultRows] = await mysqli.query(
    'SELECT * FROM tbl_w_result_est WHERE member_id = ? AND result_id = ? LIMIT 1',
    [focusMemberId, resultId],
  );
  const result = resultRows[0];
  if (!result) {
    const err = new Error('Result not found');
    err.code = 'RESULT_NOT_FOUND';
    throw err;
  }

  const member = await getMember(focusMemberId);
  if (!member) {
    const err = new Error('Member not found');
    err.code = 'MEMBER_NOT_FOUND';
    throw err;
  }

  let etestName = '';
  if (result.etest_id >= 1) {
    const [etestRows] = await mysqli.query(
      'SELECT * FROM tbl_etest WHERE ETEST_ID = ? LIMIT 1',
      [result.etest_id],
    );
    if (etestRows.length === 1) etestName = etestRows[0].ETEST_NAME;
  }

  const [detailRows] = await mysqli.query(
    'SELECT quiz_id, MAX(ans_id) AS ans_id FROM tbl_w_result_est_detail WHERE result_id = ? GROUP BY quiz_id',
    [resultId],
  );
  const details = detailRows;
  const totalAmount = details.length;

  const amount = {};
  const wrong = {};
  const unans = {};
  for (let i = 1; i <= 7; i += 1) {
    amount[i] = 0;
    wrong[i] = 0;
    unans[i] = 0;
  }

  for (const d of details) {
    const [qRows] = await mysqli.query(
      'SELECT SKILL_ID FROM tbl_questions WHERE QUESTIONS_ID = ? LIMIT 1',
      [d.quiz_id],
    );
    if (qRows.length !== 1) continue;
    const skillId = Number(qRows[0].SKILL_ID);

    const [ansRows] = await mysqli.query(
      'SELECT ANSWERS_ID FROM tbl_answers WHERE QUESTIONS_ID = ? AND ANSWERS_CORRECT = ? LIMIT 1',
      [d.quiz_id, 1],
    );
    if (ansRows.length !== 1) continue;
    const correctId = String(ansRows[0].ANSWERS_ID);
    const chosenId = String(d.ans_id);

    if (chosenId === correctId) {
      amount[skillId] += 1;
    } else if (chosenId === '0' || chosenId === '') {
      unans[skillId] += 1;
    } else {
      wrong[skillId] += 1;
    }
  }

  const allPass = (amount[1] + amount[2] + amount[4] + amount[5]);
  const allWrong = (wrong[1] + wrong[2] + wrong[4] + wrong[5]);
  const allUnans = (unans[1] + unans[2] + unans[4] + unans[5]);
  const percent = totalAmount > 0 ? ((allPass) - (allWrong * 0.25)) * (100 / totalAmount) : 0;

  const textMsg = [
    '<span class="text-danger">ไม่สามารถประเมินได้ ( Incalculable )</span>',
    '<span class="text-warning">พอใช้ ( Low )</span>',
    '<span class="text-success">ปานกลาง ( Intermediate )</span>',
    '<span class="text-primary">สูง ( High )</span>',
  ];

  const eachPercent = [
    null,
    (amount[1] - wrong[1] * 0.25),
    (amount[2] - wrong[2] * 0.25),
    (amount[4] + amount[5] - (wrong[4] + wrong[5]) * 0.25),
  ];

  const skillMsg = {};
  for (const idx of [1, 2, 3]) {
    const p = eachPercent[idx];
    if (p <= 0) skillMsg[idx] = textMsg[0];
    else if (idx === 1) {
      if (p <= 14.75) skillMsg[idx] = textMsg[1];
      else if (p <= 29.75) skillMsg[idx] = textMsg[2];
      else skillMsg[idx] = textMsg[3];
    } else {
      if (p <= 10.75) skillMsg[idx] = textMsg[1];
      else if (p <= 20.75) skillMsg[idx] = textMsg[2];
      else skillMsg[idx] = textMsg[3];
    }
  }

  const avatar = resolveAvatar(member.member_id, member.gender);

  return {
    resultId: String(result.result_id),
    memberId: String(member.member_id),
    fname: member.fname || '',
    lname: member.lname || '',
    gender: member.gender || 1,
    avatar: avatar.src,
    avatarHeight: avatar.height,
    createDate: parseThaiDateTime(result.create_date),
    testType: 'EOL Standard Test',
    etestName,
    allPass,
    allWrong,
    allUnans,
    totalAmount,
    percent: parsePercent(percent),
    skills: [
      {
        key: 'listening',
        label: 'การฟัง ( Listening )',
        skillId: 2,
        correct: amount[2],
        wrong: wrong[2],
        unans: unans[2],
        total: amount[2] + wrong[2] + unans[2],
        score: toFixedTwoTrim(eachPercent[2]),
        level: skillMsg[2],
      },
      {
        key: 'reading',
        label: 'การอ่าน ( Reading )',
        skillId: 1,
        correct: amount[1],
        wrong: wrong[1],
        unans: unans[1],
        total: amount[1] + wrong[1] + unans[1],
        score: toFixedTwoTrim(eachPercent[1]),
        level: skillMsg[1],
      },
      {
        key: 'writing',
        label: 'การเขียน ( Writing )',
        skillId: '4+5',
        correct: amount[4] + amount[5],
        wrong: wrong[4] + wrong[5],
        unans: unans[4] + unans[5],
        total: amount[4] + wrong[4] + unans[4] + amount[5] + wrong[5] + unans[5],
        score: toFixedTwoTrim(eachPercent[3]),
        level: skillMsg[3],
      },
    ],
    scoreTable: buildScoreTable(percent),
  };
}

function buildScoreTable(percent) {
  const p = Number(percent) || 0;
  const colorA = 'bgcolor_f0f0f0';
  const colorB = 'bgcolor_ffe0e0';
  const colorBottom = 'bgcolor_C4FAFC';
  const colorTopScore = 'bgcolor_E2F9F9';

  const color = new Array(12).fill(colorA);
  const colorM = new Array(8).fill(colorA);
  const colorG = new Array(6).fill(colorA);
  const colorC = new Array(7).fill(colorA);

  if (p <= 0) { color[0] = colorB; colorM[0] = colorB; }
  if (p >= 0.25 && p <= 7.75) { color[1] = colorB; colorM[1] = colorB; colorG[1] = colorB; }
  if (p > 7.75 && p <= 15.75) { color[2] = colorB; colorM[1] = colorB; colorG[1] = colorB; }
  if (p > 15.75 && p <= 25.75) { color[3] = colorB; colorM[2] = colorB; colorG[2] = colorB; }
  if (p > 25.75 && p <= 35.75) { color[4] = colorB; colorM[2] = colorB; colorG[2] = colorB; }
  if (p > 35.75 && p <= 45.75) { color[5] = colorB; colorM[3] = colorB; colorG[3] = colorB; }
  if (p > 45.75 && p <= 60.75) { color[6] = colorB; colorM[3] = colorB; colorG[3] = colorB; }
  if (p > 60.75 && p <= 70.75) { color[7] = colorB; colorM[4] = colorB; colorG[4] = colorB; }
  if (p > 70.75 && p <= 80.75) { color[8] = colorB; colorM[4] = colorB; colorG[4] = colorB; }
  if (p > 80.75 && p <= 90.75) { color[9] = colorB; colorM[5] = colorB; colorG[5] = colorB; }
  if (p > 90.75 && p <= 99.75) { color[10] = colorB; colorM[6] = colorB; colorG[5] = colorB; }
  if (p > 99.75 && p <= 100) { color[11] = colorB; colorM[7] = colorB; }

  if (p <= 0) colorC[0] = colorB;
  if (p >= 0.25 && p <= 15.75) colorC[1] = colorB;
  if (p > 15.75 && p <= 35.75) colorC[2] = colorB;
  if (p > 35.75 && p <= 60.75) colorC[3] = colorB;
  if (p > 60.75 && p <= 80.75) colorC[4] = colorB;
  if (p > 80.75 && p <= 99.75) colorC[5] = colorB;
  if (p > 99.75 && p <= 100) colorC[6] = colorB;

  // Top-score row cells keep their highlighted/default colours exactly like PHP.

  return {
    eol: color,
    toeic: colorM,
    cefr: colorC,
    cutepToeflItpToeflIbtIelts: colorG,
    topScoreColor: colorTopScore,
  };
}

async function getContestList(focusMemberId, start, stop) {
  let dates = makeDateRange(start, stop);
  if (dates.start === dates.stop) {
    dates = {
      start: `${dates.start} 00:00:00`,
      stop: `${dates.stop} 23:59:59`,
    };
  }

  // Recalculate percent where stored wrong percentage differs from correct percentage.
  const recalcSql = `SELECT * FROM (
    SELECT Z.CREATE_DATE, Z.RESULT_ID, C.MEMBER_ID, C.USER, C.PASS,
      (SUM(B.ANSWERS_CORRECT) / COUNT(A.RESULT_DETAIL_ID)) * 100 AS CORRECT_PERCENTAGE,
      Z.PERCENT AS WRONG_PERCENTAGE, Z.ETEST_ID
    FROM tbl_x_member_sub AS Y
    LEFT JOIN tbl_w_result AS Z ON Z.member_id = Y.sub_id
    LEFT JOIN tbl_w_result_detail AS A ON A.RESULT_ID = Z.RESULT_ID
    LEFT JOIN tbl_answers AS B ON B.QUESTIONS_ID = A.QUIZ_ID AND B.ANSWERS_CORRECT = '1' AND B.ANSWERS_ID = A.ANS_ID
    LEFT JOIN tbl_x_member AS C ON C.MEMBER_ID = Z.MEMBER_ID
    WHERE (Y.SUB_ID = ? OR Y.SUB_ID = ?) AND Y.SUB_ID <> ''
    GROUP BY Z.RESULT_ID
  ) AS M
  WHERE M.CORRECT_PERCENTAGE <> M.WRONG_PERCENTAGE`;

  const [recalcRows] = await mysqli.query(recalcSql, [focusMemberId, focusMemberId]);
  for (const r of recalcRows) {
    if (r.RESULT_ID && r.MEMBER_ID && r.ETEST_ID) {
      await mysqli.query(
        'UPDATE tbl_w_result SET percent = ? WHERE result_id = ? AND member_id = ? AND etest_id = ?',
        [r.CORRECT_PERCENTAGE, r.RESULT_ID, r.MEMBER_ID, r.ETEST_ID],
      );
    }
  }

  const [rows] = await mysqli.query(
    `SELECT r.result_id, r.create_date, r.percent, e.exam_name
     FROM tbl_w_result AS r
     LEFT JOIN tbl_eventest AS e ON e.exam_id = r.etest_id
     WHERE r.member_id = ? AND r.etest_id > 0
       AND r.create_date >= ? AND r.create_date <= ?
     ORDER BY r.create_date DESC`,
    [focusMemberId, dates.start, dates.stop],
  );

  return {
    items: rows.map((r) => ({
      resultId: String(r.result_id),
      createDate: formatDisplayDateTime(r.create_date),
      percent: parsePercent(r.percent),
      examName: r.exam_name || '',
    })),
    start: dates.start,
    stop: dates.stop,
  };
}

async function getContestDetail(focusMemberId, resultId, type) {
  const [resultRows] = await mysqli.query(
    'SELECT * FROM tbl_w_result WHERE member_id = ? AND result_id = ? LIMIT 1',
    [focusMemberId, resultId],
  );
  const result = resultRows[0];
  if (!result) {
    const err = new Error('Result not found');
    err.code = 'RESULT_NOT_FOUND';
    throw err;
  }

  const member = await getMember(focusMemberId);
  if (!member) {
    const err = new Error('Member not found');
    err.code = 'MEMBER_NOT_FOUND';
    throw err;
  }

  let examName = '';
  let testType = 0;
  let examType = 1;
  if (result.etest_id >= 1) {
    const [eventRows] = await mysqli.query(
      'SELECT * FROM tbl_eventest WHERE exam_id = ? LIMIT 1',
      [result.etest_id],
    );
    if (eventRows.length === 1) {
      examName = eventRows[0].exam_name;
      testType = Number(eventRows[0].test_type) || 0;
      examType = Number(eventRows[0].exam_type) || 1;
    }
  }

  const sectionText = testType === 2
    ? `EOL Contest » ${examName} » การแข่งขัน`
    : `EOL Contest » ${examName} » เก็บคะแนน`;

  const [detailRows] = await mysqli.query(
    'SELECT quiz_id, ans_id FROM tbl_w_result_detail WHERE result_id = ?',
    [resultId],
  );
  const details = detailRows;
  const totalAmount = details.length;
  let amount = 0;

  if (totalAmount >= 1) {
    if (examType === 1) {
      for (const d of details) {
        const [ansRows] = await mysqli.query(
          'SELECT ANSWERS_ID FROM tbl_answers WHERE QUESTIONS_ID = ? AND ANSWERS_CORRECT = ? LIMIT 1',
          [d.quiz_id, 1],
        );
        if (ansRows.length === 1 && String(ansRows[0].ANSWERS_ID) === String(d.ans_id)) {
          amount += 1;
        }
      }
    } else {
      for (const d of details) {
        const [eaRows] = await mysqli.query(
          'SELECT * FROM tbl_eventest_answer WHERE answer_id = ? AND question_id = ? AND answer = ? LIMIT 1',
          [d.ans_id, d.quiz_id, 1],
        );
        if (eaRows.length === 1) amount += 1;
      }
    }
  }

  const percent = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
  const avatar = resolveAvatar(member.member_id, member.gender);

  const detail = {
    resultId: String(result.result_id),
    memberId: String(member.member_id),
    fname: member.fname || '',
    lname: member.lname || '',
    gender: member.gender || 1,
    avatar: avatar.src,
    avatarHeight: avatar.height,
    createDate: parseThaiDateTime(result.create_date),
    sectionText,
    amount,
    totalAmount,
    percent: parsePercent(percent),
    examType,
    testType,
  };

  const viewType = Number(type) || 1;
  if (viewType === 1) {
    detail.chartBar = await buildChartBarData(resultId, amount, percent);
    detail.weakPoint = await buildWeakPointData(resultId);
  } else if (viewType === 2) {
    if (examType === 2) {
      detail.contestDetail = await buildContestCustomDetailData(resultId);
    } else {
      detail.testDetail = await buildTestDetailData(resultId);
    }
  } else if (viewType === 3) {
    detail.viewGroup = await buildViewGroupData(result);
  }

  return detail;
}

async function buildContestCustomDetailData(resultId) {
  const [rows] = await mysqli.query(
    `SELECT d.quiz_id, d.ans_id, c.question_text
     FROM tbl_w_result_detail AS d
     INNER JOIN tbl_eventest_question_custom AS c ON c.question_id = d.quiz_id
     WHERE d.result_id = ?`,
    [resultId],
  );

  const questions = [];
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const [ansRows] = await mysqli.query(
      'SELECT * FROM tbl_eventest_answer WHERE question_id = ?',
      [row.quiz_id],
    );
    const answers = [];
    let isCorrect = false;
    for (const a of ansRows) {
      const selected = String(a.answer_id) === String(row.ans_id);
      if (selected && Number(a.answer) === 1) isCorrect = true;
      answers.push({
        answerId: String(a.answer_id),
        text: a.answer_text || '',
        selected,
        correct: Number(a.answer) === 1,
      });
    }
    questions.push({
      no: i + 1,
      questionId: String(row.quiz_id),
      questionText: row.question_text || '',
      answers,
      isCorrect,
    });
  }

  return { questions };
}

module.exports = {
  resolveFocusMember,
  getAcademicSkills,
  getAcademicResults,
  getAcademicDetail,
  getStandardList,
  getStandardDetail,
  getContestList,
  getContestDetail,
};
