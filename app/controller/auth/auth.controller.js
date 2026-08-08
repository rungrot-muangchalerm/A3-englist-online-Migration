const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const sendMail = require('../../service/email.service');
const mysqli = require('../../config/mysqli.config');
const jwtMiddleware = require('../../middleware/jwt.middleware');

const secret = process.env.JWT_SECRET;
const TOKEN_MAX_AGE = 24 * 60 * 60 * 1000;

function generateRandomPassword(length = 8) {
  const chars = 'abcdefghijklmnpqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function findMemberByUserPass(username, password) {
  // 1) tbl_x_member
  let sql = 'SELECT member_id, user, pass, fname, lname, gender, is_admin FROM tbl_x_member WHERE user = ? AND pass = ? LIMIT 1';
  let [rows] = await mysqli.query(sql, [username, password]);
  if (rows.length === 1) {
    const r = rows[0];
    return {
      memberId: r.member_id,
      user: r.user,
      fname: r.fname,
      lname: r.lname,
      gender: r.gender,
      role: r.is_admin == 1 ? 'admin' : 'member',
      type: 'member',
    };
  }

  // 2) tbl_x_member_1year
  sql = 'SELECT id, user, pass, fname, lname FROM tbl_x_member_1year WHERE user = ? AND pass = ? LIMIT 1';
  [rows] = await mysqli.query(sql, [username, password]);
  if (rows.length === 1) {
    const r = rows[0];
    return {
      memberId: r.id,
      user: r.user,
      fname: r.fname,
      lname: r.lname,
      gender: 1,
      role: 'member',
      type: '1yc',
    };
  }

  // 3) tbl_x_member_general
  sql = 'SELECT member_id, user, pass, fname, lname, gender FROM tbl_x_member_general WHERE user = ? AND pass = ? LIMIT 1';
  [rows] = await mysqli.query(sql, [username, password]);
  if (rows.length === 1) {
    const r = rows[0];
    return {
      memberId: r.member_id,
      user: r.user,
      fname: r.fname,
      lname: r.lname,
      gender: r.gender,
      role: 'member',
      type: 'general',
    };
  }

  return null;
}

async function findMemberDetails(memberId, type) {
  if (type === '1yc') {
    const sql = 'SELECT id, user, fname, lname FROM tbl_x_member_1year WHERE id = ? LIMIT 1';
    const [rows] = await mysqli.query(sql, [memberId]);
    if (rows.length === 1) {
      const r = rows[0];
      return {
        memberId: r.id,
        user: r.user,
        fname: r.fname,
        lname: r.lname,
        gender: 1,
        role: 'member',
        type: '1yc',
      };
    }
    return null;
  }

  if (type === 'general') {
    const sql = 'SELECT member_id, user, fname, lname, gender FROM tbl_x_member_general WHERE member_id = ? LIMIT 1';
    const [rows] = await mysqli.query(sql, [memberId]);
    if (rows.length === 1) {
      const r = rows[0];
      return {
        memberId: r.member_id,
        user: r.user,
        fname: r.fname,
        lname: r.lname,
        gender: r.gender,
        role: 'member',
        type: 'general',
      };
    }
    return null;
  }

  const sql = 'SELECT member_id, user, fname, lname, gender, is_admin FROM tbl_x_member WHERE member_id = ? LIMIT 1';
  const [rows] = await mysqli.query(sql, [memberId]);
  if (rows.length === 1) {
    const r = rows[0];
    return {
      memberId: r.member_id,
      user: r.user,
      fname: r.fname,
      lname: r.lname,
      gender: r.gender,
      role: r.is_admin == 1 ? 'admin' : 'member',
      type: 'member',
    };
  }
  return null;
}

function resolveAvatar(memberId, gender) {
  const fallbackAvatar = `/assets/2010/member_images/icon_user_0${gender}.jpg`;
  const avatarPath = path.join(__dirname, '../../assets/2010/member_images', `${memberId}.jpg`);
  const avatar = fs.existsSync(avatarPath)
    ? `/assets/2010/member_images/${memberId}.jpg`
    : fallbackAvatar;
  return { avatar, fallbackAvatar };
}

