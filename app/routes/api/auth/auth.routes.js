const express = require('express');
const router = express.Router();
const auth = require('../../../controller/auth/auth.controller');

router.get('/me', auth.me);
router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.post('/register', auth.register);
router.post('/forgot', auth.forgot);

module.exports = router;
