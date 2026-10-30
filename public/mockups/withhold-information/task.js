// The single interactive Withholding information mockup. The scenario bar stands in
// for the applicant's answers. Every show/hide below it is an OOB business rule on a
// choice or on the applicant's own answer, and Save and close is the OOB required
// field check.
(function () {
  var SCENARIOS = {
    none: { commercial: false, security: null },
    commercial: { commercial: true, security: null },
    security: { commercial: false, security: 'Yes' },
    'security-none': { commercial: false, security: 'No' }
  };
  var byId = function (id) { return document.getElementById(id); };
  var saveState = byId('save-state');
  var error = byId('error');
  var form = document.querySelector('main');

  function show(id, on) { byId(id).hidden = !on; }
  function value(name) { return document.querySelector('[name="' + name + '"]').value; }

  // Which fields apply, given the applicant's answers and the choices made so far.
  function applyRules() {
    var a = SCENARIOS[document.querySelector('[name="scenario"]:checked').value];
    var commercial = value('commercial-agree');
    show('commercial-rationale', commercial !== '');
    show('commercial-applicant', commercial === 'Agree - but only withhold some of it' || commercial === 'Disagree');

    var approved = a.security === 'Yes';
    var evidence = approved ? value('security-evidence') : '';
    var covers = evidence === 'Yes' ? value('security-agree') : '';
    show('approved', approved);
    show('no-approval', a.security === 'No');
    show('security-chase', evidence === 'No');
    show('security-covers', evidence === 'Yes');
    show('security-rationale', covers !== '');
    show('security-applicant', covers === 'Yes - but only some of it' || covers === 'No');

    show('personal-yes', value('personal') === 'Yes');
    // Waiting on evidence: the task stays in progress until it arrives.
    show('complete', evidence !== 'No');
  }

  function isVisible(el) { return el.offsetParent !== null; }

  function setSaved(saved) { saveState.textContent = saved ? '- Saved' : '- Unsaved'; }

  function clearErrors() {
    error.hidden = true;
    form.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });
  }

  // Switching scenario starts the form again, as it is a different application.
  function applyScenario() {
    var key = document.querySelector('[name="scenario"]:checked').value;
    var a = SCENARIOS[key];
    form.querySelectorAll('select, textarea').forEach(function (el) { el.value = ''; });
    form.querySelector('.check').checked = false;
    form.querySelectorAll('details').forEach(function (el) { el.open = false; });
    clearErrors();
    setSaved(true);

    var asked = a.commercial || a.security !== null;
    byId('asked').textContent = asked ? 'Yes' : 'No';
    byId('reasons').textContent = a.commercial ? 'Commercial or industrial confidentiality' : 'National security';
    show('reasons-row', asked);
    show('commercial', a.commercial);
    show('security', a.security !== null);
    byId('approval').textContent = a.security || '';
    applyRules();
    history.replaceState(null, '', '#' + key);
  }

  function save() {
    clearErrors();
    var missing = [];
    form.querySelectorAll('[data-required]').forEach(function (el) {
      if (!isVisible(el) || el.value.trim()) return;
      var name = el.getAttribute('data-required');
      if (missing.indexOf(name) === -1) missing.push(name);
      var message = document.createElement('div');
      message.className = 'field-error';
      message.textContent = name + ': Required fields must be filled in.';
      el.parentNode.appendChild(message);
    });
    if (missing.length) {
      byId('error-text').textContent = missing.join(', ') + ' : Required fields must be filled in.';
      error.hidden = false;
      window.scrollTo(0, 0);
      return;
    }
    setSaved(true);
  }

  form.addEventListener('change', function (e) {
    applyRules();
    setSaved(false);
    var message = e.target.parentNode.querySelector('.field-error');
    if (message && e.target.value) message.remove();
  });
  form.addEventListener('input', function () { setSaved(false); });
  byId('save').addEventListener('click', save);
  byId('scenarios').addEventListener('change', applyScenario);

  var fromUrl = document.querySelector('[name="scenario"][value="' + location.hash.slice(1) + '"]');
  if (fromUrl) fromUrl.checked = true;
  applyScenario();
})();