function buildMemberPublic(member) {
  const gender = member.gender || 1;
  const { avatar, fallbackAvatar } = resolveAvatar(member.memberId, gender);
  return {
    memberId: member.memberId,
    user: member.user,
    fname: member.fname,
    lname: member.lname,
    role: member.role,
    type: member.type || 'member',
    avatar,
    fallbackAvatar,
    profile: member.role === 'admin' ? 'Administrator' : 'Member',
  };
}

module.exports = {
  /**
   * POST /api/auth/login
   * ตรวจสอบ username/password และออก JWT cookie
   */
  login: async (req, res) => {
    try {
      const { username, password } = req.body || {};
      if (!username || !password) {
        res.status(400).json({ success: false, message: 'กรุณาระบุชื่อผู้ใช้และรหัสผ่าน' });
        return;
      }

      const member = await findMemberByUserPass(String(username).trim(), String(password).trim());
      if (!member) {
        res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        return;
      }

      const token = jwt.sign(
        {
          memberId: member.memberId,
          user: member.user,
          fname: member.fname,
          lname: member.lname,
          role: member.role,
          type: member.type,
        },
        secret,
        { expiresIn: '24h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: TOKEN_MAX_AGE,
      });

      res.status(200).json({
        success: true,
        member: buildMemberPublic(member),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
  },

  /**
   * GET /api/auth/me
   * ส่งข้อมูลผู้ใช้ปัจจุบันกลับไป (หรือ null ถ้ายังไม่ login)
   */
  me: async (req, res) => {
    try {
      const token = jwtMiddleware.getToken(req);
      if (!token) {
        res.status(200).json({ loggedIn: false, member: null });
        return;
      }

      let decoded;
      try {
        decoded = jwt.verify(token, secret);
      } catch (err) {
        res.status(200).json({ loggedIn: false, member: null });
        return;
      }

      const details = await findMemberDetails(decoded.memberId, decoded.type);
      if (!details) {
        res.status(200).json({
          loggedIn: true,
          member: buildMemberPublic({
            memberId: decoded.memberId,
            user: decoded.user,
            fname: decoded.fname,
            lname: decoded.lname,
            gender: 1,
            role: decoded.role,
            type: decoded.type || 'member',
          }),
        });
        return;
      }

      res.status(200).json({
        loggedIn: true,
        member: buildMemberPublic(details),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
    }
  },

  /**
   * POST /api/auth/logout
   * เพิ่ม token เข้า blacklist และลบ cookie
   */
  logout: async (req, res) => {
    try {
      jwtMiddleware.revoke(req, res, () => { });
      res.clearCookie('token');
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
  },

  /**
   * POST /api/auth/register
   * สมัครสมาชิกใหม่
   */
  register: async (req, res) => {
    try {
      const {
        fname, lname, user, pass, email, tel, gender, datebirth, recaptchaToken, check_accept,
      } = req.body || {};

      const errors = [];

      if (!fname || !String(fname).trim()) errors.push('Please Insert First Name');
      if (!lname || !String(lname).trim()) errors.push('Please Insert Last Name');

      const username = String(user || '').trim();
      const password = String(pass || '');
      const emailStr = String(email || '').trim();
      const telStr = String(tel || '').trim();
      const genderVal = String(gender || '').trim();
      const birthday = String(datebirth || '').trim();

      if (!username) {
        errors.push('Please Insert Username');
      } else {
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
          errors.push('UserName กรุณากรอกเฉพาะตัวอักษร a-z, A-Z, 0-9 เท่านั้น');
        }
        if (username.length < 8 || username.length > 20) {
          errors.push('Username must have 8-20 Characters long');
        }
      }

      if (!password) {
        errors.push('Please Insert Password');
      } else {
        if (!/^[a-zA-Z0-9]+$/.test(password)) {
          errors.push('Password กรุณากรอกเฉพาะตัวอักษร a-z, A-Z, 0-9 เท่านั้น');
        }
        if (password.length < 8 || password.length > 20) {
          errors.push('Password must have 8-20 Characters long');
        }
      }

      if (!emailStr) {
        errors.push('Please Insert Email');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
        errors.push('Email is incorrect');
      }

      if (!genderVal || !['1', '2'].includes(genderVal)) errors.push('Please Choose Gender.');
      if (!telStr) errors.push('Please Insert Tel.');
      if (!birthday) errors.push('Please Insert Date of Birth');
      if (!check_accept) errors.push('กรุณายอมรับข้อกำหนดในการใช้งาน');

      if (!recaptchaToken) {
        errors.push('โปรดยืนยันตัวตนของคุณ');
      } else {
        const recaptchaSecret = process.env.RECAPTCHA_SECRET || '6LfiLXUaAAAAANcB8khOlRKNkYlaUbYFHesERj3W';
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(recaptchaToken)}`;
        const verifyRes = await fetch(verifyUrl, { method: 'POST' });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          errors.push('โปรดทำการยืนยันให้ถูกต้อง');
        }
      }

      if (errors.length === 0) {
        const [[existing]] = await mysqli.query(
          'SELECT 1 AS found FROM tbl_x_member WHERE user = ? UNION SELECT 1 FROM tbl_x_member_1year WHERE user = ? LIMIT 1',
          [username, username]
        );
        if (existing) {
          errors.push('This Username is already registered');
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: errors.join('\n'),
          errors,
        });
      }

      const [[maxRow]] = await mysqli.query('SELECT MAX(member_id) AS max_id FROM tbl_x_member');
      const nextId = (parseInt(maxRow.max_id, 10) || 0) + 1;
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const insertSql = `
        INSERT INTO tbl_x_member
        (member_id, user, pass, fname, lname, nickname, gender, education_level, education, birthday, address, email, tel, create_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await mysqli.query(insertSql, [
        nextId, username, password, fname, lname, '', genderVal, '0', '', birthday || '0000-00-00', '', emailStr, telStr, now,
      ]);

      res.status(200).json({
        success: true,
        message: 'สมัครสมาชิกสำเร็จ Login เข้าสู่ระบบ',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
  },

  /**
   * POST /api/auth/forgot
   * ลืมรหัสผ่าน ส่งรหัสผ่านใหม่ไปยัง email
   */
  forgot: async (req, res) => {
    try {
      const { email, recaptchaToken } = req.body || {};
      const emailStr = String(email || '').trim();
      const errors = [];

      if (!emailStr) {
        errors.push('Please Insert Email');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
        errors.push('Email is incorrect');
      }

      if (!recaptchaToken) {
        errors.push('โปรดยืนยันตัวตนของคุณ');
      } else {
        const recaptchaSecret = process.env.RECAPTCHA_SECRET || '6LfiLXUaAAAAANcB8khOlRKNkYlaUbYFHesERj3W';
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(recaptchaToken)}`;
        const verifyRes = await fetch(verifyUrl, { method: 'POST' });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          errors.push('โปรดทำการยืนยันให้ถูกต้อง');
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: errors.join('\n'),
          errors,
        });
      }

      const [rows] = await mysqli.query(
        'SELECT user, email FROM tbl_x_member WHERE email = ?',
        [emailStr]
      );

      if (rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Sorry your email is not there in our database. Please try again.',
        });
      }

      if (rows.length > 1) {
        return res.status(400).json({
          success: false,
          message: 'Sorry!!! your email registered have more than one. if you want password. Please Contact us.',
        });
      }

      const { user: username } = rows[0];
      const newPassword = generateRandomPassword();

      await mysqli.query(
        'UPDATE tbl_x_member SET pass = ? WHERE email = ?',
        [newPassword, emailStr]
      );

      await sendMail({
        from: 'Engtest.net Webmaster <englishonline.eol@gmail.com>',
        to: emailStr,
        subject: 'Your New Password.',
        text: `You have received a new message from english online by EOL System.\nHere is the message:\n======================================\n\nUsername : ${username} New Password : ${newPassword}\n======================================\n\nhttps://www.engtest.net/index.php\nOnce logged in you can change your password\n\nThanks!\nSite admin\n\nThis is an automated response, please do not reply!`,
      });

      res.status(200).json({
        success: true,
        message: 'Your new password has been send! Please check your email!',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
  },
};
