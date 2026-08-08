const express = require('express');
const path = require('path');
const router = express.Router();
const backofficeMiddleware = require('../../../../../../middleware/backoffice.middleware');

router.get('/exam', backofficeMiddleware.requireBackofficeLogin, (req, res) => {
  res.render(path.join(__dirname, '../../../../../../../views/page/backoffice/mainoffice/office/eol-contest-exam/index.ejs'), {
    layout: path.join(__dirname, '../../../../../../../views/layouts/backoffice.layout.ejs'),
    title: 'Manage EOL Contest Exam | EOL System',
    showLogout: true,
    script: '/assets/js/pages/backoffice/office-contest-exam.js',
  });
});

module.exports = router;
