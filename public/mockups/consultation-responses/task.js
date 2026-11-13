// DESIGN EXPLORATION — the Extend consultation deadline task for MLA/2026/10006.
// Three versions, each its own page (?layout=), and three scenarios on the bar:
//  · page         – the task holds only the Extensions subgrid. Add extension
//                   opens a Consultation extension record full page, as Add
//                   consultee does on Prepare for consultation.
//  · quick-create – as page, but Add extension opens the OOB quick create side panel.
//  · fields       – the extension fields sit on the task. Saving writes an
//                   extension record (a Power Automate flow) and clears them.
// Every way a flow moves the case's consultation deadline on when an extension
// is saved. Nothing is kept: switching the bar or reloading starts again.
//
// The Extensions subgrid behaves as the Consultees subgrid (ConsulteeGrid.tsx):
// select column, row and cell hover, click a row to select it, the header box
// to select all, Remove with a confirmation, Rows/Selected in the footer.
// Requested by is a lookup to another table, so its link opens the Organisation
// and the row's own record opens from a double-click or the Navigate icon.
(function () {
  // Name on the extension, and the Organisation (Account) record it looks up.
  var CONSULTEES = [
    ['Natural England', 'natural-england-ne'],
    ['Environment Agency', 'environment-agency-ea'],
    ['Portsmouth Marine Management Organisation Coastal Office', 'portsmouth-marine-management-organisation-mmo-coastal-office'],
    ['Maritime and Coastguard Agency', 'maritime-and-coastguard-agency-mca'],
    ['Southern Inshore Fisheries and Conservation Authority', 'southern-inshore-fisheries-and-conservation-authority-ifca'],
    ['Historic England', 'historic-england-he'],
    ['Havant Borough Council', 'havant-borough-council'],
    ['Royal Yachting Association', 'royal-yachting-association-rya']
  ];
  // "Today", the deadline before any extension, and the extensions so far.
  var SCENARIOS = {
    due: { today: '2026-11-06', base: '2026-11-10', extensions: [] },
    passed: { today: '2026-11-12', base: '2026-11-10', extensions: [] },
    extended: {
      today: '2026-11-14',
      base: '2026-11-10',
      extensions: [{
        on: '2026-11-12', days: 7, by: 'Natural England',
        reason: 'Natural England asked by email on 11 November for another week to finish assessing the effect on the Chichester and Langstone Harbours SPA.'
      }]
    }
  };
  var COLUMNS = [
    { key: 'on', label: 'Extended on', sort: ['Old to new', 'New to old'] },
    { key: 'days', label: 'Extended by', sort: ['Smaller to larger', 'Larger to smaller'] },
    { key: 'to', label: 'New deadline', sort: ['Old to new', 'New to old'] },
    { key: 'by', label: 'Requested by', sort: ['A to Z', 'Z to A'] }
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
  var TICK = '<span class="box"><svg viewBox="0 0 12 12"><path d="M2.5 6.2 5 8.5l4.5-5"/></svg></span>';
  var PART = '<span class="box"><svg viewBox="0 0 12 12"><path d="M3 6h6"/></svg></span>';
  var CHEVRON = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>';
  var OPEN = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9 2.5h4.5V7m0-4.5L7.5 8.5M7 3H2.5v10.5H13V9"/></svg>';

  // The extension fields: on the task, in the quick create, or on the record.
  // New deadline is worked out as soon as Extend by is picked: in D365 that is a
  // small form script, or it appears on save from a calculated column.
  function fieldsHtml() {
    var options = ['7 days', '14 days', '21 days', '28 days'].map(function (o) { return '<option>' + o + '</option>'; }).join('');
    var who = CONSULTEES.map(function (o) { return '<option>' + esc(o[0]) + '</option>'; }).join('');
    return '' +
      '<div class="row"><div class="label">Extend by</div><div class="deco"><span class="req" aria-hidden="true">*</span></div><div class="fields"><select class="choice" name="days" aria-label="Extend by"><option value="">---</option>' + options + '</select></div></div>' +
      '<div class="row"><div class="label">New deadline</div><div class="deco">' + LOCK + '</div><div class="fields"><div class="value" data-new-deadline></div></div></div>' +
      '<div class="row"><div class="label">Requested by</div><div class="deco"><span class="req" aria-hidden="true">*</span></div><div class="fields"><select class="choice" name="by" aria-label="Requested by"><option value="">---</option>' + who + '</select></div></div>' +
      '<div class="row"><div class="label">Reason</div><div class="deco"><span class="req" aria-hidden="true">*</span></div><div class="fields"><textarea class="text" name="reason" aria-label="Reason"></textarea></div></div>';
  }

  // A saved extension, opened from the subgrid: read-only, as it is a record of
  // what was agreed and has already moved the deadline.
  function savedFieldsHtml(e) {
    function row(label, value, multiline) {
      return '<div class="row"><div class="label">' + label + '</div><div class="deco">' + LOCK + '</div><div class="fields"><div class="value' + (multiline ? ' multiline' : '') + '">' + value + '</div></div></div>';
    }
    return row('Extended on', show(e.on)) + row('Extend by', e.days + ' days') + row('New deadline', show(e.to)) +
      row('Requested by', '<button type="button" class="cell-link" data-org="' + esc(e.by) + '">' + esc(e.by) + '</button>') +
      row('Reason', esc(e.reason), true);
  }

  // Each version of the task is its own page: ?layout=page or quick-create, or the
  // fields on the task by default.
  var LAYOUT = ['page', 'quick-create'].indexOf(new URLSearchParams(location.search).get('layout')) > -1
    ? new URLSearchParams(location.search).get('layout') : 'fields';
  var CASE_URL = 'tab.html?tab=tasks&task=' + LAYOUT + '#page/';

  function scope() {
    return byId({ fields: 'extend-fields', 'quick-create': 'qc-fields', page: 'rec-fields' }[LAYOUT]);
  }
  function input(name) { return scope().querySelector('[name="' + name + '"]'); }

  function updateNewDeadline() {
    var days = parseInt(input('days').value, 10);
    scope().querySelector('[data-new-deadline]').textContent = days ? show(addDays(state.deadline, days)) : '';
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
    var layout = LAYOUT;
    var scenario = choice('scenario');
    var s = SCENARIOS[scenario];
    state = {
      today: s.today, base: s.base, seq: 0, selected: [], sort: { key: 'on', dir: -1 },
      extensions: s.extensions.map(function (e, i) { return Object.assign({ id: 'x' + i, seq: i }, e); })
    };
    state.seq = state.extensions.length;
    recalculate();
    history.replaceState(null, '', location.search + '#' + scenario);
    Array.prototype.forEach.call(document.querySelectorAll('.back-to-case'), function (a) {
      a.href = CASE_URL + scenario;
    });
    // Help text link to the case's Consultation responses tab, in the same scenario.
    byId('responses-link').href = 'tab.html?task=' + LAYOUT + '#page/' + scenario;
    byId('passed-note').hidden = scenario !== 'passed';
    byId('extend-card').hidden = layout !== 'fields';
    byId('extend-fields').innerHTML = layout === 'fields' ? fieldsHtml() : '';
    byId('error').hidden = true;
    closeQuickCreate();
    closeDialog();
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

  function checkbox(attrs, checked, label) {
    return '<button type="button" class="gcheck" role="checkbox" aria-checked="' + checked + '" aria-label="' + esc(label) + '" ' + attrs + '>' +
      (checked === 'mixed' ? PART : TICK) + '</button>';
  }

  function drawGrid() {
    var rows = sorted();
    var picked = state.selected;
    var all = rows.length > 0 && rows.every(function (e) { return picked.indexOf(e.id) > -1; });
    byId('grid-head').innerHTML =
      '<th>' + checkbox('data-all' + (rows.length ? '' : ' disabled'), all ? 'true' : picked.length ? 'mixed' : 'false', 'Select all') + '</th>' +
      COLUMNS.map(function (c) {
        var arrow = state.sort.key === c.key ? (state.sort.dir === 1 ? ' ↑' : ' ↓') : '';
        return '<th class="col"><button type="button" class="hmenu" data-col="' + c.key + '" aria-haspopup="menu">' + c.label + arrow + CHEVRON + '</button></th>';
      }).join('') +
      '<th><button type="button" class="navigate" title="Navigate" aria-label="Navigate">' + OPEN + '</button></th>';
    byId('rows').innerHTML = rows.map(function (e) {
      var on = picked.indexOf(e.id) > -1;
      return '<tr data-id="' + e.id + '"' + (on ? ' class="selected"' : '') + '>' +
        '<td>' + checkbox('data-check="' + e.id + '"', on ? 'true' : 'false', 'Select extension of ' + show(e.on)) + '</td>' +
        '<td class="cell" tabindex="0">' + show(e.on) + '</td>' +
        '<td class="cell" tabindex="0">' + e.days + ' days</td>' +
        '<td class="cell" tabindex="0">' + show(e.to) + '</td>' +
        '<td class="cell" tabindex="0"><button type="button" class="cell-link" data-org="' + esc(e.by) + '" title="' + esc(e.by) + '">' + esc(e.by) + '</button></td>' +
        '<td><button type="button" class="navigate" data-open="' + e.id + '" title="Navigate" aria-label="Open extension">' + OPEN + '</button></td></tr>';
    }).join('');
    byId('deadline').textContent = show(state.deadline);
    byId('empty').hidden = rows.length > 0;
    byId('count').textContent = 'Rows: ' + rows.length;
    byId('selected-count').hidden = picked.length === 0;
    byId('selected-count').textContent = 'Selected: ' + picked.length;
    // Subgrid command bar: the create command with nothing selected, Remove with
    // rows selected. Edit is hidden, as on Consultees. With the fields on the
    // task there is no create command, as the fields are how an extension is added.
    byId('add').hidden = LAYOUT === 'fields' || picked.length > 0;
    byId('remove').hidden = picked.length === 0;
  }

  function setSaved(saved) { byId('save-state').textContent = saved ? '- Saved' : '- Unsaved'; }

  // OOB required field check. On the task the fields are only required once one
  // of them is filled in (a business rule), so the task can be opened and closed
  // without extending.
  function check(errorId, textId, allowEmpty) {
    var missing = [['days', 'Extend by'], ['by', 'Requested by'], ['reason', 'Reason']]
      .filter(function (f) { return !input(f[0]).value.trim(); })
      .map(function (f) { return f[1]; });
    if (allowEmpty && missing.length === 3) return 'empty';
    byId(errorId).hidden = missing.length === 0;
    byId(textId).textContent = missing.length ? 'Required fields must be filled in: ' + missing.join(', ') + '.' : '';
    return missing.length ? 'missing' : 'ok';
  }

  function addExtension() {
    state.extensions.push({
      id: 'x' + state.seq, seq: state.seq, on: state.today,
      days: parseInt(input('days').value, 10), by: input('by').value, reason: input('reason').value.trim()
    });
    state.seq += 1;
    recalculate();
    byId('passed-note').hidden = true;
    drawGrid();
  }

  // Save and close, the only save command, as on every other task. With the
  // fields on the task it adds the extension (if one is filled in) and returns.
  function saveAndClose() {
    if (LAYOUT === 'fields' && check('error', 'error-text', true) === 'missing') return;
    location.href = CASE_URL + choice('scenario');
  }

  function openQuickCreate() {
    byId('qc-fields').innerHTML = fieldsHtml();
    byId('qc-error').hidden = true;
    byId('qc').hidden = false;
    byId('qc-scrim').hidden = false;
    input('days').focus();
  }
  function closeQuickCreate() {
    byId('qc').hidden = true;
    byId('qc-scrim').hidden = true;
    byId('qc-fields').innerHTML = '';
  }

  // The Consultation extension record's main form, full page: a new one from
  // Add extension (page version), or a saved one from the subgrid (every version).
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

  function openOrganisation(name) {
    var match = CONSULTEES.filter(function (o) { return o[0] === name; })[0];
    if (match) location.href = '../../receive-assess/cases/MLA%2F2026%2F10006/organisations/' + match[1];
  }

  function openDialog() {
    var n = state.selected.length;
    byId('dialog-title').textContent = n > 1 ? 'Remove ' + n + ' extensions' : 'Remove extension';
    byId('dialog-text').textContent = 'Do you want to remove ' + (n > 1 ? 'these ' + n + ' extensions' : 'this extension') +
      '? The consultation deadline will move back. You cannot undo this.';
    byId('dialog').hidden = false;
    byId('dialog-scrim').hidden = false;
    byId('dialog-cancel').focus();
  }
  function closeDialog() {
    byId('dialog').hidden = true;
    byId('dialog-scrim').hidden = true;
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
    if (t.closest('[data-all]')) {
      var ids = state.extensions.map(function (e) { return e.id; });
      state.selected = state.selected.length === ids.length ? [] : ids;
      return drawGrid();
    }
    var box = t.closest('[data-check]');
    if (box) {
      var id = box.dataset.check;
      state.selected = state.selected.indexOf(id) > -1
        ? state.selected.filter(function (x) { return x !== id; }) : state.selected.concat(id);
      return drawGrid();
    }
    var org = t.closest('[data-org]');
    if (org) return openOrganisation(org.dataset.org);
    var nav = t.closest('[data-open]');
    if (nav) return openRecord(state.extensions.filter(function (e) { return e.id === nav.dataset.open; })[0]);
    // Clicking a row, away from its controls, selects just that row.
    var row = t.closest('tbody tr[data-id]');
    if (row) {
      var cell = t.closest('td.cell');
      state.selected = [row.dataset.id];
      drawGrid();
      // Keep the clicked cell's dark border after the redraw.
      if (cell) byId('rows').querySelector('tr[data-id="' + row.dataset.id + '"]').children[cell.cellIndex].focus();
    }
  });
  // Double-clicking a row opens its own record.
  byId('rows').addEventListener('dblclick', function (ev) {
    if (ev.target.closest('button')) return;
    var row = ev.target.closest('tr[data-id]');
    if (row) openRecord(state.extensions.filter(function (e) { return e.id === row.dataset.id; })[0]);
  });
  byId('record-view').addEventListener('click', function (ev) {
    var org = ev.target.closest('[data-org]');
    if (org) openOrganisation(org.dataset.org);
  });

  document.addEventListener('change', function (e) {
    if (e.target.name === 'days') updateNewDeadline();
  });
  byId('extend-card').addEventListener('input', function () { setSaved(false); });
  Array.prototype.forEach.call(document.querySelectorAll('.command.back-to-case.live'), function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); saveAndClose(); });
  });
  byId('add').addEventListener('click', function () { if (LAYOUT === 'page') openRecord(null); else openQuickCreate(); });
  byId('remove').addEventListener('click', openDialog);
  byId('dialog-cancel').addEventListener('click', closeDialog);
  byId('dialog-scrim').addEventListener('click', closeDialog);
  byId('dialog-remove').addEventListener('click', function () {
    state.extensions = state.extensions.filter(function (e) { return state.selected.indexOf(e.id) === -1; });
    state.selected = [];
    recalculate();
    closeDialog();
    drawGrid();
  });
  byId('rec-back').addEventListener('click', showTask);
  byId('rec-save').addEventListener('click', function () {
    if (openRecordId === null) {
      if (check('rec-error', 'rec-error-text', false) !== 'ok') return;
      addExtension();
    }
    showTask();
    window.scrollTo(0, 0);
  });
  byId('qc-cancel').addEventListener('click', closeQuickCreate);
  byId('qc-scrim').addEventListener('click', closeQuickCreate);
  byId('qc-save').addEventListener('click', function () {
    if (check('qc-error', 'qc-error-text', false) !== 'ok') return;
    addExtension();
    closeQuickCreate();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!byId('qc').hidden) closeQuickCreate();
    if (!byId('dialog').hidden) closeDialog();
    closeSortMenu();
  });

  // A hash naming a scenario (e.g. "page/due" from the case) picks it on the bar.
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
