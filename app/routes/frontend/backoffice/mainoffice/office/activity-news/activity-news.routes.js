const express = require('express');
const path = require('path');
const router = express.Router();
const backofficeMiddleware = require('../../../../../../middleware/backoffice.middleware');

router.get('/event-gallery', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Event Gallery | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/activity-news/event-gallery-list.js',
  });
});

router.get('/event-gallery/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Event Gallery | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/event-gallery-detail.js',
  });
});

router.get('/event-gallery/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/event-gallery-form.js',
  });
});

router.get('/eol-pr-news', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage ข่าวประชาสัมพธ์ EOL | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/activity-news/eol-pr-news-list.js',
  });
});

router.get('/eol-pr-news/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage ข่าวประชาสัมพธ์ EOL | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/eol-pr-news-detail.js',
  });
});

router.get('/eol-pr-news/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/eol-pr-news-form.js',
  });
});

router.get('/eol-contest', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage EOL Contest | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/activity-news/eol-contest-list.js',
  });
});

router.get('/eol-contest/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage EOL Contest | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/eol-contest-detail.js',
  });
});

router.get('/eol-contest/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/eol-contest-form.js',
  });
});

router.get('/feedback', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/feedback/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Feedback | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office-feedback-list.js',
  });
});

router.get('/csr-activity', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage CSR Activity | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/activity-news/csr-activity-list.js',
  });
});

router.get('/csr-activity/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage CSR Activity | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/csr-activity-detail.js',
  });
});

router.get('/csr-activity/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/csr-activity-form.js',
  });
});

router.get('/advertising', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Advertising | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/activity-news/advertising-list.js',
  });
});

router.get('/advertising/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Advertising | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/advertising-detail.js',
  });
});

router.get('/advertising/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/advertising-form.js',
  });
});

router.get('/news', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage News | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/activity-news/news-list.js',
  });
});

router.get('/news/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage News | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/news-detail.js',
  });
});

router.get('/news/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/news-form.js',
  });
});

router.get('/advertorial', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Advertorial | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office/activity-news/advertorial-list.js',
  });
});

router.get('/advertorial/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Advertorial | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/advertorial-detail.js',
  });
});

router.get('/advertorial/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,
    script: '/assets/js/pages/backoffice/office/activity-news/advertorial-form.js',
  });
});

module.exports = router;
