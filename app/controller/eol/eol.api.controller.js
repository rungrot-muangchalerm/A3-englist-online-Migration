const path = require('path');
const fs = require('fs');
const multer = require('multer');
const accountService = require('../../service/eol/account.service');
const masterService = require('../../service/eol/master.service');
const refillService = require('../../service/eol/refill.service');
const profileService = require('../../service/eol/profile.service');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200 * 1024 } });

function resolveAvatar(memberId, gender) {
  const fallbackAvatar = `/assets/2010/member_images/icon_user_0${gender || 1}.jpg`;
  const avatarPath = path.join(__dirname, '../../../../assets/2010/member_images', `${memberId}.jpg`);
  const avatar = fs.existsSync(avatarPath)
    ? `/assets/2010/member_images/${memberId}.jpg`
    : fallbackAvatar;
  return { avatar, fallbackAvatar };
}

function buildMemberPublic(member) {
  const gender = member.gender || 1;
  const { avatar, fallbackAvatar } = resolveAvatar(member.member_id, gender);
  return {
    memberId: member.member_id,
    user: member.user,
    fname: member.fname,
    lname: member.lname,
    role: member.is_admin == 1 ? 'admin' : 'member',
    avatar,
    fallbackAvatar,
  };
}

async function getHome(req, res) {
  try {
    const account = await accountService.resolveAccount(req.user.memberId);
    const memberPublic = buildMemberPublic(account.member);
    let masterData;
    if (account.type === 'master') {
      masterData = await masterService.buildDashboard(req.user.memberId, req.query);
    }

    return res.json({
      status: 200,
      data: {
        account: {
          member: memberPublic,
          type: account.type,
          corporate: account.corporate,
          usable: account.usable,
          isAdmin: account.isAdmin,
          infoText: account.infoText,
        },
        master: account.type === 'master' ? masterData : undefined,
      },
    });
  } catch (err) {
    if (err.code === 'MEMBER_NOT_FOUND' || err.code === 'INVALID_MEMBER') {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

async function postRefill(req, res, next) {
  const memberId = req.user.memberId;
  const { code, pin, verifly, verifyToken } = req.body || {};

  if (!code || !pin || !verifly) {
    return res.status(400).json({ status: 400, message: 'Please Insert Code, PIN and Verify Code' });
  }

  if (!refillService.verifyChallenge(verifyToken, verifly)) {
    return res.status(400).json({ status: 400, message: 'Verify Code is incorrect' });
  }

  try {
    const account = await accountService.resolveAccount(memberId);
    const result = await refillService.refillCard(memberId, account.type, code, pin);
    return res.json({
      status: 200,
      data: {
        message: 'Your Refill is Complete. Please Check Refill Information in Refill History',
        ...result,
      },
    });
  } catch (err) {
    return res.status(400).json({ status: 400, message: err.message });
  }
}

function updateProfile(req, res, next) {
  const memberId = req.user.memberId;
  return upload.single('image')(req, res, async (err) => {
    if (err) return next(err);
    try {
      await profileService.updateProfile(memberId, req.body, req.file || null);
      return res.json({ status: 200, data: { message: 'Profile updated successfully' } });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  });
}

async function changePassword(req, res, next) {
  const memberId = req.user.memberId;
  try {
    await profileService.changePassword(memberId, req.body);
    return res.json({ status: 200, data: { message: 'Password changed successfully' } });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
}

module.exports = {
  getHome,
  postRefill,
  updateProfile,
  changePassword,
};
