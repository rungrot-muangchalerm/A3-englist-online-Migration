const gepotReportModel = require('../../../../model/backoffice/mainoffice/admin/gepot-report.model');

const THAI_MONTHS = [
  '',
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

function cleanText(value) {
  return String(value || '').trim();
}

function asNumber(value) {
  return Number(value) || 0;
}

function formatThaiDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const day = date.getDate();
  const month = THAI_MONTHS[date.getMonth() + 1];
  const year = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day} ${month} ${year} เวลา ${hours}:${minutes}:${seconds} น.`;
}

function resolveLevel(score, thresholds) {
  if (score <= 0) return { text: 'ไม่สามารถประเมินได้', color: 'red' };
  if (score <= thresholds.low) return { text: 'พอใช้ ( Low )', color: 'brown' };
  if (score <= thresholds.intermediate) return { text: 'ปานกลาง ( Intermediate )', color: 'green' };
  return { text: 'สูง ( High )', color: 'blue' };
}

function resolveCefr(score, thresholds) {
  if (score <= 0) return { text: 'A0', color: 'red' };
  if (score <= thresholds.a1) return { text: 'A1', color: 'red' };
  if (score <= thresholds.a2) return { text: 'A2', color: 'brown' };
  if (score <= thresholds.b1) return { text: 'B1', color: 'green' };
  if (score <= thresholds.b2) return { text: 'B2', color: 'blue' };
  if (score <= thresholds.c1) return { text: 'C1', color: 'blue' };
  return { text: 'C2', color: 'blue' };
}

function buildSkill(name, correct, wrong, total, levelThresholds, cefrThresholds) {
  const safeCorrect = asNumber(correct);
  const safeWrong = asNumber(wrong);
  const unanswered = total - (safeCorrect + safeWrong);
  const score = safeCorrect - (safeWrong * 0.25);
  return {
    name,
    correct: safeCorrect,
    wrong: safeWrong,
    unanswered,
    score: Math.round(score * 100) / 100,
    total,
    level: resolveLevel(score, levelThresholds),
    cefr: resolveCefr(score, cefrThresholds),
  };
}

function buildReportCard(member, result, no) {
  const correct = asNumber(result.correct);
  const wrong = asNumber(result.wrong);
  return {
    no,
    memberId: member.member_id,
    username: member.user || '',
    fullName: `${cleanText(member.fname)}  ${cleanText(member.lname)}`,
    date: formatThaiDateTime(result.create_date),
    testType: 'General English Proficiency Online Test',
    correct,
    wrong,
    unanswered: 100 - (correct + wrong),
    percent: asNumber(result.percent),
    skills: [
      buildSkill('การฟัง ( Listening )', result.correct_listening, result.wrong_listening, 30, { low: 10.75, intermediate: 20.75 }, { a1: 6.75, a2: 12.75, b1: 18.75, b2: 24.75, c1: 29.75 }),
      buildSkill('การอ่าน ( Reading )', result.correct_reading, result.wrong_reading, 40, { low: 14.75, intermediate: 29.75 }, { a1: 8.75, a2: 16.75, b1: 24.75, b2: 32.75, c1: 39.75 }),
      buildSkill('ไวยากรณ์ ( Grammar )', result.correct_grammar, result.wrong_grammar, 30, { low: 10.75, intermediate: 20.75 }, { a1: 6.75, a2: 12.75, b1: 18.75, b2: 24.75, c1: 29.75 }),
    ],
  };
}

async function buildSingle(username) {
  const safeUsername = cleanText(username);
  if (!safeUsername) return { mode: 'none', username: '', startUsername: '', endUsername: '', rows: [] };
  const member = await gepotReportModel.findMemberByUsername(safeUsername);
  if (!member) return { mode: 'single', username: safeUsername, startUsername: '', endUsername: '', rows: [] };
  const result = await gepotReportModel.findBestResult(member.member_id);
  return {
    mode: 'single',
    username: safeUsername,
    startUsername: '',
    endUsername: '',
    rows: result ? [buildReportCard(member, result, null)] : [],
  };
}

async function buildMember(memberId) {
  const safeMemberId = cleanText(memberId);
  if (!safeMemberId) return { mode: 'none', username: '', startUsername: '', endUsername: '', rows: [] };
  const member = await gepotReportModel.findMemberById(safeMemberId);
  if (!member) return { mode: 'single', username: '', startUsername: '', endUsername: '', rows: [] };
  const result = await gepotReportModel.findBestResult(member.member_id);
  return {
    mode: 'single',
    username: member.user || '',
    startUsername: '',
    endUsername: '',
    rows: result ? [buildReportCard(member, result, null)] : [],
  };
}

async function buildRange(startUsername, endUsername) {
  const safeStart = cleanText(startUsername);
  const safeEnd = cleanText(endUsername);
  if (!safeStart || !safeEnd) return { mode: 'none', username: '', startUsername: '', endUsername: '', rows: [] };
  const members = await gepotReportModel.findMembersByUsernameRange(safeStart, safeEnd);
  const rows = [];
  for (const member of members) {
    const result = await gepotReportModel.findBestResult(member.member_id);
    if (result) rows.push(buildReportCard(member, result, rows.length + 1));
  }
  return {
    mode: 'range',
    username: '',
    startUsername: safeStart,
    endUsername: safeEnd,
    rows,
  };
}

async function buildReport(query) {
  if (query.member_id) {
    return buildMember(query.member_id);
  }
  if (query.start_username || query.end_username) {
    return buildRange(query.start_username, query.end_username);
  }
  if (query.username) {
    return buildSingle(query.username);
  }
  return { mode: 'none', username: '', startUsername: '', endUsername: '', rows: [] };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function colorClass(color) {
  const value = String(color || '').toLowerCase();
  if (value === 'red') return 'text-danger';
  if (value === 'green') return 'text-success';
  if (value === 'blue') return 'text-primary';
  if (value === 'brown' || value === 'orange') return 'text-warning';
  return 'text-dark';
}

function skillRows(row) {
  return row.skills.map(skill => `
    <tr>
      <td>${escapeHtml(skill.name)}</td>
      <td>${escapeHtml(skill.correct)}</td>
      <td>${escapeHtml(skill.wrong)}</td>
      <td>${escapeHtml(skill.unanswered)}</td>
      <td>${escapeHtml(skill.score)} / ${escapeHtml(skill.total)}</td>
      <td class="${colorClass(skill.level.color)}">${escapeHtml(skill.level.text)}</td>
      <td class="${colorClass(skill.cefr.color)}">${escapeHtml(skill.cefr.text)}</td>
    </tr>`).join('');
}

function fullReportRows(rows) {
  return rows.map((row, index) => `
    <table class="table table-bordered table-sm mb-3">
      <tr><th colspan="7" class="bg-secondary text-white">General English Proficiency Online Test</th></tr>
      <tr><td>No.</td><td colspan="6">${escapeHtml(row.no || index + 1)}</td></tr>
      <tr><td>Member ID</td><td colspan="6">${escapeHtml(row.memberId)}</td></tr>
      <tr><td>Username</td><td colspan="6">${escapeHtml(row.username)}</td></tr>
      <tr><td>ผู้ทำแบบทดสอบ</td><td colspan="6">${escapeHtml(row.fullName)}</td></tr>
      <tr><td>วันที่ทำการทดสอบ</td><td colspan="6">${escapeHtml(row.date)}</td></tr>
      <tr><td>ประเภทการทดสอบ</td><td colspan="6">${escapeHtml(row.testType)}</td></tr>
      <tr><td>คะแนนที่ได้</td><td colspan="6">ตอบถูก ${escapeHtml(row.correct)} ข้อ ตอบผิด ${escapeHtml(row.wrong)} ข้อ ไม่ได้ตอบ ${escapeHtml(row.unanswered)} ข้อ คิดเป็น ${escapeHtml(row.percent)} %</td></tr>
      <tr>
        <th>ทักษะ ( Skill )</th>
        <th>ตอบถูก</th>
        <th>ตอบผิด</th>
        <th>ไม่ได้ตอบ</th>
        <th>คะแนน ( Score )</th>
        <th>ระดับความสามารถ ( Level )</th>
        <th>CEFR</th>
      </tr>
      ${skillRows(row)}
    </table>
    <br>`).join('');
}

function summaryReportRows(rows) {
  return `
    <table class="table table-bordered table-sm">
      <tr>
        <th class="bg-secondary text-white">No.</th>
        <th class="bg-secondary text-white">Member ID</th>
        <th class="bg-secondary text-white">Username</th>
        <th class="bg-secondary text-white">ผู้ทำแบบทดสอบ</th>
        <th class="bg-secondary text-white">วันที่ทำการทดสอบ</th>
        <th class="bg-secondary text-white">ตอบถูก</th>
        <th class="bg-secondary text-white">ตอบผิด</th>
        <th class="bg-secondary text-white">ไม่ได้ตอบ</th>
        <th class="bg-secondary text-white">Percent</th>
        <th class="bg-secondary text-white">Listening CEFR</th>
        <th class="bg-secondary text-white">Reading CEFR</th>
        <th class="bg-secondary text-white">Grammar CEFR</th>
      </tr>
      ${rows.map((row, index) => `
        <tr>
          <td>${escapeHtml(row.no || index + 1)}</td>
          <td>${escapeHtml(row.memberId)}</td>
          <td>${escapeHtml(row.username)}</td>
          <td>${escapeHtml(row.fullName)}</td>
          <td>${escapeHtml(row.date)}</td>
          <td>${escapeHtml(row.correct)}</td>
          <td>${escapeHtml(row.wrong)}</td>
          <td>${escapeHtml(row.unanswered)}</td>
          <td>${escapeHtml(row.percent)}</td>
          <td>${escapeHtml(row.skills[0].cefr.text)}</td>
          <td>${escapeHtml(row.skills[1].cefr.text)}</td>
          <td>${escapeHtml(row.skills[2].cefr.text)}</td>
        </tr>`).join('')}
    </table>`;
}

async function buildExcelExport(kind, params) {
  const report = await buildReport(params);
  const title = kind === 'summary' ? 'GEPOT Summary Report' : 'GEPOT Full Report';
  const body = kind === 'summary' ? summaryReportRows(report.rows) : fullReportRows(report.rows);
  return {
    filename: `${kind === 'summary' ? 'gepot-summary-report' : 'gepot-full-report'}.xls`,
    empty: report.rows.length === 0,
    content: `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <h3>${escapeHtml(title)}</h3>
  ${body}
