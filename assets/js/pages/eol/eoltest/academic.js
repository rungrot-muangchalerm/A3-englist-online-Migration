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
      let unlockedCount = 0
      let lockedCount = 0

      while (singleBody.firstChild) singleBody.removeChild(singleBody.firstChild)
      while (multiBody.firstChild) multiBody.removeChild(multiBody.firstChild)

      document.getElementById('academic-skill-count').textContent = data.data.skills.length

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
          colorEl.textContent = lvl.unlocked ? 'Open' : 'Locked'
          if (lvl.unlocked) {
            unlockedCount += 1
            colorEl.classList.remove('text-bg-secondary')
            colorEl.classList.add('text-bg-success')
          } else {
            lockedCount += 1
          }
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
          if (!lvl.unlocked) {
            btn.classList.remove('btn-danger')
            btn.classList.add('btn-outline-secondary')
            btn.value = 'Locked'
          }
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

      document.getElementById('academic-unlocked-count').textContent = unlockedCount
      document.getElementById('academic-locked-count').textContent = lockedCount
    } else {
      console.log(data)
    }
  })
}
