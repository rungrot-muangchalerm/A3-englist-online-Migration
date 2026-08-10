const app = document.getElementById('admin-lessons-related-app');
const skillPath = app.dataset.skillPath || '';

if (skillPath) {
  fetch(`/api/backoffice/admin/lessons-related/${encodeURIComponent(skillPath)}`, {
    credentials: 'include'
  }).then(res => res.json()).then(data => {
    if (data.status === 200) {
      const panel = document.getElementById('admin-lessons-related-panel');
      const list = document.getElementById('admin-lessons-related-list');
      const empty = document.getElementById('admin-lessons-related-empty');
      panel.classList.remove('d-none');
      document.getElementById('admin-lessons-related-skill-name').textContent = data.data.selectedSkillName;
      if (data.data.relations.length === 0) {
        empty.classList.remove('d-none');
      }
      data.data.relations.forEach(relation => {
        const clone = document.getElementById('admin-lessons-related-template').content.cloneNode(true);
        clone.querySelector('[data-role="no"]').textContent = relation.no;
        clone.querySelector('[data-role="reason-id"]').textContent = relation.reasonId;
        clone.querySelector('[data-role="reason-name"]').textContent = relation.reasonName;
        clone.querySelector('[data-role="topic-id"]').textContent = relation.topicId;
        clone.querySelector('[data-role="topic-name"]').textContent = relation.topicName;
        list.appendChild(clone);
      });
    } else {
      console.log(data);
    }
  });
}
