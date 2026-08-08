const express = require('express');
const router = express.Router();
const adminLessonRelatedController = require('../../../../../controller/backoffice/mainoffice/admin/lesson-related.controller');
const jwtMiddleware = require('../../../../../middleware/jwt.middleware');

router.get('/', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), adminLessonRelatedController.list);
router.get('/reading', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '1';
  adminLessonRelatedController.list(req, res, next);
});
router.get('/listening', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '2';
  adminLessonRelatedController.list(req, res, next);
});
router.get('/semi-speaking', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '3';
  adminLessonRelatedController.list(req, res, next);
});
router.get('/semi-writing', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '4';
  adminLessonRelatedController.list(req, res, next);
});
router.get('/grammatical', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '5';
  adminLessonRelatedController.list(req, res, next);
});
router.get('/integrated-skill', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '6';
  adminLessonRelatedController.list(req, res, next);
});
router.get('/vocabulary', jwtMiddleware.authenticate, jwtMiddleware.requireRoleApi('backoffice_admin'), (req, res, next) => {
  req.params.skillId = '7';
  adminLessonRelatedController.list(req, res, next);
});

module.exports = router;
