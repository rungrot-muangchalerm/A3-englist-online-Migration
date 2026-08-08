const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../middleware/jwt.middleware');
const faqController = require('../../../controller/api/1yc/faq.api.controller');

const require1yc = jwtMiddleware.requireType(['1yc']);

router.get('/', require1yc, faqController.list);
router.post('/', require1yc, faqController.create);
router.get('/:id', require1yc, faqController.detail);
router.post('/:id/answer', require1yc, faqController.answer);
router.delete('/:id', require1yc, faqController.deleteFaq);
router.delete('/:id/answers/:answerId', require1yc, faqController.deleteAnswer);

module.exports = router;
