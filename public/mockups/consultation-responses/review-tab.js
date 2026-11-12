// DESIGN EXPLORATION — the Consultation responses tab for MLA/2026/10006,
// Hayling Island groyne repairs. The application is from the GOV.UK prototype
// (consultation v2 / public register v1); the consultees, responses and comments
// are made up for it.
//
// Two layouts (one page, or a nav by consultee) and three scenarios (before the
// deadline, deadline passed, deadline extended), chosen on the bar on tab.html.
// The choice comes in on this page's hash as "layout/scenario", or is read from
// the bar when the page loads.
(function () {
  // Consultees have 14 days to respond, as in consultation v2. The site notice
  // stays up for 21 days (LCML v4 site notice page), and public comments close
  // 21 days after it goes up, as on public register v1. The notice is taken as
  // going up the day the consultation starts.
  // Scenario "today": before the deadline 6 November, deadline passed
  // 12 November, deadline extended (by 7 days, on 12 November) 14 November.
  var STARTED = '27 October 2026';
  var DUE = '10 November 2026';
  var EXTENDED = '17 November 2026';
  var COMMENTS_CLOSE = '17 November 2026';

  // status: per scenario, what CDP says about the request. A string is the same
  // in every scenario.
  var CONSULTEES = [
    {
      id: 'ne',
      name: 'Natural England',
      type: 'Request for advice',
      asked: 'We would like your advice on whether the repairs are likely to have a significant effect on the Chichester and Langstone Harbours Special Protection Area. Tell us about any timing restrictions you would recommend to protect overwintering brent geese.',
      status: { due: 'Awaiting response', passed: 'Overdue', extended: 'Awaiting response' }
    },
    {
      id: 'ea',
      name: 'Environment Agency',
      type: 'Request for advice',
      asked: 'We would like your advice on whether the works comply with the Water Framework Directive, based on the applicant’s WFD assessment.',
      status: 'Responded',
      responded: '4 November 2026',
      by: 'Priya Shah',
      response: [
        'Thank you for consulting the Environment Agency. We have reviewed the application and the Water Framework Directive assessment (hayling-groynes-wfd-assessment.pdf) and have no objection to the proposal.',
        'The works are like for like repairs within the footprint of the existing groynes, and the rock armour at groyne 19 is small in scale. We agree with the conclusion of the WFD assessment that the works will not cause deterioration of the Solent coastal water body or stop it reaching good status. We recommend that: • plant is refuelled away from the beach and spill kits are kept on site, as set out in the application • any timber or debris removed is taken off the beach on the same tide.',
        'The groynes are part of the Hayling Island coastal defence scheme. Please make sure Coastal Partners know the final working dates.'
      ]
    },
    {
      id: 'mmo',
      name: 'Portsmouth Marine Management Organisation Coastal Office',
      type: 'Request for advice',
      asked: 'Please tell us about fishing and other uses of the sea in the area, any seasonal restrictions you would recommend, and which MMO office should be the local office for the licence.',
      status: 'Responded',
      responded: '3 November 2026',
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
      status: 'Responded',
      responded: '30 October 2026',
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
      status: { due: 'Awaiting response', passed: 'Overdue', extended: 'Responded' },
      responded: '13 November 2026',
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
      status: 'Responded',
      responded: '5 November 2026',
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
      status: 'No response'
    },
    {
      id: 'rya',
      name: 'Royal Yachting Association',
      type: 'Application notification',
      status: 'Responded',
      responded: '6 November 2026',
      by: 'Mark Ellison',
      response: [
        'The RYA is responding for the two watersports clubs that launch from the seafront between groynes 16 and 18. Please could the works on groynes 16 to 18 avoid weekends in May and June, when the clubs run their junior training. We also ask that the rock at the end of groyne 19 is marked so that windsurfers and kitesurfers can see it at high water.'
      ]
    }
  ];

  // from: the first scenario the comment has arrived in.
  var COMMENTS = [
    {
      name: 'Margaret Ellis',
      email: 'margaret.ellis@example.com',
      received: '29 October 2026',
      text: 'I own beach hut 212, which is just behind groyne 17. Will we still be able to get to our huts while the work is going on? Some of us are elderly and can’t walk the long way round from the next access point. I’d also like to know if the machines will start at 7:30 in the morning, as the noise carries a long way along the huts.'
    },
    {
      name: 'Dan Okoro',
      email: 'dan.okoro@example.com',
      received: '2 November 2026',
      text: 'I windsurf off this beach most weekends. The new rock at the end of groyne 19 will be under water at high tide and could be a real hazard for windsurfers and swimmers. Please make sure it is clearly marked with a post or a buoy.'
    },
    {
      name: 'Susan Hart',
      email: 'susan.hart@example.com',
      received: '4 November 2026',
      text: 'I fully support this. The beach in front of groynes 17 to 19 has dropped a lot in the last few winters and the groynes are falling apart. Please get on with it before the next big storm.'
    },
    {
      name: 'Rob Turner',
      email: 'rob.turner@example.com',
      received: '5 November 2026',
      text: 'Greenheart is a tropical hardwood. Even if it is FSC certified, I don’t think we should be shipping it from South America to repair groynes. Have recycled plastic or reused timber been considered? I’d like the applicant to explain why they chose greenheart.'
    },
    {
      name: 'Peter Lawson',
      email: 'secretary@example.com',
      received: '11 November 2026',
      from: 'passed',
      text: 'I’m writing as secretary of the Hayling Island Seafront Beach Huts Association. We met the applicant in the summer and are happy with the timing of the works. Our members ask that the fencing around each groyne leaves a clear path along the top of the beach so huts either side can still be reached, and that the contractor gives us two weeks’ notice of the dates for each groyne.'
    }
  ];

  var LAYOUTS = ['page', 'nav'];
  var SCENARIOS = ['due', 'passed', 'extended'];
  var page = document.getElementById('page');

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function statusOf(c, scenario) {
    return typeof c.status === 'string' ? c.status : c.status[scenario];
  }

  function tag(status) {
    var mod = { 'Awaiting response': 'awaiting', Responded: 'responded', Overdue: 'overdue' }[status];
    return '<span class="tag' + (mod ? ' tag--' + mod : '') + '">' + esc(status) + '</span>';
  }

  function commentsFor(scenario) {
    return COMMENTS.filter(function (c) { return !c.from || scenario !== 'due'; });
  }

  function field(label, value) {
    return '<div class="field"><dt class="field__label">' + esc(label) +
      '</dt><dd class="field__value">' + value + '</dd></div>';
  }

  function paragraphs(list) {
    return list.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  }

  function summary(scenario) {
    var advice = CONSULTEES.filter(function (c) { return c.type === 'Request for advice'; });
    var notified = CONSULTEES.filter(function (c) { return c.type !== 'Request for advice'; });
    function count(list) {
      return list.filter(function (c) { return statusOf(c, scenario) === 'Responded'; }).length + ' of ' + list.length + ' responded';
    }
    var overdue = advice.filter(function (c) { return statusOf(c, scenario) === 'Overdue'; }).length;
    var due = scenario === 'extended'
      ? esc(EXTENDED) + ' (extended from ' + esc(DUE) + ')'
      : esc(DUE) + (scenario === 'passed' ? ' (passed)' : '');
    // Dates first, then the responses.
    return '<dl class="fields consult__summary">' +
      field('Consultation started', esc(STARTED)) +
      field('Consultee responses due', due) +
      field('Public comments close', esc(COMMENTS_CLOSE)) +
      field('Requests for advice', esc(count(advice)) + (overdue ? ', ' + overdue + ' overdue' : '')) +
      field('Application notifications', esc(count(notified))) +
      field('Public comments', commentsFor(scenario).length + ' received') +
      '</dl>';
  }

  function table(scenario) {
    var rows = CONSULTEES.map(function (c) {
      return '<tr><td><button type="button" class="consult__link" data-go="' + c.id + '">' + esc(c.name) + '</button></td>' +
        '<td>' + esc(c.type) + '</td><td>' + tag(statusOf(c, scenario)) + '</td>' +
        '<td>' + (statusOf(c, scenario) === 'Responded' ? esc(c.responded) : '') + '</td></tr>';
    }).join('');
    return '<div class="consult__table-wrap"><table class="consult__table">' +
      '<thead><tr><th scope="col">Organisation</th><th scope="col">Consultation type</th><th scope="col">Consultation status</th><th scope="col">Responded</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>';
  }

  // One page layout only: a link back up the page, as GOV.UK's back to top link.
  var BACK_TO_TOP = '<p class="consult__top"><button type="button" class="consult__link" data-jump="top">' +
    '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>' +
    'Back to top</button></p>';

  function consultee(c, scenario, headingTag, backToTop) {
    var status = statusOf(c, scenario);
    var fields = field('Consultation type', esc(c.type));
    if (c.asked) fields += field('Advice requested', esc(c.asked));
    // Plain text here: a tinted badge is hard to see on the grey value box.
    fields += field('Consultation status', esc(status));
    if (status === 'Responded') {
      fields += field('Responded', esc(c.responded) + ' by ' + esc(c.by));
      fields += field('Response', paragraphs(c.response));
    }
    return '<article class="consult__item" id="item-' + c.id + '">' +
      '<' + headingTag + ' class="consult__item-title" tabindex="-1">' + esc(c.name) + '</' + headingTag + '>' +
      '<dl class="fields">' + fields + '</dl>' + (backToTop ? BACK_TO_TOP : '') + '</article>';
  }

  function comments(scenario, headingTag) {
    return commentsFor(scenario).map(function (c) {
      return '<article class="consult__item">' +
        '<' + headingTag + ' class="consult__item-title">' + esc(c.name) + '</' + headingTag + '>' +
        '<dl class="fields">' + field('Received', esc(c.received)) + field('Email', esc(c.email)) +
        field('Comment', paragraphs([c.text])) + '</dl></article>';
    }).join('');
  }

  // Layout 1: everything on one page. A contents list jumps to each part, the
  // overview table jumps to each consultee, and Back to top links return.
  function onePage(scenario) {
    function contentsLink(target, label) {
      return '<li><button type="button" class="consult__link" data-jump="' + target + '">' + esc(label) + '</button></li>';
    }
    function heading(id, label) {
      return '<h2 class="consult__heading" id="' + id + '" tabindex="-1">' + esc(label) + '</h2>';
    }
    return '<h1 class="section__title" id="top" tabindex="-1">Consultation responses</h1>' +
      '<nav class="consult__contents" aria-label="Contents"><h2 class="consult__contents-title">Contents</h2><ul>' +
      contentsLink('sec-consultees', 'Consultees') +
      contentsLink('sec-responses', 'Responses from consultees') +
      contentsLink('sec-comments', 'Public comments (' + commentsFor(scenario).length + ')') +
      '</ul></nav>' +
      summary(scenario) +
      heading('sec-consultees', 'Consultees') + table(scenario) +
      '<hr class="site-divider">' + heading('sec-responses', 'Responses from consultees') +
      CONSULTEES.map(function (c) { return consultee(c, scenario, 'h3', true); }).join('') +
      '<hr class="site-divider">' + heading('sec-comments', 'Public comments') + comments(scenario, 'h3') + BACK_TO_TOP;
  }

  function jumpTo(el) {
    if (!el) return;
    el.focus({ preventScroll: true });
    if (el.id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    else el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  // Layout 2: the nav/detail pattern from Marine plan policies and Other permissions.
  function withNav(scenario) {
    // Names only, as the overview table shows who has responded. The one
    // exception is Overdue, the case where the caseworker may need to act.
    function link(target, label, overdue) {
      return '<button type="button" class="mpp__link" data-target="' + target + '">' + esc(label) +
        (overdue ? '<span class="consult__overdue">Overdue</span>' : '') + '</button>';
    }
    function group(title, type) {
      return '<div class="mpp__group"><h2 class="mpp__group-title">' + title + '</h2>' +
        CONSULTEES.filter(function (c) { return c.type === type; }).map(function (c) {
          return link('pane-' + c.id, c.name, statusOf(c, scenario) === 'Overdue');
        }).join('') + '</div>';
    }
    var nav = '<nav class="mpp__nav" aria-label="Consultation responses">' +
      '<div class="mpp__group">' + link('pane-overview', 'Overview') + '</div>' +
      group('Requests for advice', 'Request for advice') +
      group('Application notifications', 'Application notification') +
      '<div class="mpp__group"><h2 class="mpp__group-title">Public</h2>' +
      link('pane-comments', 'Public comments (' + commentsFor(scenario).length + ')') + '</div></nav>';
    var panes = '<div class="consult__pane" id="pane-overview"><h2 class="mpp__detail-title" tabindex="-1">Overview</h2>' +
      summary(scenario) + table(scenario) + '</div>' +
      CONSULTEES.map(function (c) {
        return '<div class="consult__pane consult__pane--consultee" id="pane-' + c.id + '" hidden>' + consultee(c, scenario, 'h2') + '</div>';
      }).join('') +
      '<div class="consult__pane" id="pane-comments" hidden><h2 class="mpp__detail-title" tabindex="-1">Public comments</h2>' +
      comments(scenario, 'h3') + '</div>';
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
    var jump = e.target.closest('[data-jump]');
    if (jump) return jumpTo(document.getElementById(jump.dataset.jump));
    var go = e.target.closest('[data-go]');
    if (!go) return;
    if (page.querySelector('.mpp')) return selectPane('pane-' + go.dataset.go, true);
    var item = document.getElementById('item-' + go.dataset.go);
    jumpTo(item && item.querySelector('[tabindex="-1"]'));
  });

  function fromBar(name) {
    try {
      var checked = window.top.document.querySelector('#scenarios [name="' + name + '"]:checked');
      return checked && checked.value;
    } catch (e) { return null; }
  }

  function render() {
    var parts = location.hash.slice(1).split('/');
    var layout = LAYOUTS.indexOf(parts[0]) > -1 ? parts[0] : fromBar('layout') || 'page';
    var scenario = SCENARIOS.indexOf(parts[1]) > -1 ? parts[1] : fromBar('scenario') || 'due';
    page.innerHTML = layout === 'nav' ? withNav(scenario) : onePage(scenario);
    if (layout === 'nav') selectPane('pane-overview', false);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  render();
})();
