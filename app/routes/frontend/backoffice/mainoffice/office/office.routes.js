const express = require('express');
const path = require('path');
const router = express.Router();
const jwtMiddleware = require('../../../../../middleware/jwt.middleware');

router.get('/', (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Webmaster Backoffice | EOL System',
    showLogout: false,
  });
});

router.get('/dashboard', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_office'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/office/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Webmaster Backoffice | EOL System',
    showLogout: true,
    adminUser: req.user.user,
    adminFullName: req.user.fullName || req.user.user,
  });
});

router.use('/user', require('./user/user.routes'));
router.use('/main-menu', require('./main-menu/main-menu.routes'));
router.use('/activity-news', require('./activity-news/activity-news.routes'));
router.use('/interesting', require('./interesting/interesting.routes'));
router.use('/news', require('./news/news.routes'));
router.use('/entertainment', require('./entertainment/entertainment.routes'));
router.use('/english-channel', require('./english-channel/english-channel.routes'));
router.use('/english-etesting', require('./english-etesting/english-etesting.routes'));
router.use('/e-learning', require('./e-learning/e-learning.routes'));
router.use('/e-learning-reading', require('./e-learning/e-learning-reading.routes'));
router.use('/e-learning-listening', require('./e-learning/e-learning-listening.routes'));
router.use('/e-learning-semi-speaking', require('./e-learning/e-learning-semi-speaking.routes'));
router.use('/e-learning-semi-writing', require('./e-learning/e-learning-semi-writing.routes'));
router.use('/e-learning-grammar', require('./e-learning/e-learning-grammar.routes'));
router.use('/e-learning-cloze', require('./e-learning/e-learning-cloze.routes'));
router.use('/e-learning-vocabulary', require('./e-learning/e-learning-vocabulary.routes'));
router.use('/eol-contest-exam', require('./eol-contest-exam/eol-contest-exam.routes'));

module.exports = router;
