const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/about_eol', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/info/about-eol.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'เกี่ยวกับ EOL | EOL System',
  });
});

router.get('/whatiseol', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/info/whatiseol.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'What is EOL System | EOL System',
  });
});

router.get('/safe', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/info/safe.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'ความปลอดภัยของเว็บไซต์ | EOL System',
  });
});

router.get('/eol', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/info/eol.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'กว่าจะเป็น EOL | EOL System',
  });
});

router.get('/privacy', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/info/privacy.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'นโยบายความเป็นส่วนตัว | EOL System',
  });
});

router.get('/stop', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/info/stop.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'การแก้ปัญหาในการร้องเรียน | EOL System',
  });
});

module.exports = router;
