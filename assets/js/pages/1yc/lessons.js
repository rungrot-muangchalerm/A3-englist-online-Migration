/* eslint-disable no-undef */

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function attachHoverMenus() {
    document.querySelectorAll('.tbntoggle').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        var id = el.getAttribute('id');
        if (!id) return;
        var parts = id.split('_');
        var menu = document.getElementById('menu' + parts[1]);
        if (menu) menu.style.display = 'block';
      });
      el.addEventListener('mouseleave', function () {
        var id = el.getAttribute('id');
        if (!id) return;
        var parts = id.split('_');
        var menu = document.getElementById('menu' + parts[1]);
        if (menu) menu.style.display = 'none';
      });
    });
  }

  ready(function () {
    var container = document.getElementById('ss-container');
    if (!container) return;

    fetch('/api/1yc/lessons/html', {
      method: 'GET',
      credentials: 'include'
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.status !== 200 || !data.data) {
          container.innerHTML = '<p align="center">Error loading lessons</p>';
          return;
        }

        container.innerHTML = data.data.html;
        attachHoverMenus();

        if (typeof window.initYcTimeline === 'function') {
          window.initYcTimeline();
        }
      })
      .catch(function (err) {
        console.error(err);
        container.innerHTML = '<p align="center">Error loading lessons</p>';
      });
  });
}());
