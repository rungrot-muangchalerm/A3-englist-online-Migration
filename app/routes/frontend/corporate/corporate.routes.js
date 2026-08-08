const path = require('path');
const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../middleware/jwt.middleware');

router.get('/ecop', jwtMiddleware.verifyToken, (req, res) => {
  const skillId = req.query.skill_id ? Number(req.query.skill_id) : null;
  const levelId = req.query.level_id ? Number(req.query.level_id) : null;

  if (skillId && !levelId) {
    return res.redirect(`/corporate/ecop?skill_id=${skillId}&level_id=2`);
  }

  res.render(path.join(__dirname, '../../../../views/page/corporate/ecop/index.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
    title: 'Corporate Multi - Learning | EOL System',
    script: '/assets/js/pages/corporate/ecop.js',
  });
});

router.get('/ecop/skill/:id', jwtMiddleware.verifyToken, (req, res) => {
  const skillId = Number(req.params.id) || 0;
  res.render(path.join(__dirname, '../../../../views/page/corporate/ecop/skill_id.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
    title: 'EOL Lessons | Corporate Multi - Learning',
    skillId,
    script: '/assets/js/pages/corporate/ecop/eol-lessons.js',
  });
});

module.exports = router;
