// Other permissions — reuses the MPP nav/detail pattern. The four permission
// panes are pre-rendered in the HTML; this just toggles which is shown and,
// on click, moves focus to its heading (announced + scrolled into view).
(function () {
  var nav = document.querySelector('.mpp__nav');
  if (!nav) return;
  var links = Array.prototype.slice.call(nav.querySelectorAll('.mpp__link'));

  function select(link, moveFocus) {
    links.forEach(function (l) {
      var pane = document.getElementById(l.dataset.target);
      var active = l === link;
      l.classList.toggle('mpp__link--active', active);
      if (pane) pane.hidden = !active;
    });

    if (moveFocus) {
      var current = document.getElementById(link.dataset.target);
      var heading = current && current.querySelector('.mpp__detail-title');
      if (heading) {
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: 'start' });
      }
    }
  }

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      select(link, true);
    });
  });

  // Open the first permission by default (no focus/scroll on initial load).
  if (links.length) select(links[0], false);
})();
