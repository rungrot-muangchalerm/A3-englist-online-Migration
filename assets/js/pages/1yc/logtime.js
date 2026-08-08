/* eslint-disable no-undef */

(function () {
  function $(id) { return document.getElementById(id); }

  function renderAssessments(assessments, hasAssessments) {
    let html = '<table align="center" width="100%" cellpadding="5" cellspacing="1" border="0">';
    if (hasAssessments) {
      assessments.forEach(function (a) {
        html += '<tr>' +
          '<td colspan="2"><font size="3" color="red">&nbsp;</font></td>' +
          '</tr>' +
          '<tr height="25">' +
          '<td align="left" width="4%"><b>การประเมินผลครั้งที่ &nbsp; : &nbsp; ' + a.testTime + '</b></td>' +
          '<td align="left" width="20%"><b>&nbsp; คะแนนที่ได้ &nbsp; : &nbsp; คิดเป็น ' + a.score + ' % </b></td>' +
          '</tr>';
      });
    } else {
      html += '<tr>' +
        '<td colspan="2"><font size="3" color="red"> - </font></td>' +
        '</tr>' +
        '<tr>' +
        '<td><font size="2" face="tahoma" color="green">&nbsp;&nbsp;-ไม่มีคะแนนประเมินผล</font></td>' +
        '</tr>';
    }
    html += '</table>';
    return html;
  }

  function renderLogs(logs, hasLogs, totalDuration) {
    if (!hasLogs) {
      return '<center><h3 style="color:red;"> - No data -</h3></center>';
    }
    let html = '<br>' +
      '<table align="center" width="100%" cellpadding="5" cellspacing="1" border="0">' +
      '<tr>' +
      '<td width="35%" bgcolor="#aaaaaa" align="center"><font size="2" face="tahoma" color="white"><b>Last login</b></font></td>' +
      '<td width="20%" bgcolor="#aaaaaa" align="center"><font size="2" face="tahoma" color="white"><b>From</b></font></td>' +
      '<td width="20%" bgcolor="#aaaaaa" align="center"><font size="2" face="tahoma" color="white"><b>Untill</b></font></td>' +
      '<td width="20%" bgcolor="#aaaaaa" align="center"><font size="2" face="tahoma" color="white"><b>Total time</b></font></td>' +
      '</tr>';
    logs.forEach(function (log) {
      html += '<tr>' +
        '<td bgcolor="#f0f0f0" align="left"><font size="2" face="tahoma" color="blue">&nbsp;&nbsp;' + log.lastLoginText + '</font></td>' +
        '<td bgcolor="#f0f0f0" align="center"><font size="2" face="tahoma" color="brown">' + log.logDate + '</font></td>' +
        '<td bgcolor="#f0f0f0" align="center"><font size="2" face="tahoma" color="green">' + log.outDate + '</font></td>' +
        '<td bgcolor="#f0f0f0" align="center"><font size="2" face="tahoma" color="red" title="' + log.logDate + '"> ' + log.duration + ' </font></td>' +
        '</tr>';
    });
    html += '<tr>' +
      '<td bgcolor="#f0f0f0" align="center"><font size="2" face="tahoma" color="brown">&nbsp;</font></td>' +
      '<td bgcolor="#f0f0f0" align="center"><font size="2" face="tahoma" color="brown">&nbsp;</font></td>' +
      '<td bgcolor="#f0f0f0" align="center"><font size="2" face="tahoma" color="red"><b>รวมเวลา</b></font></td>' +
      '<td bgcolor="#f0f0f0" align="center"><font size="2" face="tahoma" color="red"> ' + totalDuration + ' </font></td>' +
      '</tr>' +
      '</table>';
    return html;
  }

  function renderLogtime() {
    const body = $('yc-logtime-body');
    if (!body) return;
    body.innerHTML = '<p align="center">Loading logtime...</p>';

    fetch('/api/1yc/logtime', { method: 'GET', credentials: 'include' }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status !== 200) {
        console.log(data);
        body.innerHTML = '<p align="center">Error loading logtime</p>';
        return;
      }

      const d = data.data;
      let html = '';
      html += '<table align="center" width="100%" cellpadding="5" cellspacing="1" border="0">' +
        '<tr>' +
        '<td colspan="2"><font size="3" color="red">' + d.fullName + '</font></td>' +
        '</tr>' +
        '</table>';
      html += renderAssessments(d.assessments, d.hasAssessments);
      html += renderLogs(d.logs, d.hasLogs, d.totalDuration);
      body.innerHTML = html;
    });
  }

  renderLogtime();
}());
