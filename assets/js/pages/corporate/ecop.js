/* eslint-disable no-undef */
(function () {
  const params = new URLSearchParams(window.location.search);
  const skillId = Number(params.get('skill_id')) || null;
  const levelId = Number(params.get('level_id')) || null;
  const topicId = params.get('topic_id') || '';

  const CONFIG = {
    7: {
      titleEn: 'VIDEO LESSONS',
      titleTh: 'หัวข้อบทเรียนไฟล์วิดีโอ',
      bgClass: 'bg-warning',
      borderClass: 'bg-info',
      icon: '/assets/images/icon/icon_video_lesson.png',
    },
    8: {
      titleEn: 'EOL LESSONS',
      titleTh: 'หัวข้อเนื้อหาบทเรียน',
      bgClass: 'bg-info',
      borderClass: 'bg-warning',
      icon: '/assets/images/icon/icon_content_lesson.png',
    },
  };

  function api(path) {
    return fetch(path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json'
    } })
      .then((res) => res.json());
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function show(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('d-none');
  }

  function hide(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('d-none');
  }

  function showLimited() {
    hide('corporate-landing');
    hide('corporate-topic-list');
    hide('corporate-topic-detail');
    show('corporate-limited');
  }

  function applyBannerConfig(prefix, skill) {
    const cfg = CONFIG[skill];
    if (!cfg) return;
    const banner = document.getElementById(`${prefix}-banner`);
    if (banner) {
      banner.classList.remove('bg-warning', 'bg-info');
      banner.classList.add(cfg.bgClass);
    }
    const icon = document.getElementById(`${prefix}-icon`);
    if (icon) icon.src = cfg.icon;
    const titleEn = document.getElementById(`${prefix}-title-en`);
    if (titleEn) titleEn.textContent = cfg.titleEn;
    const titleTh = document.getElementById(`${prefix}-title-th`);
    if (titleTh) titleTh.textContent = cfg.titleTh;
    const border = document.getElementById(`${prefix}-border`);
    if (border) {
      border.classList.remove('bg-warning', 'bg-info');
      border.classList.add(cfg.borderClass);
    }
    const headerTitle = document.getElementById(`${prefix}-header-title`);
    if (headerTitle) headerTitle.textContent = cfg.titleEn;
  }

  function renderList(items, skill) {
    const container = document.getElementById('topic-list-items');
    container.innerHTML = '';

    if (!items || items.length === 0) {
      container.innerHTML = '<p class="text-center"><span class="text-danger"><b>- No Data -</b></span></p>';
      return;
    }

    const html = ['<table class="table table-sm topic-table">'];
    items.forEach((item, idx) => {
      const num = idx + 1;
      const name = skill === 8 ? item.lessonName : item.topicName;
      const id = skill === 8 ? item.lessonId : item.topicId;
      const link = `/corporate/ecop?skill_id=${skill}&level_id=${levelId || 2}&topic_id=${id}`;
      html.push(`
        <tr class="align-top">
          <td width="5%" class="text-center"><span class="text-dark"><b>${num}</b></span></td>
          <td width="80%" class="text-start">
            <a href="${link}" title="${escapeHtml(name)}">
              <span class="text-dark"><b>${escapeHtml(name)}</b></span>
            </a>
          </td>
        </tr>
      `);
    });
    html.push('</table>');
    container.innerHTML = html.join('');
  }

  function loadList(status) {
    if (!status.isCorporate) {
      showLimited();
      return;
    }

    hide('corporate-landing');
    hide('corporate-topic-detail');
    show('corporate-topic-list');
    applyBannerConfig('topic-list', skillId);

    const path = skillId === 8
      ? '/api/corporate/custom-lessons'
      : `/api/corporate/video-topics?skill_id=${skillId}&level_id=${levelId || 2}`;

    api(path)
      .then((data) => {
        if (data.status !== 200) {
          showLimited();
          return;
        }
        renderList(data.data.items, skillId);
      })
      .catch(() => showLimited());
  }

  function loadDetail(status) {
    if (!status.isCorporate) {
      showLimited();
      return;
    }

    hide('corporate-landing');
    hide('corporate-topic-list');
    show('corporate-topic-detail');
    applyBannerConfig('topic-detail', skillId);

    const back = document.getElementById('topic-detail-back');
    if (back) back.href = `/corporate/ecop?skill_id=${skillId}&level_id=${levelId || 2}`;

    const path = skillId === 8
      ? `/api/corporate/custom-lesson?lesson_id=${encodeURIComponent(topicId)}`
      : `/api/corporate/video-topic?topic_id=${encodeURIComponent(topicId)}`;

    api(path)
      .then((data) => {
        if (data.status !== 200) {
          document.getElementById('topic-detail-content').innerHTML = '<p class="text-center"><span class="text-danger"><b>- Data not found -</b></span></p>';
          return;
        }
        const d = data.data;
        const title = skillId === 8 ? d.lessonName : d.topicName;
        const content = skillId === 8 ? d.lessonContent : d.topicDetail;
        document.getElementById('topic-detail-content').innerHTML = `
          <div class="topic-detail-title"><b>${escapeHtml(title)}</b></div>
          <div class="progress mb-2">
            <div class="progress-bar bg-warning w-100" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <div>${content || ''}</div>
        `;
      })
      .catch(() => {
        document.getElementById('topic-detail-content').innerHTML = '<p class="text-center"><span class="text-danger"><b>- Error loading data -</b></span></p>';
      });
  }

  function init() {
    api('/api/corporate/status')
      .then((data) => {
        if (data.status !== 200) {
          window.location.href = '/';
          return;
        }
        const status = data.data;

        if (!skillId) {
          show('corporate-landing');
          hide('corporate-topic-list');
          hide('corporate-topic-detail');
          hide('corporate-limited');
          return;
        }

        if (topicId) {
          loadDetail(status);
        } else {
          loadList(status);
        }
      })
      .catch(() => {
        window.location.href = '/';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
