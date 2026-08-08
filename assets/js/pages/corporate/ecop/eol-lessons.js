(function () {
  const listSection = document.getElementById('eol-lessons-list');
  const detailSection = document.getElementById('eol-lessons-detail');
  const listBody = document.getElementById('eol-lessons-list-body');
  const detailTitle = document.getElementById('eol-lessons-detail-title');
  const detailContent = document.getElementById('eol-lessons-detail-content');
  const backLink = document.getElementById('eol-lessons-back');

  function htmlEscape(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function showList() {
    listSection.style.display = '';
    detailSection.style.display = 'none';
  }

  function showDetail(lesson) {
    detailTitle.textContent = lesson.lessonName || '';
    detailContent.innerHTML = lesson.lessonContent || '';
    listSection.style.display = 'none';
    detailSection.style.display = '';
  }

  function renderList(lessons) {
    if (!lessons || lessons.length === 0) {
      listBody.innerHTML = '<tr><td><font size="2" face="tahoma" color="gray">ไม่มีบทเรียน</font></td></tr>';
      return;
    }
    let html = '';
    lessons.forEach(function (lesson) {
      html += `<tr><td><a href="#" data-lesson-id="${lesson.lessonId}">${htmlEscape(lesson.lessonName)}</a></td></tr>`;
    });
    listBody.innerHTML = html;
    listBody.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        loadLesson(Number(link.dataset.lessonId));
      });
    });
  }

  function loadLesson(lessonId) {
    fetch(`/api/corporate/custom-lesson?lesson_id=${encodeURIComponent(lessonId)}`, {
      credentials: 'include'
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.status !== 200) {
          alert(data.message || 'Error loading lesson');
          return;
        }
        showDetail(data.data);
      })
      .catch(function (err) {
        alert(err.message || 'Network error');
      });
  }

  backLink.addEventListener('click', function (e) {
    e.preventDefault();
    showList();
  });

  fetch('/api/corporate/custom-lessons', {
    credentials: 'include'
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.status !== 200) {
        listBody.innerHTML = `<tr><td><font size="2" face="tahoma" color="red">${htmlEscape(data.message || 'Error')}</font></td></tr>`;
        return;
      }
      renderList(data.data.items);
    })
    .catch(function (err) {
      listBody.innerHTML = `<tr><td><font size="2" face="tahoma" color="red">${htmlEscape(err.message || 'Network error')}</font></td></tr>`;
    });
})();
