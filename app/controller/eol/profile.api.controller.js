const profileService = require('../../service/eol/profile.service');

async function getProfile(req, res) {
  try {
    const data = await profileService.buildProfile(req.user.memberId);
    res.json({
      status: 200,
      data: {
        member: data.member,
        educationLevels: data.educationLevels,
        avatarUrl: data.avatarUrl,
        avatarWidth: data.avatarWidth,
        hasAvatar: data.hasAvatar,
      },
    });
  } catch (err) {
    if (err.code === 'MEMBER_NOT_FOUND') {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    res.status(500).json({ status: 500, message: err.message });
  }
}

module.exports = { getProfile };
