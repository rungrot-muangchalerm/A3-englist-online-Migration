const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../middleware/jwt.middleware');
const eolTestMiddleware = require('../../../middleware/eol.test.middleware');
const eolRoleMiddleware = require('../../../middleware/eol.role.middleware');
const eolcontestApiController = require('../../../controller/eol/eolcontest.api.controller');

router.get('/exams', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, eolRoleMiddleware.requireCorporateSubApi, eolcontestApiController.exams);
router.post('/start', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, eolRoleMiddleware.requireCorporateSubApi, eolcontestApiController.start);
router.get('/page', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, eolRoleMiddleware.requireCorporateSubApi, eolcontestApiController.page);
router.post('/record', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, eolRoleMiddleware.requireCorporateSubApi, eolcontestApiController.record);
router.post('/finish', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, eolRoleMiddleware.requireCorporateSubApi, eolcontestApiController.finish);

module.exports = router;
