const express = require('express');
const path = require('path');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwt.middleware');

// Home
router.get('/', (req, res) => {
  res.render(path.join(__dirname, '../../../views/page/index.ejs'), {
    layout: path.join(__dirname, '../../../views/layouts/main.layout.ejs'),
    script: '/js/pages/index.js',
  });
});

// TEOC 11 results (migrated from /18.php)
router.get('/18', (req, res) => {
  res.render(path.join(__dirname, '../../../views/page/18.ejs'), {
    layout: path.join(__dirname, '../../../views/layouts/main.layout.ejs'),
    title: 'TEOC 11 เช็ครายชื่อของคุณสิ ผ่านหรือยัง | EOL System',
    script: '/assets/js/pages/18.js',
  });
});

// Certificate page (member only)
router.get('/certificate', jwtMiddleware.verifyToken, (req, res) => {
  res.render(path.join(__dirname, '../../../views/page/certificate.ejs'), {
    layout: path.join(__dirname, '../../../views/layouts/main.layout.ejs'),
    title: 'EOL Certificate | EOL System',
    script: '/assets/js/pages/certificate.js',
  });
});

// Auth pages
router.use('/auth', require('./auth/auth.routes'));

// Info pages
router.use('/info', require('./info/info.routes'));

// EOL System pages
router.use('/eol_system', require('./eol_system/eol_system.routes'));

// Shop pages
router.use('/shop', require('./shop/shop.routes'));

// Exam List pages
router.use('/exam_list', require('./exam_list/exam_list.routes'));

// Forum pages
router.use('/forum', require('./forum/forum.routes'));

// Contact pages
router.use('/contact', require('./contact/contact.routes'));

// EOL Dashboard (Phase 2)
router.use('/eol', require('./eol/eol.routes'));

// Corporate Multi-Learning
router.use('/corporate', require('./corporate/corporate.routes'));

// Lessons / E-Learning
router.use('/lessons', require('./lessons/lessons.routes'));

// 1 Year Course (migration starting from login)
router.use('/1yc', require('./1yc/1yc.routes'));

// Backoffice pages
router.use('/backoffice', require('./backoffice/backoffice.routes'));

module.exports = router;
