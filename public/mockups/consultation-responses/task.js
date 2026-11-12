// DESIGN EXPLORATION — the Extend consultation deadline task for MLA/2026/10006.
// The bar switches between two layouts and three scenarios:
//  · fields       – the extension fields sit on the task. Saving writes an
//                   extension record (a Power Automate flow) and clears them.
//  · quick-create – the task holds only the Extensions subgrid. Add extension
//                   opens the OOB quick create form for a Consultation extension.
// Either way a flow moves the case's consultation deadline on when an extension
// is saved. Nothing is kept: switching the bar or reloading starts again.
(function () {
  var CONSULTEES = [
    'Natural England',
    'Environment Agency',
    'Portsmouth Marine Management Organisation Coastal Office',
    'Maritime and Coastguard Agency',
    'Southern Inshore Fisheries and Conservation Authority',
    'Historic England',
    'Havant Borough Council',
    'Royal Yachting Association'
  ];
  // "Today" and the deadline in each scenario.
  var SCENARIOS = {
    due: { today: '2026-11-06', deadline: '2026-11-10', extensions: [] },
    passed: { today: '2026-11-12', deadline: '2026-11-10', extensions: [] },
    extended: {
      today: '2026-11-14',
      deadline: '2026-11-17',
      extensions: [{
        on: '2026-11-12', days: 7, to: '2026-11-17', by: 'Natural England',
        reason: 'Natural England asked by email on 11 November for another week to finish assessing the effect on the Chichester and Langstone Harbours SPA.'
      }]
    }
  };

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

  // The extension fields, on the task (layout 1) or in the quick create (layout 2).
  // New deadline is worked out as soon as Extend by is picked: in D365 that is a
  // small form script, or it appears on save from a calculated column.
  function fieldsHtml() {
    var options = ['7 days', '14 days', '21 days', '28 days'].map(function (o) { return '<option>' + o + '</option>'; }).join('');
    var who = CONSULTEES.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('');
    return '' +
      '<div class="row"><div class="label">Extend by</div><div class="deco"><span class="req" aria-hidden="true">*</span></div><div class="fields"><select class="choice" name="days" aria-label="Extend by"><option value="">---</option>' + options + '</select></div></div>' +
      '<div class="row"><div class="label">New deadline</div><div class="deco">' + LOCK + '</div><div class="fields"><div class="value" data-new-deadline></div></div></div>' +
      '<div class="row"><div class="label">Requested by</div><div class="deco"><span class="req" aria-hidden="true">*</span></div><div class="fields"><select class="choice" name="by" aria-label="Requested by"><option value="">---</option>' + who + '</select></div></div>' +
      '<div class="row"><div class="label">Reason</div><div class="deco"><span class="req" aria-hidden="true">*</span></div><div class="fields"><textarea class="text" name="reason" aria-label="Reason"></textarea></div></div>';
  }

  function scope() { return choice('layout') === 'fields' ? byId('extend-fields') : byId('qc-fields'); }
  function input(name) { return scope().querySelector('[name="' + name + '"]'); }

  function updateNewDeadline() {
    var days = parseInt(input('days').value, 10);
    scope().querySelector('[data-new-deadline]').textContent = days ? show(addDays(state.deadline, days)) : '';
  }

  function render() {
    var layout = choice('layout');
    var scenario = choice('scenario');
    var s = SCENARIOS[scenario];
    state = { today: s.today, deadline: s.deadline, extensions: s.extensions.slice() };
    history.replaceState(null, '', '#' + layout + '/' + scenario);
    Array.prototype.forEach.call(document.querySelectorAll('.back-to-case'), function (a) {
      a.href = 'tab.html?tab=tasks#page/' + scenario;
    });
    byId('passed-note').hidden = scenario !== 'passed';
    byId('extend-card').hidden = layout !== 'fields';
    byId('add').hidden = layout !== 'quick-create';
    byId('extend-fields').innerHTML = layout === 'fields' ? fieldsHtml() : '';
    byId('error').hidden = true;
    closeQuickCreate();
    setSaved(true);
    drawGrid();
  }

  function drawGrid() {
    byId('deadline').textContent = show(state.deadline);
    byId('rows').innerHTML = state.extensions.map(function (e) {
      return '<tr><td>' + show(e.on) + '</td><td>' + e.days + ' days</td><td>' + show(e.to) + '</td><td>' + esc(e.by) + '</td><td title="' + esc(e.reason) + '">' + esc(e.reason) + '</td></tr>';
    }).join('');
    byId('empty').hidden = state.extensions.length > 0;
    byId('count').textContent = 'Rows: ' + state.extensions.length;
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
    var days = parseInt(input('days').value, 10);
    var to = addDays(state.deadline, days);
    state.extensions.unshift({ on: state.today, days: days, to: to, by: input('by').value, reason: input('reason').value.trim() });
    state.deadline = to;
    byId('passed-note').hidden = true;
    drawGrid();
  }

  function save(thenClose) {
    if (choice('layout') === 'fields') {
      var result = check('error', 'error-text', true);
      if (result === 'missing') return false;
      if (result === 'ok') {
        addExtension();
        byId('extend-fields').innerHTML = fieldsHtml();
      }
    }
    setSaved(true);
    if (thenClose) location.href = 'tab.html?tab=tasks#page/' + choice('scenario');
    return true;
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

  document.addEventListener('change', function (e) {
    if (e.target.name === 'days') updateNewDeadline();
  });
  byId('extend-card').addEventListener('input', function () { setSaved(false); });
  byId('save').addEventListener('click', function () { save(false); });
  Array.prototype.forEach.call(document.querySelectorAll('.command.back-to-case.live'), function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); save(true); });
  });
  byId('add').addEventListener('click', openQuickCreate);
  byId('qc-cancel').addEventListener('click', closeQuickCreate);
  byId('qc-scrim').addEventListener('click', closeQuickCreate);
  byId('qc-save').addEventListener('click', function () {
    if (check('qc-error', 'qc-error-text', false) !== 'ok') return;
    addExtension();
    closeQuickCreate();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !byId('qc').hidden) closeQuickCreate();
  });

  // A hash of "layout/scenario" picks the bar's options, e.g. from the case's task list.
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
