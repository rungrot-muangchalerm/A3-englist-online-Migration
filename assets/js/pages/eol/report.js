{
  const params = new URLSearchParams(window.location.search);
  const reportSection = params.get('report_section') || '';
  const memberId = params.get('member_id') || '';
  const resultId = params.get('result_id') || '';
  const skillId = params.get('skill_id') || '10';
  const type = params.get('type') || '1';
  const start = params.get('start') || '';
  const stop = params.get('stop') || '';

  const memberIdParam = memberId ? `&member_id=${encodeURIComponent(memberId)}` : '';
  const memberIdQuery = memberId ? `?member_id=${encodeURIComponent(memberId)}` : '';

  function hideAllSections() {
    document.querySelectorAll('.report-section').forEach((el) => {
      el.classList.add('d-none');
    });
  }

  function showSection(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('d-none');
  }

  function clearContainerKeepTemplates(id) {
    const container = document.getElementById(id);
    if (!container) return;
    Array.from(container.childNodes).forEach((node) => {
      if (node.nodeName !== 'TEMPLATE') node.remove();
    });
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function setHref(id, value) {
    const el = document.getElementById(id);
    if (el) el.href = value;
  }

  function renderFocusBar(focus) {
    const container = document.getElementById('report-focus-bar');
    const template = document.getElementById('report-focus-bar-template');
    if (!container || !template) return;
    clearContainerKeepTemplates('report-focus-bar');
    const clone = template.content.cloneNode(true);
    const focusName = clone.querySelector('.focus-name');
    if (focusName) {
      focusName.textContent = `${focus.fname || ''} ${focus.lname || ''}`.trim();
    }
    container.appendChild(clone);
  }

  function renderSelector() {
    fetch(`/api/eol/report/selector?member_id=${encodeURIComponent(memberId)}`, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== 200) {
          console.log(data);
          return;
        }
        renderFocusBar(data.data.focus);

        const showContest = data.data.accountType === 'master' || data.data.corporate;
        const selectorClass = document.getElementById('selector-class');
        if (selectorClass) selectorClass.className = showContest ? 'sub-member' : 'personal';
        setText('selector-text', 'ตรวจเช็คดูผลการฝึกฝนและเรียนรู้ในห้องทดสอบ');

        const configs = showContest
          ? [
            { section: 'academic', src: '/assets/images/image2/eol system/Report/Button/Test Evaluation Report.png', top: '512px', left: '50%', marginLeft: '-390px' },
            { section: 'standard', src: '/assets/images/image2/eol system/Report/Button/EST Report.png', top: '512px', left: '50%', marginLeft: '-120px' },
            { section: 'contest', src: '/assets/images/image2/eol system/Report/Button/Contest Report.png', top: '512px', left: '50%', marginLeft: '150px' },
          ]
          : [
            { section: 'academic', src: '/assets/images/image2/eol system/Report/Button/Test Evaluation Report.png', top: '475px', left: '50%', marginLeft: '-257px' },
            { section: 'standard', src: '/assets/images/image2/eol system/Report/Button/EST Report.png', top: '475px', left: '50%', marginLeft: '40px' },
          ];

        configs.forEach((cfg) => {
          const link = document.getElementById(`report-button-${cfg.section}`);
          const img = document.getElementById(`report-button-${cfg.section}-img`);
          if (!link || !img) return;
          link.classList.remove('d-none');
          img.src = cfg.src;
          img.classList.add('position-absolute');
          img.classList.add('rounded');
          img.setAttribute('aria-valuenow', '28%');
        });

        const contestBtn = document.getElementById('report-button-contest');
        if (contestBtn) if (showContest ) contestBtn.classList.remove('d-none'); else contestBtn.classList.add('d-none');
      });
  }

  function renderAcademicLayout() {
    const layout = document.getElementById('report-academic-layout');
    if (!layout) return;
    setHref('academic-layout-back', `/eol/eoltest/report${memberIdQuery}`);
    const backArea = layout.querySelector('.back-area');
    if (backArea) backArea.href = `/eol/eoltest/report${memberIdQuery}`;
    const multiLink = layout.querySelector('.multiple-skills-link');
    if (multiLink) multiLink.href = `/eol/eoltest/report?report_section=academic&skill_id=10${memberIdParam}`;
    layout.querySelectorAll('.skill-link').forEach((link) => {
      link.href = `/eol/eoltest/report?report_section=academic&skill_id=${link.getAttribute('data-skill-id')}${memberIdParam}`;
    });
  }

  function renderAcademicList(listData) {
    clearContainerKeepTemplates('academic-list-filter');
    clearContainerKeepTemplates('academic-list-levels');

    const filterTemplate = document.getElementById('report-academic-filter-template');
    const filterContainer = document.getElementById('academic-list-filter');
    let inputA;
    let inputB;
    if (filterTemplate && filterContainer) {
      const filterClone = filterTemplate.content.cloneNode(true);
      const skillName = filterClone.querySelector('.skill-name');
      if (skillName) skillName.textContent = listData.skillName;
      inputA = filterClone.querySelector('#popup_container_a');
      inputB = filterClone.querySelector('#popup_container_b');
      if (inputA) inputA.value = listData.start;
      if (inputB) inputB.value = listData.stop;
      const viewBtn = filterClone.querySelector('.btn-view-academic');
      if (viewBtn) {
        viewBtn.addEventListener('click', () => {
          const aVal = (inputA && inputA.value) || '';
          const bVal = (inputB && inputB.value) || '';
          window.location.href = `/eol/eoltest/report?report_section=academic&skill_id=${encodeURIComponent(skillId)}&start=${encodeURIComponent(aVal)}&stop=${encodeURIComponent(bVal)}${memberIdParam}`;
        });
      }
      filterContainer.appendChild(filterClone);
    }

    const levelsContainer = document.getElementById('academic-list-levels');
    const levelTemplate = document.getElementById('report-academic-level-template');
    const itemTemplate = document.getElementById('report-academic-item-template');
    const emptyTemplate = document.getElementById('report-empty-template');
    if (!levelsContainer) return;

    if (!listData.levels || listData.levels.length === 0) {
      if (emptyTemplate) levelsContainer.appendChild(emptyTemplate.content.cloneNode(true));
    } else {
      listData.levels.forEach((lvl) => {
        const levelClone = levelTemplate.content.cloneNode(true);
        const title = levelClone.querySelector('.level-title');
        if (title) title.setAttribute('color', lvl.color);
        const levelName = levelClone.querySelector('.level-name');
        if (levelName) levelName.textContent = lvl.levelName;
        const itemsTable = levelClone.querySelector('.items-table');
        lvl.items.forEach((item) => {
          const itemClone = itemTemplate.content.cloneNode(true);
          const link = itemClone.querySelector('.item-link');
          if (link) link.href = `/eol/eoltest/report?report_section=academic&skill_id=${encodeURIComponent(listData.skillId)}&result_id=${encodeURIComponent(item.resultId)}&type=1${memberIdParam}`;
          const dateEl = itemClone.querySelector('.item-date');
          if (dateEl) dateEl.textContent = item.createDate;
          const correctEl = itemClone.querySelector('.item-correct');
          if (correctEl) correctEl.textContent = item.correct;
          const totalEl = itemClone.querySelector('.item-total');
          if (totalEl) totalEl.textContent = item.total;
          const bar = itemClone.querySelector('.item-bar');
          if (bar) {
            bar.src = `/assets/2010/temp_images/icon_bar/${lvl.bar}`;
            bar.width = Math.max(0, 510 * (Number(item.percent) / 100));
          }
          const percentEl = itemClone.querySelector('.item-percent');
          if (percentEl) percentEl.textContent = item.percent;
          if (itemsTable) itemsTable.appendChild(itemClone);
        });
        const minEl = levelClone.querySelector('.level-min');
        if (minEl) minEl.textContent = lvl.min;
        const maxEl = levelClone.querySelector('.level-max');
        if (maxEl) maxEl.textContent = lvl.max;
        const avgEl = levelClone.querySelector('.level-average');
        if (avgEl) avgEl.textContent = lvl.average;
        levelsContainer.appendChild(levelClone);
      });
    }

    if (typeof window.Epoch === 'function') {
      try {
        const container = document.getElementById('report-academic-list');
        const aInput = container && container.querySelector('#popup_container_a');
        const bInput = container && container.querySelector('#popup_container_b');
        if (aInput) new window.Epoch('epoch_popup', 'popup', aInput);
        if (bInput) new window.Epoch('epoch_popup', 'popup', bInput);
      } catch (e) {
        // ignore
      }
    }
  }

  function renderAcademicDetail(d) {
    const container = document.getElementById('report-academic-detail');
    if (!container) return;
    clearContainerKeepTemplates('academic-detail-header');
    clearContainerKeepTemplates('academic-detail-summary');
    clearContainerKeepTemplates('academic-detail-answers');
    clearContainerKeepTemplates('academic-detail-group');

    const headerTemplate = document.getElementById('report-detail-header-template');
    if (headerTemplate) {
      const headerClone = headerTemplate.content.cloneNode(true);
      const backLink = headerClone.querySelector('.back-link');
      if (backLink) backLink.href = `/eol/eoltest/report${memberIdQuery}`;
      const avatar = headerClone.querySelector('.detail-avatar');
      if (avatar) {
        avatar.src = d.avatar;
        avatar.height = d.avatarHeight;
        avatar.onerror = function () {
          this.onerror = null;
          this.src = `/assets/2010/member_images/icon_user_0${d.gender || 1}.jpg`;
        };
      }
      const fname = headerClone.querySelector('.detail-fname');
      if (fname) fname.textContent = d.fname;
      const lname = headerClone.querySelector('.detail-lname');
      if (lname) lname.textContent = d.lname;
      const dateEl = headerClone.querySelector('.detail-date');
      if (dateEl) dateEl.textContent = d.createDate;
      const sectionEl = headerClone.querySelector('.detail-section');
      if (sectionEl) sectionEl.textContent = d.sectionText;
      const amountEl = headerClone.querySelector('.detail-amount');
      if (amountEl) amountEl.textContent = d.amount;
      const totalEl = headerClone.querySelector('.detail-total');
      if (totalEl) totalEl.textContent = d.totalAmount;
      const percentEl = headerClone.querySelector('.detail-percent');
      if (percentEl) percentEl.textContent = d.percent;
      document.getElementById('academic-detail-header').appendChild(headerClone);
    }

    const tabsTemplate = document.getElementById('report-type-tabs-template');
    if (tabsTemplate) {
      const tabsClone = tabsTemplate.content.cloneNode(true);
      const link1 = tabsClone.querySelector('.tab-link-1');
      if (link1) link1.href = `/eol/eoltest/report?report_section=academic&result_id=${encodeURIComponent(resultId)}&type=1&skill_id=${encodeURIComponent(skillId)}${memberIdParam}`;
      const link2 = tabsClone.querySelector('.tab-link-2');
      if (link2) link2.href = `/eol/eoltest/report?report_section=academic&result_id=${encodeURIComponent(resultId)}&type=2&skill_id=${encodeURIComponent(skillId)}${memberIdParam}`;
      const link3 = tabsClone.querySelector('.tab-link-3');
      if (link3) link3.href = `/eol/eoltest/report?report_section=academic&result_id=${encodeURIComponent(resultId)}&type=3&skill_id=${encodeURIComponent(skillId)}${memberIdParam}`;
      document.getElementById('academic-detail-header').appendChild(tabsClone);
    }

    if (type === '2' && d.testDetail) {
      const target = document.getElementById('academic-detail-answers');
      const qTemplate = document.getElementById('report-test-question-template');
      const aTemplate = document.getElementById('report-test-answer-template');
      const iconTemplate = document.getElementById('report-test-icon-template');
      const msgTemplate = document.getElementById('report-test-msg-template');
      if (!target || !qTemplate) return;
      d.testDetail.questions.forEach((q) => {
        const qClone = qTemplate.content.cloneNode(true);
        const relateCell = qClone.querySelector('.relate-cell');
        const relateRow = qClone.querySelector('.relate-row');
        if (q.relateType === 1) {
          if (relateRow) relateRow.classList.remove('d-none');
          const tClone = document.getElementById('report-test-relate-text-template').content.cloneNode(true);
          const t = tClone.querySelector('.relate-text');
          if (t) t.textContent = q.relateText;
          if (relateCell) relateCell.appendChild(tClone);
        } else if (q.relateType === 2) {
          if (relateRow) relateRow.classList.remove('d-none');
          const tClone = document.getElementById('report-test-relate-image-template').content.cloneNode(true);
          const img = tClone.querySelector('img');
          if (img) img.src = q.relateText;
          if (relateCell) relateCell.appendChild(tClone);
        } else if (q.relateType === 3) {
          if (relateRow) relateRow.classList.remove('d-none');
          const tClone = document.getElementById('report-test-relate-audio-template').content.cloneNode(true);
          const source = tClone.querySelector('source');
          if (source) source.src = `https://www.engtest.net/files/sound/${q.relateText}`;
          if (relateCell) relateCell.appendChild(tClone);
        }
        const qNo = qClone.querySelector('.q-no');
        if (qNo) qNo.textContent = q.no;
        const qText = qClone.querySelector('.q-text');
        if (qText) qText.textContent = q.questionText;

        const answersContainer = qClone.querySelector('.answers');
        q.answers.forEach((a) => {
          const aClone = aTemplate.content.cloneNode(true);
          const textEl = aClone.querySelector('.answer-text');
          if (textEl) {
            textEl.textContent = `${a.index}.  ${a.text}`;
            if (a.selected) {
              textEl.setAttribute('color', 'orange');
              textEl.classList.add('fw-bold');
            }
          }
          if (answersContainer) answersContainer.appendChild(aClone);
        });

        const msgAEl = qClone.querySelector('.msg-a');
        const msgBEl = qClone.querySelector('.msg-b');
        if (q.unanswered) {
          if (msgAEl) msgAEl.textContent = "It's unanswered";
        } else {
          if (msgAEl) msgAEl.textContent = `Your answer is ${q.selectedIndex}. `;
          const msgClone = msgTemplate.content.cloneNode(true);
          const msgText = msgClone.querySelector('.msg-text');
          if (msgText) {
            msgText.setAttribute('color', q.isCorrect ? 'green' : 'red');
            msgText.textContent = q.isCorrect ? "It's a correct answer." : "It's an incorrect answer.";
          }
          if (msgBEl) msgBEl.appendChild(msgClone);
        }

        const iconCell = qClone.querySelector('.icon-cell');
        if (iconCell) {
          const iconClone = iconTemplate.content.cloneNode(true);
          const img = iconClone.querySelector('img');
          if (img) img.src = q.isCorrect ? '/assets/2010/temp_images/icon_correct.jpg' : '/assets/2010/temp_images/icon_incorrect.jpg';
          iconCell.appendChild(iconClone);
        }

        const reasonName = qClone.querySelector('.reason-name');
        if (reasonName) reasonName.textContent = q.reasonName;
        const lessonLink = qClone.querySelector('.lesson-link');
        if (lessonLink) lessonLink.href = `/eol/elearning_switch?reason_id=${q.detailId}&skill_id=${q.skillId}`;
        if (q.description) {
          qClone.querySelectorAll('.description-row').forEach((row) => { row.classList.remove('d-none'); });
          const desc = qClone.querySelector('.description-text');
          if (desc) desc.textContent = q.description;
        }
        target.appendChild(qClone);
      });
    } else if (type === '3' && d.viewGroup) {
      const target = document.getElementById('academic-detail-group');
      if (!target) return;
      if (d.viewGroup.total === 0) {
        const emptyTemplate = document.getElementById('report-view-group-empty-template');
        if (emptyTemplate) target.appendChild(emptyTemplate.content.cloneNode(true));
      } else {
        const template = document.getElementById('report-view-group-template');
        const distTemplate = document.getElementById('report-view-group-distribution-template');
        const rankTemplate = document.getElementById('report-view-group-ranking-template');
        if (!template) return;
        const clone = template.content.cloneNode(true);
        const vgTotal = clone.querySelector('.vg-total');
        if (vgTotal) vgTotal.textContent = d.viewGroup.total;
        const vgMin = clone.querySelector('.vg-min');
        if (vgMin) vgMin.textContent = d.viewGroup.min;
        const vgMax = clone.querySelector('.vg-max');
        if (vgMax) vgMax.textContent = d.viewGroup.max;
        const vgAvg = clone.querySelector('.vg-average');
        if (vgAvg) vgAvg.textContent = d.viewGroup.average;
        const distTable = clone.querySelector('.distribution-table');
        const rand = Math.floor(Math.random() * 8) + 1;
        d.viewGroup.distribution.forEach((dist) => {
          const dClone = distTemplate.content.cloneNode(true);
          const label = dClone.querySelector('.dist-label');
          if (label) label.textContent = dist.label;
          const amount = dClone.querySelector('.dist-amount');
          if (amount) amount.textContent = dist.amount;
          const bar = dClone.querySelector('.dist-bar');
          if (bar) {
            bar.src = `/assets/2010/temp_images/icon_bar/bar_0${rand}.png`;
            bar.setAttribute('aria-valuenow', `${dist.ratio}%`);
          }
          const ratio = dClone.querySelector('.dist-ratio');
          if (ratio) ratio.textContent = dist.ratio;
          if (distTable) distTable.appendChild(dClone);
        });
        const rankTable = clone.querySelector('.ranking-table');
        d.viewGroup.ranking.forEach((r) => {
          const rClone = rankTemplate.content.cloneNode(true);
          const row = rClone.querySelector('.rank-row');
          if (row) row.setAttribute('bgcolor', r.isFocus ? '#ffd0ff' : (r.order % 2 === 1 ? '#f7f7f7' : '#f0f0f0'));
          const order = rClone.querySelector('.rank-order');
          if (order) order.textContent = r.order;
          const fname = rClone.querySelector('.rank-fname');
          if (fname) fname.textContent = r.fname;
          const lname = rClone.querySelector('.rank-lname');
          if (lname) lname.textContent = r.lname;
          const highest = rClone.querySelector('.rank-highest');
          if (highest) highest.textContent = r.highestPercent;
          const amount = rClone.querySelector('.rank-amount');
          if (amount) amount.textContent = r.amount;
          if (rankTable) rankTable.appendChild(rClone);
        });
        target.appendChild(clone);
      }
    } else {
      const target = document.getElementById('academic-detail-summary');
      if (d.chartBar) {
        const barTemplate = document.getElementById('report-chart-bar-row-template');
        const avgTemplate = document.getElementById('report-chart-bar-avg-template');
        if (target && barTemplate) {
          d.chartBar.bars.forEach((bar) => {
            const bClone = barTemplate.content.cloneNode(true);
            const skill = bClone.querySelector('.bar-skill');
            if (skill) skill.textContent = bar.skillName;
            const percent = bClone.querySelector('.bar-percent');
            if (percent) percent.textContent = bar.percent;
            const correct = bClone.querySelector('.bar-correct');
            if (correct) correct.textContent = bar.correct;
            const total = bClone.querySelector('.bar-total');
            if (total) total.textContent = bar.total;
            const img = bClone.querySelector('.bar-image');
            if (img) {
              img.src = `/assets/2010/temp_images/icon_bar/${bar.barImage}`;
              img.setAttribute('aria-valuenow', `${bar.percent}%`);
            }
            target.appendChild(bClone);
          });
        }
        if (target && avgTemplate) {
          const avgClone = avgTemplate.content.cloneNode(true);
          const avgPercent = avgClone.querySelector('.avg-percent');
          if (avgPercent) avgPercent.textContent = d.chartBar.averagePercent;
          const avgCorrect = avgClone.querySelector('.avg-correct');
          if (avgCorrect) avgCorrect.textContent = d.chartBar.averageCorrect;
          const avgTotal = avgClone.querySelector('.avg-total');
          if (avgTotal) avgTotal.textContent = d.chartBar.averageTotal;
          const avgBar = avgClone.querySelector('.avg-bar');
          if (avgBar) avgBar.setAttribute('aria-valuenow', `${d.chartBar.averagePercent}%`);
          target.appendChild(avgClone);
        }
      }
      if (d.weakPoint) {
        const wpTemplate = document.getElementById('report-weak-point-template');
        const wpSkillTemplate = document.getElementById('report-weak-point-skill-template');
        const wpGroupTemplate = document.getElementById('report-weak-point-skill-group-template');
        const wpItemTemplate = document.getElementById('report-weak-point-item-template');
        if (target && wpTemplate && wpSkillTemplate && wpGroupTemplate && wpItemTemplate) {
          const wpClone = wpTemplate.content.cloneNode(true);
          const wpContainer = wpClone.querySelector('.weak-point-skills');
          if (wpContainer) wpContainer.appendChild(wpSkillTemplate.content.cloneNode(true));
          d.weakPoint.forEach((skill) => {
            const groupClone = wpGroupTemplate.content.cloneNode(true);
            const skillName = groupClone.querySelector('.skill-name');
            if (skillName) skillName.textContent = skill.skillName;
            const itemsContainer = groupClone.querySelector('.skill-items');
            let lastSskill = null;
            skill.items.forEach((item) => {
              const showSskill = lastSskill !== item.sskillId;
              lastSskill = item.sskillId;
              const itemClone = wpItemTemplate.content.cloneNode(true);
              const sskillName = itemClone.querySelector('.sskill-name');
              if (sskillName) sskillName.textContent = showSskill ? item.sskillName : '';
              const detailLink = itemClone.querySelector('.detail-link');
              if (detailLink) detailLink.href = `/eol/elearning_switch?reason_id=${item.detailId}&skill_id=${skill.skillId}`;
              const detailName = itemClone.querySelector('.detail-name');
              if (detailName) detailName.textContent = item.detailName;
              if (itemsContainer) itemsContainer.appendChild(itemClone);
            });
            if (wpContainer) wpContainer.appendChild(groupClone);
          });
          target.appendChild(wpClone);
        }
      }
    }
  }

  function renderAcademic() {
    const url = `/api/eol/report/academic?member_id=${encodeURIComponent(memberId)}&skill_id=${encodeURIComponent(skillId)}&result_id=${encodeURIComponent(resultId)}&type=${encodeURIComponent(type)}&start=${encodeURIComponent(start)}&stop=${encodeURIComponent(stop)}`;
    fetch(url, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== 200) {
          console.log(data);
          return;
        }
        renderFocusBar(data.data.focus);
        if (resultId) {
          showSection('report-academic-detail');
          renderAcademicDetail(data.data.detail);
        } else if (skillId) {
          showSection('report-academic-list');
          renderAcademicList(data.data.list);
        } else {
          showSection('report-academic-layout');
          renderAcademicLayout();
        }
      });
  }

  function renderStandardList(listData) {
    clearContainerKeepTemplates('standard-items-wrap');

    const container = document.getElementById('report-standard-list');
    if (container) {
      const inputA = container.querySelector('#popup_eolstandard_a');
      const inputB = container.querySelector('#popup_eolstandard_b');
      if (inputA) inputA.value = listData.start;
      if (inputB) inputB.value = listData.stop;
      const viewBtn = container.querySelector('.btn-view-standard');
      if (viewBtn) {
        viewBtn.addEventListener('click', () => {
          const aVal = (inputA && inputA.value) || '';
          const bVal = (inputB && inputB.value) || '';
          window.location.href = `/eol/eoltest/report?report_section=standard&start=${encodeURIComponent(aVal)}&stop=${encodeURIComponent(bVal)}${memberIdParam}`;
        });
      }
    }

    const itemsWrap = document.getElementById('standard-items-wrap');
    const emptyTemplate = document.getElementById('report-standard-empty-template');
    const tableTemplate = document.getElementById('report-standard-list-table-template');
    const rowTemplate = document.getElementById('report-standard-row-template');
    if (!itemsWrap) return;

    if (!listData.items || listData.items.length === 0) {
      if (emptyTemplate) itemsWrap.appendChild(emptyTemplate.content.cloneNode(true));
    } else {
      const tableClone = tableTemplate.content.cloneNode(true);
      const tbody = tableClone.querySelector('.items-body');
      listData.items.forEach((item) => {
        const rowClone = rowTemplate.content.cloneNode(true);
        const dateEl = rowClone.querySelector('.std-date');
        if (dateEl) dateEl.textContent = item.createDate;
        const percentEl = rowClone.querySelector('.std-percent');
        if (percentEl) percentEl.textContent = item.percent;
        const link = rowClone.querySelector('.std-link');
        if (link) link.href = `/eol/eoltest/report?report_section=standard&result_id=${encodeURIComponent(item.resultId)}${memberIdParam}`;
        if (tbody) tbody.appendChild(rowClone);
      });
      itemsWrap.appendChild(tableClone);
    }

    if (typeof window.Epoch === 'function') {
      try {
        const aInput = container && container.querySelector('#popup_eolstandard_a');
        const bInput = container && container.querySelector('#popup_eolstandard_b');
        if (aInput) new window.Epoch('epoch_popup', 'popup', aInput);
        if (bInput) new window.Epoch('epoch_popup', 'popup', bInput);
      } catch (e) {
        // ignore
      }
    }
  }

  function renderStandardDetail(d) {
    const container = document.getElementById('report-standard-detail');
    if (!container) return;

    const avatar = container.querySelector('.detail-avatar');
    if (avatar) {
      avatar.src = d.avatar;
      avatar.height = d.avatarHeight;
      avatar.onerror = function () {
        this.onerror = null;
        this.src = `/assets/2010/member_images/icon_user_0${d.gender || 1}.jpg`;
      };
    }
    const fname = container.querySelector('.detail-fname');
    if (fname) fname.textContent = d.fname;
    const lname = container.querySelector('.detail-lname');
    if (lname) lname.textContent = d.lname;
    const dateEl = container.querySelector('.detail-date');
    if (dateEl) dateEl.textContent = d.createDate;
    const testType = container.querySelector('.detail-test-type');
    if (testType) testType.textContent = d.testType;
    const pass = container.querySelector('.detail-pass');
    if (pass) pass.textContent = d.allPass;
    const wrong = container.querySelector('.detail-wrong');
    if (wrong) wrong.textContent = d.allWrong;
    const unans = container.querySelector('.detail-unans');
    if (unans) unans.textContent = d.allUnans;
    const percent = container.querySelector('.detail-percent');
    if (percent) percent.textContent = d.percent;

    const skillsTable = document.getElementById('standard-skills-table');
    if (skillsTable) {
      const rows = skillsTable.querySelectorAll('tr');
      rows.forEach((tr, idx) => { if (idx > 0) tr.remove(); });
      const skillTemplate = document.getElementById('report-standard-skill-template');
      if (skillTemplate && d.skills) {
        d.skills.forEach((s) => {
          const sClone = skillTemplate.content.cloneNode(true);
          const label = sClone.querySelector('.skill-label');
          if (label) label.textContent = s.label;
          const correct = sClone.querySelector('.skill-correct');
          if (correct) correct.textContent = s.correct;
          const wrong = sClone.querySelector('.skill-wrong');
          if (wrong) wrong.textContent = s.wrong;
          const unans = sClone.querySelector('.skill-unans');
          if (unans) unans.textContent = s.unans;
          const level = sClone.querySelector('.skill-level');
          if (level) level.textContent = s.level;
          const score = sClone.querySelector('.skill-score');
          if (score) score.textContent = s.score;
          const total = sClone.querySelector('.skill-total');
          if (total) total.textContent = s.total;
          skillsTable.appendChild(sClone);
        });
      }
    }

    clearContainerKeepTemplates('score-comparison-wrap');
    const scoreTemplate = document.getElementById('report-score-comparison-template');
    const scoreWrap = document.getElementById('score-comparison-wrap');
    if (scoreTemplate && scoreWrap) {
      const scoreClone = scoreTemplate.content.cloneNode(true);
      const c = d.scoreTable.eol;
      const m = d.scoreTable.toeic;
      const g = d.scoreTable.cutepToeflItpToeflIbtIelts;
      const cc = d.scoreTable.cefr;

      const topEl = scoreClone.querySelector('.score-top');
      if (topEl) {
        const value = d.scoreTable.topScoreColor;
        if (value === 'bgcolor_ffe0e0') topEl.classList.add('bg-light');
        else if (value === 'bgcolor_C4FAFC') topEl.classList.add('bg-light');
        else if (value === 'bgcolor_E2F9F9') topEl.classList.add('bg-light');
        else topEl.classList.add('bg-light');
      }
      for (let i = 1; i <= 11; i += 1) {
        const el = scoreClone.querySelector(`.score-c-${i}`);
        if (el) {
          const value = c[i];
          if (value === 'bgcolor_ffe0e0') el.classList.add('bg-light');
          else if (value === 'bgcolor_C4FAFC') el.classList.add('bg-light');
          else if (value === 'bgcolor_E2F9F9') el.classList.add('bg-light');
          else el.classList.add('bg-light');
        }
      }
      for (let i = 1; i <= 7; i += 1) {
        const el = scoreClone.querySelector(`.score-m-${i}`);
        if (el) {
          const value = m[i];
          if (value === 'bgcolor_ffe0e0') el.classList.add('bg-light');
          else if (value === 'bgcolor_C4FAFC') el.classList.add('bg-light');
          else if (value === 'bgcolor_E2F9F9') el.classList.add('bg-light');
          else el.classList.add('bg-light');
        }
      }
      for (let i = 1; i <= 5; i += 1) {
        const el = scoreClone.querySelector(`.score-g-${i}`);
        if (el) {
          const value = g[i];
          if (value === 'bgcolor_ffe0e0') el.classList.add('bg-light');
          else if (value === 'bgcolor_C4FAFC') el.classList.add('bg-light');
          else if (value === 'bgcolor_E2F9F9') el.classList.add('bg-light');
          else el.classList.add('bg-light');
        }
      }
      for (let i = 1; i <= 6; i += 1) {
        const el = scoreClone.querySelector(`.score-cc-${i}`);
        if (el) {
          const value = cc[i];
          if (value === 'bgcolor_ffe0e0') el.classList.add('bg-light');
          else if (value === 'bgcolor_C4FAFC') el.classList.add('bg-light');
          else if (value === 'bgcolor_E2F9F9') el.classList.add('bg-light');
          else el.classList.add('bg-light');
        }
      }
      scoreWrap.appendChild(scoreClone);
    }
  }

  function renderStandard() {
    const url = `/api/eol/report/standard?member_id=${encodeURIComponent(memberId)}&result_id=${encodeURIComponent(resultId)}&start=${encodeURIComponent(start)}&stop=${encodeURIComponent(stop)}`;
    fetch(url, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== 200) {
          console.log(data);
          return;
        }
        renderFocusBar(data.data.focus);
        if (resultId) {
          showSection('report-standard-detail');
          renderStandardDetail(data.data.detail);
        } else {
          showSection('report-standard-list');
          renderStandardList(data.data.list);
        }
      });
  }

  function renderContestList(listData) {
    clearContainerKeepTemplates('contest-items-wrap');

    const container = document.getElementById('report-contest-list');
    let inputA;
    let inputB;
    if (container) {
      inputA = container.querySelector('#popup_container_contest_a');
      inputB = container.querySelector('#popup_container_contest_b');
      if (inputA) inputA.value = listData.start ? listData.start.slice(0, 10) : '';
      if (inputB) inputB.value = listData.stop ? listData.stop.slice(0, 10) : '';
      const viewBtn = container.querySelector('.btn-view-contest');
      if (viewBtn) {
        viewBtn.addEventListener('click', () => {
          const aVal = (inputA && inputA.value) || '';
          const bVal = (inputB && inputB.value) || '';
          window.location.href = `/eol/eoltest/report?report_section=contest&start=${encodeURIComponent(aVal)}&stop=${encodeURIComponent(bVal)}${memberIdParam}`;
        });
      }
    }

    const itemsWrap = document.getElementById('contest-items-wrap');
    const emptyTemplate = document.getElementById('report-contest-empty-template');
    const tableTemplate = document.getElementById('report-contest-table-template');
    const rowTemplate = document.getElementById('report-contest-row-template');
    if (!itemsWrap) return;

    if (!listData.items || listData.items.length === 0) {
      if (emptyTemplate) itemsWrap.appendChild(emptyTemplate.content.cloneNode(true));
    } else {
      const tableClone = tableTemplate.content.cloneNode(true);
      const table = tableClone.querySelector('.tb-list-score-contest');
      listData.items.forEach((item) => {
        const rowClone = rowTemplate.content.cloneNode(true);
        const link = rowClone.querySelector('.contest-link');
        if (link) {
          link.href = `/eol/eoltest/report?report_section=contest&result_id=${encodeURIComponent(item.resultId)}&type=1${memberIdParam}`;
          link.textContent = item.createDate;
          link.setAttribute('title', item.examName);
        }
        const percent = rowClone.querySelector('.contest-percent');
        if (percent) percent.textContent = `${item.percent}%`;
        const bar = rowClone.querySelector('.contest-bar');
        if (bar) {
          bar.setAttribute('aria-valuenow', `${item.percent}%`);
          bar.setAttribute('title', item.examName);
        }
        if (table) table.appendChild(rowClone);
      });
      itemsWrap.appendChild(tableClone);
    }

    if (typeof window.Epoch === 'function') {
      try {
        if (inputA) new window.Epoch('epoch_popup', 'popup', inputA);
        if (inputB) new window.Epoch('epoch_popup', 'popup', inputB);
      } catch (e) {
        // ignore
      }
    }
  }

  function renderContestDetail(d) {
    const container = document.getElementById('report-contest-detail');
    if (!container) return;
    clearContainerKeepTemplates('contest-detail-header');
    clearContainerKeepTemplates('contest-detail-content');

    const headerContainer = document.getElementById('contest-detail-header');
    const headerTemplate = document.getElementById('report-detail-header-template');
    if (headerTemplate && headerContainer) {
      const headerClone = headerTemplate.content.cloneNode(true);
      const backLink = headerClone.querySelector('.back-link');
      if (backLink) backLink.href = `/eol/eoltest/report${memberIdQuery}`;
      const avatar = headerClone.querySelector('.detail-avatar');
      if (avatar) {
        avatar.src = d.avatar;
        avatar.height = d.avatarHeight;
        avatar.onerror = function () {
          this.onerror = null;
          this.src = `/assets/2010/member_images/icon_user_0${d.gender || 1}.jpg`;
        };
      }
      const fname = headerClone.querySelector('.detail-fname');
      if (fname) fname.textContent = d.fname;
      const lname = headerClone.querySelector('.detail-lname');
      if (lname) lname.textContent = d.lname;
      const dateEl = headerClone.querySelector('.detail-date');
      if (dateEl) dateEl.textContent = d.createDate;
      const sectionEl = headerClone.querySelector('.detail-section');
      if (sectionEl) sectionEl.textContent = d.sectionText;
      const amountEl = headerClone.querySelector('.detail-amount');
      if (amountEl) amountEl.textContent = d.amount;
      const totalEl = headerClone.querySelector('.detail-total');
      if (totalEl) totalEl.textContent = d.totalAmount;
      const percentEl = headerClone.querySelector('.detail-percent');
      if (percentEl) percentEl.textContent = d.percent;
      headerContainer.appendChild(headerClone);
    }

    const tabsTemplate = document.getElementById('report-type-tabs-template');
    if (tabsTemplate && headerContainer) {
      const tabsClone = tabsTemplate.content.cloneNode(true);
      const link1 = tabsClone.querySelector('.tab-link-1');
      if (link1) link1.href = `/eol/eoltest/report?report_section=contest&result_id=${encodeURIComponent(resultId)}&type=1${memberIdParam}`;
      const link2 = tabsClone.querySelector('.tab-link-2');
      if (link2) link2.href = `/eol/eoltest/report?report_section=contest&result_id=${encodeURIComponent(resultId)}&type=2${memberIdParam}`;
      const link3 = tabsClone.querySelector('.tab-link-3');
      if (link3) link3.href = `/eol/eoltest/report?report_section=contest&result_id=${encodeURIComponent(resultId)}&type=3${memberIdParam}`;
      headerContainer.appendChild(tabsClone);
    }

    const target = document.getElementById('contest-detail-content');
    if (!target) return;

    if (type === '2' && d.contestDetail) {
      const qTemplate = document.getElementById('report-contest-custom-question-template');
      const aTemplate = document.getElementById('report-contest-answer-template');
      const msgTemplate = document.getElementById('report-contest-msg-template');
      const iconTemplate = document.getElementById('report-contest-icon-template');
      if (!qTemplate) return;
      d.contestDetail.questions.forEach((q) => {
        const qClone = qTemplate.content.cloneNode(true);
        const qNo = qClone.querySelector('.q-no');
        if (qNo) qNo.textContent = q.no;
        const qText = qClone.querySelector('.q-text');
        if (qText) qText.textContent = q.questionText;
        const answersBody = qClone.querySelector('.answers-body');
        q.answers.forEach((a) => {
          const aClone = aTemplate.content.cloneNode(true);
          const radio = aClone.querySelector('.answer-radio');
          if (radio) radio.checked = a.selected;
          const text = aClone.querySelector('.answer-text');
          if (text) text.textContent = a.text;
          if (answersBody) answersBody.appendChild(aClone);
        });
        const msgClone = msgTemplate.content.cloneNode(true);
        const msgText = msgClone.querySelector('.msg-text');
        if (msgText) {
          msgText.setAttribute('color', q.isCorrect ? 'green' : 'red');
          msgText.textContent = q.isCorrect ? "It's a correct answer." : "It's an incorrect answer.";
        }
        const msgCell = qClone.querySelector('.msg-cell');
        if (msgCell) msgCell.appendChild(msgClone);
        const iconClone = iconTemplate.content.cloneNode(true);
        const img = iconClone.querySelector('img');
        if (img) img.src = q.isCorrect ? '/assets/2010/temp_images/icon_correct.jpg' : '/assets/2010/temp_images/icon_incorrect.jpg';
        const iconCell = qClone.querySelector('.icon-cell');
        if (iconCell) iconCell.appendChild(iconClone);
        target.appendChild(qClone);
      });
    } else if (type === '2' && d.testDetail) {
      const qTemplate = document.getElementById('report-test-question-template');
      const aTemplate = document.getElementById('report-test-answer-template');
      const iconTemplate = document.getElementById('report-test-icon-template');
      const msgTemplate = document.getElementById('report-test-msg-template');
      if (!qTemplate) return;
      d.testDetail.questions.forEach((q) => {
        const qClone = qTemplate.content.cloneNode(true);
        const relateCell = qClone.querySelector('.relate-cell');
        const relateRow = qClone.querySelector('.relate-row');
        if (q.relateType === 1) {
          if (relateRow) relateRow.classList.remove('d-none');
          const tClone = document.getElementById('report-test-relate-text-template').content.cloneNode(true);
          const t = tClone.querySelector('.relate-text');
          if (t) t.textContent = q.relateText;
          if (relateCell) relateCell.appendChild(tClone);
        } else if (q.relateType === 2) {
          if (relateRow) relateRow.classList.remove('d-none');
          const tClone = document.getElementById('report-test-relate-image-template').content.cloneNode(true);
          const img = tClone.querySelector('img');
          if (img) img.src = q.relateText;
          if (relateCell) relateCell.appendChild(tClone);
        } else if (q.relateType === 3) {
          if (relateRow) relateRow.classList.remove('d-none');
          const tClone = document.getElementById('report-test-relate-audio-template').content.cloneNode(true);
          const source = tClone.querySelector('source');
          if (source) source.src = `https://www.engtest.net/files/sound/${q.relateText}`;
          if (relateCell) relateCell.appendChild(tClone);
        }
        const qNo = qClone.querySelector('.q-no');
        if (qNo) qNo.textContent = q.no;
        const qText = qClone.querySelector('.q-text');
        if (qText) qText.textContent = q.questionText;

        const answersContainer = qClone.querySelector('.answers');
        q.answers.forEach((a) => {
          const aClone = aTemplate.content.cloneNode(true);
          const textEl = aClone.querySelector('.answer-text');
          if (textEl) {
            textEl.textContent = `${a.index}.  ${a.text}`;
            if (a.selected) {
              textEl.setAttribute('color', 'orange');
              textEl.classList.add('fw-bold');
            }
          }
          if (answersContainer) answersContainer.appendChild(aClone);
        });

        const msgAEl = qClone.querySelector('.msg-a');
        const msgBEl = qClone.querySelector('.msg-b');
        if (q.unanswered) {
          if (msgAEl) msgAEl.textContent = "It's unanswered";
        } else {
          if (msgAEl) msgAEl.textContent = `Your answer is ${q.selectedIndex}. `;
          const msgClone = msgTemplate.content.cloneNode(true);
          const msgText = msgClone.querySelector('.msg-text');
          if (msgText) {
            msgText.setAttribute('color', q.isCorrect ? 'green' : 'red');
            msgText.textContent = q.isCorrect ? "It's a correct answer." : "It's an incorrect answer.";
          }
          if (msgBEl) msgBEl.appendChild(msgClone);
        }

        const iconCell = qClone.querySelector('.icon-cell');
        if (iconCell) {
          const iconClone = iconTemplate.content.cloneNode(true);
          const img = iconClone.querySelector('img');
          if (img) img.src = q.isCorrect ? '/assets/2010/temp_images/icon_correct.jpg' : '/assets/2010/temp_images/icon_incorrect.jpg';
          iconCell.appendChild(iconClone);
        }

        const reasonName = qClone.querySelector('.reason-name');
        if (reasonName) reasonName.textContent = q.reasonName;
        const lessonLink = qClone.querySelector('.lesson-link');
        if (lessonLink) lessonLink.href = `/eol/elearning_switch?reason_id=${q.detailId}&skill_id=${q.skillId}`;
        if (q.description) {
          qClone.querySelectorAll('.description-row').forEach((row) => { row.classList.remove('d-none'); });
          const desc = qClone.querySelector('.description-text');
          if (desc) desc.textContent = q.description;
        }
        target.appendChild(qClone);
      });
    } else if (type === '3' && d.viewGroup) {
      if (d.viewGroup.total === 0) {
        const emptyTemplate = document.getElementById('report-view-group-empty-template');
        if (emptyTemplate) target.appendChild(emptyTemplate.content.cloneNode(true));
      } else {
        const template = document.getElementById('report-view-group-template');
        const distTemplate = document.getElementById('report-view-group-distribution-template');
        const rankTemplate = document.getElementById('report-view-group-ranking-template');
        if (!template) return;
        const clone = template.content.cloneNode(true);
        const vgTotal = clone.querySelector('.vg-total');
        if (vgTotal) vgTotal.textContent = d.viewGroup.total;
        const vgMin = clone.querySelector('.vg-min');
        if (vgMin) vgMin.textContent = d.viewGroup.min;
        const vgMax = clone.querySelector('.vg-max');
        if (vgMax) vgMax.textContent = d.viewGroup.max;
        const vgAvg = clone.querySelector('.vg-average');
        if (vgAvg) vgAvg.textContent = d.viewGroup.average;
        const distTable = clone.querySelector('.distribution-table');
        const rand = Math.floor(Math.random() * 8) + 1;
        d.viewGroup.distribution.forEach((dist) => {
          const dClone = distTemplate.content.cloneNode(true);
          const label = dClone.querySelector('.dist-label');
          if (label) label.textContent = dist.label;
          const amount = dClone.querySelector('.dist-amount');
          if (amount) amount.textContent = dist.amount;
          const bar = dClone.querySelector('.dist-bar');
          if (bar) {
            bar.src = `/assets/2010/temp_images/icon_bar/bar_0${rand}.png`;
            bar.setAttribute('aria-valuenow', `${dist.ratio}%`);
          }
          const ratio = dClone.querySelector('.dist-ratio');
          if (ratio) ratio.textContent = dist.ratio;
          if (distTable) distTable.appendChild(dClone);
        });
        const rankTable = clone.querySelector('.ranking-table');
        d.viewGroup.ranking.forEach((r) => {
          const rClone = rankTemplate.content.cloneNode(true);
          const row = rClone.querySelector('.rank-row');
          if (row) row.setAttribute('bgcolor', r.isFocus ? '#ffd0ff' : (r.order % 2 === 1 ? '#f7f7f7' : '#f0f0f0'));
          const order = rClone.querySelector('.rank-order');
          if (order) order.textContent = r.order;
          const fname = rClone.querySelector('.rank-fname');
          if (fname) fname.textContent = r.fname;
          const lname = rClone.querySelector('.rank-lname');
          if (lname) lname.textContent = r.lname;
          const highest = rClone.querySelector('.rank-highest');
          if (highest) highest.textContent = r.highestPercent;
          const amount = rClone.querySelector('.rank-amount');
          if (amount) amount.textContent = r.amount;
          if (rankTable) rankTable.appendChild(rClone);
        });
        target.appendChild(clone);
      }
    } else {
      if (d.chartBar) {
        const barTemplate = document.getElementById('report-chart-bar-row-template');
        const avgTemplate = document.getElementById('report-chart-bar-avg-template');
        if (barTemplate) {
          d.chartBar.bars.forEach((bar) => {
            const bClone = barTemplate.content.cloneNode(true);
            const skill = bClone.querySelector('.bar-skill');
            if (skill) skill.textContent = bar.skillName;
            const percent = bClone.querySelector('.bar-percent');
            if (percent) percent.textContent = bar.percent;
            const correct = bClone.querySelector('.bar-correct');
            if (correct) correct.textContent = bar.correct;
            const total = bClone.querySelector('.bar-total');
            if (total) total.textContent = bar.total;
            const img = bClone.querySelector('.bar-image');
            if (img) {
              img.src = `/assets/2010/temp_images/icon_bar/${bar.barImage}`;
              img.setAttribute('aria-valuenow', `${bar.percent}%`);
            }
            target.appendChild(bClone);
          });
        }
        if (avgTemplate) {
          const avgClone = avgTemplate.content.cloneNode(true);
          const avgPercent = avgClone.querySelector('.avg-percent');
          if (avgPercent) avgPercent.textContent = d.chartBar.averagePercent;
          const avgCorrect = avgClone.querySelector('.avg-correct');
          if (avgCorrect) avgCorrect.textContent = d.chartBar.averageCorrect;
          const avgTotal = avgClone.querySelector('.avg-total');
          if (avgTotal) avgTotal.textContent = d.chartBar.averageTotal;
          const avgBar = avgClone.querySelector('.avg-bar');
          if (avgBar) avgBar.setAttribute('aria-valuenow', `${d.chartBar.averagePercent}%`);
          target.appendChild(avgClone);
        }
      }
      if (d.weakPoint) {
        const wpTemplate = document.getElementById('report-weak-point-template');
        const wpSkillTemplate = document.getElementById('report-weak-point-skill-template');
        const wpGroupTemplate = document.getElementById('report-weak-point-skill-group-template');
        const wpItemTemplate = document.getElementById('report-weak-point-item-template');
        if (wpTemplate && wpSkillTemplate && wpGroupTemplate && wpItemTemplate) {
          const wpClone = wpTemplate.content.cloneNode(true);
          const wpContainer = wpClone.querySelector('.weak-point-skills');
          if (wpContainer) wpContainer.appendChild(wpSkillTemplate.content.cloneNode(true));
          d.weakPoint.forEach((skill) => {
            const groupClone = wpGroupTemplate.content.cloneNode(true);
            const skillName = groupClone.querySelector('.skill-name');
            if (skillName) skillName.textContent = skill.skillName;
            const itemsContainer = groupClone.querySelector('.skill-items');
            let lastSskill = null;
            skill.items.forEach((item) => {
              const showSskill = lastSskill !== item.sskillId;
              lastSskill = item.sskillId;
              const itemClone = wpItemTemplate.content.cloneNode(true);
              const sskillName = itemClone.querySelector('.sskill-name');
              if (sskillName) sskillName.textContent = showSskill ? item.sskillName : '';
              const detailLink = itemClone.querySelector('.detail-link');
              if (detailLink) detailLink.href = `/eol/elearning_switch?reason_id=${item.detailId}&skill_id=${skill.skillId}`;
              const detailName = itemClone.querySelector('.detail-name');
              if (detailName) detailName.textContent = item.detailName;
              if (itemsContainer) itemsContainer.appendChild(itemClone);
            });
            if (wpContainer) wpContainer.appendChild(groupClone);
          });
          target.appendChild(wpClone);
        }
      }
    }
  }

  function renderContest() {
    const url = `/api/eol/report/contest?member_id=${encodeURIComponent(memberId)}&result_id=${encodeURIComponent(resultId)}&type=${encodeURIComponent(type)}&start=${encodeURIComponent(start)}&stop=${encodeURIComponent(stop)}`;
    fetch(url, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== 200) {
          console.log(data);
          return;
        }
        renderFocusBar(data.data.focus);
        if (resultId) {
          showSection('report-contest-detail');
          renderContestDetail(data.data.detail);
        } else {
          showSection('report-contest-list');
          renderContestList(data.data.list);
        }
      });
  }

  function init() {
    hideAllSections();
    if (reportSection === 'academic') {
      renderAcademic();
    } else if (reportSection === 'standard') {
      renderStandard();
    } else if (reportSection === 'contest') {
      renderContest();
    } else {
      showSection('report-section-selector');
      renderSelector();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
