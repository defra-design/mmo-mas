// The Consultation responses tab for MLA/2026/10006, Hayling Island groyne
// repairs: the consultees' responses and the public's comments as they arrive
// from CDP, read-only. The application is from the GOV.UK prototype; the
// consultees, responses and comments are made up for it.
//
// The case passes in when the consultation started and its consultee closing
// date on the hash (#started=YYYY-MM-DD&closing=YYYY-MM-DD), as the closing date
// moves when the caseworker extends it. The case works its dates out from
// today, so it is always mid-consultation: started 11 days ago, closing in 3.
// Responses and comments are dated in days after the start, and only show once
// that day has come. A consultee who hasn't responded is Overdue once the
// closing date has passed, and Awaiting response until then.
// The design exploration this came from, with its other layout and scenarios,
// is public/mockups/consultation-responses.
(function () {
  // Consultees have 14 days to respond, as in consultation v2. The site notice
  // stays up for 21 days (LCML v4 site notice page), and public comments close
  // 21 days after it goes up, as on public register v1. The notice is taken as
  // going up the day the consultation starts.
  var PERIOD_DAYS = 14;
  var COMMENTS_DAYS = 21;
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

  // day: the response came in this many days after the consultation started.
  // No day: not responded yet. status: a fixed status (No response needed).
  var CONSULTEES = [
    {
      id: 'ne',
      name: 'Natural England',
      type: 'Request for advice',
      asked: 'We would like your advice on whether the repairs are likely to have a significant effect on the Chichester and Langstone Harbours Special Protection Area. Tell us about any timing restrictions you would recommend to protect overwintering brent geese.',
    },
    {
      id: 'ea',
      name: 'Environment Agency',
      type: 'Request for advice',
      asked: 'We would like your advice on whether the works comply with the Water Framework Directive, based on the applicant’s WFD assessment.',
      day: 8,
      by: 'Priya Shah',
      response: [
        'Thank you for consulting the Environment Agency. We have reviewed the application and the Water Framework Directive assessment (hayling-groynes-wfd-assessment.pdf) and have no objection to the proposal.',
        'The works are like for like repairs within the footprint of the existing groynes, and the rock armour at groyne 19 is small in scale. We agree with the conclusion of the WFD assessment that the works will not cause deterioration of the Solent coastal water body or stop it reaching good status. We recommend that: • plant is refuelled away from the beach and spill kits are kept on site, as set out in the application • any timber or debris removed is taken off the beach on the same tide.',
        'The groynes are part of the Hayling Island coastal defence scheme. Please make sure Coastal Partners know the final working dates.'
      ],
      // A file the consultee uploaded with their response.
      document: 'EA-WFD-review-hayling-groynes.pdf'
    },
    {
      id: 'mmo',
      name: 'Portsmouth Marine Management Organisation Coastal Office',
      type: 'Request for advice',
      asked: 'Please tell us about fishing and other uses of the sea in the area, any seasonal restrictions you would recommend, and which MMO office should be the local office for the licence.',
      day: 7,
      by: 'Chris Dunn',
      response: [
        'The beach between groynes 14 and 19 is used for bait digging for lugworm and ragworm at low water, mainly in winter, and for recreational angling from the beach. There is no commercial fishing from this part of the beach, but small potting boats from Langstone Harbour work the inshore grounds offshore of the groynes. We do not expect the April to June working window to cause problems for local fisheries.',
        'We are not aware of other projects on this stretch of the frontage. Coastal Partners are planning beach recycling on the eastern seafront in 2027, which should be considered for in-combination effects.',
        'We recommend the licence includes a condition that the works are carried out between April and June only. The local office for this licence should be the Portsmouth Coastal Office.'
      ]
    },
    {
      id: 'mca',
      name: 'Maritime and Coastguard Agency',
      type: 'Request for advice',
      asked: 'Tell us whether the rock armour at groyne 19 is likely to be a risk to navigation, and any measures you would recommend.',
      day: 3,
      by: 'Alex Byrne',
      response: [
        'The MCA has no objection. The works are on the beach and carried out at low water, so we do not expect them to affect navigation.',
        'The rock armour at the seaward end of groyne 19 will extend up to 6 metres beyond the existing groyne and may be covered at high water. We recommend that the licence holder: • tells the UK Hydrographic Office about the extended structure so that charts can be updated • issues a local notice to mariners through Langstone Harbour Board before the rock is placed • keeps the end of groyne 19 marked as it is now.'
      ]
    },
    {
      id: 'ifca',
      name: 'Southern Inshore Fisheries and Conservation Authority',
      type: 'Request for advice',
      asked: 'We would like your advice on any effect on fishing and bait digging in the area, and any byelaws that apply.',
      day: 17,
      by: 'Sarah Mills',
      response: [
        'Apologies for the late response. The works area is within the Southern IFCA district. The Solent bait digging code of conduct applies to the intertidal area off groynes 14 to 19, which is popular with bait diggers in winter and spring.',
        'We ask that the fenced working areas leave room for bait diggers to reach the lower shore between groynes, and that the rock armour at groyne 19 is not placed on any mussel bed. We have no objection to the proposal.'
      ]
    },
    {
      id: 'he',
      name: 'Historic England',
      type: 'Request for advice',
      asked: 'Tell us whether there are any heritage assets in the works area, and any measures you would recommend.',
      day: 12,
      by: 'Helen Price',
      response: [
        'There are no designated heritage assets in the works area, and the National Record of the Historic Environment shows no recorded wrecks or finds on this part of the beach. The timber groynes date from the 1950s and are not of heritage interest.',
        'We are content with the applicant’s proposal to stop work and report any finds under The Crown Estate’s protocol for archaeological discoveries, and recommend this is a condition of the licence.'
      ]
    },
    {
      id: 'havant',
      name: 'Havant Borough Council',
      type: 'Application notification',
      status: 'No response needed'
    },
    {
      id: 'rya',
      name: 'Royal Yachting Association',
      type: 'Application notification',
      day: 10,
      by: 'Mark Ellison',
      response: [
        'The RYA is responding for the two watersports clubs that launch from the seafront between groynes 16 and 18. Please could the works on groynes 16 to 18 avoid weekends in May and June, when the clubs run their junior training. We also ask that the rock at the end of groyne 19 is marked so that windsurfers and kitesurfers can see it at high water.'
      ]
    }
  ];
  // A to Z, as the consultee grid on the Prepare for consultation task sorts
  // them. The overview table follows this order, and the nav within each group.
  CONSULTEES.sort(function (a, b) { return a.name.localeCompare(b.name); });

  var COMMENTS = [
    {
      name: 'Margaret Ellis',
      email: 'margaret.ellis@example.com',
      day: 2,
      text: 'I own beach hut 212, which is just behind groyne 17. Will we still be able to get to our huts while the work is going on? Some of us are elderly and can’t walk the long way round from the next access point. I’d also like to know if the machines will start at 7:30 in the morning, as the noise carries a long way along the huts.'
    },
    {
      name: 'Dan Okoro',
      email: 'dan.okoro@example.com',
      day: 6,
      text: 'I windsurf off this beach most weekends. The new rock at the end of groyne 19 will be under water at high tide and could be a real hazard for windsurfers and swimmers. Please make sure it is clearly marked with a post or a buoy.'
    },
    {
      name: 'Susan Hart',
      email: 'susan.hart@example.com',
      day: 8,
      text: 'I fully support this. The beach in front of groynes 17 to 19 has dropped a lot in the last few winters and the groynes are falling apart. Please get on with it before the next big storm.'
    },
    {
      name: 'Rob Turner',
      email: 'rob.turner@example.com',
      day: 9,
      text: 'Greenheart is a tropical hardwood. Even if it is FSC certified, I don’t think we should be shipping it from South America to repair groynes. Have recycled plastic or reused timber been considered? I’d like the applicant to explain why they chose greenheart.'
    },
    {
      name: 'Peter Lawson',
      email: 'secretary@example.com',
      day: 15,
      text: 'I’m writing as secretary of the Hayling Island Seafront Beach Huts Association. We met the applicant in the summer and are happy with the timing of the works. Our members ask that the fencing around each groyne leaves a clear path along the top of the beach so huts either side can still be reached, and that the contractor gives us two weeks’ notice of the dates for each groyne.'
    }
  ];

  var page = document.getElementById('page');

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // Responded once the response's day has come. Anyone still waiting is
  // Overdue once the closing date has passed.
  function statusOf(c) {
    if (c.status) return c.status;
    if (arrived(c)) return 'Responded';
    return today() > closing() ? 'Overdue' : 'Awaiting response';
  }
  function arrived(item) {
    return item.day != null && addDays(started(), item.day) <= today();
  }
  function dayDate(item) {
    return longDate(addDays(started(), item.day));
  }

  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function addDays(isoDate, days) {
    var p = isoDate.split('-');
    return iso(new Date(+p[0], p[1] - 1, +p[2] + days));
  }
  function today() {
    return iso(new Date());
  }
  function hashDate(name) {
    var match = new RegExp('[#&]' + name + '=(\\d{4}-\\d{2}-\\d{2})').exec(location.hash);
    return match && match[1];
  }
  function started() {
    return hashDate('started') || addDays(today(), -11);
  }
  function originalClosing() {
    return addDays(started(), PERIOD_DAYS);
  }
  function closing() {
    return hashDate('closing') || originalClosing();
  }
  function longDate(iso) {
    var p = iso.split('-');
    return +p[2] + ' ' + MONTHS[p[1] - 1] + ' ' + p[0];
  }

  function tag(status) {
    var mod = { 'Awaiting response': 'awaiting', Responded: 'responded', Overdue: 'overdue' }[status];
    return '<span class="tag' + (mod ? ' tag--' + mod : '') + '">' + esc(status) + '</span>';
  }

  function commentsFor() {
    return COMMENTS.filter(arrived);
  }

  function field(label, value) {
    return '<div class="field"><dt class="field__label">' + esc(label) +
      '</dt><dd class="field__value">' + value + '</dd></div>';
  }

  // A document, shown as on the other CDP tabs: a download icon and the file
  // name. A dead link here, as on the WFD tab.
  function docLink(name) {
    return '<a class="doc-link" href="#" onclick="return false;" style="display: inline-flex; align-items: center; gap: 2px; line-height: 1;">' +
      '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" style="display: block; flex-shrink: 0;">' +
      '<line x1="10" y1="2.6" x2="10" y2="12.4" stroke="currentColor" stroke-width="1.2" />' +
      '<polyline points="6,8.6 10,12.6 14,8.6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />' +
      '<line x1="3.6" y1="16.4" x2="16.4" y2="16.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />' +
      '</svg><span>' + esc(name) + '</span></a>';
  }

  function paragraphs(list) {
    return list.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  }

  function summary() {
    var advice = CONSULTEES.filter(function (c) { return c.type === 'Request for advice'; });
    var notified = CONSULTEES.filter(function (c) { return c.type !== 'Request for advice'; });
    function count(list) {
      return list.filter(function (c) { return statusOf(c) === 'Responded'; }).length + ' of ' + list.length + ' responded';
    }
    var overdue = advice.filter(function (c) { return statusOf(c) === 'Overdue'; }).length;
    var due = closing() !== originalClosing()
      ? esc(longDate(closing())) + ' (extended from ' + esc(longDate(originalClosing())) + ')'
      : esc(longDate(originalClosing()));
    if (today() > closing()) due += ' (passed)';
    // Dates first, then the responses.
    return '<dl class="fields consult__summary">' +
      field('Consultation started', esc(longDate(started()))) +
      field('Consultee closing date', due) +
      field('Public comments close', esc(longDate(addDays(started(), COMMENTS_DAYS)))) +
      field('Requests for advice', esc(count(advice)) + (overdue ? ', ' + overdue + ' overdue' : '')) +
      field('Application notifications', esc(count(notified))) +
      field('Public comments', commentsFor().length + ' received') +
      '</dl>';
  }

  function table() {
    var rows = CONSULTEES.map(function (c) {
      return '<tr><td><button type="button" class="consult__link" data-go="' + c.id + '">' + esc(c.name) + '</button></td>' +
        '<td>' + esc(c.type) + '</td><td>' + tag(statusOf(c)) + '</td>' +
        '<td>' + (statusOf(c) === 'Responded' ? esc(dayDate(c)) : '') + '</td></tr>';
    }).join('');
    return '<div class="consult__table-wrap"><table class="consult__table">' +
      '<thead><tr><th scope="col">Organisation</th><th scope="col">Consultation type</th><th scope="col">Response status</th><th scope="col">Date responded</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>';
  }

  function consultee(c, headingTag) {
    var status = statusOf(c);
    var fields = field('Consultation type', esc(c.type));
    if (c.asked) fields += field('Advice requested', esc(c.asked));
    // Plain text here: a tinted badge is hard to see on the grey value box.
    fields += field('Response status', esc(status));
    if (status === 'Responded') {
      fields += field('Responded by', esc(c.by));
      fields += field('Date responded', esc(dayDate(c)));
      fields += field('Response', paragraphs(c.response));
      if (c.document) fields += field('Supporting document', docLink(c.document));
    }
    return '<article class="consult__item" id="item-' + c.id + '">' +
      '<' + headingTag + ' class="consult__item-title" tabindex="-1">' + esc(c.name) + '</' + headingTag + '>' +
      '<dl class="fields">' + fields + '</dl></article>';
  }

  function comments(headingTag) {
    return commentsFor().map(function (c) {
      return '<article class="consult__item">' +
        '<' + headingTag + ' class="consult__item-title">' + esc(c.name) + '</' + headingTag + '>' +
        '<dl class="fields">' + field('Date received', esc(dayDate(c))) + field('Email address', esc(c.email)) +
        field('Comment', paragraphs([c.text])) + '</dl></article>';
    }).join('');
  }

  // The nav/detail pattern from Marine plan policies and Other permissions.
  function withNav() {
    // Names only, as the overview table shows who has responded. The one
    // exception is Overdue, the case where the caseworker may need to act.
    function link(target, label, overdue) {
      return '<button type="button" class="mpp__link" data-target="' + target + '">' + esc(label) +
        (overdue ? '<span class="consult__overdue">Overdue</span>' : '') + '</button>';
    }
    function group(title, type) {
      return '<div class="mpp__group"><h2 class="mpp__group-title">' + title + '</h2>' +
        CONSULTEES.filter(function (c) { return c.type === type; }).map(function (c) {
          return link('pane-' + c.id, c.name, statusOf(c) === 'Overdue');
        }).join('') + '</div>';
    }
    var nav = '<nav class="mpp__nav" aria-label="Consultation responses">' +
      '<div class="mpp__group">' + link('pane-overview', 'Overview') + '</div>' +
      group('Requests for advice', 'Request for advice') +
      group('Application notifications', 'Application notification') +
      '<div class="mpp__group"><h2 class="mpp__group-title">Public</h2>' +
      link('pane-comments', 'Public comments (' + commentsFor().length + ')') + '</div></nav>';
    var panes = '<div class="consult__pane" id="pane-overview"><h2 class="mpp__detail-title" tabindex="-1">Overview</h2>' +
      summary() + table() + '</div>' +
      CONSULTEES.map(function (c) {
        return '<div class="consult__pane consult__pane--consultee" id="pane-' + c.id + '" hidden>' + consultee(c, 'h2') + '</div>';
      }).join('') +
      '<div class="consult__pane" id="pane-comments" hidden><h2 class="mpp__detail-title" tabindex="-1">Public comments</h2>' +
      comments('h3') + '</div>';
    return '<h1 class="section__title">Consultation responses</h1><div class="mpp">' + nav +
      '<section class="mpp__detail">' + panes + '</section></div>';
  }

  function selectPane(target, moveFocus) {
    Array.prototype.forEach.call(page.querySelectorAll('.mpp__link'), function (l) {
      l.classList.toggle('mpp__link--active', l.dataset.target === target);
    });
    Array.prototype.forEach.call(page.querySelectorAll('.consult__pane'), function (p) {
      p.hidden = p.id !== target;
    });
    var heading = moveFocus && page.querySelector('#' + target + ' [tabindex="-1"]');
    if (heading) {
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ block: 'start' });
    }
  }

  page.addEventListener('click', function (e) {
    var navLink = e.target.closest('.mpp__link');
    if (navLink) return selectPane(navLink.dataset.target, true);
    var go = e.target.closest('[data-go]');
    if (go) selectPane('pane-' + go.dataset.go, true);
  });

  function render() {
    page.innerHTML = withNav();
    selectPane('pane-overview', false);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  render();
})();
