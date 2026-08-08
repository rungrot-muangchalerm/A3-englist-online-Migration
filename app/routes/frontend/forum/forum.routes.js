const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/e-eng', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/forum/e-eng.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'EOL Column | EOL System',
    activeTypeId: req.query.type_id || '03-01',
    script: '/assets/js/pages/forum/e-eng.js',
  });
});

router.get('/detail', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/forum/detail.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'รายละเอียดบทความ | EOL System',
    script: '/assets/js/pages/forum/detail.js',
  });
});

router.get('/other', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/forum/other.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'EOL Other | EOL System',
    script: '/assets/js/pages/forum/other.js',
  });
});

module.exports = router;