/* eslint-disable no-undef */

(function () {
  function $(id) { return document.getElementById(id); }

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return diff + ' วินาทีที่แล้ว';
    if (diff < 3600) return Math.round(diff / 60) + ' นาทีที่แล้ว';
    if (diff < 86400) return Math.round(diff / 3600) + ' ชั่วโมงที่แล้ว';
    if (diff < 172800) return Math.round(diff / 86400) + ' วันที่แล้ว เมื่อเวลา ' + date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2) + ' น.';
    const thMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return ' เมื่อวันที่ ' + date.getDate() + ' ' + thMonths[date.getMonth()] + ' เวลา ' + date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2) + ' น.';
  }

  function setTitle() {
    const section = getQueryParam('section') || 'lesson';
    const titleImg = $('yc-content-title');
    if (!titleImg) return;
    if (section === 'logtime') titleImg.src = '/assets/images/image2/1year/font(record).png';
    else if (section === 'faq') titleImg.src = '/assets/images/image2/1year/font(Q&A).png';
    else if (section === 'management') titleImg.src = '/assets/images/image2/1year/font(record).png';
    else titleImg.src = '/assets/images/image2/1year/font(lessons).png';
  }

  function checkAuth() {
    fetch('/api/1yc/me', { method: 'GET', credentials: 'include' }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status !== 200 || !data.data) {
        window.location.href = '/';
      }
    });
  }

  function renderPagination(currentPage, totalPages, faqId) {
    const div = document.createElement('div');
    div.className = 'page';
    div.style = 'text-align:right;margin-right:100px;margin-top:25px;font-size:18px;';
    for (let i = 1; i <= totalPages; i++) {
      const a = document.createElement('a');
      a.href = '/1yc/content?section=faq&page=' + i + (faqId ? '&faqId=' + faqId : '');
      a.textContent = i;
      a.style = 'color:' + (i === currentPage ? '#DF013A' : 'black') + ';margin-right:10px;';
      div.appendChild(a);
    }
    return div;
  }

  function renderFaqList() {
    const body = $('yc-content-body');
    if (!body) return;
    body.innerHTML = '<p align="center">Loading FAQ...</p>';

    const page = Math.max(1, parseInt(getQueryParam('page'), 10) || 1);

    fetch('/api/1yc/faq?page=' + page, { method: 'GET', credentials: 'include' }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status !== 200) {
        console.log(data);
        body.innerHTML = '<p align="center">Error loading FAQ</p>';
        return;
      }

      body.innerHTML = '';

      // Form for new question
      const formDiv = document.createElement('div');
      formDiv.className = 'divfaq';
      formDiv.innerHTML = '<form onsubmit="event.preventDefault();">' +
        'หัวข้อ : <br><br>' +
        '<textarea id="faq-topic" class="tx" maxlength="500"></textarea><br><br>' +
        '<button type="button" id="btn-post-faq">Post</button>' +
        '<button type="reset">Cancel</button>' +
        '</form>' +
        '<br><img id="faq-loading" src="/assets/images/image2/eol system/loading2.gif" style="display:none; margin-left:100px;"><br>' +
        '<label id="faq-error" style="display:none; margin-left:100px;">มีความผิดพลาดในการเพิ่มข้อมูล</label>';
      body.appendChild(formDiv);

      const listContainer = document.createElement('div');
      listContainer.className = 'divshowfaq';
      body.appendChild(listContainer);

      const template = $('faq-item-template');
      data.data.faqs.forEach(function (faq) {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.faq-name').textContent = faq.name;
        clone.querySelector('.faq-topic').textContent = faq.topic;
        const link = clone.querySelector('.faq-topic-link');
        link.href = '/1yc/content?section=faq&faqId=' + faq.faqId + '&page=' + page;
        clone.querySelector('.faq-date').textContent = formatDate(faq.date) + '   View [' + faq.view + ']';
        if (data.data.isAdmin) {
          const del = clone.querySelector('.faq-delete');
          del.style.display = 'block';
          del.querySelector('.faq-delete-link').addEventListener('click', function (event) {
            event.preventDefault();
            if (confirm('Do you want to delete this Q&A ?')) {
              deleteFaq(faq.faqId, page);
            }
          });
        }
        listContainer.appendChild(clone);
      });

      body.appendChild(renderPagination(data.data.currentPage, data.data.totalPages));

      $('btn-post-faq').addEventListener('click', function () {
        const topic = $('faq-topic').value.trim();
        if (!topic) return;
        $('faq-loading').style.display = 'inline';
        fetch('/api/1yc/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ topic: topic })
        }).then(function (res) { return res.json(); }).then(function (data) {
          $('faq-loading').style.display = 'none';
          if (data.status === 200) {
            $('faq-topic').value = '';
            $('faq-error').style.display = 'none';
            renderFaqList();
          } else {
            console.log(data);
            $('faq-error').style.display = 'inline';
          }
        });
      });
    });
  }

  function deleteFaq(faqId, page) {
    fetch('/api/1yc/faq/' + faqId, {
      method: 'DELETE',
      credentials: 'include'
    }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status === 200) {
        window.location.href = '/1yc/content?section=faq&page=' + page;
      } else {
        console.log(data);
      }
    });
  }

  function deleteAnswer(faqId, answerId, page) {
    fetch('/api/1yc/faq/' + faqId + '/answers/' + answerId, {
      method: 'DELETE',
      credentials: 'include'
    }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status === 200) {
        window.location.href = '/1yc/content?section=faq&faqId=' + faqId + '&page=' + page;
      } else {
        console.log(data);
      }
    });
  }

  function renderFaqDetail(faqId) {
    const body = $('yc-content-body');
    if (!body) return;
    body.innerHTML = '<p align="center">Loading FAQ...</p>';
    const page = Math.max(1, parseInt(getQueryParam('page'), 10) || 1);

    fetch('/api/1yc/faq/' + faqId, { method: 'GET', credentials: 'include' }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status !== 200) {
        console.log(data);
        body.innerHTML = '<p align="center">Error loading FAQ</p>';
        return;
      }

      body.innerHTML = '';

      const listfaq = document.createElement('div');
      listfaq.className = 'listfaq';
      listfaq.id = data.data.faq.faqId;
      listfaq.innerHTML = '<p><b>' + data.data.faq.name + '</b></p>' +
        '<div class="txtcontent">' +
        '<p><b>Question : </b></p>' +
        '<p>' + data.data.faq.topic + '</p>' +
        '<p align="right">' + formatDate(data.data.faq.date) + '</p>' +
        '</div>';
      body.appendChild(listfaq);

      const answerItemTemplate = $('faq-answer-item-template');
      data.data.answers.forEach(function (answer) {
        const clone = answerItemTemplate.content.cloneNode(true);
        clone.querySelector('.answer-detail').textContent = answer.detail;
        clone.querySelector('.answer-name').textContent = 'By : ' + answer.name;
        clone.querySelector('.answer-date').textContent = formatDate(answer.date);
        if (data.data.isAdmin) {
          const del = clone.querySelector('.answer-delete');
          del.style.display = 'block';
          del.querySelector('.answer-delete-link').addEventListener('click', function (event) {
            event.preventDefault();
            if (confirm('Do you want to delete this answer ?')) {
              deleteAnswer(faqId, answer.ansId, page);
            }
          });
        }
        listfaq.appendChild(clone);
      });

      const formTemplate = $('faq-answer-form-template');
      const formClone = formTemplate.content.cloneNode(true);
      body.appendChild(formClone);

      $('btn-post-answer').addEventListener('click', function () {
        const detail = $('faq-answer-detail').value.trim();
        if (!detail) return;
        $('faq-answer-loading').style.display = 'inline';
        fetch('/api/1yc/faq/' + faqId + '/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ detail: detail })
        }).then(function (res) { return res.json(); }).then(function (data) {
          $('faq-answer-loading').style.display = 'none';
          if (data.status === 200) {
            window.location.href = '/1yc/content?section=faq&faqId=' + faqId + '&page=' + page;
          } else {
            console.log(data);
          }
        });
      });
    });
  }

  setTitle();
  checkAuth();

  const section = getQueryParam('section') || 'lesson';
  if (section === 'faq') {
    window.location.href = '/1yc/faq';
    return;
  }
  if (section === 'logtime') {
    window.location.href = '/1yc/logtime';
    return;
  }
  if (section === 'management') {
    $('yc-content-body').innerHTML = '<p align="center">Management (migration in progress)</p>';
  } else {
    const topicId = getQueryParam('topic_id');
    if (topicId) {
      $('yc-content-body').innerHTML = '<p align="center">Topic content for topic_id=' + topicId + ' (migration in progress)</p>';
    } else {
      $('yc-content-body').innerHTML = '<p align="center">Select a lesson from <a href="/1yc/lessons">1 Year Course Lessons</a></p>';
    }
  }
}());
