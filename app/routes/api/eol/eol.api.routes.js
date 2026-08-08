const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../middleware/jwt.middleware');
const eolTestMiddleware = require('../../../middleware/eol.test.middleware');
const eolApiController = require('../../../controller/eol/eol.api.controller');
const reportApiController = require('../../../controller/eol/report.api.controller');
const academicApiController = require('../../../controller/eol/academic.api.controller');
const accountApiController = require('../../../controller/eol/account.api.controller');
const refillApiController = require('../../../controller/eol/refill.api.controller');
const profileApiController = require('../../../controller/eol/profile.api.controller');
const masterApiController = require('../../../controller/eol/master.api.controller');
const etestApiController = require('../../../controller/eol/etest.api.controller');
const statisticsApiController = require('../../../controller/eol/statistics.api.controller');
const systemtestApiController = require('../../../controller/eol/systemtest.api.controller');
const standardtestApiController = require('../../../controller/eol/standardtest.api.controller');

router.get('/account', jwtMiddleware.verifyToken, accountApiController.getAccount);

router.get('/eoltest/home', jwtMiddleware.verifyToken, eolApiController.getHome);

router.get('/refill', jwtMiddleware.verifyToken, refillApiController.getRefill);
router.post('/refill', jwtMiddleware.verifyToken, eolApiController.postRefill);

router.get('/profile', jwtMiddleware.verifyToken, profileApiController.getProfile);
router.post('/profile', jwtMiddleware.verifyToken, eolApiController.updateProfile);
router.post('/password', jwtMiddleware.verifyToken, eolApiController.changePassword);

router.get('/master', jwtMiddleware.verifyToken, masterApiController.getDashboard);
router.post('/master/group/create', jwtMiddleware.verifyToken, masterApiController.createGroup);
router.post('/master/group/rename', jwtMiddleware.verifyToken, masterApiController.renameGroup);
router.post('/master/group/delete', jwtMiddleware.verifyToken, masterApiController.deleteGroup);
router.post('/master/member/add', jwtMiddleware.verifyToken, masterApiController.addMember);
router.post('/master/member/edit', jwtMiddleware.verifyToken, masterApiController.editMember);
router.post('/master/member/status', jwtMiddleware.verifyToken, masterApiController.setStatus);
router.post('/master/member/left', jwtMiddleware.verifyToken, masterApiController.leftGroup);
router.post('/master/member/delete', jwtMiddleware.verifyToken, masterApiController.deleteSub);
router.post('/master/members/limit', jwtMiddleware.verifyToken, masterApiController.bulkLimit);
router.post('/master/members/unlimit', jwtMiddleware.verifyToken, masterApiController.bulkUnlimit);
router.post('/master/members/delete', jwtMiddleware.verifyToken, masterApiController.bulkDelete);
router.post('/master/members/move', jwtMiddleware.verifyToken, masterApiController.bulkMove);

router.get('/report/selector', jwtMiddleware.verifyToken, reportApiController.getSelector);
router.get('/report/academic', jwtMiddleware.verifyToken, reportApiController.getAcademic);
router.get('/report/standard', jwtMiddleware.verifyToken, reportApiController.getStandard);
router.get('/report/contest', jwtMiddleware.verifyToken, reportApiController.getContest);

router.get('/academic/status', jwtMiddleware.verifyToken, academicApiController.getStatus);
router.post('/academic/set-test', jwtMiddleware.verifyToken, academicApiController.setTest);

router.get('/etest', jwtMiddleware.verifyToken, etestApiController.getEtest);
router.post('/etest/update', jwtMiddleware.verifyToken, etestApiController.updateExam);
router.post('/etest/delete', jwtMiddleware.verifyToken, etestApiController.deleteExam);
router.post('/etest/create/custom', jwtMiddleware.verifyToken, etestApiController.createCustom);
router.post('/etest/question', jwtMiddleware.verifyToken, etestApiController.addQuestion);
router.post('/etest/create/system', jwtMiddleware.verifyToken, etestApiController.createSystem);

router.get('/statistics/overview', jwtMiddleware.verifyToken, statisticsApiController.overview);
router.get('/statistics/evaluation', jwtMiddleware.verifyToken, statisticsApiController.evaluation);
router.get('/statistics/contest', jwtMiddleware.verifyToken, statisticsApiController.contest);

router.get('/systemtest/status', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, systemtestApiController.status);
router.post('/systemtest/create', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, systemtestApiController.create);
router.get('/systemtest/question', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, systemtestApiController.question);
router.post('/systemtest/record', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, systemtestApiController.record);
router.post('/systemtest/finish', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, systemtestApiController.finish);

router.get('/standardtest/status', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, standardtestApiController.status);
router.post('/standardtest/create', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, standardtestApiController.create);
router.get('/standardtest/page', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, standardtestApiController.page);
router.post('/standardtest/record', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, standardtestApiController.record);
router.post('/standardtest/finish', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTimeApi, standardtestApiController.finish);

const eolcontestApiRoutes = require('./eolcontest.api.routes');
router.use('/eoltest/eolcontest', eolcontestApiRoutes);

module.exports = router;
