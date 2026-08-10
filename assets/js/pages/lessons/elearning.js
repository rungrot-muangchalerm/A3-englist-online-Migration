(function () {
  const skillNames = {
    1: 'Reading',
    2: 'Listening',
    3: 'Speaking',
    4: 'Writing',
    5: 'Grammar',
    7: 'Vocabulary',
  };

  const skillBackgrounds = {
    1: '/assets/images/image2/eol system/Lessons/bg-lessons-reading2.jpg',
    2: '/assets/images/image2/eol system/Lessons/bg-lessons-listening2.jpg',
    3: '/assets/images/image2/eol system/Lessons/bg-lessons-speaking2.jpg',
    4: '/assets/images/image2/eol system/Lessons/bg-lessons-writing2.jpg',
    5: '/assets/images/image2/eol system/Lessons/bg-lessons-grammar2.jpg',
    7: '/assets/images/image2/eol system/Lessons/bg-lessons-vocabulary2.jpg',
  };

  const levelNames = {
    1: 'Beginner',
    2: 'Intermediate',
    3: 'Advance',
  };

  function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      section: params.get('section') || 'elearning',
      skillId: params.get('skill_id'),
      levelId: params.get('level_id'),
      topicId: params.get('topic_id'),
      page: params.get('page'),
      search: params.get('search'),
    };
  }

  function buildUrl(values) {
    const params = new URLSearchParams();
    const current = getParams();
    const section = values.section || current.section || 'elearning';
    params.set('section', section);
    const skillId = values.skillId !== undefined ? values.skillId : current.skillId;
    if (skillId) params.set('skill_id', skillId);
    const levelId = values.levelId !== undefined ? values.levelId : current.levelId;
    if (levelId) params.set('level_id', levelId);
    const page = values.page !== undefined ? values.page : current.page;
    if (page) params.set('page', page);
    const topicId = values.topicId !== undefined ? values.topicId : current.topicId;
    if (topicId) params.set('topic_id', topicId);
    const search = values.search !== undefined ? values.search : current.search;
    if (search) params.set('search', search);
    return `/lessons/elearning?${params.toString()}`;
  }

  function showView(id) {
    ['view-main', 'view-list', 'view-detail'].forEach((viewId) => {
      const el = document.getElementById(viewId);
      if (el) if (viewId === id ) el.classList.remove('d-none'); else el.classList.add('d-none');
    });
  }

  function renderMain() {
    showView('view-main');
  }

  function redirectToList(skillId) {
    window.location.href = buildUrl({ skillId: skillId, levelId: 1, page: 1, topicId: null, search: null });
  }

  function renderList(params) {
    showView('view-list');
    const skillId = Number(params.skillId) || 0;
    const levelId = Number(params.levelId) || 0;
    const page = Number(params.page) || 1;
    const search = params.search || '';

    document.getElementById('list-bg').src = skillBackgrounds[skillId] || '';
    document.getElementById('list-map-list').href = buildUrl({ skillId: skillId, levelId: levelId, page: 1, topicId: null, search: null });
    document.getElementById('search-input').value = search;

    const listUrl = `/api/lessons/elearning/topics?skill_id=${skillId}&level_id=${levelId}&page=${page}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
    fetch(listUrl, {
      credentials: 'include',
      method: 'GET'
    }).then((res) => res.json()).then((data) => {
      const container = document.getElementById('topic-list');
      const empty = document.getElementById('topic-empty');
      const pagination = document.getElementById('topic-pagination');
      container.innerHTML = '';
      pagination.innerHTML = '';

      if (data.status !== 200) {
        if (empty) empty.classList.remove('d-none');
        return;
      }

      const topics = data.data.topics || [];
      const pageCount = data.data.pageCount || 1;
      const currentPage = data.data.page || 1;
      const startIndex = ((currentPage - 1) * (data.data.perPage || 20)) + 1;

      if (topics.length === 0) {
        if (empty) empty.classList.remove('d-none');
        return;
      }
      if (empty) empty.classList.add('d-none');

      const template = document.getElementById('topic-row-template');
      topics.forEach((topic, index) => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('[data-role="index"]').textContent = startIndex + index;
        const link = clone.querySelector('[data-role="link"]');
        link.href = buildUrl({ skillId: skillId, levelId: levelId, topicId: topic.topic_id, page: null, search: null });
        clone.querySelector('[data-role="name"]').textContent = topic.topic_name || '';
        container.appendChild(clone);
      });

      if (pageCount > 1) {
        const ul = document.createElement('ul');
        ul.className = 'pagination';
        const itemTemplate = document.getElementById('pagination-item-template');
        for (let i = 1; i <= pageCount; i += 1) {
          const clone = itemTemplate.content.cloneNode(true);
          const li = clone.querySelector('li');
          if (i === currentPage) li.className = 'active';
          const link = clone.querySelector('[data-role="link"]');
          link.href = buildUrl({ skillId: skillId, levelId: levelId, page: i, topicId: null, search: search });
          clone.querySelector('[data-role="label"]').textContent = i;
          ul.appendChild(clone);
        }
        pagination.appendChild(ul);
      }
    });
  }

  function renderDetail(params) {
    showView('view-detail');
    const skillId = Number(params.skillId) || 0;
    const levelId = Number(params.levelId) || 0;
    const topicId = Number(params.topicId) || 0;

    document.getElementById('detail-bg').src = skillBackgrounds[skillId] || '';
    document.getElementById('detail-map-list').href = buildUrl({ skillId: skillId, levelId: levelId, page: 1, topicId: null, search: null });

    fetch(`/api/lessons/elearning/topic?topic_id=${topicId}&skill_id=${skillId}&level_id=${levelId}`, {
      credentials: 'include',
      method: 'GET'
    }).then((res) => res.json()).then((data) => {
      const privilegeMsg = document.getElementById('detail-privilege');
      const content = document.getElementById('detail-content');
      const related = document.getElementById('related-topics');
      content.innerHTML = '';
      related.innerHTML = '';

      if (data.status !== 200) {
        privilegeMsg.classList.remove('d-none');
        return;
      }

      if (!data.data.allow) {
        privilegeMsg.classList.remove('d-none');
        return;
      }
      privilegeMsg.classList.add('d-none');

      content.innerHTML = data.data.topic.topicDetail || '';

      const relatedTopics = data.data.relatedTopics || [];
      if (relatedTopics.length > 0) {
        const wrapper = document.createElement('table');
        wrapper.setAttribute('align', 'center');
        wrapper.setAttribute('width', '100%');
        wrapper.setAttribute('cellpadding', '0');
        wrapper.setAttribute('cellspacing', '0');
        wrapper.setAttribute('border', '0');
        wrapper.setAttribute('bgcolor', 'f0f0f0');
        wrapper.innerHTML = '<tr height="30" class="align-middle"><td width="100%" colspan="2" class="text-start"><span><b> &nbsp; Relate Topic </b></span></td></tr><tr><td width="5%" class="text-center">&nbsp;</td><td width="95%" class="text-center"></td></tr><tr height="10" class="align-middle"><td width="100%" colspan="2" class="text-start"></td></tr>';
        const cell = wrapper.rows[1].cells[1];
        const template = document.getElementById('related-topic-template');
        relatedTopics.forEach((topic) => {
          const clone = template.content.cloneNode(true);
          const link = clone.querySelector('[data-role="link"]');
          link.href = buildUrl({ skillId: skillId, levelId: levelId, topicId: topic.topic_id, page: null, search: null });
          clone.querySelector('[data-role="name"]').textContent = topic.topic_name || '';
          cell.appendChild(clone);
        });
        related.appendChild(wrapper);
      }
    });
  }

  function init() {
    const params = getParams();
    if (!params.skillId && !params.levelId) {
      renderMain();
      return;
    }
    if (params.skillId && !params.levelId) {
      redirectToList(params.skillId);
      return;
    }
    if (params.topicId) {
      renderDetail(params);
    } else {
      renderList(params);
    }
  }

  document.getElementById('search-btn').addEventListener('click', () => {
    const params = getParams();
    const search = document.getElementById('search-input').value.trim();
    window.location.href = buildUrl({ skillId: params.skillId, levelId: params.levelId, page: 1, topicId: null, search: search });
  });

  document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('search-btn').click();
    }
  });

  init();
}());
