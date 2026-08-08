const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth/auth.routes'));
router.use('/topic', require('./topic/topic.routes'));
router.use('/product', require('./product/product.routes'));
router.use('/forum', require('./forum/forum.routes'));
router.use('/other', require('./other/other.routes'));
router.use('/contact', require('./contact/contact.routes'));
router.use('/teoc', require('./teoc/teoc.routes'));
router.use('/certificate', require('./certificate/certificate.routes'));
router.use('/eol', require('./eol/eol.api.routes'));
router.use('/corporate', require('./corporate/corporate.api.routes'));
router.use('/lessons', require('./lessons/lessons.api.routes'));
router.use('/backoffice', require('./backoffice/backoffice.routes'));
router.use('/1yc', require('./1yc/1yc.api.routes'));

// Health check (optional)
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
