const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../middleware/jwt.middleware');
const corporateApiController = require('../../../controller/corporate/corporate.api.controller');

router.get('/status', jwtMiddleware.verifyToken, corporateApiController.status);
router.get('/custom-lessons', jwtMiddleware.verifyToken, corporateApiController.customLessons);
router.get('/custom-lesson', jwtMiddleware.verifyToken, corporateApiController.customLesson);
router.get('/video-topics', jwtMiddleware.verifyToken, corporateApiController.videoTopics);
router.get('/video-topic', jwtMiddleware.verifyToken, corporateApiController.videoTopic);

module.exports = router;
