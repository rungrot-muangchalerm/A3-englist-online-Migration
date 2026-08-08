const express = require('express');
const path = require('path');
const router = express.Router();
const backofficeMiddleware = require('../../../../../../middleware/backoffice.middleware');

router.get('/beginner', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Grammatical Structure [ Beginner ] | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/beginner-list.js',
  });
});

router.get('/beginner/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Grammatical Structure [ Beginner ] | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/beginner-detail.js',
  });
});

router.get('/beginner/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/beginner-form.js',
  });
});

router.get('/intermediate', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Grammatical Structure [ Intermediate ] | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/intermediate-list.js',
  });
});

router.get('/intermediate/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Grammatical Structure [ Intermediate ] | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/intermediate-detail.js',
  });
});

router.get('/intermediate/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/intermediate-form.js',
  });
});

router.get('/advance', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Grammatical Structure [ Advance ] | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/advance-list.js',
  });
});

router.get('/advance/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Grammatical Structure [ Advance ] | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/advance-detail.js',
  });
});

router.get('/advance/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/advance-form.js',
  });
});

router.get('/toeic', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Grammatical Structure [ TOEIC ] | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/toeic-list.js',
  });
});

router.get('/toeic/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Grammatical Structure [ TOEIC ] | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/toeic-detail.js',
  });
});

router.get('/toeic/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/toeic-form.js',
  });
});

router.get('/ielts', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Grammatical Structure [ IELTS ] | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/ielts-list.js',
  });
});

router.get('/ielts/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Grammatical Structure [ IELTS ] | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/ielts-detail.js',
  });
});

router.get('/ielts/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/e-learning-grammar/ielts-form.js',
  });
});

module.exports = router;
