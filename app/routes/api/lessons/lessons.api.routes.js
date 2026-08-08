const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../middleware/jwt.middleware');
const lessonsApiController = require('../../../controller/lessons/lessons.api.controller');

router.get('/elearning/privilege', jwtMiddleware.authenticate, lessonsApiController.getPrivilege);
router.get('/elearning/topics', jwtMiddleware.authenticate, lessonsApiController.getTopics);
router.get('/elearning/topic', jwtMiddleware.authenticate, lessonsApiController.getTopicDetail);

module.exports = router;
