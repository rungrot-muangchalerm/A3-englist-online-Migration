const monthlyReportModel = require('../../../../model/backoffice/mainoffice/admin/monthly-report.model');

const TIMELINE_DAYS = 31;

function pad(number) {
  return String(number).padStart(2, '0');
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildLegacyDates() {
  const today = new Date();
  const dates = [];
  for (let index = 1; index <= TIMELINE_DAYS; index += 1) {
    dates.push(formatDate(addDays(today, -(index + 1))));
  }
  return dates;
}

async function buildReport() {
  const dates = buildLegacyDates();
  const oldestDate = dates[dates.length - 1];
  const newestDate = dates[0];
  const rows = await monthlyReportModel.findDailyReport(`${oldestDate} 00:00:01`, `${newestDate} 23:59:59`);
  const rowByDate = new Map(rows.map(row => [formatDate(new Date(row.report_date)), row]));
  return dates.map(date => {
    const row = rowByDate.get(date);
    return {
      date,
      allTest: row ? Number(row.all_test) : 0,
      evaluation: row ? Number(row.evaluation) : 0,
      contest: row ? Number(row.contest) : 0,
      members: row ? Number(row.members) : 0,
    };
  });
}

module.exports = {
  buildReport,
};
