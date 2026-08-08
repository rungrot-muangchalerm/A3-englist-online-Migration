const path = require('path');
const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../middleware/jwt.middleware');

router.get('/elearning', jwtMiddleware.verifyToken, (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/lessons/index.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
    title: 'English Test Online :: elearning',
    script: '/assets/js/pages/lessons/elearning.js',
  });
});

module.exports = router;
