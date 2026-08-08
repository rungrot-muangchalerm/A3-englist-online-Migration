const mysqli = require('../../../config/mysqli.config');

/**
 * 1 Year Course logtime / usage history API controller
 */

function formatTimeDiff(totalMinutes) {
  const hour = Math.floor(totalMinutes / 60);
  const min = Math.floor(totalMinutes % 60);
  let text = '';
  if (hour > 0) {
    text += hour + ' ชั่วโมง ';
  }
  text += min + ' นาที';
  return text;
}

function diffMinutes(start, end) {
  if (!start || !end) return 0;
  const d1 = new Date('1970-01-01T' + start);
  const d2 = new Date('1970-01-01T' + end);
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
  const diff = Math.abs(Math.floor((d2 - d1) / 1000 / 60));
  return diff;
}

function toMySqlDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);
  const pad = function (n) { return ('0' + n).slice(-2); };
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
}

function formatDateThai(timestamp) {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return diff + ' วินาทีที่แล้ว';
  if (diff < 3600) return Math.round(diff / 60) + ' นาทีที่แล้ว';
  if (diff < 86400) return Math.round(diff / 3600) + ' ชั่วโมงที่แล้ว';
  if (diff < 172800) return Math.round(diff / 86400) + ' วันที่แล้ว เมื่อเวลา ' + date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2) + ' น.';
  const thMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const year = date.getFullYear() + 543;
  const currentYear = now.getFullYear();
  const dateText = ' เมื่อวันที่ ' + date.getDate() + ' ' + thMonths[date.getMonth()] + (date.getFullYear() >= currentYear ? '' : ' ' + year) + ' เวลา ' + date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2) + ' น.';
  return dateText;
}

module.exports = {
  /**
   * GET /api/1yc/logtime
   * Query: member_id (optional, for admin/management view)
   */
  getLogtime: async (req, res) => {
    try {
      const memberId = req.query.member_id || req.user?.memberId;
      if (!memberId) {
        return res.status(401).json({ status: 401, message: 'Unauthorized' });
      }

      const [memberRows] = await mysqli.query(
        'SELECT id, user, fname, lname FROM tbl_x_member_1year WHERE id = ? LIMIT 1',
        [memberId]
      );
      const member = memberRows.length > 0 ? memberRows[0] : null;
      const fullName = (member && (member.fname || member.lname))
        ? (member.fname || '') + ' ' + (member.lname || '')
        : (member ? member.user : '-');

      const [resultRows] = await mysqli.query(
        'SELECT etest_id, score FROM tbl_1year_result WHERE member_id = ? ORDER BY etest_id ASC',
        [memberId]
      );
      const assessments = resultRows.map(function (row) {
        let testTime = '3';
        if (row.etest_id === 136) testTime = '1';
        else if (row.etest_id === 137) testTime = '2';
        return {
          testTime: testTime,
          score: row.score,
        };
      });

      const [logRows] = await mysqli.query(
        'SELECT logid, logdate, outdate FROM tbl_x_log_member_1year WHERE id = ? ORDER BY logdate DESC',
        [memberId]
      );
      const logs = [];
      let totalMinutes = 0;
      logRows.forEach(function (row) {
        const rawLogDate = row.logdate ? toMySqlDateTime(row.logdate) : '';
        const rawOutDate = row.outdate ? toMySqlDateTime(row.outdate) : '';
        const logTime = rawLogDate.split(' ')[1] || '';
        const outTime = rawOutDate.split(' ')[1] || '';
        const minutes = diffMinutes(logTime, outTime);
        totalMinutes += minutes;
        logs.push({
          logDate: rawLogDate,
          outDate: rawOutDate,
          lastLoginText: formatDateThai(rawLogDate),
          duration: formatTimeDiff(minutes),
          minutes: minutes,
        });
      });

      return res.status(200).json({
        status: 200,
        data: {
          fullName: fullName.trim() || '-',
          memberId: memberId,
          hasAssessments: assessments.length > 0,
          assessments: assessments,
          hasLogs: logs.length > 0,
          logs: logs,
          totalDuration: formatTimeDiff(totalMinutes),
          totalMinutes: totalMinutes,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: 'Server error' });
    }
  },
};
