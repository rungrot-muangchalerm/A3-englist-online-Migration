const express = require('express');
const router = express.Router();
const adminReasonController = require('../../../../../controller/backoffice/mainoffice/admin/reason.controller');
const jwtMiddleware = require('../../../../../middleware/jwt.middleware');

router.get('/', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), adminReasonController.list);
router.get('/reading', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '1';
  adminReasonController.list(req, res, next);
});
router.get('/listening', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '2';
  adminReasonController.list(req, res, next);
});
router.get('/semi-speaking', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '3';
  adminReasonController.list(req, res, next);
});
router.get('/semi-writing', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '4';
  adminReasonController.list(req, res, next);
});
router.get('/grammartic', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '5';
  adminReasonController.list(req, res, next);
});
router.get('/cloze-test', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '6';
  adminReasonController.list(req, res, next);
});
router.get('/vocab', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '7';
  adminReasonController.list(req, res, next);
});
router.get('/detail/:detailId', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), adminReasonController.list);
router.get('/quiz/:quizId', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), adminReasonController.list);

module.exports = router;
