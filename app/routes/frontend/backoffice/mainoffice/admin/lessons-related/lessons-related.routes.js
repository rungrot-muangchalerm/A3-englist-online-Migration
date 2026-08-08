const express = require('express');
const path = require('path');
const router = express.Router();
const jwtMiddleware = require('../../../../../../middleware/jwt.middleware');

router.get('/', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/lessons-related.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Lessons & Related | EOL System',
    showLogout: true,
    skillPath: '',
    script: '/assets/js/pages/backoffice/admin-lessons-related.js',
  });
});

router.get('/reading', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/lessons-related.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Lessons & Related - Reading | EOL System',
    showLogout: true,
    skillPath: 'reading',
    script: '/assets/js/pages/backoffice/admin-lessons-related.js',
  });
});

router.get('/listening', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/lessons-related.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Lessons & Related - Listening | EOL System',
    showLogout: true,
    skillPath: 'listening',
    script: '/assets/js/pages/backoffice/admin-lessons-related.js',
  });
});

router.get('/semi-speaking', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/lessons-related.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Lessons & Related - Semi-Speaking | EOL System',
    showLogout: true,
    skillPath: 'semi-speaking',
    script: '/assets/js/pages/backoffice/admin-lessons-related.js',
  });
});

router.get('/semi-writing', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/lessons-related.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Lessons & Related - Semi-Writing | EOL System',
    showLogout: true,
    skillPath: 'semi-writing',
    script: '/assets/js/pages/backoffice/admin-lessons-related.js',
  });
});

router.get('/grammatical', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/lessons-related.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Lessons & Related - Grammatical | EOL System',
    showLogout: true,
    skillPath: 'grammatical',
    script: '/assets/js/pages/backoffice/admin-lessons-related.js',
  });
});

router.get('/integrated-skill', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/lessons-related.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Lessons & Related - Integrated Skill | EOL System',
    showLogout: true,
    skillPath: 'integrated-skill',
    script: '/assets/js/pages/backoffice/admin-lessons-related.js',
  });
});

router.get('/vocabulary', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/lessons-related.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Lessons & Related - Vocabulary | EOL System',
    showLogout: true,
    skillPath: 'vocabulary',
    script: '/assets/js/pages/backoffice/admin-lessons-related.js',
  });
});

module.exports = router;
