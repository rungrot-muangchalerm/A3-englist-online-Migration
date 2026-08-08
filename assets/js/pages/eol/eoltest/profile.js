(function () {
  function htmlEscape(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function showView(id) {
    const views = document.querySelectorAll('.eol-view');
    views.forEach((v) => { v.style.display = 'none'; });
    const target = document.getElementById(id);
    if (target) target.style.display = '';
  }
  document.addEventListener('DOMContentLoaded', function () {
    const profileBtn = document.getElementById('reg_submit');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        const form = document.getElementById('profileForm');
        const msg = document.getElementById('profileMsg');
        const row1 = document.getElementById('profileMsgRow');
        const row2 = document.getElementById('profileMsgRow2');
        msg.innerHTML = '';
        row1.style.display = 'none';
        row2.style.display = 'none';
        fetch('/api/eol/profile', {
          method: 'POST',
          credentials: 'include',
          body: new FormData(form)
        })
          .then((res) => res.json())
          .then((data) => {
            row1.style.display = '';
            row2.style.display = '';
            const message = data.data && data.data.message ? data.data.message : data.message;
            msg.innerHTML = `<font size=2 face=tahoma color=${data.status === 200 ? 'green' : 'red'}>&nbsp;${htmlEscape(message).replace(/\n/g, '<br>&nbsp;')}</font>`;
            if (data.status === 200) {
              setTimeout(function () { window.location.reload(); }, 1200);
            }
          });
      });
    }

    // ---------- Password POST ----------
    const passBtn = document.getElementById('password-save-btn');
    if (passBtn) {
      passBtn.addEventListener('click', () => {
        const form = document.getElementById('passForm');
        const msg = document.getElementById('passwordMsg');
        const spacer = document.getElementById('passwordMsgSpacer');
        const row = document.getElementById('passwordMsgRow');
        msg.innerHTML = '';
        spacer.style.display = 'none';
        row.style.display = 'none';
        fetch('/api/eol/password', {
          method: 'POST',
          credentials: 'include',
          body: new URLSearchParams(new FormData(form))
        })
          .then((res) => res.json())
          .then((data) => {
            spacer.style.display = '';
            row.style.display = '';
            const message = data.data && data.data.message ? data.data.message : data.message;
            msg.innerHTML = `<font size=2 face=tahoma color=${data.status === 200 ? 'green' : 'red'}><b>${htmlEscape(message)}</b></font>`;
            if (data.status === 200) {
              form.reset();
            }
          });
      });
    }
      showView('view-edit-profile');
      fetch('/api/eol/profile', {
        credentials: 'include'
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== 200) {
            console.log(data);
            return;
          }
          document.getElementById('profile-fname').value = data.data.member.fname || '';
          document.getElementById('profile-lname').value = data.data.member.lname || '';
          document.getElementById('profile-gender-m').checked = String(data.data.member.gender) === '1';
          document.getElementById('profile-gender-f').checked = String(data.data.member.gender) === '2';
          const fmtBirth = (data.data.member.birthday && String(data.data.member.birthday) !== '0000-00-00')
            ? new Date(data.data.member.birthday).toISOString().slice(0, 10)
            : '';
          document.getElementById('popup_container').value = fmtBirth;
          document.getElementById('profile-education-b').value = data.data.member.education || '';

          const eduSelect = document.getElementById('profile-education-a');
          while (eduSelect.options.length > 1) eduSelect.remove(1);
          const eduTemplate = document.getElementById('profile-education-option-template');
          Object.entries(data.data.educationLevels || {}).forEach(([k, v]) => {
            const clone = eduTemplate.content.cloneNode(true);
            const opt = clone.querySelector('option');
            opt.value = k;
            opt.textContent = v;
            if (String(data.data.member.education_level) === String(k)) opt.selected = true;
            eduSelect.appendChild(opt);
          });

          document.getElementById('profile-address').value = data.data.member.address || '';
          document.getElementById('profile-email').value = data.data.member.email || '';
          document.getElementById('profile-tel').value = data.data.member.tel || '';
          document.getElementById('profile-username').textContent = data.data.member.user || '';

          const avatarCell = document.getElementById('profile-avatar-cell');
          while (avatarCell.firstChild) avatarCell.removeChild(avatarCell.firstChild);
          if (data.data.hasAvatar && data.data.avatarUrl) {
            const clone = document.getElementById('profile-avatar-template').content.cloneNode(true);
            const img = clone.querySelector('img');
            img.src = data.data.avatarUrl;
            img.width = data.data.avatarWidth || 90;
            avatarCell.appendChild(clone);
          }

          if (typeof window.Epoch === 'function') {
            try {
              new Epoch('epoch_popup', 'popup', document.getElementById('popup_container'));
            } catch (e) { /* ignore */ }
          }
        });
  });
})();
