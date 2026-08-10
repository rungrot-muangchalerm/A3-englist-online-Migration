/* eslint-disable no-undef */

(function () {
  function $(id) { return document.getElementById(id); }

  function renderAssessments(assessments, hasAssessments) {
    let html = '<table class="table table-sm text-center w-100">';
    if (hasAssessments) {
      assessments.forEach(function (a) {
        html += '<tr>' +
          '<td colspan="2"><span class="text-danger">&nbsp;</span></td>' +
          '</tr>' +
          '<tr height="25" class="align-middle">' +
          '<td width="4%" class="text-start"><b>การประเมินผลครั้งที่ &nbsp; : &nbsp; ' + a.testTime + '</b></td>' +
          '<td width="20%" class="text-start"><b>&nbsp; คะแนนที่ได้ &nbsp; : &nbsp; คิดเป็น ' + a.score + ' % </b></td>' +
          '</tr>';
      });
    } else {
      html += '<tr>' +
        '<td colspan="2"><span class="text-danger"> - </span></td>' +
        '</tr>' +
        '<tr>' +
        '<td><span class="text-success">&nbsp;&nbsp;-ไม่มีคะแนนประเมินผล</span></td>' +
        '</tr>';
    }
    html += '</table>';
    return html;
  }

  function renderLogs(logs, hasLogs, totalDuration) {
    if (!hasLogs) {
      return '<div class="text-center"><h3 class="text-danger"> - No data -</h3></div>';
    }
    let html = '<br>' +
      '<table class="table table-sm text-center w-100">' +
      '<tr>' +
      '<td width="35%" class="text-center bg-secondary text-white"><span class="text-white"><b>Last login</b></span></td>' +
      '<td width="20%" class="text-center bg-secondary text-white"><span class="text-white"><b>From</b></span></td>' +
      '<td width="20%" class="text-center bg-secondary text-white"><span class="text-white"><b>Untill</b></span></td>' +
      '<td width="20%" class="text-center bg-secondary text-white"><span class="text-white"><b>Total time</b></span></td>' +
      '</tr>';
    logs.forEach(function (log) {
      html += '<tr>' +
        '<td class="text-start bg-light"><span class="text-primary">&nbsp;&nbsp;' + log.lastLoginText + '</span></td>' +
        '<td class="text-center bg-light"><span class="text-warning">' + log.logDate + '</span></td>' +
        '<td class="text-center bg-light"><span class="text-success">' + log.outDate + '</span></td>' +
        '<td class="text-center bg-light"><span class="text-danger" title="' + log.logDate + '"> ' + log.duration + ' </span></td>' +
        '</tr>';
    });
    html += '<tr>' +
      '<td class="text-center bg-light"><span class="text-warning">&nbsp;</span></td>' +
      '<td class="text-center bg-light"><span class="text-warning">&nbsp;</span></td>' +
      '<td class="text-center bg-light"><span class="text-danger"><b>รวมเวลา</b></span></td>' +
      '<td class="text-center bg-light"><span class="text-danger"> ' + totalDuration + ' </span></td>' +
      '</tr>' +
      '</table>';
    return html;
  }

  function renderLogtime() {
    const body = $('yc-logtime-body');
    if (!body) return;
    body.innerHTML = '<p class="text-center">Loading logtime...</p>';

    fetch('/api/1yc/logtime', { method: 'GET', credentials: 'include' }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status !== 200) {
        console.log(data);
        body.innerHTML = '<p class="text-center">Error loading logtime</p>';
        return;
      }

      const d = data.data;
      let html = '';
      html += '<table class="table table-sm text-center w-100">' +
        '<tr>' +
        '<td colspan="2"><span class="text-danger">' + d.fullName + '</span></td>' +
        '</tr>' +
        '</table>';
      html += renderAssessments(d.assessments, d.hasAssessments);
      html += renderLogs(d.logs, d.hasLogs, d.totalDuration);
      body.innerHTML = html;
    });
  }

  renderLogtime();
}());
