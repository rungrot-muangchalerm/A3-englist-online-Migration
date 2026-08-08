const express = require('express');
const path = require('path');
const router = express.Router();
const backofficeMiddleware = require('../../../../../../middleware/backoffice.middleware');

router.get('/english-on-tour', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage English on Tour | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/english-channel/english-on-tour-list.js',
  });
});

router.get('/english-on-tour/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage English on Tour | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/english-channel/english-on-tour-detail.js',
  });
});

router.get('/english-on-tour/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/english-channel/english-on-tour-form.js',
  });
});

router.get('/chris-delivery', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Chris Delivery | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/english-channel/chris-delivery-list.js',
  });
});

router.get('/chris-delivery/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Chris Delivery | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/english-channel/chris-delivery-detail.js',
  });
});

router.get('/chris-delivery/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/english-channel/chris-delivery-form.js',
  });
});

router.get('/yes-you-can', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Yes! You Can. | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/english-channel/yes-you-can-list.js',
  });
});

router.get('/yes-you-can/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Yes! You Can. | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/english-channel/yes-you-can-detail.js',
  });
});

router.get('/yes-you-can/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/english-channel/yes-you-can-form.js',
  });
});

module.exports = router;
