const gepotReportService = require('../../../../service/backoffice/mainoffice/admin/gepot-report.service');

async function excel(req, res) {
  try {
    const data = await gepotReportService.buildReport(req.query);
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

async function downloadExcel(req, res, kind) {
  try {
    const file = await gepotReportService.buildExcelExport(kind, req.body);
    if (file.empty) {
      res.status(404).send('Not found.');
      return;
    }
    res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(`\ufeff${file.content}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('เกิดข้อผิดพลาด');
  }
}

async function fullExcel(req, res) {
  await downloadExcel(req, res, 'full');
}

async function summaryExcel(req, res) {
  await downloadExcel(req, res, 'summary');
}

async function pdf(req, res) {
  try {
    const data = await gepotReportService.buildReport(req.query);
    res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'เกิดข้อผิดพลาด' });
  }
}

async function printPdf(req, res) {
  try {
    const file = await gepotReportService.buildPdfExport(req.body);
    if (file.empty) {
      res.status(404).send('Not found.');
      return;
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(file.content);
  } catch (error) {
    console.error(error);
    res.status(500).send('เกิดข้อผิดพลาด');
  }
}

module.exports = {
  excel,
  fullExcel,
  summaryExcel,
  pdf,
  printPdf,
};
