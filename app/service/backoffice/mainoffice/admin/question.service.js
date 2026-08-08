const questionModel = require('../../../../model/backoffice/mainoffice/admin/question.model');

const SKILLS = [
  { id: 1, name: 'Reading' },
  { id: 2, name: 'Listening' },
  { id: 3, name: 'Speaking' },
  { id: 4, name: 'Writing' },
  { id: 5, name: 'Grammartical' },
  { id: 6, name: 'Intergrated' },
  { id: 7, name: 'Vocabulary' },
];

const DESCRIPTION_SKILLS = [
  { id: 1, name: 'Reading' },
  { id: 2, name: 'Listening' },
  { id: 3, name: 'Speaking' },
  { id: 4, name: 'Writing' },
  { id: 5, name: 'Grammartical' },
  { id: 6, name: 'Cloze test' },
  { id: 7, name: 'Vocabulary' },
];

async function buildQuestionAmount() {
  const [questionRows, descriptionRows] = await Promise.all([
    questionModel.countQuestionsBySkillAndLevel(),
    questionModel.countDescriptionsBySkill(),
  ]);

  const questionCounts = new Map();
  questionRows.forEach((row) => {
    questionCounts.set(`${row.SKILL_ID}-${row.LEVEL_ID}-${row.IS_ACTIVE}`, Number(row.amount) || 0);
  });

  const descriptionCounts = new Map();
  descriptionRows.forEach((row) => {
    descriptionCounts.set(Number(row.SKILL_ID), Number(row.amount) || 0);
  });

  return {
    rows: SKILLS.map((skill) => {
      const levels = [1, 2, 3, 4, 5].map((level) => {
        const online = questionCounts.get(`${skill.id}-${level}-1`) || 0;
        const offline = questionCounts.get(`${skill.id}-${level}-0`) || 0;
        return {
          level,
          online,
          offline,
          total: online + offline,
        };
      });
      const onlineTotal = levels.reduce((sum, level) => sum + level.online, 0);
      const offlineTotal = levels.reduce((sum, level) => sum + level.offline, 0);
      return {
        skillId: skill.id,
        skillName: skill.name,
        levels,
        onlineTotal,
        offlineTotal,
        total: onlineTotal + offlineTotal,
      };
    }),
    descriptions: DESCRIPTION_SKILLS.map((skill) => ({
      skillId: skill.id,
      skillName: skill.name,
      amount: descriptionCounts.get(skill.id) || 0,
    })),
  };
}

module.exports = {
  buildQuestionAmount,
};
