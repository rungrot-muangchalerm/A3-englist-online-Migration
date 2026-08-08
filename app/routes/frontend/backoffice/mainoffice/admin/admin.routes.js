const express = require('express');
const path = require('path');
const router = express.Router();
const jwtMiddleware = require('../../../../../middleware/jwt.middleware');

router.get('/', (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/admin/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Academics Backoffice | EOL System',
    showLogout: false,
  });
});

router.get('/dashboard', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/admin/dashboard.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Academics Backoffice | EOL System',
    showLogout: true,
  });
});

router.get('/check-question-amount', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/admin/check-question-amount.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Check Question Amount | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/admin-check-question-amount.js',
  });
});

router.use('/check-reason-index-details', require('./check-reason-index-details/check-reason-index-details.routes'));

router.use('/check-questions-list', require('./check-questions-list/check-questions-list.routes'));

router.get('/extra-test-system', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/admin/extra-test-system.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Extra Test System | EOL System',
    showLogout: true,
    pageMode: 'list',
    script: '/assets/js/pages/backoffice/admin-extra-test-system.js',
  });
});

router.get('/extra-test-system/:testId', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/admin/extra-test-system.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Extra Test System | EOL System',
    showLogout: true,
    pageMode: 'detail',
    testId: parseInt(req.params.testId, 10) || 0,
    script: '/assets/js/pages/backoffice/admin-extra-test-system.js',
  });
});

router.get('/analyze-quiz', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/admin/analyze-quiz.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Analyze Quiz | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/admin-analyze-quiz.js',
  });
});

router.get('/quiz-comment', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/admin/quiz-comment.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Quiz Comment | EOL System',
    showLogout: true,
    pageMode: 'list',
    script: '/assets/js/pages/backoffice/admin-quiz-comment.js',
  });
});

router.get('/quiz-comment/:quizId', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/admin/quiz-comment.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Quiz Comment | EOL System',
    showLogout: true,
    pageMode: 'detail',
    quizId: parseInt(req.params.quizId, 10) || 0,
    script: '/assets/js/pages/backoffice/admin-quiz-comment.js',
  });
});

router.use('/lessons-related', require('./lessons-related/lessons-related.routes'));

router.get('/monthly-report', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/admin/monthly-report.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Monthly Report | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/admin-monthly-report.js',
  });
});

router.get('/export-report-gepot-excel', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/admin/export-report-gepot-excel.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Export Report GEPOT Excel | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/admin-gepot-excel.js',
  });
});

router.get('/export-report-gepot-pdf', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../views/page/backoffice/mainoffice/admin/export-report-gepot-pdf.ejs'), {
    layout: path.join(__dirname, '../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Export Report GEPOT PDF | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/admin-gepot-pdf.js',
  });
});

module.exports = router;
