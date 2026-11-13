// DESIGN EXPLORATION — the Extend consultation deadline task for MLA/2026/10006.
// Three scenarios on the bar. The task holds the Extensions subgrid; Add
// extension opens a Consultation extension record full page, as Add consultee
// does on Prepare for consultation. A flow moves the case's consultation
// deadline on when an extension is saved. Nothing is kept: switching the bar
// or reloading starts again.
//
// The Extensions subgrid is configured without a select column, like the Tasks
// subgrid: extensions can't be removed, as each one has already moved the
// deadline. Row and cell hover as every grid; the Extended on link or a
// double-click opens the extension read-only. Reason is cut off with an
// ellipsis, and a tooltip shows it in full only when it is cut off.
//
// Once extended, the dates at the top show the original period and deadline,
// the total extension and the extended deadline. In D365 those are separate
// fields shown and hidden by a business rule, as a label can't change.
(function () {
  // "Today", the deadline before any extension, and the extensions so far.
  var SCENARIOS = {
    due: { today: '2026-11-06', base: '2026-11-10', extensions: [] },
    passed: { today: '2026-11-12', base: '2026-11-10', extensions: [] },
    extended: {
      today: '2026-11-14',
      base: '2026-11-10',
      extensions: [{
        on: '2026-11-12', days: 7,
        reason: 'Natural England asked by email on 11 November for another week to finish assessing the effect on the Chichester and Langstone Harbours SPA.'
      }]
    }
  };
  var COLUMNS = [
    { key: 'on', label: 'Extended on', sort: ['Old to new', 'New to old'] },
    { key: 'days', label: 'Extended by', sort: ['Smaller to larger', 'Larger to smaller'] },
    { key: 'to', label: 'New deadline', sort: ['Old to new', 'New to old'] },
    { key: 'reason', label: 'Reason', sort: ['A to Z', 'Z to A'] }
  ];

  var byId = function (id) { return document.getElementById(id); };
  var bar = byId('scenarios');
  var state;

  function choice(name) { return bar.querySelector('[name="' + name + '"]:checked').value; }

  function parse(iso) { var p = iso.split('-'); return new Date(+p[0], p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function show(isoDate) { var p = isoDate.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
  function addDays(isoDate, days) { var d = parse(isoDate); d.setDate(d.getDate() + days); return iso(d); }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  var LOCK = '<svg class="lock" viewBox="0 0 20 20" aria-label="Read-only" role="img"><path d="M6.5 8V6a3.5 3.5 0 0 1 7 0v2M5 8h10v9H5z" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
  var CHEVRON = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>';

  // A new extension's fields. Current deadline is the case's deadline now: the
  // original one for a first extension, or the latest. New deadline is worked
  // out as soon as Extend by is picked: in D365 that is a small form script, or
  // it appears on save from a calculated column.
  function fieldsHtml() {
    var options = ['7 days', '14 days', '21 days', '28 days'].map(function (o) { return '<option>' + o + '</option>'; }).join('');
    return '' +
      '<div class="row"><div class="label">Current deadline</div><div class="deco">' + LOCK + '</div><div class="fields"><div class="value">' + show(state.deadline) + '</div></div></div>' +
      '<div class="row"><div class="label">Extend by</div><div class="deco"><span class="req" aria-hidden="true">*</span></div><div class="fields"><select class="choice" name="days" aria-label="Extend by"><option value="">---</option>' + options + '</select></div></div>' +
      '<div class="row"><div class="label">New deadline</div><div class="deco">' + LOCK + '</div><div class="fields"><div class="value" data-new-deadline></div></div></div>' +
      '<div class="row"><div class="label">Reason</div><div class="deco"><span class="req" aria-hidden="true">*</span></div><div class="fields"><textarea class="text" name="reason" aria-label="Reason"></textarea></div></div>';
  }

  // A saved extension, opened from the subgrid: read-only, as it is a record of
  // what was agreed and has already moved the deadline.
  function savedFieldsHtml(e) {
    function row(label, value, multiline) {
      return '<div class="row"><div class="label">' + label + '</div><div class="deco">' + LOCK + '</div><div class="fields"><div class="value' + (multiline ? ' multiline' : '') + '">' + value + '</div></div></div>';
    }
    return row('Extended on', show(e.on)) + row('Extend by', e.days + ' days') + row('New deadline', show(e.to)) +
      row('Reason', esc(e.reason), true);
  }

  function input(name) { return byId('rec-fields').querySelector('[name="' + name + '"]'); }

  function updateNewDeadline() {
    var days = parseInt(input('days').value, 10);
    byId('rec-fields').querySelector('[data-new-deadline]').textContent = days ? show(addDays(state.deadline, days)) : '';
  }

  // Each extension's new deadline, and the case's deadline, follow from the
  // deadline before any extension plus the extensions in the order they were made.
  function recalculate() {
    var deadline = state.base;
    state.extensions.slice().sort(function (a, b) { return a.seq - b.seq; }).forEach(function (e) {
      deadline = addDays(deadline, e.days);
      e.to = deadline;
    });
    state.deadline = deadline;
  }

  function render() {
    var scenario = choice('scenario');
    var s = SCENARIOS[scenario];
    state = {
      today: s.today, base: s.base, seq: 0, added: false, sort: { key: 'on', dir: -1 },
      extensions: s.extensions.map(function (e, i) { return Object.assign({ id: 'x' + i, seq: i }, e); })
    };
    state.seq = state.extensions.length;
    recalculate();
    history.replaceState(null, '', location.search + '#' + scenario);
    Array.prototype.forEach.call(document.querySelectorAll('.back-to-case'), function (a) {
      a.href = 'tab.html?tab=tasks#' + scenario;
    });
    // Help text link to the case's Consultation responses tab, in the same scenario.
    byId('responses-link').href = 'tab.html#' + scenario;
    byId('passed-note').hidden = scenario !== 'passed';
    showTask();
    setSaved(true);
    drawGrid();
  }

  function sorted() {
    var key = state.sort.key, dir = state.sort.dir;
    return state.extensions.slice().sort(function (a, b) {
      var x = a[key], y = b[key];
      return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y))) * dir || (b.seq - a.seq);
    });
  }

  function drawGrid() {
    var rows = sorted();
    byId('grid-head').innerHTML = COLUMNS.map(function (c) {
      var arrow = state.sort.key === c.key ? (state.sort.dir === 1 ? ' ↑' : ' ↓') : '';
      return '<th class="col"><button type="button" class="hmenu" data-col="' + c.key + '" aria-haspopup="menu">' + c.label + arrow + CHEVRON + '</button></th>';
    }).join('');
    byId('rows').innerHTML = rows.map(function (e) {
      return '<tr data-id="' + e.id + '">' +
        '<td class="cell" tabindex="0"><button type="button" class="cell-link" data-open="' + e.id + '">' + show(e.on) + '</button></td>' +
        '<td class="cell" tabindex="0">' + e.days + ' days</td>' +
        '<td class="cell" tabindex="0">' + show(e.to) + '</td>' +
        '<td class="cell" tabindex="0" data-tip>' + esc(e.reason) + '</td></tr>';
    }).join('');
    drawDates();
    byId('empty').hidden = rows.length > 0;
    byId('count').textContent = 'Rows: ' + rows.length;
  }

  // The dates at the top. Not extended: period and deadline. Extended: the
  // original period and deadline, the total extension and the extended deadline.
  function drawDates() {
    var extended = state.extensions.length > 0;
    var total = state.extensions.reduce(function (n, e) { return n + e.days; }, 0);
    byId('period-label').textContent = extended ? 'Original consultation period' : 'Consultation period';
    byId('deadline-label').textContent = extended ? 'Original consultation deadline' : 'Consultation deadline';
    byId('deadline').textContent = show(state.base);
    byId('total-row').hidden = !extended;
    byId('extended-row').hidden = !extended;
    byId('total').textContent = total + ' days';
    byId('extended-deadline').textContent = show(state.deadline);
  }

  function setSaved(saved) { byId('save-state').textContent = saved ? '- Saved' : '- Unsaved'; }

  // OOB required field check on the new extension.
  function check() {
    var missing = [['days', 'Extend by'], ['reason', 'Reason']]
      .filter(function (f) { return !input(f[0]).value.trim(); })
      .map(function (f) { return f[1]; });
    byId('rec-error').hidden = missing.length === 0;
    byId('rec-error-text').textContent = missing.length ? 'Required fields must be filled in: ' + missing.join(', ') + '.' : '';
    return missing.length === 0;
  }

  function addExtension() {
    state.extensions.push({
      id: 'x' + state.seq, seq: state.seq, on: state.today,
      days: parseInt(input('days').value, 10), reason: input('reason').value.trim()
    });
    state.seq += 1;
    state.added = true;
    recalculate();
    byId('passed-note').hidden = true;
    drawGrid();
  }

  // Save and close, the only save command, as on every other task. ?extended=1
  // tells the case an extension was added here, so the task's status there reads
  // Extended (the Deadline extended scenario already does).
  function saveAndClose() {
    location.href = 'tab.html?tab=tasks' + (state.added ? '&extended=1' : '') + '#' + choice('scenario');
  }

  // The Consultation extension record's main form, full page: a new one from
  // Add extension, or a saved one from the subgrid.
  var openRecordId = null;
  function openRecord(e) {
    openRecordId = e ? e.id : null;
    byId('rec-title').innerHTML = e ? 'Consultation extension <span>- Saved</span>' : 'Add extension <span>- Unsaved</span>';
    byId('rec-fields').innerHTML = e ? savedFieldsHtml(e) : fieldsHtml();
    byId('rec-error').hidden = true;
    byId('task-view').hidden = true;
    byId('record-view').hidden = false;
    window.scrollTo(0, 0);
  }
  function showTask() {
    byId('record-view').hidden = true;
    byId('rec-fields').innerHTML = '';
    byId('task-view').hidden = false;
  }

  function closeSortMenu() { byId('sort-menu').hidden = true; }
  function openSortMenu(button) {
    var col = COLUMNS.filter(function (c) { return c.key === button.dataset.col; })[0];
    var menu = byId('sort-menu');
    menu.innerHTML = '<button type="button" role="menuitem" data-sort="1">' + col.sort[0] + '</button>' +
      '<button type="button" role="menuitem" data-sort="-1">' + col.sort[1] + '</button>';
    menu.dataset.col = col.key;
    var card = button.closest('.card').getBoundingClientRect();
    var r = button.getBoundingClientRect();
    menu.style.left = (r.left - card.left) + 'px';
    menu.style.top = (r.bottom - card.top + 4) + 'px';
    menu.hidden = false;
  }

  var grid = byId('rows').closest('.card');
  grid.addEventListener('click', function (ev) {
    var t = ev.target;
    var sortItem = t.closest('[data-sort]');
    if (sortItem) {
      state.sort = { key: byId('sort-menu').dataset.col, dir: +sortItem.dataset.sort };
      closeSortMenu();
      return drawGrid();
    }
    var head = t.closest('.hmenu');
    if (head) return byId('sort-menu').hidden || byId('sort-menu').dataset.col !== head.dataset.col ? openSortMenu(head) : closeSortMenu();
    closeSortMenu();
    var link = t.closest('[data-open]');
    if (link) openRecord(state.extensions.filter(function (e) { return e.id === link.dataset.open; })[0]);
  });
  // Double-clicking a row opens its own record.
  byId('rows').addEventListener('dblclick', function (ev) {
    if (ev.target.closest('button')) return;
    var row = ev.target.closest('tr[data-id]');
    if (row) openRecord(state.extensions.filter(function (e) { return e.id === row.dataset.id; })[0]);
  });

  // Reason: a tooltip below the cell, after 300ms, only when it is cut off
  // (as TruncatedCell.tsx). Not the native title, which would always show.
  var tip = byId('tip'), tipTimer;
  byId('rows').addEventListener('mouseover', function (ev) {
    var cell = ev.target.closest('[data-tip]');
    if (!cell || cell.scrollWidth <= cell.clientWidth) return;
    clearTimeout(tipTimer);
    tipTimer = setTimeout(function () {
      tip.textContent = cell.textContent;
      var r = cell.getBoundingClientRect();
      tip.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 368)) + 'px';
      tip.style.top = (r.bottom + window.scrollY + 4) + 'px';
      tip.hidden = false;
    }, 300);
  });
  byId('rows').addEventListener('mouseout', function (ev) {
    if (ev.target.closest('[data-tip]')) { clearTimeout(tipTimer); tip.hidden = true; }
  });

  document.addEventListener('change', function (e) {
    if (e.target.name === 'days') updateNewDeadline();
  });
  Array.prototype.forEach.call(document.querySelectorAll('.command.back-to-case.live'), function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); saveAndClose(); });
  });
  byId('add').addEventListener('click', function () { openRecord(null); });
  byId('rec-back').addEventListener('click', showTask);
  byId('rec-save').addEventListener('click', function () {
    if (openRecordId === null) {
      if (!check()) return;
      addExtension();
    }
    showTask();
    window.scrollTo(0, 0);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeSortMenu();
  });

  // A hash naming a scenario (e.g. "nav/due" from the case) picks it on the bar.
  function fromHash() {
    location.hash.slice(1).split('/').forEach(function (v) {
      var radio = bar.querySelector('input[value="' + v + '"]');
      if (radio) radio.checked = true;
    });
    render();
  }
  bar.addEventListener('change', render);
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
