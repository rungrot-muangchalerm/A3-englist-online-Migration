const accountService = require('../eol/account.service');
const lessonsModel = require('../../model/lessons/lessons.model');
const mysqli = require('../../config/mysqli.config');

async function checkPrivilege(memberId) {
  const active = await accountService.hasActiveTime(memberId);
  if (active) {
    return { allow: true };
  }
  const [rows] = await mysqli.query(
    'SELECT member_id FROM tbl_x_member_amount WHERE member_id = ? LIMIT 1',
    [memberId],
  );
  return { allow: rows.length === 1 };
}

async function listTopics(memberId, skillId, levelId, page, search) {
  if (!memberId) {
    const err = new Error('Unauthorized');
    err.code = 'UNAUTHORIZED';
    throw err;
  }
  const skill = Number(skillId) || 0;
  const level = Number(levelId) || 0;
  const currentPage = Number(page) || 1;
  if (skill < 1 || level < 1) {
    const err = new Error('Invalid skill or level');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  const perPage = 20;
  const [total, topics] = await Promise.all([
    lessonsModel.countTopicsByType(skill, level, search),
    lessonsModel.findTopicsByType(skill, level, { page: currentPage, perPage, search }),
  ]);

  const pageCount = Math.ceil(total / perPage) || 1;
  return {
    skillId: skill,
    levelId: level,
    page: currentPage,
    perPage,
    total,
    pageCount,
    topics,
  };
}

function resolveRelatedTopicIds(topicId) {
  const id = String(topicId);
  const groups = [
    ['352', '397', '467'],
    ['378', '379'],
    ['334', '335'],
    ['380', '381', '382'],
    ['336', '337', '338'],
  ];
  for (let i = 0; i < groups.length; i += 1) {
    if (groups[i].includes(id)) {
      return groups[i].filter((item) => item !== id);
    }
  }
  return [];
}

async function getTopicDetail(memberId, topicId, skillId, levelId) {
  if (!memberId) {
    const err = new Error('Unauthorized');
    err.code = 'UNAUTHORIZED';
    throw err;
  }
  const id = Number(topicId) || 0;
  if (id < 1) {
    const err = new Error('Invalid topic');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  const topic = await lessonsModel.findTopicById(id);
  if (!topic) {
    const err = new Error('Topic not found');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const privilege = await checkPrivilege(memberId);
  const relatedIds = resolveRelatedTopicIds(id);
  const relatedTopics = await lessonsModel.findRelatedTopics(relatedIds);

  return {
    topic: {
      topicId: topic.topic_id,
      topicName: topic.topic_name,
      topicDetail: topic.topic_detail,
      typeId: topic.type_id,
    },
    skillId: Number(skillId) || 0,
    levelId: Number(levelId) || 0,
    allow: privilege.allow,
    relatedTopics,
  };
}

module.exports = {
  checkPrivilege,
  listTopics,
  getTopicDetail,
};
