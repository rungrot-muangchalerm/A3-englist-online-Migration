const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/eol_member_club', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/eol_system/eol-member-club.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'EOL Member Club | EOL System',
  });
});

router.get('/personal', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/eol_system/personal.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'EOL Personal | EOL System',
  });
});

router.get('/oneyear', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/eol_system/oneyear.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: '1 Year Course | EOL System',
  });
});

router.get('/intelligence', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/eol_system/intelligence.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'EOL Intelligence Course | EOL System',
  });
});

router.get('/corporate', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/eol_system/corporate.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'EOL Corporate Package | EOL System',
  });
});

router.get('/eol_platform', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/eol_system/eol-platform.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'EOL Corporate Platform | EOL System',
  });
});

module.exports = router;
