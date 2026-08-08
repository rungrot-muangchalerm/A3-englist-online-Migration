const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../middleware/jwt.middleware');
const ycController = require('../../../controller/api/1yc/1yc.api.controller');

const logtimeController = require('../../../controller/api/1yc/logtime.api.controller');

const require1yc = jwtMiddleware.requireType(['1yc']);

router.get('/me', require1yc, ycController.me);
router.get('/lessons/html', require1yc, ycController.lessonsHtml);
router.post('/profile', require1yc, ycController.updateProfile);
router.post('/account', require1yc, ycController.updateAccount);
router.get('/logtime', require1yc, logtimeController.getLogtime);
router.use('/faq', require('./faq.api.routes'));

module.exports = router;
