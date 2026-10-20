// Marine plan policies (sector view) — plain JS for the CDP iframe.
// Same data as marine-plan-policies.js, but the nav lists the sectors (topics)
// within each of the four category groups, and each sector page shows every
// policy in that sector. Used only by MLA/2026/10015. Data lives in the shared
// marine-plan-policies.json so both views stay in sync.
//
// Supporting documents: a "Supporting documents" item at the top of the nav
// lists every document the applicant uploaded with the policies it supports,
// using the shared supporting-documents.js.
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
    var documents = data.documents || [];
    var items = [];
    // Each policy's label and the nav item for its sector, by policy code.
    var policies = {};

    if (documents.length) {
      var docsGroup = document.createElement('div');
      docsGroup.className = 'mpp__group';
      var docsTitle = document.createElement('div');
      docsTitle.className = 'mpp__group-title';
      docsTitle.textContent = 'Evidence';
      docsGroup.appendChild(docsTitle);
      var docsItem = addItem(docsGroup, 'Supporting documents', renderDocuments);
      nav.appendChild(docsGroup);
    }

    var firstSector;
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
        var item = addItem(group, sector.name, function () {
          renderSector(sector);
        });
        sector.policies.forEach(function (policy) {
          policies[policy.code] = { label: policy.label, item: item };
        });
        if (!firstSector) firstSector = item;
      });

      nav.appendChild(group);
    });

    function addItem(group, text, renderFn) {
      var link = document.createElement('button');
      link.type = 'button';
      link.className = 'mpp__link';
      link.textContent = text;
      var item = { el: link, render: renderFn };
      link.addEventListener('click', function () {
        select(item, true);
      });
      group.appendChild(link);
      items.push(item);
      return item;
    }

    function select(item, moveFocus) {
      items.forEach(function (i) {
        i.el.classList.toggle('mpp__link--active', i === item);
      });
      detail.innerHTML = '';
      item.render();

      if (moveFocus) focusOn(detail.querySelector('.mpp__detail-title'));
    }

    function renderSector(sector) {
      detail.appendChild(heading('h2', 'mpp__detail-title', sector.name));

      sector.policies.forEach(function (policy) {
        var block = document.createElement('div');
        block.className = 'mpp__policy';

        var name = heading('h3', 'mpp__policy-title', policy.label);
        name.id = 'policy-' + policy.code;
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
    }

    // The shared Supporting documents page (supporting-documents.js). A policy
    // name opens its sector page, scrolled to that policy.
    function renderDocuments() {
      var labels = {};
      Object.keys(policies).forEach(function (code) {
        labels[code] = policies[code].label;
      });
      window.renderSupportingDocuments(detail, documents, labels, function (code) {
        if (!policies[code]) return;
        select(policies[code].item, false);
        focusOn(document.getElementById('policy-' + code));
      });
    }

    // Open the first sector by default (no focus/scroll on initial load), or the
    // Supporting documents page when linked to from a policy assessment.
    if (docsItem && window.location.hash === '#supporting-documents') select(docsItem, false);
    else if (firstSector) select(firstSector, false);
  }

  // Focusable so a click moves focus here (announced to screen readers and
  // scrolled into view) rather than leaving the reader stranded mid-page.
  function heading(tag, className, text) {
    var el = document.createElement(tag);
    el.className = className;
    el.textContent = text;
    el.tabIndex = -1;
    return el;
  }

  function focusOn(el) {
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: 'start' });
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
