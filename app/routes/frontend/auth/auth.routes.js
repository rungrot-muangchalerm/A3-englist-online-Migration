const path = require('path');
const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../middleware/jwt.middleware');

const defaultSiteKey = '6LfiLXUaAAAAAPu12aw99mPwxrOelLbxDpuQnHjl';

// Register page
router.get('/register_account', jwtMiddleware.redirectIfAuthenticated, (req, res) => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY || defaultSiteKey;
  res.render(path.join(__dirname, '../../../../views/page/auth/register_account.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'REGISTER | EOL System',
    siteKey,
    script: '/assets/js/pages/auth/register_account.js',
  });
});

// Forgot password page
router.get('/forgot', jwtMiddleware.redirectIfAuthenticated, (req, res) => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY || defaultSiteKey;
  res.render(path.join(__dirname, '../../../../views/page/auth/forgot.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'ลืมรหัสผ่าน | EOL System',
    siteKey,
    script: '/assets/js/pages/auth/forgot.js',
  });
});

module.exports = router;
