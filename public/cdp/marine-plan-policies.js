// Marine plan policies — plain JS for the CDP iframe.
// Builds the grouped policy nav and renders the selected policy's information
// and the applicant's consideration, plus a Supporting documents page listing
// the applicant's documents. Data lives in the sibling JSON file so it can be
// regenerated/updated without touching this script.
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
    // Each policy's nav item and label, by policy code.
    var byCode = {};
    var labels = {};

    // "Evidence" > "Supporting documents" at the top of the nav: every document
    // the applicant uploaded, using the shared supporting-documents.js.
    var docsItem;
    if (documents.length) {
      var docsGroup = addGroup('Evidence');
      docsItem = addItem(docsGroup, 'Supporting documents', function () {
        return window.renderSupportingDocuments(detail, documents, labels, function (code) {
          if (byCode[code]) select(byCode[code], true);
        });
      });
    }

    (data.categories || []).forEach(function (cat) {
      var group = addGroup(cat.name);
      (cat.policies || []).forEach(function (policy) {
        byCode[policy.code] = addItem(group, policy.label, function () {
          return render(policy);
        });
        labels[policy.code] = policy.label;
      });
    });

    function addGroup(name) {
      var group = document.createElement('div');
      group.className = 'mpp__group';
      var title = document.createElement('div');
      title.className = 'mpp__group-title';
      title.textContent = name;
      group.appendChild(title);
      nav.appendChild(group);
      return group;
    }

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

    // Each render returns its heading. Focusable so a click moves focus there
    // (announced to screen readers and scrolled into view) rather than leaving
    // the reader stranded mid-page.
    function select(item, moveFocus) {
      items.forEach(function (i) {
        i.el.classList.toggle('mpp__link--active', i === item);
      });
      detail.innerHTML = '';
      var heading = item.render();

      if (moveFocus) {
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: 'start' });
      }
    }

    function render(policy) {
      var heading = document.createElement('h2');
      heading.className = 'mpp__detail-title';
      heading.textContent = policy.label;
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
      return heading;
    }

    // Open the first policy by default (no focus/scroll on initial load), or the
    // Supporting documents page when linked to from a policy assessment.
    var firstPolicy = items.filter(function (i) {
      return i !== docsItem;
    })[0];
    if (docsItem && window.location.hash === '#supporting-documents') select(docsItem, false);
    else if (firstPolicy) select(firstPolicy, false);
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
