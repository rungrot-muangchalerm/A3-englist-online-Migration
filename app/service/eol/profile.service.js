const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');
const profileData = require('../../model/eol/profile.model');

const AVATAR_DIR = path.join(__dirname, '../../../assets/2010/member_images');
const MAX_IMAGE_SIZE = 100 * 1024; // 100 KB

const educationLevels = {
  1: 'ระดับประถมศึกษาตอนต้น',
  2: 'ระดับประถมศึกษาตอนปลาย',
  3: 'ระดับมัธยมศึกษาตอนต้น',
  4: 'ระดับมัธยมศึกษาตอนปลาย',
  5: 'ระดับอุดมศึกษา',
  6: 'ระดับปริญญาตรี',
  7: 'ระดับปริญญาโท',
  8: 'ระดับปริญญาเอก',
  9: 'อื่นๆ',
};

async function buildProfile(memberId) {
  const member = await profileData.getMemberById(memberId);
  if (!member) {
    const err = new Error('Member not found');
    err.code = 'MEMBER_NOT_FOUND';
    throw err;
  }

  const avatarPath = path.join(AVATAR_DIR, `${memberId}.jpg`);
  const hasAvatar = fs.existsSync(avatarPath);
  let avatarUrl = null;
  let avatarWidth = 90;
  if (hasAvatar) {
    try {
      const image = await Jimp.read(avatarPath);
      avatarWidth = image.getWidth() >= 100 ? 90 : image.getWidth();
    } catch (e) {
      avatarWidth = 90;
    }
    avatarUrl = `/assets/2010/member_images/${memberId}.jpg`;
  }

  return {
    member,
    educationLevels,
    avatarUrl,
    avatarWidth,
    hasAvatar,
  };
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

async function updateProfile(memberId, body, file) {
  const errors = [];
  const fname = String(body.fname || '').trim();
  const lname = String(body.lname || '').trim();
  const gender = String(body.gender || '').trim();
  const birth = String(body.birth || '').trim();
  const educationLevel = String(body.education_a || '0').trim();
  const education = String(body.education_b || '').trim();
  const address = String(body.address || '').trim();
  const email = String(body.email || '').trim();
  const tel = String(body.tel || '').trim();

  if (!fname) errors.push('Please Insert First Name');
  if (!lname) errors.push('Please Insert Last Name');
  if (!gender) errors.push('Please Choose Gender');

  const birthday = parseDate(birth);
  if (birth && !birthday) errors.push('Date of Birth is incorrect');

  if (!educationLevel || educationLevel === '0') errors.push('Please Select Education Level');

  if (!email) {
    errors.push('Please Insert Email');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email is incorrect');
  }

  if (file) {
    if (!['image/jpeg', 'image/jpg'].includes(file.mimetype)) {
      errors.push('Please Upload JPG or JPEG Image Only');
    } else if (file.size > MAX_IMAGE_SIZE) {
      errors.push('Image size must be less than 100 KB');
    }
  }

  if (errors.length > 0) {
    const err = new Error(errors.join('\n'));
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  await profileData.updateProfile(memberId, {
    fname,
    lname,
    gender,
    birthday: birthday || '0000-00-00',
    education,
    educationLevel,
    address,
    email,
    tel,
  });

  if (file) {
    if (!fs.existsSync(AVATAR_DIR)) {
      fs.mkdirSync(AVATAR_DIR, { recursive: true });
    }
    const targetPath = path.join(AVATAR_DIR, `${memberId}.jpg`);
    const image = await Jimp.read(file.buffer);
    await image.contain(100, 100).quality(75).writeAsync(targetPath);
  }

  return { success: true };
}

async function changePassword(memberId, body) {
  const errors = [];
  const oldPass = String(body.old || '');
  const newPass = String(body.new_a || '');
  const rePass = String(body.new_b || '');

  if (!oldPass) errors.push('Please Insert Old Password');
  if (!newPass) errors.push('Please Insert New Password');
  else if (newPass.length < 8 || newPass.length > 20) errors.push('Password must have 8-20 Characters long');
  if (!rePass) errors.push('Please Insert Re-New Password');
  else if (newPass !== rePass) errors.push('New Password and Re-New Password do not match');

  if (errors.length > 0) {
    const err = new Error(errors.join('\n'));
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  const matched = await profileData.checkPassword(memberId, oldPass);
  if (!matched) {
    const err = new Error('Old Password is incorrect');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  await profileData.updatePassword(memberId, newPass);
  return { success: true };
}

module.exports = {
  buildProfile,
  updateProfile,
  changePassword,
};
