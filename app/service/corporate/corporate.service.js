const corporateModel = require('../../model/corporate/corporate.model');

async function getStatus(memberId) {
  const sub = await corporateModel.findActiveSubMember(memberId);
  return {
    isCorporate: !!sub,
    masterId: sub ? sub.master_id : null,
  };
}

async function requireCorporate(memberId) {
  const status = await getStatus(memberId);
  if (!status.isCorporate) {
    const err = new Error('EOL Multi Learning is limited for corporate members only.');
    err.code = 'NOT_CORPORATE';
    throw err;
  }
  return status;
}

async function listCustomLessons(memberId) {
  const { masterId } = await requireCorporate(memberId);
  const rows = await corporateModel.findCustomLessons(masterId);
  return rows.map((r) => ({
    lessonId: r.lesson_id,
    lessonName: r.lesson_name,
  }));
}

async function getCustomLesson(memberId, lessonId) {
  await requireCorporate(memberId);
  const row = await corporateModel.findCustomLessonById(lessonId);
  if (!row) {
    const err = new Error('Lesson not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  return {
    lessonId: row.lesson_id,
    lessonName: row.lesson_name,
    lessonContent: row.lesson_content,
  };
}

async function listVideoTopics(skillId, levelId) {
  const rows = await corporateModel.findVideoTopics(skillId, levelId);
  return rows.map((r) => ({
    topicId: r.topic_id,
    topicName: r.topic_name,
    adminId: r.admin_id,
  }));
}

async function getVideoTopic(topicId) {
  const row = await corporateModel.findVideoTopicById(topicId);
  if (!row) {
    const err = new Error('Topic not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  return {
    topicId: row.topic_id,
    topicName: row.topic_name,
    topicDetail: row.topic_detail,
  };
}

module.exports = {
  getStatus,
  listCustomLessons,
  getCustomLesson,
  listVideoTopics,
  getVideoTopic,
};
