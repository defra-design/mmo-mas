// Marine plan policies — plain JS for the CDP iframe.
// Builds the grouped policy nav and renders the selected policy's information
// and the applicant's consideration. Data lives in the sibling JSON file so it
// can be regenerated/updated without touching this script.
(function () {
  var nav = document.getElementById('mpp-nav');
  var detail = document.getElementById('mpp-detail');

  fetch('marine-plan-policies.json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(init)
    .catch(function () {
      detail.textContent = 'Unable to load the marine plan policies.';
    });

  function init(data) {
    var items = [];

    (data.categories || []).forEach(function (cat) {
      var group = document.createElement('div');
      group.className = 'mpp__group';

      var title = document.createElement('div');
      title.className = 'mpp__group-title';
      title.textContent = cat.name;
      group.appendChild(title);

      (cat.policies || []).forEach(function (policy) {
        var link = document.createElement('button');
        link.type = 'button';
        link.className = 'mpp__link';
        link.textContent = policy.label;
        link.addEventListener('click', function () {
          select(policy, link, true);
        });
        group.appendChild(link);
        items.push({ policy: policy, el: link });
      });

      nav.appendChild(group);
    });

    function select(policy, el, moveFocus) {
      items.forEach(function (item) {
        item.el.classList.toggle('mpp__link--active', item.el === el);
      });
      render(policy, moveFocus);
    }

    function render(policy, moveFocus) {
      detail.innerHTML = '';

      var heading = document.createElement('h2');
      heading.className = 'mpp__detail-title';
      heading.textContent = policy.label;
      // Focusable so a click moves focus here (announced to screen readers and
      // scrolled into view) rather than leaving the reader stranded mid-page.
      heading.tabIndex = -1;
      detail.appendChild(heading);

      detail.appendChild(subhead('Policy information'));
      detail.appendChild(box([policy.policyInfo]));

      detail.appendChild(subhead("Applicant's consideration"));
      var consideration =
        policy.consideration && policy.consideration.length
          ? policy.consideration
          : ['No consideration provided.'];
      detail.appendChild(box(consideration));

      if (moveFocus) {
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: 'start' });
      }
    }

    // Open the first policy by default (no focus/scroll on initial load).
    if (items.length) select(items[0].policy, items[0].el, false);
  }

  function subhead(text) {
    var p = document.createElement('p');
    p.className = 'mpp__subhead';
    p.textContent = text;
    return p;
  }

  function box(paragraphs) {
    var wrap = document.createElement('div');
    wrap.className = 'mpp__box';
    paragraphs.forEach(function (text) {
      var p = document.createElement('p');
      p.textContent = text;
      wrap.appendChild(p);
    });
    return wrap;
  }
})();
