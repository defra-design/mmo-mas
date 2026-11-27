// src/utils/brixhamCaseAnswers.ts
// The caseworker's answers on MLA/2026/10013's tasks (Installation of safety
// ladders at Brixham Fish Quay). Site check, WFD, Withholding information,
// Public notice, every marine plan policy and Prepare for consultation are done.
// Made up to fit the application in public/cdp/*-brixham.html and
// marine-plan-policies-brixham.json.
import type {
  ConsulteeRow,
  MppAnswer,
  PublicRegisterForm,
  SiteCheckForm,
  SiteNoticeForm,
  WfdForm,
} from '../context/TaskContext';
import { SITE_NOTICE } from './publicNoticeRequirement';

export const BRIXHAM_SITE_CHECK: SiteCheckForm = {
  coordinatesOk: 'Yes',
  withinMile: 'Yes',
  notes: 'The site drawn on the map follows the north and east walls of Brixham Fish Quay, inside the harbour, and matches the ladder positions drawing. The works are within 1 nautical mile of the Tor Bay coastal water body, so a WFD assessment is needed. The harbour is close to the Lyme Bay and Torbay SAC and the Torbay MCZ.',
};

export const BRIXHAM_WFD: WfdForm = {
  review: 'Yes',
  initialConsiderations: 'The applicant’s WFD assessment covers the Tor Bay coastal water body. The ladders are fixed to an existing quay wall above the water line, with no piling or work on the seabed, so deterioration is very unlikely. Send the Environment Agency a notification as part of consultation.',
};

// One assessment per Brixham policy (South West marine plan).
export const BRIXHAM_MPP: Record<string, MppAnswer> = {
  'SW-CC-1': { outcome: 'Compliant', reason: 'The ladders are fixed to an existing quay wall. There are no habitats at the quay that provide flood defence or carbon storage.' },
  'SW-CC-3': { outcome: 'Compliant', reason: 'The ladders sit flat against the wall, so they will not change how waves, tides or sediment move in the harbour.' },
  'SW-CO-1': { outcome: 'Compliant', reason: 'No extra space is used, and one ladder is fitted at a time with the working area agreed with the fish quay users each day.' },
  'SW-INF-1': { outcome: 'Compliant', reason: 'Safe ladders keep the fish quay fit for use by the fishing fleet at all states of the tide.' },
  'SW-PS-1': { outcome: 'Compliant', reason: 'No berth is closed for longer than a single tide, and harbour users will be told through a notice to mariners.' },
  'SW-BIO-1': { outcome: 'Compliant', reason: 'The quay wall is man-made, with no priority habitats or species known on it. Only small areas around each fixing are cleared.' },
  'SW-DIST-1': { outcome: 'Compliant', reason: 'The works are small, quiet and short, inside a working fish quay that is already busy every day.' },
  'SW-MPA-1': { outcome: 'Consultation required', reason: 'The HRA screening concludes the works will not affect the Lyme Bay and Torbay SAC or the Torbay MCZ. Natural England need to agree this before we can rely on it.' },
  'SW-UWN-2': { outcome: 'Compliant', reason: 'Fixings are drilled above the water line at low tide with hand held drills, so no underwater noise is made.' },
  'SW-WQ-1': { outcome: 'Compliant', reason: 'Drilling dust is collected, resin is mixed away from the quay edge and a spill kit is kept on site. The steel is not painted or treated.' },
  'SW-ACC-1': { outcome: 'Compliant', reason: 'The ladders improve safe access between the water and the quay, and the public area of the quay stays open.' },
  'SW-FISH-2': { outcome: 'Consultation required', reason: 'The ladder positions were agreed with the fish quay users, but ask Devon and Severn IFCA to confirm the works will not affect access for fishing.' },
  'SW-HER-1': { outcome: 'Consultation required', reason: 'The quay is in the Brixham Conservation Area. Ask Historic England whether the ladder design is acceptable on the historic harbour walls.' },
  'SW-CBC-1': { outcome: 'Compliant', reason: 'The works are inside Brixham Harbour and will not affect any other marine plan area.' },
  'SW-CE-1': { outcome: 'Compliant', reason: 'No other works are planned at the fish quay at the same time, and the ladder works only last 3 weeks.' },
  'SW-AQ-2': { outcome: 'Compliant', reason: 'Not relevant. There is no aquaculture in Brixham Harbour and the project does not involve any.' },
  'SW-CAB-1': { outcome: 'Compliant', reason: 'Not relevant. The project does not involve any cables.' },
  'SW-CAB-3': { outcome: 'Compliant', reason: 'No work on the seabed, and the applicant has checked there are no cables or pipes in the wall where the fixings go.' },
  'SW-DD-1': { outcome: 'Compliant', reason: 'No dredging is involved, and the ladders stand out from the wall by less than 300 millimetres, so maintenance dredging can carry on.' },
  'SW-DD-2': { outcome: 'Compliant', reason: 'Not relevant. Nothing will be disposed of at sea.' },
  'SW-DD-3': { outcome: 'Compliant', reason: 'Not relevant. No dredged material will be produced.' },
  'SW-INF-2': { outcome: 'Compliant', reason: 'The works replace safety equipment on an existing quay and need no new land or water space.' },
  'SW-PS-4': { outcome: 'Compliant', reason: 'The fish quay is in the inner harbour, away from the main approach, so shipping will not be affected.' },
  'SW-REN-1': { outcome: 'Compliant', reason: 'Not relevant. The project does not involve or affect renewable energy.' },
  'SW-AIR-1': { outcome: 'Compliant', reason: 'Only hand held electric drills and the harbour workboat are used, for 3 weeks. Any effect on air quality is very small.' },
  'SW-BIO-2': { outcome: 'Compliant', reason: 'Only small patches of common seaweed and barnacles are cleared around each fixing, and these will grow back.' },
  'SW-BIO-3': { outcome: 'Compliant', reason: 'No coastal habitat is lost. The ladders are fixed to an existing quay wall.' },
  'SW-HAB-1': { outcome: 'Compliant', reason: 'Not relevant. The works are in the intertidal zone inside the harbour, nowhere near deep sea habitats.' },
  'SW-INNS-1': { outcome: 'Compliant', reason: 'The ladders are new and the workboat stays in Brixham, so the risk of bringing in non-native species is very low.' },
  'SW-INNS-2': { outcome: 'Compliant', reason: 'The ladders are fixed and will not be moved elsewhere. Check Clean Dry posters are already shown at the harbour office.' },
  'SW-ML-1': { outcome: 'Compliant', reason: 'The old ladders are recycled and waste is collected on the quay each day, so nothing should go into the water.' },
  'SW-ML-2': { outcome: 'Compliant', reason: 'The project will not add to marine litter, and the waste and recycling points on the quay stay in place.' },
  'SW-MPA-2': { outcome: 'Compliant', reason: 'The ladders are small, on an existing wall and can be removed, so they will not affect how the SAC or MCZ adapt to climate change.' },
  'SW-MPA-3': { outcome: 'Consultation required', reason: 'The works do not reach the seabed, and the HRA screening says the Torbay MCZ features are not on the quay wall. Ask Natural England to confirm.' },
  'SW-UWN-1': { outcome: 'Compliant', reason: 'No piling, and all drilling is above the water line at low tide, so no impulsive noise is made.' },
  'SW-EMP-1': { outcome: 'Compliant', reason: 'The work uses the harbour’s maintenance team and a local contractor, and safe ladders support jobs on the boats and in the fish market.' },
  'SW-FISH-1': { outcome: 'Consultation required', reason: 'The quay stays open and work avoids early morning landings. Ask the Brixham MMO Coastal Office whether this is enough for boats landing their catch.' },
  'SW-FISH-3': { outcome: 'Compliant', reason: 'The works are on a quay wall in a working harbour, with no work on the seabed, so fish nursery and spawning areas are not affected.' },
  'SW-SOC-1': { outcome: 'Compliant', reason: 'Safer ladders help people use the harbour safely, and the public area of the quay stays open.' },
  'SW-SCP-1': { outcome: 'Compliant', reason: 'The new ladders look like the ones already on the quay, so the look of the harbour will not change.' },
  'SW-TR-1': { outcome: 'Compliant', reason: 'The works are before the main tourist season and the public areas of the harbour stay open.' },
};

