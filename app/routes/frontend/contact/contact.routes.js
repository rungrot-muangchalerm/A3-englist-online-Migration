const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/contact', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/contact/contact.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'ติดต่อเรา | EOL System',
    script: '/assets/js/pages/contact/contact.js',
  });
});

router.get('/work', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/contact/work.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'ร่วมงานกับเรา | EOL System',
  });
});

module.exports = router;
