/* eslint-disable no-undef */

{
  fetch('/api/eol/academic/status', {
    credentials: 'include',
    method: 'GET',
  }).then((res) => res.json()).then((data) => {
    if (data.status === 200) {
      const singleBody = document.getElementById('single-skills-body')
      const multiBody = document.getElementById('multi-skills-body')
      const skillTemplate = document.getElementById('academic-skill-row-template')
      const levelTemplate = document.getElementById('academic-level-row-template')

      data.data.skills.forEach((skill) => {
        const clone = skillTemplate.content.cloneNode(true)
        const rows = clone.querySelectorAll('tr')
        const skillRow = rows[0]
        const levelRow = rows[1]

        skillRow.querySelectorAll('.skill-name').forEach((el) => {
          el.textContent = skill.skillName
        })

        const toggleA = skillRow.querySelector('.skill-toggle-a')
        const toggleB = skillRow.querySelector('.skill-toggle-b')
        toggleA.addEventListener('click', () => {
          levelRow.classList.remove('d-none');toggleA.classList.add('d-none');toggleB.classList.remove('d-none');})
        toggleB.addEventListener('click', () => {
          levelRow.classList.add('d-none');toggleA.classList.remove('d-none');toggleB.classList.add('d-none');})

        const levelTable = levelRow.querySelector('.level-table')
        skill.levels.forEach((lvl) => {
          const levelClone = levelTemplate.content.cloneNode(true)
          const colorEl = levelClone.querySelector('.level-color')
          colorEl.setAttribute('color', String(lvl.color || '').replace(/["<>]/g, ''))
          levelClone.querySelector('.level-name').textContent = lvl.levelName
          const msgEl = levelClone.querySelector('.level-message')
          if (lvl.unlocked) {
            msgEl.textContent = ''
          } else {
            msgEl.textContent = 'Must pass the lower level at least 50%'
            msgEl.classList.add('text-danger')
            msgEl.classList.add('small');}
          const btn = levelClone.querySelector('.btn-goto-test')
          btn.disabled = !lvl.unlocked
          btn.addEventListener('click', () => {
            fetch('/api/eol/academic/set-test', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ skill_id: skill.skillId, level_id: lvl.levelId }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.status !== 200) {
                  console.log(data);
                  return;
                }
                const redirect = (data.data && data.data.redirect)
                  ? data.data.redirect
                  : '/eol/systemtest/set_test';
                window.location.href = redirect;
              });
          })
          levelTable.appendChild(levelClone)
        })

        if (skill.skillId === 10) {
          multiBody.appendChild(skillRow)
          multiBody.appendChild(levelRow)
        } else {
          singleBody.appendChild(skillRow)
          singleBody.appendChild(levelRow)
        }
      })
    } else {
      console.log(data)
    }
  })
}
