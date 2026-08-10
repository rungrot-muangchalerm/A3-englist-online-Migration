fetch('/api/backoffice/permissions', {
  credentials: 'include'
}).then(res => res.json()).then(data => {
  if (data.status !== 200) return;
  const p = data.permissions || [];

  // ---------- Manage User ----------
  if (!p.includes('00-01')) document.getElementById('menu-00-01').classList.add('d-none');

  // ---------- Manage Main Menu ----------
  if (!p.includes('01-01')) document.getElementById('menu-01-01').classList.add('d-none');
  if (!p.includes('01-02')) document.getElementById('menu-01-02').classList.add('d-none');
  if (!p.includes('01-03')) document.getElementById('menu-01-03').classList.add('d-none');
  if (!p.includes('01-04')) document.getElementById('menu-01-04').classList.add('d-none');
  if (!p.includes('01-05')) document.getElementById('menu-01-05').classList.add('d-none');
  if (!p.includes('01-06')) document.getElementById('menu-01-06').classList.add('d-none');
  if (!p.includes('01-07')) document.getElementById('menu-01-07').classList.add('d-none');
  if (!p.includes('01-08')) document.getElementById('menu-01-08').classList.add('d-none');
  if (!p.includes('01-09')) document.getElementById('menu-01-09').classList.add('d-none');

  // ---------- Manage Activity and News ----------
  if (!p.includes('02-01')) document.getElementById('menu-02-01').classList.add('d-none');
  if (!p.includes('02-02')) document.getElementById('menu-02-02').classList.add('d-none');
  if (!p.includes('02-03')) document.getElementById('menu-02-03').classList.add('d-none');
  if (!p.includes('02-04')) document.getElementById('menu-02-04').classList.add('d-none');
  if (!p.includes('02-05')) document.getElementById('menu-02-05').classList.add('d-none');
  if (!p.includes('02-06')) document.getElementById('menu-02-06').classList.add('d-none');
  if (!p.includes('02-07')) document.getElementById('menu-02-07').classList.add('d-none');
  if (!p.includes('02-08')) document.getElementById('menu-02-08').classList.add('d-none');

  // ---------- Manage Interesting From EOL ----------
  if (!p.includes('03-01')) document.getElementById('menu-03-01').classList.add('d-none');
  if (!p.includes('03-02')) document.getElementById('menu-03-02').classList.add('d-none');
  if (!p.includes('03-03')) document.getElementById('menu-03-03').classList.add('d-none');
  if (!p.includes('03-04')) document.getElementById('menu-03-04').classList.add('d-none');
  if (!p.includes('03-05')) document.getElementById('menu-03-05').classList.add('d-none');
  if (!p.includes('03-06')) document.getElementById('menu-03-06').classList.add('d-none');
  if (!p.includes('03-07')) document.getElementById('menu-03-07').classList.add('d-none');
  if (!p.includes('03-08')) document.getElementById('menu-03-08').classList.add('d-none');
  if (!p.includes('03-09')) document.getElementById('menu-03-09').classList.add('d-none');
  if (!p.includes('03-10')) document.getElementById('menu-03-10').classList.add('d-none');
  if (!p.includes('03-11')) document.getElementById('menu-03-11').classList.add('d-none');
  if (!p.includes('03-12')) document.getElementById('menu-03-12').classList.add('d-none');
  if (!p.includes('03-13')) document.getElementById('menu-03-13').classList.add('d-none');
  if (!p.includes('03-14')) document.getElementById('menu-03-14').classList.add('d-none');
  if (!p.includes('03-15')) document.getElementById('menu-03-15').classList.add('d-none');
  if (!p.includes('03-16')) document.getElementById('menu-03-16').classList.add('d-none');

  // ---------- Manage News ----------
  if (!p.includes('04-01')) document.getElementById('menu-04-01').classList.add('d-none');
  if (!p.includes('04-02')) document.getElementById('menu-04-02').classList.add('d-none');
  if (!p.includes('04-03')) document.getElementById('menu-04-03').classList.add('d-none');
  if (!p.includes('04-04')) document.getElementById('menu-04-04').classList.add('d-none');
  if (!p.includes('04-05')) document.getElementById('menu-04-05').classList.add('d-none');

  // ---------- Manage Entertainment ----------
  if (!p.includes('05-01')) document.getElementById('menu-05-01').classList.add('d-none');
  if (!p.includes('05-02')) document.getElementById('menu-05-02').classList.add('d-none');
  if (!p.includes('05-03')) document.getElementById('menu-05-03').classList.add('d-none');

  // ---------- Manage English Channel ----------
  if (!p.includes('06-01')) document.getElementById('menu-06-01').classList.add('d-none');
  if (!p.includes('06-02')) document.getElementById('menu-06-02').classList.add('d-none');
  if (!p.includes('06-03')) document.getElementById('menu-06-03').classList.add('d-none');

  // ---------- Manage English E-Testing ----------
  if (!p.includes('07-01')) document.getElementById('menu-07-01').classList.add('d-none');
  if (!p.includes('07-02')) document.getElementById('menu-07-02').classList.add('d-none');
  if (!p.includes('07-03')) document.getElementById('menu-07-03').classList.add('d-none');
  if (!p.includes('07-04')) document.getElementById('menu-07-04').classList.add('d-none');
  if (!p.includes('07-05')) document.getElementById('menu-07-05').classList.add('d-none');
  if (!p.includes('07-06')) document.getElementById('menu-07-06').classList.add('d-none');
  if (!p.includes('07-07')) document.getElementById('menu-07-07').classList.add('d-none');

  // ---------- Manage E-Learning ----------
  if (!p.includes('10-01')) document.getElementById('menu-10-01').classList.add('d-none');

  // ---------- Manage E-Learning Reading Comprehension ----------
  if (!p.includes('11-01')) document.getElementById('menu-11-01').classList.add('d-none');
  if (!p.includes('11-02')) document.getElementById('menu-11-02').classList.add('d-none');
  if (!p.includes('11-03')) document.getElementById('menu-11-03').classList.add('d-none');
  if (!p.includes('11-04')) document.getElementById('menu-11-04').classList.add('d-none');
  if (!p.includes('11-05')) document.getElementById('menu-11-05').classList.add('d-none');

  // ---------- Manage E-Learning Listening Comprehension ----------
  if (!p.includes('12-01')) document.getElementById('menu-12-01').classList.add('d-none');
  if (!p.includes('12-02')) document.getElementById('menu-12-02').classList.add('d-none');
  if (!p.includes('12-03')) document.getElementById('menu-12-03').classList.add('d-none');
  if (!p.includes('12-04')) document.getElementById('menu-12-04').classList.add('d-none');
  if (!p.includes('12-05')) document.getElementById('menu-12-05').classList.add('d-none');

  // ---------- Manage E-Learning Semi-Speaking ----------
  if (!p.includes('13-01')) document.getElementById('menu-13-01').classList.add('d-none');
  if (!p.includes('13-02')) document.getElementById('menu-13-02').classList.add('d-none');
  if (!p.includes('13-03')) document.getElementById('menu-13-03').classList.add('d-none');
  if (!p.includes('13-04')) document.getElementById('menu-13-04').classList.add('d-none');
  if (!p.includes('13-05')) document.getElementById('menu-13-05').classList.add('d-none');

  // ---------- Manage E-Learning Semi-Writing ----------
  if (!p.includes('14-01')) document.getElementById('menu-14-01').classList.add('d-none');
  if (!p.includes('14-02')) document.getElementById('menu-14-02').classList.add('d-none');
  if (!p.includes('14-03')) document.getElementById('menu-14-03').classList.add('d-none');
  if (!p.includes('14-04')) document.getElementById('menu-14-04').classList.add('d-none');
  if (!p.includes('14-05')) document.getElementById('menu-14-05').classList.add('d-none');

  // ---------- Manage E-Learning Grammatical Structure ----------
  if (!p.includes('15-01')) document.getElementById('menu-15-01').classList.add('d-none');
  if (!p.includes('15-02')) document.getElementById('menu-15-02').classList.add('d-none');
  if (!p.includes('15-03')) document.getElementById('menu-15-03').classList.add('d-none');
  if (!p.includes('15-04')) document.getElementById('menu-15-04').classList.add('d-none');
  if (!p.includes('15-05')) document.getElementById('menu-15-05').classList.add('d-none');

  // ---------- Manage E-Learning Integrated Skill: Cloze Test ----------
  if (!p.includes('16-01')) document.getElementById('menu-16-01').classList.add('d-none');
  if (!p.includes('16-02')) document.getElementById('menu-16-02').classList.add('d-none');
  if (!p.includes('16-03')) document.getElementById('menu-16-03').classList.add('d-none');
  if (!p.includes('16-04')) document.getElementById('menu-16-04').classList.add('d-none');
  if (!p.includes('16-05')) document.getElementById('menu-16-05').classList.add('d-none');

  // ---------- Manage E-Learning Vocabulary Items ----------
  if (!p.includes('17-01')) document.getElementById('menu-17-01').classList.add('d-none');
  if (!p.includes('17-02')) document.getElementById('menu-17-02').classList.add('d-none');
  if (!p.includes('17-03')) document.getElementById('menu-17-03').classList.add('d-none');
  if (!p.includes('17-04')) document.getElementById('menu-17-04').classList.add('d-none');
  if (!p.includes('17-05')) document.getElementById('menu-17-05').classList.add('d-none');

  // ---------- Manage EOL Contest Exam ----------
  if (!p.includes('18-01')) document.getElementById('menu-18-01').classList.add('d-none');

  // ---------- ซ่อนกลุ่มที่ไม่เหลือเมนูย่อยให้แสดง ----------
  function hideGroupIfNoMenu(groupId) {
    const group = document.getElementById(groupId);
    if (!group) return;
    const menus = group.querySelectorAll('[id^="menu-"]');
    const hasVisible = Array.from(menus).some(menu => !menu.classList.contains('d-none'));
    if (!hasVisible) {
      group.classList.add('d-none');
    }
  }

  hideGroupIfNoMenu('group-00');
  hideGroupIfNoMenu('group-01');
  hideGroupIfNoMenu('group-02');
  hideGroupIfNoMenu('group-03');
  hideGroupIfNoMenu('group-04');
  hideGroupIfNoMenu('group-05');
  hideGroupIfNoMenu('group-06');
  hideGroupIfNoMenu('group-07');
  hideGroupIfNoMenu('group-10');
  hideGroupIfNoMenu('group-11');
  hideGroupIfNoMenu('group-12');
  hideGroupIfNoMenu('group-13');
  hideGroupIfNoMenu('group-14');
  hideGroupIfNoMenu('group-15');
  hideGroupIfNoMenu('group-16');
  hideGroupIfNoMenu('group-17');
  hideGroupIfNoMenu('group-18');
});
