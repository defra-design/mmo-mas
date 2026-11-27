// src/context/caseSeeds.ts
// Where each case starts: its task statuses and the answers already saved on
// them. Every case keeps its own answers from here on (see TaskContext), and
// "Clear saved data" puts every case back to this point.
import type { CaseState, TaskState } from './TaskContext';
import {
  CONSULTATION_CASE_ID,
  EVIDENCE_CASE_ID,
  RESUBMISSION_CASE_ID,
} from '../utils/cases';
import {
  HAYLING_CONSULTATION_PERIOD,
  HAYLING_MPP,
  HAYLING_SITE_CHECK,
  HAYLING_SITE_NOTICE,
  HAYLING_WFD,
} from '../utils/consultationCaseAnswers';
import {
  BRIXHAM_CONSULTATION_PERIOD,
  BRIXHAM_MPP,
  BRIXHAM_PUBLIC_REGISTER,
  BRIXHAM_SITE_CHECK,
  BRIXHAM_SITE_NOTICE,
  BRIXHAM_WFD,
} from '../utils/brixhamCaseAnswers';
import { EXMOUTH_SITE_CHECK, EXMOUTH_SITE_NOTICE } from '../utils/exmouthCaseAnswers';
import { EVIDENCE_LOCATION_COUNT } from '../components/tasks/publicNoticeEvidenceLocations';

const noReview = () =>
  Array.from({ length: EVIDENCE_LOCATION_COUNT }, () => ({ decision: '', rejectionComments: '' }));

// A case nobody has worked on: Site check first, everything else waits for it.
export function blankCase(): CaseState {
  return {
    tasks: {
      siteCheck: 'To do',
      wfdAssessment: 'Cannot start yet',
      marinePlanPolicies: 'Cannot start yet',
      prepForConsultee: 'Cannot start yet',
      publicRegister: 'Cannot start yet',
      siteNotice: 'Cannot start yet',
      publicNoticeEvidence: 'To do',
      publicNoticeEvidenceResubmission: 'Resubmitted - to review',
    },
    siteCheckForm: { coordinatesOk: '', withinMile: '', notes: '' },
    wfdForm: { review: '', initialConsiderations: '' },
    mppForm: {},
    prepForConsulteeMeta: { completed: false, consultationPeriod: '' },
    publicRegisterForm: {
      commercialAgree: '',
      commercialApplicantText: '',
      commercialRationale: '',
      personalInfo: '',
      personalInfoDetail: '',
      completed: false,
    },
    siteNoticeForm: { needsNotice: '', rationale: '', summary: '', groups: '' },
    publicNoticeEvidenceMeta: { locations: noReview() },
    publicNoticeEvidenceResubmissionMeta: { reviews: noReview() },
    saved: {
      siteCheck: true,
      wfdAssessment: true,
      marinePlanPolicies: true,
      prepForConsultee: true,
      publicRegister: true,
      siteNotice: true,
      publicNoticeEvidence: true,
      publicNoticeEvidenceResubmission: true,
    },
  };
}

const allDone: Partial<TaskState> = {
  siteCheck: 'Done',
  wfdAssessment: 'Done',
  marinePlanPolicies: 'Done',
  prepForConsultee: 'Done',
  publicRegister: 'Done',
  siteNotice: 'Done',
};

// Only Site check and Public notice are done; the photos have come back.
function evidenceCase(): CaseState {
  const blank = blankCase();
  return {
    ...blank,
    tasks: {
      ...blank.tasks,
      siteCheck: 'Done',
      wfdAssessment: 'To do',
      marinePlanPolicies: 'To do',
      prepForConsultee: 'To do',
      publicRegister: 'To do',
      siteNotice: 'Done',
    },
    siteCheckForm: EXMOUTH_SITE_CHECK,
    siteNoticeForm: EXMOUTH_SITE_NOTICE,
  };
}

// All assessment work is done apart from the replacement photos.
function resubmissionCase(): CaseState {
  const blank = blankCase();
  return {
    ...blank,
    tasks: { ...blank.tasks, ...allDone, publicNoticeEvidence: 'Awaiting applicant' },
    siteCheckForm: BRIXHAM_SITE_CHECK,
    wfdForm: BRIXHAM_WFD,
    mppForm: BRIXHAM_MPP,
    prepForConsulteeMeta: { completed: true, consultationPeriod: BRIXHAM_CONSULTATION_PERIOD },
    publicRegisterForm: BRIXHAM_PUBLIC_REGISTER,
    siteNoticeForm: BRIXHAM_SITE_NOTICE,
  };
}

// In consultation: every task before it is done.
function consultationCase(): CaseState {
  const blank = blankCase();
  return {
    ...blank,
    tasks: { ...blank.tasks, ...allDone },
    siteCheckForm: HAYLING_SITE_CHECK,
    wfdForm: HAYLING_WFD,
    mppForm: HAYLING_MPP,
    prepForConsulteeMeta: { completed: true, consultationPeriod: HAYLING_CONSULTATION_PERIOD },
    publicRegisterForm: { ...blank.publicRegisterForm, personalInfo: 'No', completed: true },
    siteNoticeForm: HAYLING_SITE_NOTICE,
  };
}

const seeds: Record<string, () => CaseState> = {
  [EVIDENCE_CASE_ID]: evidenceCase,
  [RESUBMISSION_CASE_ID]: resubmissionCase,
  [CONSULTATION_CASE_ID]: consultationCase,
};

/** A case's starting state. Cases without a seed start blank. */
export function seedCase(caseId: string): CaseState {
  return (seeds[caseId] ?? blankCase)();
}
