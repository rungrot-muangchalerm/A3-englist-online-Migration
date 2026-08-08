const express = require('express');
const router = express.Router();
const topic = require('../../../controller/topic/topic.controller');

router.get('/', topic.list);
router.get('/detail', topic.detail);
router.get('/recent-updates', topic.recentUpdates);
router.get('/english-room', topic.englishRoom);
router.get('/magazine-showcase', topic.magazineShowcase);

module.exports = router;
