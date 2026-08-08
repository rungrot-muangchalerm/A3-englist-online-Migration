const express = require('express');
const path = require('path');
const router = express.Router();
const jwtMiddleware = require('../../../middleware/jwt.middleware');
const eolTestMiddleware = require('../../../middleware/eol.test.middleware');
const eolRoleMiddleware = require('../../../middleware/eol.role.middleware');

router.get('/', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTime, eolRoleMiddleware.requireCorporateSub, (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/eolcontest/index.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
    title: 'EOL Contest | EOL System',
    script: '/assets/js/pages/eol/eoltest/eolcontest/index.js',
  });
});

router.get('/:examId', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTime, eolRoleMiddleware.requireCorporateSub, (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/eolcontest/set_test.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
    title: 'EOL Contest | EOL System',
    script: '/assets/js/pages/eol/eoltest/eolcontest/set_test.js',
  });
});

router.get('/:examId/test', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTime, eolRoleMiddleware.requireCorporateSub, (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/eolcontest/test.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
    title: 'EOL Contest | EOL System',
    script: '/assets/js/pages/eol/eoltest/eolcontest/test.js',
  });
});

module.exports = router;
