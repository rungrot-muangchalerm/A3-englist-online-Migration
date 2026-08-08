const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/eol-standard-test', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/exam_list/eol-standard-test.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'GEPOT ONLINE TEST | Exam List',
  });
});

router.get('/admission', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/exam_list/admission.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'Admission | Exam List',
  });
});

router.get('/cu-tep', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/exam_list/cu-tep.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'CU-TEP | Exam List',
  });
});

router.get('/cefr', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/exam_list/cefr.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'CEFR | Exam List',
  });
});

router.get('/toefl', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/exam_list/toefl.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'TOEFL | Exam List',
  });
});

router.get('/toeic', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/exam_list/toeic.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'TOEIC | Exam List',
  });
});

router.get('/ielts', (req, res) => {
  res.render(path.join(__dirname, '../../../../views/page/exam_list/ielts.ejs'), {
    layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
    title: 'IELTS | Exam List',
  });
});

module.exports = router;