const consultee = (id: string, organisation: string, notes = ''): ConsulteeRow => ({
  id,
  organisation,
  consultationType: notes ? 'Request for advice' : 'Application notification',
  notes,
});

export const BRIXHAM_CONSULTEES: ConsulteeRow[] = [
  consultee('brixham-ne', 'Natural England (NE)', 'We would like your advice on whether the works are likely to have a significant effect on the Lyme Bay and Torbay Special Area of Conservation or the Torbay Marine Conservation Zone, based on the applicant’s HRA screening.'),
  consultee('brixham-mmo', 'Brixham Marine Management Organisation (MMO) Coastal Office', 'We would like your advice on any local knowledge of the fish quay, and on how the works could affect boats landing their catch.'),
  consultee('brixham-mca', 'Maritime and Coastguard Agency (MCA)', 'We would like your advice on whether the ladder positions and design meet current guidance for safe access and escape from the water.'),
  consultee('brixham-ifca', 'Devon and Severn Inshore Fisheries and Conservation Authority (IFCA)', 'We would like your advice on any effect on access for fishing vessels using the fish quay while the works take place.'),
  consultee('brixham-he', 'Historic England (HE)', 'We would like your advice on whether the ladders affect the significance of the harbour walls, which are in the Brixham Conservation Area.'),
  consultee('brixham-ea', 'Environment Agency (EA)'),
];

export const BRIXHAM_CONSULTATION_PERIOD = '14 days';

// The applicant asked for nothing to be withheld, so there is no decision to
// make: only the personal information check is answered.
export const BRIXHAM_PUBLIC_REGISTER: PublicRegisterForm = {
  commercialAgree: '',
  commercialApplicantText: '',
  commercialRationale: '',
  personalInfo: 'No',
  personalInfoDetail: '',
  completed: true,
};

// The applicant's proposed works summary (public/cdp/project-details-brixham.html).
export const BRIXHAM_PROPOSED_WORKS =
  'We are applying for a marine licence to replace the safety ladders on the north and east ' +
  'walls of Brixham Fish Quay. We will remove 4 corroded galvanised ladders and fix 6 new ' +
  'stainless steel ladders to the quay wall with resin anchors, working from the quay and a ' +
  'small harbour workboat at low tide.';

// The applicant's WFD assessment (public/cdp/water-framework-directive-brixham.html),
// a dead link as on the GOV.UK prototype.
export const BRIXHAM_WFD_DOCUMENT = { fileName: 'brixham-fish-quay-ladders-wfd-assessment.pdf', href: '#' };

export const BRIXHAM_SITE_NOTICE: SiteNoticeForm = {
  needsNotice: SITE_NOTICE,
  rationale: '',
  summary: 'Removal of 4 old ladders and installation of 6 new stainless steel safety ladders on the north and east walls of Brixham Fish Quay. Works from February to April 2027, from the quay and a harbour workboat at low tide.',
  groups: 'Marine users',
};
