const express = require('express');
const router = express.Router();
const contact = require('../../../controller/contact/contact.controller');

router.post('/send', contact.send);

module.exports = router;
