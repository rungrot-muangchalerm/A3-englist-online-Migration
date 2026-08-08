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
      bg: '#e6916c',
      border: '#027EA0',
      icon: '/assets/images/icon/icon_video_lesson.png',
    },
    8: {
      titleEn: 'EOL LESSONS',
      titleTh: 'หัวข้อเนื้อหาบทเรียน',
      bg: '#027EA0',
      border: '#e6916c',
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
    if (el) el.style.display = '';
  }

  function hide(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
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
    if (banner) banner.style.background = cfg.bg;
    const icon = document.getElementById(`${prefix}-icon`);
    if (icon) icon.src = cfg.icon;
    const titleEn = document.getElementById(`${prefix}-title-en`);
    if (titleEn) titleEn.textContent = cfg.titleEn;
    const titleTh = document.getElementById(`${prefix}-title-th`);
    if (titleTh) titleTh.textContent = cfg.titleTh;
    const border = document.getElementById(`${prefix}-border`);
    if (border) border.style.background = cfg.border;
    const headerTitle = document.getElementById(`${prefix}-header-title`);
    if (headerTitle) headerTitle.textContent = cfg.titleEn;
  }

  function renderList(items, skill) {
    const container = document.getElementById('topic-list-items');
    container.innerHTML = '';

    if (!items || items.length === 0) {
      container.innerHTML = '<p align="center"><font size="2" face="tahoma" color="red"><b>- No Data -</b></font></p>';
      return;
    }

    const html = ['<table class="topic-table" cellpadding="0" cellspacing="0" border="0">'];
    items.forEach((item, idx) => {
      const num = idx + 1;
      const name = skill === 8 ? item.lessonName : item.topicName;
      const id = skill === 8 ? item.lessonId : item.topicId;
      const link = `/corporate/ecop?skill_id=${skill}&level_id=${levelId || 2}&topic_id=${id}`;
      html.push(`
        <tr valign="top" height="25" style="line-height:30px;">
          <td align="center" width="5%"><font size="3" face="tahoma" color="black"><b>${num}</b></font></td>
          <td align="left" width="80%">
            <a href="${link}" title="${escapeHtml(name)}">
              <font size="3" face="tahoma" color="black"><b>${escapeHtml(name)}</b></font>
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
          document.getElementById('topic-detail-content').innerHTML = '<p align="center"><font size="2" face="tahoma" color="red"><b>- Data not found -</b></font></p>';
          return;
        }
        const d = data.data;
        const title = skillId === 8 ? d.lessonName : d.topicName;
        const content = skillId === 8 ? d.lessonContent : d.topicDetail;
        document.getElementById('topic-detail-content').innerHTML = `
          <div class="topic-detail-title"><b>${escapeHtml(title)}</b></div>
          <div style="background:#f4b083; border-radius:5px; height:4px; margin-bottom:10px;"></div>
          <div>${content || ''}</div>
        `;
      })
      .catch(() => {
        document.getElementById('topic-detail-content').innerHTML = '<p align="center"><font size="2" face="tahoma" color="red"><b>- Error loading data -</b></font></p>';
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
