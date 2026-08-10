(function () {
  const listBody = document.getElementById('eolcontest-list-body');

  function htmlEscape(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderList(exams) {
    if (!exams || exams.length === 0) {
      listBody.innerHTML = '<tr><td colspan="4"><span class="text-body-secondary">ไม่มีชุดข้อสอบ</span></td></tr>';
      return;
    }
    let html = '';
    exams.forEach(function (exam, idx) {
      const canTest = exam.allowed && Number(exam.active) === 1;
      const testTypeText = Number(exam.testType) === 2 ? 'การแข่งขัน' : 'สอบเก็บคะแนน';
      const btn = canTest
        ? `<a href="/eol/eoltest/eolcontest/${encodeURIComponent(exam.examId)}" class="btn btn-danger btn-sm">Test</a>`
        : `<button class="btn btn-secondary btn-sm" disabled>Test</button>`;
      const cls = idx % 2 === 0 ? '' : 'class="table-secondary"';
      html += `<tr ${cls}>
        <td><b>${htmlEscape(exam.examName)}</b> <span class="text-body-secondary">(${htmlEscape(testTypeText)})</span></td>
        <td>${htmlEscape(exam.amount)}</td>
        <td>${htmlEscape(exam.testtime)} นาที</td>
        <td>${btn}</td>
      </tr>`;
    });
    listBody.innerHTML = html;
  }

  fetch('/api/eol/eoltest/eolcontest/exams', {
    credentials: 'include'
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.status !== 200) {
        listBody.innerHTML = `<tr><td colspan="4"><span class="text-danger">${htmlEscape(data.message || 'Error')}</span></td></tr>`;
        return;
      }
      renderList(data.data);
    })
    .catch(function (err) {
      listBody.innerHTML = `<tr><td colspan="4"><span class="text-danger">${htmlEscape(err.message || 'Network error')}</span></td></tr>`;
    });
})();
