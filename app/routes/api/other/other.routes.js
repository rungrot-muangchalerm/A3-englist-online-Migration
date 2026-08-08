const express = require('express');
const router = express.Router();
const other = require('../../../controller/other/other.controller');

router.get('/school', other.school);
router.get('/feedback', other.feedback);
router.get('/advertise', other.advertise);

module.exports = router;
