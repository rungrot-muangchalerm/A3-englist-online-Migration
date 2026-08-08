const express = require('express');
const path = require('path');
const router = express.Router();
const jwtMiddleware = require('../../../../../../middleware/jwt.middleware');

router.get('/', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-questions-list.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Check Questions List | EOL System',
    showLogout: true,
    pageMode: 'menu',
    script: '/assets/js/pages/backoffice/admin-check-questions-list.js',
  });
});

router.get('/search', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-questions-list.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Search List | EOL System',
    showLogout: true,
    pageMode: 'search',
    script: '/assets/js/pages/backoffice/admin-check-questions-list.js',
  });
});

router.get('/add-question', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-questions-list.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Add Questions | EOL System',
    showLogout: true,
    pageMode: 'add-question',
    script: '/assets/js/pages/backoffice/admin-check-questions-list.js',
  });
});

router.get('/add-related-item', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-questions-list.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Add Related Item | EOL System',
    showLogout: true,
    pageMode: 'add-related-item',
    script: '/assets/js/pages/backoffice/admin-check-questions-list.js',
  });
});

router.get('/show-questions', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-questions-list.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Show Question List | EOL System',
    showLogout: true,
    pageMode: 'show-questions',
    script: '/assets/js/pages/backoffice/admin-check-questions-list.js',
  });
});

router.get('/hidden-questions', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-questions-list.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Hidden Question List | EOL System',
    showLogout: true,
    pageMode: 'hidden-questions',
    script: '/assets/js/pages/backoffice/admin-check-questions-list.js',
  });
});

router.get('/show-related', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-questions-list.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Show Related List | EOL System',
    showLogout: true,
    pageMode: 'show-related',
    script: '/assets/js/pages/backoffice/admin-check-questions-list.js',
  });
});

router.get('/hidden-related', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_admin'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/admin/check-questions-list.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Hidden Related List | EOL System',
    showLogout: true,
    pageMode: 'hidden-related',
    script: '/assets/js/pages/backoffice/admin-check-questions-list.js',
  });
});

module.exports = router;