</body>
</html>`,
  };
}

async function buildPdfExport(params) {
  const report = await buildReport(params);
  return {
    empty: report.rows.length === 0,
    content: `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>GEPOT PDF Report</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="text-center d-print-none"><button class="btn btn-primary" onclick="window.print()">Export To PDF</button></div><br>
  ${report.rows.map((row, index) => `
    <table class="table table-sm table-light w-100">
      <tr>
        <td width="5%" class="text-end"><b>${escapeHtml(row.no || index + 1)}</b></td>
        <td width="20%" class="text-end"><b>ผู้ทำแบบทดสอบ &nbsp; : &nbsp;</b></td>
        <td width="75%" class="text-start"><b>&nbsp; ${escapeHtml(row.fullName)}</b></td>
      </tr>
      <tr>
        <td></td>
        <td class="text-end"><b>วันที่ทำการทดสอบ &nbsp; : &nbsp;</b></td>
        <td class="text-start"><b>&nbsp; ${escapeHtml(row.date)}</b></td>
      </tr>
      <tr>
        <td></td>
        <td class="text-end"><b>ประเภทการทดสอบ &nbsp; : &nbsp;</b></td>
        <td class="text-start"><b>&nbsp; ${escapeHtml(row.testType)}</b></td>
      </tr>
      <tr>
        <td></td>
        <td class="text-end"><b>คะแนนที่ได้ &nbsp; : &nbsp;</b></td>
        <td class="text-start"><b>&nbsp; ตอบถูก ${escapeHtml(row.correct)} ข้อ &nbsp; &nbsp; ตอบผิด ${escapeHtml(row.wrong)} ข้อ &nbsp; &nbsp; ไม่ได้ตอบ ${escapeHtml(row.unanswered)} ข้อ &nbsp; &nbsp; คิดเป็น ${escapeHtml(row.percent)} %</b></td>
      </tr>
    </table>
    <table class="table table-bordered table-sm w-100">
      <tr>
        <td class="bg-secondary text-white text-center fw-bold" width="20%">ทักษะ ( Skill )</td>
        <td class="bg-secondary text-white text-center fw-bold" colspan="3" width="45%">คะแนน ( Score )</td>
        <td class="bg-secondary text-white text-center fw-bold">ระดับความสามารถ ( Level )</td>
        <td class="bg-secondary text-white text-center fw-bold">CEFR</td>
      </tr>
      ${row.skills.map(skill => `
        <tr>
          <td class="bg-secondary-subtle text-center" rowspan="2"><b>${escapeHtml(skill.name)}</b></td>
          <td class="bg-secondary-subtle text-center">ตอบถูก ${escapeHtml(skill.correct)} ข้อ</td>
          <td class="bg-secondary-subtle text-center">ตอบผิด ${escapeHtml(skill.wrong)} ข้อ</td>
          <td class="bg-secondary-subtle text-center">ไม่ได้ตอบ ${escapeHtml(skill.unanswered)} ข้อ</td>
          <td class="bg-secondary-subtle text-center ${colorClass(skill.level.color)}" rowspan="2">${escapeHtml(skill.level.text)}</td>
          <td class="bg-secondary-subtle text-center ${colorClass(skill.cefr.color)}" rowspan="2">${escapeHtml(skill.cefr.text)}</td>
        </tr>
        <tr>
          <td class="bg-secondary-subtle text-center" colspan="3"><b>คิดเป็น ${escapeHtml(skill.score)} / ${escapeHtml(skill.total)} คะแนน</b></td>
        </tr>`).join('')}
    </table>
    ${index + 1 < report.rows.length ? '<div class="d-print-block"></div>' : ''}`).join('')}
  <script>window.addEventListener('load', function () { window.print(); });</script>
</body>
</html>`,
  };
}

module.exports = {
  buildReport,
  buildExcelExport,
  buildPdfExport,
};
