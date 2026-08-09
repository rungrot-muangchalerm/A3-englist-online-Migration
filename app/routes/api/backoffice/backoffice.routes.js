const express = require('express');
const router = express.Router();
const controller = require('../../../controller/backoffice/backoffice.controller');
const ckeditorUploadController = require('../../../controller/backoffice/mainoffice/office/topic/ckeditor-upload.controller');

router.get('/account', controller.account);
router.get('/permissions', controller.permissions);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.use('/admin', require('./admin/admin.routes'));
router.use('/office', require('./office/office.routes'));
router.post('/ckeditor-upload', ckeditorUploadController.uploadFile);
router.post('/ckeditor-upload/image', ckeditorUploadController.uploadImage);

module.exports = router;
