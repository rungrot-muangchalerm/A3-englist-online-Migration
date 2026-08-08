const lessonRelatedModel = require('../../../../model/backoffice/mainoffice/admin/lesson-related.model');

const SKILLS = {
  1: 'Reading',
  2: 'Listening',
  3: 'Speaking',
  4: 'Writing',
  5: 'Grammatical',
  6: 'Cloze : Test',
  7: 'Vocabulary',
};

function cleanInt(value, fallback) {
  const number = parseInt(value, 10);
  return Number.isNaN(number) ? fallback : number;
}

async function buildList(skillIdParam) {
  const skillId = cleanInt(skillIdParam, 0);
  if (!SKILLS[skillId]) {
    return {
      selectedSkillId: 0,
      selectedSkillName: '',
      relations: [],
    };
  }
  const rows = await lessonRelatedModel.findRelations(skillId);
  return {
    selectedSkillId: skillId,
    selectedSkillName: SKILLS[skillId],
    relations: rows.map((row, index) => ({
      no: index + 1,
      skillId: row.SKILL_ID,
      reasonId: row.DETAIL_ID,
      reasonName: row.DETAIL_NAME || '',
      topicId: row.TOPIC_ID,
      topicName: row.topic_name || '',
    })),
  };
}

module.exports = {
  buildList,
};
