const express = require('express');
const path = require('path');
const router = express.Router();
const jwtMiddleware = require('../../../../../../middleware/jwt.middleware');

router.get('/', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_office'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/user/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage User | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office-user-list.js',
  });
});

router.get('/add', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_office'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/user/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Add New User | EOL System',
    showLogout: true,
    mode: 'create',
    userId: null,
    script: '/assets/js/pages/backoffice/office-user-form.js',
  });
});

router.get('/:id/edit', jwtMiddleware.verifyToken, jwtMiddleware.requireRole('backoffice_office'), (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/user/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit User | EOL System',
    showLogout: true,
    mode: 'edit',
    userId: parseInt(req.params.id, 10) || 0,
    script: '/assets/js/pages/backoffice/office-user-form.js',
  });
});

module.exports = router;
