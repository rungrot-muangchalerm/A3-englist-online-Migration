const express = require('express');
const path = require('path');
const router = express.Router();
const jwtMiddleware = require('../../../../../../middleware/jwt.middleware');

router.get('/', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-reason-index-details.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Check Reason Index and Details | EOL System',
    showLogout: true,
    pageMode: 'list',
    script: '/assets/js/pages/backoffice/admin-check-reason-index-details.js',
  });
});

router.get('/reading', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-reason-index-details.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Check Reason Index and Details - Reading | EOL System',
    showLogout: true,
    pageMode: 'skill',
    skillPath: 'reading',
    script: '/assets/js/pages/backoffice/admin-check-reason-index-details.js',
  });
});

router.get('/listening', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-reason-index-details.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Check Reason Index and Details - Listening | EOL System',
    showLogout: true,
    pageMode: 'skill',
    skillPath: 'listening',
    script: '/assets/js/pages/backoffice/admin-check-reason-index-details.js',
  });
});

router.get('/semi-speaking', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-reason-index-details.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Check Reason Index and Details - Semi-Speaking | EOL System',
    showLogout: true,
    pageMode: 'skill',
    skillPath: 'semi-speaking',
    script: '/assets/js/pages/backoffice/admin-check-reason-index-details.js',
  });
});

router.get('/semi-writing', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-reason-index-details.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Check Reason Index and Details - Semi-Writing | EOL System',
    showLogout: true,
    pageMode: 'skill',
    skillPath: 'semi-writing',
    script: '/assets/js/pages/backoffice/admin-check-reason-index-details.js',
  });
});

router.get('/grammartic', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-reason-index-details.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Check Reason Index and Details - Grammartic | EOL System',
    showLogout: true,
    pageMode: 'skill',
    skillPath: 'grammartic',
    script: '/assets/js/pages/backoffice/admin-check-reason-index-details.js',
  });
});

router.get('/cloze-test', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-reason-index-details.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Check Reason Index and Details - Cloze Test | EOL System',
    showLogout: true,
    pageMode: 'skill',
    skillPath: 'cloze-test',
    script: '/assets/js/pages/backoffice/admin-check-reason-index-details.js',
  });
});

router.get('/vocab', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-reason-index-details.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Check Reason Index and Details - Vocab | EOL System',
    showLogout: true,
    pageMode: 'skill',
    skillPath: 'vocab',
    script: '/assets/js/pages/backoffice/admin-check-reason-index-details.js',
  });
});

router.get('/detail/:detailId', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-reason-index-details.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Check Reason Detail | EOL System',
    showLogout: true,
    pageMode: 'detail',
    detailId: parseInt(req.params.detailId, 10) || 0,
    script: '/assets/js/pages/backoffice/admin-check-reason-index-details.js',
  });
});

router.get('/quiz/:quizId', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-reason-index-details.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Check Reason Quiz | EOL System',
    showLogout: true,
    pageMode: 'quiz',
    quizId: parseInt(req.params.quizId, 10) || 0,
    script: '/assets/js/pages/backoffice/admin-check-reason-index-details.js',
  });
});

module.exports = router;
