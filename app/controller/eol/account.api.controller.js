const path = require('path');
const fs = require('fs');
const accountService = require('../../service/eol/account.service');

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

async function getAccount(req, res) {
  try {
    const account = await accountService.resolveAccount(req.user.memberId);
    const memberPublic = buildMemberPublic(account.member);

    return res.json({
      status: 200,
      data: {
        member: memberPublic,
        account: {
          type: account.type,
          corporate: account.corporate,
          usable: account.usable,
          isAdmin: account.isAdmin,
          infoText: account.infoText,
        },
      },
    });
  } catch (err) {
    if (err.code === 'MEMBER_NOT_FOUND' || err.code === 'INVALID_MEMBER') {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    return res.status(500).json({ status: 500, message: err.message });
  }
}

module.exports = { getAccount };
