const express = require('express');
const router = express.Router();
const forum = require('../../../controller/forum/forum.controller');

router.get('/', forum.list);

module.exports = router;
