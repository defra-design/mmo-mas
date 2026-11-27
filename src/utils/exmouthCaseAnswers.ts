// src/utils/exmouthCaseAnswers.ts
// The caseworker's answers on MLA/2026/10014's tasks (Exmouth Marina pontoon
// replacement). Only Site check and Public notice are done so far. Made up to
// fit the application in public/cdp/*-exmouth.html.
import type { SiteCheckForm, SiteNoticeForm } from '../context/TaskContext';
import { SITE_NOTICE } from './publicNoticeRequirement';

export const EXMOUTH_SITE_CHECK: SiteCheckForm = {
  coordinatesOk: 'Yes',
  withinMile: 'Yes',
  notes: 'The site covers the Exmouth Marina basin and matches the uploaded site boundary file and pontoon layout drawing. The works are in the Exe transitional water body, so a WFD assessment is needed. The marina is next to the Exe Estuary SPA, Ramsar site and SSSI.',
};

// The applicant's proposed works summary (public/cdp/project-details-exmouth.html).
// Like Teignmouth's, it leaves out the financial figures they asked to be withheld.
export const EXMOUTH_PROPOSED_WORKS =
  'Exe Estuary Marinas Ltd owns and runs Exmouth Marina, which has 172 berths for leisure ' +
  'boats, the Exmouth water taxi and visiting yachts. We are applying for a marine licence to ' +
  "replace the marina's floating pontoons and 22 steel guide piles, which were installed in " +
  'the 1990s and are now near the end of their life. The new pontoons and piles will follow ' +
  'the same layout, and the work will be done from the quayside and from a piling barge ' +
  'inside the marina basin.';

// The applicant's WFD assessment (public/cdp/water-framework-directive-exmouth.html),
// a dead link as on the GOV.UK prototype.
export const EXMOUTH_WFD_DOCUMENT = { fileName: 'exmouth-marina-pontoons-wfd-assessment.pdf', href: '#' };

// Matches the Withholding information tab (public/cdp/public-register-exmouth.html).
export const EXMOUTH_WITHHOLD_REQUEST =
  'We would like the loan amount, the contract price and the new berth tariff in our works ' +
  'summary withheld. The contract price was agreed with our supplier on the basis that it ' +
  'would not be published, and other marinas on the south coast are negotiating with the same ' +
  'supplier. The new tariff has only been shared with our berth holders, and if it is ' +
  'published before we announce it, nearby marinas could use it to tempt our customers away. ' +
  "We would also like the supplier's pontoon float design, shown on construction drawing 2, " +
  'withheld, as the supplier says it is their own design and is not public.';

export const EXMOUTH_SITE_NOTICE: SiteNoticeForm = {
  needsNotice: SITE_NOTICE,
  rationale: '',
  summary: 'Replacement of the floating pontoons and 22 steel guide piles in Exmouth Marina, in the same layout. Works from October 2027 to March 2028, from the quayside and a piling barge inside the marina basin.',
  groups: 'Both',
};
