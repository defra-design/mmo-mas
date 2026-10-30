// Stand-in for the OOB business rules on the task form: each choice reveals the
// fields that depend on it, and any change marks the record Unsaved.
(function () {
  var reveal = {
    // Agreeing in full needs only the rationale; partial or refused also needs
    // the wording the applicant will receive.
    agree: function (key, v) {
      show(key + '-agree-rationale', v !== '');
      show(key + '-agree-applicant', v === 'Agree - but only withhold some of it' || v === 'Disagree');
    },
    personal: function (v) { show('personal-yes', v === 'Yes'); }
  };
  function show(id, on) { var el = document.getElementById(id); if (el) el.hidden = !on; }
  document.addEventListener('change', function (e) {
    var name = e.target.name || '';
    if (name === 'personal') reveal.personal(e.target.value);
    else if (/-agree$/.test(name)) reveal.agree(name.replace(/-agree$/, ''), e.target.value);
    document.getElementById('save-state').textContent = '- Unsaved';
  });
  document.addEventListener('input', function () {
    document.getElementById('save-state').textContent = '- Unsaved';
  });
})();
