(function () {
  const listBody = document.getElementById('eolcontest-list-body');

  function htmlEscape(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderList(exams) {
    if (!exams || exams.length === 0) {
      listBody.innerHTML = '<tr><td colspan="4"><font size="2" face="tahoma" color="gray">ไม่มีชุดข้อสอบ</font></td></tr>';
      return;
    }
    let html = '';
    exams.forEach(function (exam, idx) {
      const canTest = exam.allowed && Number(exam.active) === 1;
      const testTypeText = Number(exam.testType) === 2 ? 'การแข่งขัน' : 'สอบเก็บคะแนน';
      const btn = canTest
        ? `<a href="/eol/eoltest/eolcontest/${encodeURIComponent(exam.examId)}" class="btn-test">Test</a>`
        : `<button class="btn-test gray" disabled>Test</button>`;
      const cls = idx % 2 === 0 ? '' : 'style="background:#f7f7f7;"';
      html += `<tr ${cls}>
        <td><b>${htmlEscape(exam.examName)}</b> <font size="2" color="gray">(${htmlEscape(testTypeText)})</font></td>
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
        listBody.innerHTML = `<tr><td colspan="4"><font size="2" face="tahoma" color="red">${htmlEscape(data.message || 'Error')}</font></td></tr>`;
        return;
      }
      renderList(data.data);
    })
    .catch(function (err) {
      listBody.innerHTML = `<tr><td colspan="4"><font size="2" face="tahoma" color="red">${htmlEscape(err.message || 'Network error')}</font></td></tr>`;
    });
})();
