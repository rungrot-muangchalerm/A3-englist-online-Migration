const express = require('express');
const router = express.Router();
const product = require('../../../controller/product/product.controller');

router.get('/', product.list);

module.exports = router;
