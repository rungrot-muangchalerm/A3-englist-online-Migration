const express = require('express');
const path = require('path');
const router = express.Router();
const backofficeMiddleware = require('../../../../../../middleware/backoffice.middleware');

router.get('/beginner', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Reading Comprehension [ Beginner ] | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/beginner-list.js',
  });
});

router.get('/beginner/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Reading Comprehension [ Beginner ] | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/beginner-detail.js',
  });
});

router.get('/beginner/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/beginner-form.js',
  });
});

router.get('/intermediate', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Reading Comprehension [ Intermediate ] | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/intermediate-list.js',
  });
});

router.get('/intermediate/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Reading Comprehension [ Intermediate ] | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/intermediate-detail.js',
  });
});

router.get('/intermediate/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/intermediate-form.js',
  });
});

router.get('/advance', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Reading Comprehension [ Advance ] | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/advance-list.js',
  });
});

router.get('/advance/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Reading Comprehension [ Advance ] | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/advance-detail.js',
  });
});

router.get('/advance/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/advance-form.js',
  });
});

router.get('/toeic', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Reading Comprehension [ TOEIC ] | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/toeic-list.js',
  });
});

router.get('/toeic/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Reading Comprehension [ TOEIC ] | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/toeic-detail.js',
  });
});

router.get('/toeic/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/toeic-form.js',
  });
});

router.get('/ielts', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Reading Comprehension [ IELTS ] | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/ielts-list.js',
  });
});

router.get('/ielts/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Reading Comprehension [ IELTS ] | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/ielts-detail.js',
  });
});

router.get('/ielts/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-reading/ielts-form.js',
  });
});

module.exports = router;
