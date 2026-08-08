const express = require('express');
const router = express.Router();
const controller = require('../../../controller/backoffice/backoffice.controller');

router.get('/account', controller.account);
router.get('/permissions', controller.permissions);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.use('/admin', require('./admin/admin.routes'));
router.use('/office', require('./office/office.routes'));

module.exports = router;
