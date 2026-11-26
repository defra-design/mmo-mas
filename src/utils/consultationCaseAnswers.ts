// src/utils/consultationCaseAnswers.ts
// The caseworker's answers on MLA/2026/10006's tasks, all done before its
// consultation started (11 days ago, see consultationCase.ts). Made up to fit the Hayling Island
// groyne repairs application and the consultation responses that came back.
// As on the other completed cases (10013, 10014), assessment answers are
// shared in this prototype: these show while the shared answer is empty.
import type { ConsulteeRow, MppAnswer, SiteCheckForm, SiteNoticeForm, WfdForm } from '../context/TaskContext';
import { SITE_NOTICE } from './publicNoticeRequirement';

export const HAYLING_SITE_CHECK: SiteCheckForm = {
  coordinatesOk: 'Yes',
  withinMile: 'Yes',
  notes: 'Both sites are on the Hayling Island seafront between groynes 14 and 19, and match the uploaded site file. The works are within 1 nautical mile of the Solent coastal water body, so a WFD assessment is needed. The sites are next to the Chichester and Langstone Harbours SPA and Ramsar site and the Solent Maritime SAC.',
};

export const HAYLING_WFD: WfdForm = {
  review: 'Yes',
  initialConsiderations: 'The applicant’s WFD assessment covers the Solent coastal water body. The works are like for like repairs within the existing groyne footprint, plus about 40 square metres of rock at groyne 19, so deterioration is unlikely. Ask the Environment Agency to confirm the conclusion as part of consultation.',
};

// One assessment per Hayling policy (South marine plan).
export const HAYLING_MPP: Record<string, MppAnswer> = {
  'S-CC-3': { outcome: 'Compliant', reason: 'The groynes stay at their current length and height, so longshore movement of shingle will not change. The rock at groyne 19 replaces beach lost to scour.' },
  'S-CO-1': { outcome: 'Compliant', reason: 'The works use the existing groyne footprint and only one groyne is worked on at a time, so the rest of the beach stays open.' },
  'S-AGG-4': { outcome: 'Compliant', reason: 'The applicant explains that marine aggregates are not suitable for armour stone of this size, as the policy asks.' },
  'S-INF-1': { outcome: 'Compliant', reason: 'Keeping the groynes in good condition protects the seafront road, promenade and about 200 properties.' },
  'S-BIO-1': { outcome: 'Consultation required', reason: 'The site is next to the Chichester and Langstone Harbours SPA. Ask Natural England whether the April to June timing avoids significant effects on overwintering birds.' },
  'S-BIO-3': { outcome: 'Compliant', reason: 'No loss of coastal habitat. The rock covers beach that is already scoured, and the vegetated shingle will be fenced off.' },
  'S-DIST-1': { outcome: 'Consultation required', reason: 'The timing avoids overwintering birds, but ringed plover may nest on the upper beach. Ask Natural England whether the weekly checks and 50 metre exclusion zone are enough.' },
  'S-MPA-1': { outcome: 'Consultation required', reason: 'The HRA screening concludes no likely significant effect. Natural England need to agree this before we can rely on it.' },
  'S-UWN-2': { outcome: 'Compliant', reason: 'Posts are driven with a vibrating head at low tide, in the dry, so no underwater noise is expected.' },
  'S-WQ-1': { outcome: 'Compliant', reason: 'Biodegradable hydraulic oil, refuelling off the beach and spill kits on site. The timber is untreated.' },
  'S-ACC-1': { outcome: 'Compliant', reason: 'The beach and promenade stay open, with a fenced working area of about 30 metres around each groyne.' },
  'S-HER-1': { outcome: 'Consultation required', reason: 'No recorded heritage assets, but ask Historic England to confirm and to comment on the protocol for finds.' },
  'S-TR-2': { outcome: 'Compliant', reason: 'Working outside the school summer holidays keeps disruption to visitors and seafront businesses to a minimum.' },
};

const consultee = (id: string, organisation: string, notes = ''): ConsulteeRow => ({
  id,
  organisation,
  consultationType: notes ? 'Request for advice' : 'Application notification',
  notes,
});

// The 8 consultees on the Consultation responses tab.
export const HAYLING_CONSULTEES: ConsulteeRow[] = [
  consultee('hayling-ne', 'Natural England (NE)', 'We would like your advice on whether the repairs are likely to have a significant effect on the Chichester and Langstone Harbours Special Protection Area. Tell us about any timing restrictions you would recommend to protect overwintering brent geese.'),
  consultee('hayling-ea', 'Environment Agency (EA)', 'We would like your advice on whether the works comply with the Water Framework Directive, based on the applicant’s WFD assessment.'),
  consultee('hayling-mmo', 'Portsmouth Marine Management Organisation (MMO) Coastal Office', 'We would like your advice on any local knowledge of the site, and on how the works could affect other users of the seafront.'),
  consultee('hayling-mca', 'Maritime and Coastguard Agency (MCA)', 'We would like your advice on whether the rock armour at the end of groyne 19 needs to be marked or charted for navigation safety.'),
  consultee('hayling-ifca', 'Southern Inshore Fisheries and Conservation Authority (IFCA)', 'We would like your advice on any effect on inshore fishing and shellfish beds near the site.'),
  consultee('hayling-he', 'Historic England (HE)', 'We would like your advice on any heritage assets in the works area, and on the applicant’s protocol for finds.'),
  consultee('hayling-havant', 'Havant Borough Council'),
  consultee('hayling-rya', 'Royal Yachting Association (RYA)'),
];

export const HAYLING_CONSULTATION_PERIOD = '14 days';

// The applicant's proposed works summary, from the GOV.UK prototype.
export const HAYLING_PROPOSED_WORKS =
  'We are applying for a marine licence to repair 6 timber groynes on the Hayling Island seafront. Rotten planks and posts will be replaced like for like with hardwood, working from the beach at low tide.';

export const HAYLING_SITE_NOTICE: SiteNoticeForm = {
  needsNotice: SITE_NOTICE,
  rationale: '',
  summary: 'Repairs to 6 timber groynes on the Hayling Island seafront, replacing rotten planks and posts like for like, and placing rock armour at the end of groyne 19. Works from April to June 2027, from the beach at low tide.',
  groups: 'Both',
};
