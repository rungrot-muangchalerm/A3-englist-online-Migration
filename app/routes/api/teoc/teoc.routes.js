const express = require('express');
const router = express.Router();
const teoc = require('../../../controller/teoc/teoc.controller');

router.get('/rounds', teoc.list);

module.exports = router;
