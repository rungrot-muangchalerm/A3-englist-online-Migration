const mysqli = require('../../../../config/mysqli.config');

async function findDailyReport(startDateTime, endDateTime) {
  const [rows] = await mysqli.query(
    `SELECT DATE(create_date) AS report_date,
            COUNT(result_id) AS all_test,
            SUM(CASE WHEN level_id >= 1 AND skill_id >= 1 AND etest_id = 0 THEN 1 ELSE 0 END) AS evaluation,
            SUM(CASE WHEN level_id = 0 AND skill_id = 0 AND etest_id > 1 THEN 1 ELSE 0 END) AS contest,
            COUNT(DISTINCT member_id) AS members
     FROM tbl_w_result
     WHERE create_date >= ? AND create_date <= ?
     GROUP BY DATE(create_date)
     ORDER BY DATE(create_date)`,
    [startDateTime, endDateTime],
  );
  return rows;
}

module.exports = {
  findDailyReport,
};
