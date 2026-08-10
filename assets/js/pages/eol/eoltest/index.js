(function () {
  const params = new URLSearchParams(window.location.search);
  const viewAction = params.get('action') || '';
  const viewStatus = params.get('status') || '';

  function htmlEscape(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function showView(id) {
    const views = document.querySelectorAll('.eol-view');
    views.forEach((v) => { v.classList.add('d-none'); });
    const target = document.getElementById(id);
    if (target) target.classList.remove('d-none');
  }

  function reloadCurrent(extra) {
    const q = new URLSearchParams(window.location.search);
    if (extra) {
      for (const [k, v] of Object.entries(extra)) {
        if (v === null || v === undefined || v === '') q.delete(k);
        else q.set(k, v);
      }
    }
    window.location.href = `${window.location.pathname}?${q.toString()}`;
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  function closeModals() {
    document.querySelectorAll('.modal1.show').forEach((m) => {
      bootstrap.Modal.getOrCreateInstance(m).hide();
    });
  }

  // ---------- Master POST helpers ----------
  function bulkPost(url, extra) {
    const body = new URLSearchParams();
    document.querySelectorAll('.master-member-check:checked').forEach((cb, idx) => {
      body.set(`member_id[${idx}]`, cb.value);
    });
    if (extra) {
      for (const [k, v] of Object.entries(extra)) {
        body.set(k, v);
      }
    }
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          window.location.reload();
        } else {
          console.log(data);
        }
      });
  }

  function postMaster(url, bodyObj, redirectExtra) {
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(bodyObj).toString()
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          if (redirectExtra) reloadCurrent(redirectExtra);
          else window.location.reload();
        } else {
          console.log(data);
        }
      });
  }

  // ---------- Master event bindings ----------
  function bindMasterEvents() {
    const viewGroupBtn = document.getElementById('master-view-group');
    if (viewGroupBtn) {
      viewGroupBtn.addEventListener('click', () => {
        const groupId = document.getElementById('group_id').value;
        reloadCurrent({ group_id: groupId, page: 1 });
      });
    }

    const createGroupBtn = document.getElementById('master-create-group');
    if (createGroupBtn) {
      createGroupBtn.addEventListener('click', () => {
        const name = document.getElementById('group_name').value;
        if (!name || !confirm('Do you want to create new group ?')) return;
        postMaster('/api/eol/master/group/create', { group_name: name });
      });
    }

    const deleteGroupBtn = document.getElementById('master-delete-group');
    if (deleteGroupBtn) {
      deleteGroupBtn.addEventListener('click', () => {
        const groupId = document.getElementById('group_id').value;
        if (groupId === '0') {
          alert('Cannot delete None Group');
          return;
        }
        if (confirm('Do you want to delete this group ?') &&
          confirm('Are you sure ? If you delete this group the member in this group will be None Group.')) {
          postMaster('/api/eol/master/group/delete', { group_id: groupId }, { group_id: 0 });
        }
      });
    }

    const renameForm = document.getElementById('rename-group-form');
    if (renameForm) {
      renameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const idrename = document.getElementById('idrename').value;
        const rename = document.getElementById('rename').value;
        if (idrename === '0') {
          alert('Cannot rename None Group');
          return;
        }
        postMaster('/api/eol/master/group/rename', { idrename, rename });
      });
    }

    const editSubForm = document.getElementById('edit-sub-form');
    if (editSubForm) {
      editSubForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const imgLoad = document.getElementById('imgload');
        const editError = document.getElementById('editerror');
        imgLoad.classList.remove('d-none');
        editError.innerHTML = '';
        fetch('/api/eol/master/member/edit', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            member: document.getElementById('idre-sub').value,
            rename: document.getElementById('rename-subAcc').value,
            newpass: document.getElementById('pass').value,
            repass: document.getElementById('re-pass').value
          }).toString()
        })
          .then((res) => res.json())
          .then((data) => {
            imgLoad.classList.add('d-none');
            if (data.status === 200) {
              window.location.reload();
            } else {
              editError.innerHTML = htmlEscape(data.data && data.data.message ? data.data.message : data.message);
            }
          })
          .catch((err) => {
            imgLoad.classList.add('d-none');
            editError.innerHTML = htmlEscape(err.message || 'Network error');
          });
      });
    }

    const memberRows = document.getElementById('master-member-rows');
    if (memberRows) {
      memberRows.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.master-edit-btn');
        if (editBtn) {
          const id = editBtn.id;
          const userData = document.getElementById(`userdata_${id}`);
          document.getElementById('rename-subAcc').value = userData ? userData.textContent : '';
          document.getElementById('idre-sub').value = id;
          document.getElementById('pass').value = '';
          document.getElementById('re-pass').value = '';
          document.getElementById('editerror').innerHTML = '';
        }

        const statusBtn = e.target.closest('.master-status-btn');
        const leftBtn = e.target.closest('.master-left-btn');
        const deleteBtn = e.target.closest('.master-delete-btn');
        if (statusBtn && confirm('Do you want to change the member status ?')) {
          postMaster('/api/eol/master/member/status', { member_id: statusBtn.dataset.member });
        }
        if (leftBtn && confirm('Do you want to bring this member out of this group to none group ?')) {
          postMaster('/api/eol/master/member/left', { member_id: leftBtn.dataset.member });
        }
        if (deleteBtn && confirm('Do you want to delete this member from your member ?')) {
          postMaster('/api/eol/master/member/delete', { member_id: deleteBtn.dataset.member });
        }
      });
    }

    const pagination = document.getElementById('master-pagination');
    if (pagination) {
      pagination.addEventListener('click', (e) => {
        const link = e.target.closest('.master-page-link');
        if (!link) return;
        e.preventDefault();
        reloadCurrent({ page: link.dataset.page });
      });
    }

    const bulkLimitBtn = document.getElementById('master-bulk-limit');
    if (bulkLimitBtn) {
      bulkLimitBtn.addEventListener('click', () => {
        if (!confirm('Do you want to change the status of the following members to be Limited ?')) return;
        bulkPost('/api/eol/master/members/limit');
      });
    }

    const bulkUnlimitBtn = document.getElementById('master-bulk-unlimit');
    if (bulkUnlimitBtn) {
      bulkUnlimitBtn.addEventListener('click', () => {
        if (!confirm('Do you want to change the status of the following members to be Unlimited ?')) return;
        bulkPost('/api/eol/master/members/unlimit');
      });
    }

    const bulkDeleteBtn = document.getElementById('master-bulk-delete');
    if (bulkDeleteBtn) {
      bulkDeleteBtn.addEventListener('click', () => {
        if (!confirm('Do you want to bring the following members out of this Corporate Card ?')) return;
        bulkPost('/api/eol/master/members/delete');
      });
    }

    const bulkMoveBtn = document.getElementById('master-bulk-move');
    if (bulkMoveBtn) {
      bulkMoveBtn.addEventListener('click', () => {
        if (!confirm('Do you want to bring the following members into the selected group ?')) return;
        const typeId = document.getElementById('ref_id').value;
        bulkPost('/api/eol/master/members/move', { type_id: typeId });
      });
    }

    const addMemberBtn = document.getElementById('master-add-member-btn');
    if (addMemberBtn) {
      addMemberBtn.addEventListener('click', () => {
        fetch('/api/eol/master/member/add', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            user_newgroup: document.getElementById('master-add-user-newgroup').value,
            add_user: document.getElementById('master-add-user').value,
            add_pass: document.getElementById('master-add-pass').value,
            add_re: document.getElementById('master-add-re').value
          }).toString()
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 200) {
              window.location.reload();
            } else {
              const message = data.data && data.data.message ? data.data.message : data.message;
              document.getElementById('master-action-error-row').classList.remove('d-none');
              document.getElementById('master-action-error-msg').classList.remove('d-none');
              document.getElementById('master-action-error-end').classList.remove('d-none');
              document.getElementById('master-action-error-text').textContent = message || 'Error';
            }
          });
      });
    }
  }

  // ---------- E-Test helpers ----------
  document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.modalInput');
      if (!btn) return;
      const rel = btn.getAttribute('rel');
      if (rel && rel.charAt(0) === '#') {
        e.preventDefault();
        openModal(rel.substring(1));
      }
    });
    document.querySelectorAll('.modal1 .close').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        closeModals();
      });
    });
    const renameBtn = document.getElementById('master-rename-btn');
    if (renameBtn) {
      renameBtn.addEventListener('click', () => {
        const select = document.getElementById('group_id');
        const renameInput = document.getElementById('rename');
        const idrenameInput = document.getElementById('idrename');
        const btnRename = document.getElementById('btn_rename');
        const txtAlert = document.getElementById('txt_alert');
        if (!select || !renameInput || !idrenameInput || !btnRename || !txtAlert) return;
        const idname = select.value;
        if (idname != 0) {
          const selected = select.options[select.selectedIndex].text;
          const name = selected.split('[');
          renameInput.value = name[0].trim();
          idrenameInput.value = idname;
          btnRename.disabled = false;
          txtAlert.classList.add('d-none');
        } else {
          btnRename.disabled = true;
          txtAlert.classList.remove('d-none');
        }
      });
    }

    const selectAll = document.getElementById('master-select-all');
    if (selectAll) {
      selectAll.addEventListener('click', () => {
        const inputs = document.querySelectorAll("input[name^='member_id[']");
        const allStatus = document.getElementById('all_status');
        if (allStatus.value == 'select') {
          inputs.forEach((i) => { i.checked = true; });
          allStatus.value = 'remove';
        } else {
          inputs.forEach((i) => { i.checked = false; });
          allStatus.value = 'select';
        }
      });
    }

    bindMasterEvents();
      fetch(`/api/eol/eoltest/home${window.location.search}`, {
        credentials: 'include'
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== 200) {
            console.log(data);
            return;
          }
          const account = data.data.account;
          if (account.type === 'master') {
            showView('view-master');
            const masterData = data.data.master;

            const groupOptionTemplate = document.getElementById('master-group-option-template');
            ['group_id', 'ref_id', 'master-add-user-newgroup'].forEach((selectId) => {
              const select = document.getElementById(selectId);
              if (!select) return;
              while (select.options.length > 0) select.remove(0);
              const selectedId = selectId === 'group_id' ? masterData.selectedGroupId : 0;
              (masterData.groups || []).forEach((g) => {
                const clone = groupOptionTemplate.content.cloneNode(true);
                const opt = clone.querySelector('option');
                opt.value = g.type_id;
                opt.textContent = `${g.name} [ ${g.count} ]`;
                if (String(g.type_id) === String(selectedId)) opt.selected = true;
                select.appendChild(opt);
              });
            });

            const rowsContainer = document.getElementById('master-member-rows');
            const emptyDiv = document.getElementById('master-empty');
            const listWrap = document.getElementById('master-list-wrap');
            while (rowsContainer.firstChild) rowsContainer.removeChild(rowsContainer.firstChild);

            if (!masterData.subMembers || masterData.subMembers.length === 0) {
              emptyDiv.classList.remove('d-none');
              listWrap.classList.add('d-none');
            } else {
              emptyDiv.classList.add('d-none');
              listWrap.classList.remove('d-none');
              const rowTemplate = document.getElementById('master-member-row-template');
              const nameTableTemplate = document.getElementById('master-member-name-table-template');
              const nameEmptyTemplate = document.getElementById('master-member-name-empty-template');
              const userTemplate = document.getElementById('master-member-user-template');
              const passTemplate = document.getElementById('master-member-pass-template');
              masterData.subMembers.forEach((m, idx) => {
                const color = (idx % 2 === 0) ? '#f0f0f0' : '#f7f7f7';
                const imgStatus = m.status == 1 ? 'unlimit.png' : 'limit.png';
                const titleStatus = m.status == 1
                  ? 'Allow this Sub Account get Available Date from Master Account - Click to Change as Limited'
                  : 'Not allow this Sub Account get Available Date from Master Account - Click to Change as Unlimited';
                const listNum = idx + 1 + ((masterData.pageNum - 1) * masterData.perPage);

                const clone = rowTemplate.content.cloneNode(true);
                const cb = clone.querySelector('.master-member-check');
                cb.name = `member_id[${idx}]`;
                cb.value = m.member_id;
                cb.title = `[${listNum}]`;

                const nameCell = clone.querySelector('[data-role="name-cell"]');
                nameCell.bgColor = color;
                if (m.fname && m.lname) {
                  const nameClone = nameTableTemplate.content.cloneNode(true);
                  nameClone.querySelector('[data-role="fname"]').textContent = `\u00A0${m.fname}\u00A0`;
                  nameClone.querySelector('[data-role="lname"]').textContent = `\u00A0${m.lname}\u00A0`;
                  nameCell.appendChild(nameClone);
                } else {
                  nameCell.appendChild(nameEmptyTemplate.content.cloneNode(true));
                }

                const userCell = clone.querySelector('[data-role="user-cell"]');
                userCell.bgColor = color;
                const userClone = userTemplate.content.cloneNode(true);
                const userText = userClone.querySelector('[data-role="text"]');
                userText.id = `userdata_${m.member_id}`;
                userText.textContent = m.user;
                userCell.appendChild(userClone);

                const passCell = clone.querySelector('[data-role="pass-cell"]');
                passCell.bgColor = color;
                const passClone = passTemplate.content.cloneNode(true);
                passClone.querySelector('[data-role="text"]').textContent = m.pass;
                passCell.appendChild(passClone);

                const operatingCell = clone.querySelector('[data-role="operating-cell"]');
                operatingCell.bgColor = color;
                operatingCell.innerHTML = m.operatingText || '';

                const statusImg = clone.querySelector('.master-status-btn');
                statusImg.querySelector('img').src = `/assets/images/icon/${imgStatus}`;
                statusImg.title = titleStatus;
                statusImg.dataset.member = m.member_id;

                const reportLink = clone.querySelector('[data-role="report-link"]');
                reportLink.href = `/eol/eoltest/report?member_id=${encodeURIComponent(m.member_id)}`;

                const leftBtn = clone.querySelector('.master-left-btn');
                leftBtn.dataset.member = m.member_id;

                const editBtn = clone.querySelector('.master-edit-btn');
                editBtn.id = m.member_id;

                const deleteBtn = clone.querySelector('.master-delete-btn');
                deleteBtn.dataset.member = m.member_id;

                rowsContainer.appendChild(clone);
              });

              const pageContainer = document.getElementById('master-pagination');
              while (pageContainer.firstChild) pageContainer.removeChild(pageContainer.firstChild);
              const linkTemplate = document.getElementById('master-pagination-link-template');
              for (let p = 1; p <= masterData.totalPages; p++) {
                let pageLabel = '';
                if (p < 10) pageLabel = `[00${p}]`;
                else if (p < 100) pageLabel = `[0${p}]`;
                else pageLabel = `[${p}]`;
                const isCurrent = p === masterData.pageNum;
                const linkClone = linkTemplate.content.cloneNode(true);
                const link = linkClone.querySelector('a');
                link.dataset.page = p;
                const label = linkClone.querySelector('span');
                if (isCurrent) {
                  link.classList.remove('btn-outline-secondary');
                  link.classList.add('btn-danger');
                }
                label.textContent = pageLabel;
                pageContainer.appendChild(linkClone);
                pageContainer.appendChild(document.createTextNode('\u00A0'));
                if (p % 20 === 0) pageContainer.appendChild(document.createElement('br'));
              }
            }

            if (masterData.allowAdd) {
              document.getElementById('master-add-section').classList.remove('d-none');
              document.getElementById('master-no-add-section').classList.add('d-none');
            } else {
              document.getElementById('master-add-section').classList.add('d-none');
              document.getElementById('master-no-add-section').classList.remove('d-none');
            }

            const actionError = params.get('action_error');
            const addUser = params.get('add_user') || '';
            if (actionError) {
              document.getElementById('master-action-error-row').classList.remove('d-none');
              document.getElementById('master-action-error-msg').classList.remove('d-none');
              document.getElementById('master-action-error-end').classList.remove('d-none');
              document.getElementById('master-action-error-text').textContent = decodeURIComponent(actionError);
              document.getElementById('master-add-user').value = addUser;
            } else {
              document.getElementById('master-action-error-row').classList.add('d-none');
              document.getElementById('master-action-error-msg').classList.add('d-none');
              document.getElementById('master-action-error-end').classList.add('d-none');
            }
          } else if (account.type === 'personal' && account.usable) {
            showView('view-personal');
            if (account.corporate) {
              document.getElementById('coporate').classList.remove('d-none');
            }
          } else {
            showView('view-expired');
          }
        });
  });
})();
