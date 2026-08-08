const express = require('express');
const router = express.Router();

router.use('/mainoffice/admin', require('./mainoffice/admin/admin.routes'));
router.use('/mainoffice/office', require('./mainoffice/office/office.routes'));

module.exports = router;
