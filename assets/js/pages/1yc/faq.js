/* eslint-disable no-undef */

(function () {
  function $(id) { return document.getElementById(id); }

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

  function getPathInfo() {
    const parts = window.location.pathname.split('/').filter(function (p) { return p; });
    // Expected: ['1yc', 'faq'] or ['1yc', 'faq', 'page', '2'] or ['1yc', 'faq', '123']
    if (parts.length === 2) return { type: 'list', page: 1 };
    if (parts.length === 4 && parts[2] === 'page') return { type: 'list', page: parseInt(parts[3], 10) || 1 };
    if (parts.length === 3) return { type: 'detail', faqId: parts[2] };
    return { type: 'list', page: 1 };
  }

  function renderPagination(currentPage, totalPages, faqId) {
    const div = document.createElement('div');
    div.className = 'page';
    div.style = 'text-align:right;margin-right:100px;margin-top:25px;font-size:18px;';
    for (let i = 1; i <= totalPages; i++) {
      const a = document.createElement('a');
      a.href = '/1yc/faq/page/' + i;
      a.textContent = i;
      a.style = 'color:' + (i === currentPage ? '#DF013A' : 'black') + ';margin-right:10px;';
      div.appendChild(a);
    }
    return div;
  }

  function deleteFaq(faqId, page) {
    fetch('/api/1yc/faq/' + faqId, { method: 'DELETE', credentials: 'include' }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status === 200) {
        window.location.href = '/1yc/faq/page/' + page;
      } else {
        console.log(data);
      }
    });
  }

  function deleteAnswer(faqId, answerId, page) {
    fetch('/api/1yc/faq/' + faqId + '/answers/' + answerId, { method: 'DELETE', credentials: 'include' }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status === 200) {
        window.location.href = '/1yc/faq/' + faqId;
      } else {
        console.log(data);
      }
    });
  }

  function renderFaqList(page) {
    const body = $('yc-faq-body');
    if (!body) return;
    body.innerHTML = '<p class="text-center">Loading FAQ...</p>';

    fetch('/api/1yc/faq?page=' + page, { method: 'GET', credentials: 'include' }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status !== 200) {
        console.log(data);
        body.innerHTML = '<p class="text-center">Error loading FAQ</p>';
        return;
      }

      body.innerHTML = '';

      const formTemplate = $('faq-form-template');
      body.appendChild(formTemplate.content.cloneNode(true));

      const listContainer = document.createElement('div');
      listContainer.className = 'divshowfaq';
      body.appendChild(listContainer);

      const itemTemplate = $('faq-item-template');
      data.data.faqs.forEach(function (faq) {
        const clone = itemTemplate.content.cloneNode(true);
        clone.querySelector('.faq-name').textContent = faq.name;
        clone.querySelector('.faq-topic').textContent = faq.topic;
        clone.querySelector('.faq-topic-link').href = '/1yc/faq/' + faq.faqId;
        clone.querySelector('.faq-date').textContent = formatDate(faq.date) + '   View [' + faq.view + ']';
        if (data.data.isAdmin) {
          const del = clone.querySelector('.faq-delete');
          del.classList.remove('d-none');
          del.querySelector('.faq-delete-link').addEventListener('click', function (event) {
            event.preventDefault();
            if (confirm('Do you want to delete this Q&A ?')) {
              deleteFaq(faq.faqId, data.data.currentPage);
            }
          });
        }
        listContainer.appendChild(clone);
      });

      body.appendChild(renderPagination(data.data.currentPage, data.data.totalPages));

      $('btn-post-faq').addEventListener('click', function () {
        const topic = $('faq-topic').value.trim();
        if (!topic) return;
        $('faq-loading').classList.remove('d-none');
        fetch('/api/1yc/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ topic: topic })
        }).then(function (res) { return res.json(); }).then(function (data) {
          $('faq-loading').classList.add('d-none');
          if (data.status === 200) {
            $('faq-topic').value = '';
            $('faq-error').classList.add('d-none');
            renderFaqList(page);
          } else {
            console.log(data);
            $('faq-error').classList.remove('d-none');
          }
        });
      });
    });
  }

  function renderFaqDetail(faqId) {
    const body = $('yc-faq-body');
    if (!body) return;
    body.innerHTML = '<p class="text-center">Loading FAQ...</p>';

    fetch('/api/1yc/faq/' + faqId, { method: 'GET', credentials: 'include' }).then(function (res) { return res.json(); }).then(function (data) {
      if (data.status !== 200) {
        console.log(data);
        body.innerHTML = '<p class="text-center">Error loading FAQ</p>';
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
        '<p class="text-end">' + formatDate(data.data.faq.date) + '</p>' +
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
          del.classList.remove('d-none');
          del.querySelector('.answer-delete-link').addEventListener('click', function (event) {
            event.preventDefault();
            if (confirm('Do you want to delete this answer ?')) {
              deleteAnswer(faqId, answer.ansId);
            }
          });
        }
        listfaq.appendChild(clone);
      });

      const formTemplate = $('faq-answer-form-template');
      body.appendChild(formTemplate.content.cloneNode(true));

      $('btn-post-answer').addEventListener('click', function () {
        const detail = $('faq-answer-detail').value.trim();
        if (!detail) return;
        $('faq-answer-loading').classList.remove('d-none');
        fetch('/api/1yc/faq/' + faqId + '/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ detail: detail })
        }).then(function (res) { return res.json(); }).then(function (data) {
          $('faq-answer-loading').classList.add('d-none');
          if (data.status === 200) {
            window.location.href = '/1yc/faq/' + faqId;
          } else {
            console.log(data);
          }
        });
      });
    });
  }

  const info = getPathInfo();
  if (info.type === 'detail') {
    renderFaqDetail(info.faqId);
  } else {
    renderFaqList(info.page);
  }
}());
