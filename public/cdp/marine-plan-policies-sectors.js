// Marine plan policies (sector view) — plain JS for the CDP iframe.
// Same data as marine-plan-policies.js, but the nav lists the sectors (topics)
// within each of the four category groups, and each sector page shows every
// policy in that sector. Used only by MLA/2026/10015. Data lives in the shared
// marine-plan-policies.json so both views stay in sync.
//
// Supporting documents: a "Supporting documents" item at the top of the nav
// lists every document the applicant uploaded with the policies it supports.
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

    function renderDocuments() {
      var title = heading('h2', 'mpp__detail-title', 'Supporting documents');
      title.id = 'supporting-documents-title';
      detail.appendChild(title);

      // Named by the heading above it, so screen readers announce the table.
      var table = document.createElement('table');
      table.className = 'mpp__doc-table';
      table.setAttribute('aria-labelledby', title.id);
      var head = table.createTHead().insertRow();
      ['Document', 'Document type', 'Policy', 'Where the information is'].forEach(function (text) {
        var th = document.createElement('th');
        th.scope = 'col';
        th.textContent = text;
        head.appendChild(th);
      });

      // One row per document and policy, so each location lines up with its
      // policy. The document and type cells span that document's rows, and
      // each document gets its own tbody so the divider falls between documents.
      // The document cell is a row-group header, so a screen reader announces
      // the document on every policy row it spans.
      documents.forEach(function (doc) {
        var body = document.createElement('tbody');
        var links = doc.policies || [];
        links.forEach(function (link, i) {
          var tr = body.insertRow();
          if (i === 0) {
            var docCell = document.createElement('th');
            docCell.scope = 'rowgroup';
            docCell.rowSpan = links.length;
            tr.appendChild(docCell);
            docCell.appendChild(docLink(doc.filename));
            var typeCell = tr.insertCell();
            typeCell.rowSpan = links.length;
            typeCell.textContent = doc.type;
          }

          // Opens the policy's sector page, scrolled to that policy.
          var policy = policies[link.code];
          var a = document.createElement('button');
          a.type = 'button';
          a.className = 'mpp__inline-link';
          a.textContent = policy ? policy.label : link.code;
          a.addEventListener('click', function () {
            if (!policy) return;
            select(policy.item, false);
            focusOn(document.getElementById('policy-' + link.code));
          });
          tr.insertCell().appendChild(a);
          tr.insertCell().textContent = link.location;
        });
        table.appendChild(body);
      });

      detail.appendChild(table);
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

  // A download link with the same icon as the other CDP pages. It does nothing
  // in the prototype; in the real system the file would come from CDP.
  function docLink(filename) {
    var a = document.createElement('a');
    a.className = 'doc-link';
    a.href = '#';
    a.addEventListener('click', function (e) {
      e.preventDefault();
    });
    a.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" style="display: block;">' +
      '<line x1="10" y1="2.6" x2="10" y2="12.4" stroke="currentColor" stroke-width="1.2" />' +
      '<polyline points="6,8.6 10,12.6 14,8.6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />' +
      '<line x1="3.6" y1="16.4" x2="16.4" y2="16.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />' +
      '</svg>';
    var span = document.createElement('span');
    span.textContent = filename;
    a.appendChild(span);
    return a;
  }
})();
