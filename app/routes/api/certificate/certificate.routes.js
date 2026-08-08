const express = require('express');
const router = express.Router();
const certificate = require('../../../controller/certificate/certificate.controller');
const jwtMiddleware = require('../../../middleware/jwt.middleware');

router.get('/me', jwtMiddleware.authenticate, certificate.me);

module.exports = router;
