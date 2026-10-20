// Supporting documents page — plain JS for the Marine plan policies CDP iframes.
// Shared by marine-plan-policies.js (one page per policy) and
// marine-plan-policies-sectors.js (one page per sector, MLA/2026/10015), which
// each add an "Evidence" > "Supporting documents" item to their nav and call
// renderSupportingDocuments to fill the detail pane.
//
// container    – element to render into (the emptied detail pane)
// documents    – data.documents from marine-plan-policies.json
// labels       – policy label by policy code, e.g. { 'SW-BIO-1': 'South West … (SW-BIO-1)' }
// openPolicy   – called with a policy code when its name in the table is clicked
// Returns the page heading, so the caller can move focus to it.
window.renderSupportingDocuments = function (container, documents, labels, openPolicy) {
  var title = document.createElement('h2');
  title.className = 'mpp__detail-title';
  title.id = 'supporting-documents-title';
  title.textContent = 'Supporting documents';
  // Focusable so a click moves focus here, as with the other detail headings.
  title.tabIndex = -1;
  container.appendChild(title);

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

      var a = document.createElement('button');
      a.type = 'button';
      a.className = 'mpp__inline-link';
      a.textContent = labels[link.code] || link.code;
      a.addEventListener('click', function () {
        openPolicy(link.code);
      });
      tr.insertCell().appendChild(a);
      tr.insertCell().textContent = link.location;
    });
    table.appendChild(body);
  });

  // Where the iframe is narrow (a case with the Tasks panel beside it), the
  // table scrolls sideways on its own rather than the whole page. Focusable
  // and named so keyboard users can scroll it too.
  var wrap = document.createElement('div');
  wrap.className = 'mpp__doc-table-wrap';
  wrap.tabIndex = 0;
  wrap.setAttribute('role', 'region');
  wrap.setAttribute('aria-labelledby', title.id);
  wrap.appendChild(table);
  container.appendChild(wrap);
  return title;

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
};
