const mysqli = require('../../../config/mysqli.config');
const { weektopic, exercise_1y } = require('../../../data/1yc-lessons.data');

/**
 * คำนวณจำนวนสัปดาห์ที่ผ่านมาตั้งแต่ startdate
 * ตรงกับ PHP: floor(((strtotime($date) - strtotime($data['startdate'])) / (60*60*24)) / 7)
 */
function computeCurrentWeek(startDate) {
  const now = new Date();
  const start = new Date(startDate);
  const diffDays = (now - start) / (1000 * 60 * 60 * 24);
  return Math.floor(diffDays / 7);
}

/**
 * ประกอบ HTML timeline เหมือน show($lucid) ใน 1yc/fn_1yc.php
 */
function buildLessonsHtml(currentWeek) {
  const cw = Math.max(0, Math.min(51, currentWeek));
  let html = exercise_1y[0];

  for (let i = 1; i <= cw; i += 1) {
    html += exercise_1y[i];
  }

  if (cw < 51) {
    html += '<div class="ss-row">\n' +
            '  <div class="ss-left"><h2 id="">Next</h2></div>\n' +
            '  <div class="ss-right"><h2>WEEK</h2></div>\n' +
            '</div>';
    for (let i = cw + 1; i < 52; i += 1) {
      html += weektopic[i];
    }
    html += '</div>';
  }

  return html;
}

/**
 * 1 Year Course API Controller
 */
module.exports = {
  /**
   * GET /api/1yc/me
   * ข้อมูลสมาชิก 1 Year Course ปัจจุบัน (ต้องเป็น type 1yc)
   */
  me: async (req, res) => {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) {
        return res.status(401).json({ status: 401, message: 'Unauthorized' });
      }
      const sql = 'SELECT id, user, pass, fname, lname, email, admin, active, startdate, enddate FROM tbl_x_member_1year WHERE id = ? LIMIT 1';
      const [rows] = await mysqli.query(sql, [memberId]);
      if (rows.length === 0) {
        return res.status(404).json({ status: 404, message: 'Member not found' });
      }
      const r = rows[0];
      return res.status(200).json({
        status: 200,
        data: {
          memberId: r.id,
          user: r.user,
          fname: r.fname || '',
          lname: r.lname || '',
          email: r.email || '',
          admin: r.admin == 1,
          active: r.active == 1,
          startDate: r.startdate,
          endDate: r.enddate,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: 'Server error' });
    }
  },

  /**
   * POST /api/1yc/profile
   * แก้ไข fname, lname, email
   */
  updateProfile: async (req, res) => {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) {
        return res.status(401).json({ status: 401, message: 'Unauthorized' });
      }
      const { fname, lname, email } = req.body || {};
      if (!fname || !lname || !email) {
        return res.status(400).json({ status: 400, message: 'Please enter firstname, lastname and email' });
      }
      const emailRegex = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ status: 400, message: 'Please enter valid email' });
      }
      const sql = 'UPDATE tbl_x_member_1year SET fname = ?, lname = ?, email = ? WHERE id = ?';
      const [result] = await mysqli.execute(sql, [fname.trim(), lname.trim(), email.trim(), memberId]);
      if (result.affectedRows >= 0) {
        return res.status(200).json({ status: 200, data: { message: 'Edit Profile Success.' } });
      }
      return res.status(500).json({ status: 500, message: 'Some problem occurred, please try again.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: 'Server error' });
    }
  },

  /**
   * POST /api/1yc/account
   * แก้ไข username และ password
   */
  updateAccount: async (req, res) => {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) {
        return res.status(401).json({ status: 401, message: 'Unauthorized' });
      }
      const { user, pass, repass } = req.body || {};
      if (!user || !pass || !repass) {
        return res.status(400).json({ status: 400, message: 'Please enter username, password and re-password' });
      }
      const userTrim = String(user).trim();
      const passTrim = String(pass).trim();
      const repassTrim = String(repass).trim();
      if (userTrim.length < 8 || userTrim.length > 20 || passTrim.length < 8 || passTrim.length > 20) {
        return res.status(400).json({ status: 400, message: 'Username and Password must be 8-20 characters long' });
      }
      if (passTrim !== repassTrim) {
        return res.status(400).json({ status: 400, message: 'Re-New Password is not same your New Password.' });
      }
      // Check duplicate username in tbl_x_member
      let sql = 'SELECT member_id FROM tbl_x_member WHERE user = ? LIMIT 1';
      let [rows] = await mysqli.query(sql, [userTrim]);
      if (rows.length > 0) {
        return res.status(400).json({ status: 400, message: 'This username is already created.' });
      }
      // Check duplicate username in tbl_x_member_1year (excluding self)
      sql = 'SELECT id FROM tbl_x_member_1year WHERE user = ? AND id != ? LIMIT 1';
      [rows] = await mysqli.query(sql, [userTrim, memberId]);
      if (rows.length > 0) {
        return res.status(400).json({ status: 400, message: 'This username is already created.' });
      }
      sql = 'UPDATE tbl_x_member_1year SET user = ?, pass = ? WHERE id = ?';
      const [result] = await mysqli.execute(sql, [userTrim, passTrim, memberId]);
      if (result.affectedRows >= 0) {
        return res.status(200).json({ status: 200, data: { message: 'Edit Username or Password Success.' } });
      }
      return res.status(500).json({ status: 500, message: 'Edit failed.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 500, message: 'Server error' });
    }
  },

  /**
   * GET /api/1yc/lessons/html
   * ส่ง HTML fragment ของ timeline 52 สัปดาห์กลับไปให้ client render
   */
  lessonsHtml: async (req, res) => {
    try {
      const memberId = req.user?.memberId;
      if (!memberId) {
        return res.status(401).json({ status: 401, message: 'Unauthorized' });
      }

      const [rows] = await mysqli.query(
        'SELECT startdate FROM tbl_x_member_1year WHERE id = ? LIMIT 1',
        [memberId]
      );
      if (rows.length === 0) {
        return res.status(404).json({ status: 404, message: 'Member not found' });
      }

      const currentWeek = computeCurrentWeek(rows[0].startdate);
      const html = buildLessonsHtml(currentWeek);

      return res.status(200).json({ status: 200, data: { html } });
    } catch (error) {
      console.error('1yc lessons html error:', error);
      return res.status(500).json({ status: 500, message: 'Server error' });
    }
  },
};
