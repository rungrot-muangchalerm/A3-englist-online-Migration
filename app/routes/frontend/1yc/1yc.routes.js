const path = require('path');
const express = require('express');
const router = express.Router();
const ycMiddleware = require('../../../middleware/1yc.middleware');

// 1 Year Course dashboard (equivalent to /1yearcourse.php)
router.get('/', ycMiddleware.verify1yc, (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/1yc/index.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/1yc-dashboard.layout.ejs'),
    title: '1 Year Course',
  });
});

router.get('/lessons', ycMiddleware.verify1yc, (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/1yc/lessons.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/1yc.layout.ejs'),
    title: '1 Year Course | Lessons',
  });
});

// 1 Year Course FAQ (equivalent to /1yc/1yearcontent.php?section=faq)
router.get('/faq', ycMiddleware.verify1yc, (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/1yc/faq.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/1yc-content.layout.ejs'),
    title: '1 Year Course | FAQ',
  });
});

router.get('/faq/page/:page', ycMiddleware.verify1yc, (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/1yc/faq.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/1yc-content.layout.ejs'),
    title: '1 Year Course | FAQ',
  });
});

router.get('/faq/:id', ycMiddleware.verify1yc, (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/1yc/faq.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/1yc-content.layout.ejs'),
    title: '1 Year Course | FAQ',
  });
});

// 1 Year Course logtime / usage history (equivalent to /1yc/1yearcontent.php?section=logtime)
router.get('/logtime', ycMiddleware.verify1yc, (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/1yc/logtime.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/1yc-content.layout.ejs'),
    title: '1 Year Course | Logtime',
  });
});

// 1 Year Course content page (legacy, for other sections like logtime/management/topic)
// equivalent to /1yc/1yearcontent.php
router.get('/content', ycMiddleware.verify1yc, (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/1yc/content.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/1yc-content.layout.ejs'),
    title: '1 Year Course | Content',
  });
});

module.exports = router;
