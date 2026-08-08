const express = require('express');
const path = require('path');
const router = express.Router();
const backofficeMiddleware = require('../../../../../../middleware/backoffice.middleware');

router.get('/about-us', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage About Us | EOL System',
    showLogout: true,    script: '/assets/js/pages/backoffice/office/main-menu/about-us-list.js',
  });
});

router.get('/about-us/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage About Us | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/about-us-detail.js',
  });
});

router.get('/about-us/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/about-us-form.js',
  });
});

router.get('/webboard', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Webboard | EOL System',
    showLogout: true,    script: '/assets/js/pages/backoffice/office/main-menu/webboard-list.js',
  });
});

router.get('/webboard/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Webboard | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/webboard-detail.js',
  });
});

router.get('/webboard/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/webboard-form.js',
  });
});

router.get('/contact-us', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Contact Us | EOL System',
    showLogout: true,    script: '/assets/js/pages/backoffice/office/main-menu/contact-us-list.js',
  });
});

router.get('/contact-us/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Contact Us | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/contact-us-detail.js',
  });
});

router.get('/contact-us/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/contact-us-form.js',
  });
});

router.get('/product', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Product | EOL System',
    showLogout: true,    script: '/assets/js/pages/backoffice/office/main-menu/product-list.js',
  });
});

router.get('/product/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage Product | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/product-detail.js',
  });
});

router.get('/product/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/product-form.js',
  });
});

router.get('/how-to-use-eol', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage How to use EOL | EOL System',
    showLogout: true,    script: '/assets/js/pages/backoffice/office/main-menu/how-to-use-eol-list.js',
  });
});

router.get('/how-to-use-eol/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage How to use EOL | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/how-to-use-eol-detail.js',
  });
});

router.get('/how-to-use-eol/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/how-to-use-eol-form.js',
  });
});

router.get('/what-is-eol', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage What is EOL | EOL System',
    showLogout: true,    script: '/assets/js/pages/backoffice/office/main-menu/what-is-eol-list.js',
  });
});

router.get('/what-is-eol/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage What is EOL | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/what-is-eol-detail.js',
  });
});

router.get('/what-is-eol/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/what-is-eol-form.js',
  });
});

router.get('/eol-ad-update-promotion', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage EOL Ad Update & Promotion | EOL System',
    showLogout: true,    script: '/assets/js/pages/backoffice/office/main-menu/eol-ad-update-promotion-list.js',
  });
});

router.get('/eol-ad-update-promotion/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage EOL Ad Update & Promotion | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/eol-ad-update-promotion-detail.js',
  });
});

router.get('/eol-ad-update-promotion/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/eol-ad-update-promotion-form.js',
  });
});

router.get('/eol-history', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage กว่าจะเป็น EOL | EOL System',
    showLogout: true,    script: '/assets/js/pages/backoffice/office/main-menu/eol-history-list.js',
  });
});

router.get('/eol-history/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage กว่าจะเป็น EOL | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/eol-history-detail.js',
  });
});

router.get('/eol-history/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/eol-history-form.js',
  });
});

router.get('/eol-vdo', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage EOL VDO | EOL System',
    showLogout: true,    script: '/assets/js/pages/backoffice/office/main-menu/eol-vdo-list.js',
  });
});

router.get('/eol-vdo/:topicId/detail', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/detail.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage EOL VDO | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/eol-vdo-detail.js',
  });
});

router.get('/eol-vdo/:topicId/edit', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/topic/form.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Edit Topic | EOL System',
    showLogout: true,
    topicId: parseInt(req.params.topicId, 10) || 0,    script: '/assets/js/pages/backoffice/office/main-menu/eol-vdo-form.js',
  });
});

module.exports = router;
