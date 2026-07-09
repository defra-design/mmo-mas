// Marine plan policies (sector view) — plain JS for the CDP iframe.
// Same data as marine-plan-policies.js, but the nav lists the sectors (topics)
// within each of the four category groups, and each sector page shows every
// policy in that sector. Used only by MLA/2026/10015. Data lives in the shared
// marine-plan-policies.json so both views stay in sync.
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

      // Group this category's policies into sectors (topics), keeping the order
      // in which each sector first appears.
      var sectors = [];
      var byTopic = {};
      (cat.policies || []).forEach(function (policy) {
        var key = policy.topic;
        if (!byTopic[key]) {
          byTopic[key] = { name: key, policies: [] };
          sectors.push(byTopic[key]);
        }
        byTopic[key].policies.push(policy);
      });

      sectors.forEach(function (sector) {
        var link = document.createElement('button');
        link.type = 'button';
        link.className = 'mpp__link';
        link.textContent = sector.name;
        link.addEventListener('click', function () {
          select(sector, link, true);
        });
        group.appendChild(link);
        items.push({ sector: sector, el: link });
      });

      nav.appendChild(group);
    });

    function select(sector, el, moveFocus) {
      items.forEach(function (item) {
        item.el.classList.toggle('mpp__link--active', item.el === el);
      });
      render(sector, moveFocus);
    }

    function render(sector, moveFocus) {
      detail.innerHTML = '';

      var heading = document.createElement('h2');
      heading.className = 'mpp__detail-title';
      heading.textContent = sector.name;
      // Focusable so a click moves focus here (announced to screen readers and
      // scrolled into view) rather than leaving the reader stranded mid-page.
      heading.tabIndex = -1;
      detail.appendChild(heading);

      sector.policies.forEach(function (policy) {
        var block = document.createElement('div');
        block.className = 'mpp__policy';

        var name = document.createElement('h3');
        name.className = 'mpp__policy-title';
        name.textContent = policyName(policy);
        block.appendChild(name);

        block.appendChild(subhead('Policy information'));
        block.appendChild(box([policy.policyInfo]));

        block.appendChild(subhead("Applicant's consideration"));
        var consideration =
          policy.consideration && policy.consideration.length
            ? policy.consideration
            : ['No consideration provided.'];
        block.appendChild(box(consideration));

        detail.appendChild(block);
      });

      if (moveFocus) {
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: 'start' });
      }
    }

    // Open the first sector by default (no focus/scroll on initial load).
    if (items.length) select(items[0].sector, items[0].el, false);
  }

  // "South West Climate change (SW-CC-1)" -> "South West Climate change 1 (SW-CC-1)":
  // the trailing number from the code is shown before the code in brackets.
  function policyName(policy) {
    var num = (policy.code.match(/(\d+)\s*$/) || [])[1];
    if (!num) return policy.label;
    return policy.label.replace(/\s*\(/, ' ' + num + ' (');
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
