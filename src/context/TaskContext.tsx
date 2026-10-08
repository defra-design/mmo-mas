// src/context/TaskContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { allMppAssessmentsComplete, policies } from '../utils/marinePlanPolicies';
import { startConsultationStatus } from '../utils/startConsultation';
import type { ConsultationsState } from '../utils/startConsultation';
import { loadPublicNoticeRequirement, NO_NOTICES, SITE_NOTICE } from '../utils/publicNoticeRequirement';

export type TaskStatus =
  | 'Done'
  | 'To do'
  | 'In progress'
  | 'Awaiting applicant'
  | 'Resubmitted - to review'
  | 'Cannot start yet';

export interface TaskState {
  siteCheck: TaskStatus;
  wfdAssessment: TaskStatus;
  marinePlanPolicies: TaskStatus;
  prepForConsultee: TaskStatus;
  publicRegister: TaskStatus;
  siteNotice: TaskStatus;
  publicNoticeEvidence: TaskStatus;
  publicNoticeEvidenceResubmission: TaskStatus;
}

export interface SiteCheckForm {
  coordinatesOk: string;
  withinMile: string;
  notes: string;
}

export interface WfdForm {
  review: string;
  initialConsiderations: string;
}

// A caseworker's assessment of one marine plan policy.
export interface MppAnswer {
  outcome: string;
  reason: string;
}

// The MPP task is 1-to-many: one answer per policy, keyed by policy code.
export type MppForm = Record<string, MppAnswer>;

// A related "Consultee" custom-table record, listed in the Prep for consultee
// subgrid and opened full page: Organisation (lookup), Consultation type (Choice)
// and Notes (multiline text revealed for a request for advice).
export interface ConsulteeRow {
  id: string;
  organisation: string;
  consultationType: string;
  notes: string;
}

// Every case's Consultee records, keyed by case reference.
export type ConsulteesState = Record<string, ConsulteeRow[]>;

// Two-options (Yes/No) field on the Prep for consultee task form. Ticked → status
// Done on save; unticked → In progress. Maps to an OOB boolean / Two Options column.
export interface PrepForConsulteeMeta {
  completed: boolean;
}

// Public register task form. `relatesTo`, the two `*Agree` decisions and
// `personalInfo` are OOB Choice columns; the rest are Multiline Text columns
// revealed by business rules on those choices (see publicRegisterFields).
// Commercial confidentiality and national security are assessed separately
// because a request can raise either or both, and each ground gets its own
// decision, applicant wording and internal rationale. `completed` is a Two
// Options column that decides the status on save (as on Prep for consultee).
// The redaction link itself is a URL column on the case, not a caseworker
// answer, so it isn't stored here.
export interface PublicRegisterForm {
  relatesTo: string;
  commercialAgree: string;
  commercialApplicantText: string;
  commercialRationale: string;
  securityAgree: string;
  securityApplicantText: string;
  securityRationale: string;
  personalInfo: string;
  personalInfoDetail: string;
  completed: boolean;
}

// Public notice task form. `needsNotice` stores the notice type or None, retaining
// its original key for saved-data compatibility. OOB Choice business rules reveal
// either `rationale` for None or the site-notice fields. `summary` is a
// Multiline Text column holding the shortened description of the works and
// `groups` is an OOB Choice column naming who has to be told. The applicant's own
// proposed-works summary is read-only case data, so it isn't stored here.
export interface SiteNoticeForm {
  needsNotice: string;
  rationale: string;
  summary: string;
  groups: string;
}

// One related public-notice-location record's native caseworker fields. The
// decision is a Yes/No Choice column; rejection comments are a Multiline Text
// column revealed by a business rule when the decision is No.
export interface PublicNoticeEvidenceLocationReview {
  decision: string;
  rejectionComments: string;
}

// Native fields on the evidence-review task. `completed` is retained only so
// older persisted prototype state continues to hydrate safely; the current form
// completes directly once all required location reviews are valid.
export interface PublicNoticeEvidenceMeta {
  completed: boolean;
  locations: PublicNoticeEvidenceLocationReview[];
}

// MLA/2026/10013 is the later resubmission-stage fixture. Its original review
// is historical/read-only; the replacement photographs get their own decision.
export interface PublicNoticeEvidenceResubmissionMeta {
  completed: boolean;
  review: PublicNoticeEvidenceLocationReview;
}

// Tracks whether each task's form has unsaved edits. Every task starts Saved (true); an
// edit flips it to false ("Unsaved") until the task is saved (matches D365 dirty-tracking).
export interface SavedState {
  siteCheck: boolean;
  wfdAssessment: boolean;
  marinePlanPolicies: boolean;
  prepForConsultee: boolean;
  publicRegister: boolean;
  siteNotice: boolean;
  publicNoticeEvidence: boolean;
  publicNoticeEvidenceResubmission: boolean;
}

// Records a "Transfer to MCMS" against one case. Two stages, done by two teams:
// the Case Officer (CO) requests the transfer, then the Business Support Team
// (BST) carry it out by hand in the legacy MCMS system and record the reference
// it was given there. The completion fields stay undefined until that second step.
export interface TransferState {
  requestedBy: string;
  dateRequested: string;
  reasons: string;
  completedBy?: string;
  dateTransferred?: string;
  mcmsReference?: string;
}

// Every case's transfer record, keyed by case reference. Cases are independent:
// transferring one must never disturb another's status, because a caseworker can
// have several in flight (and cases rejected rather than transferred).
// The Status a case shows while a transfer is in flight is derived from this map
// by `caseStatus` in src/utils/caseStatus.ts.
export type TransfersState = Record<string, TransferState>;

// Records a "Reject application" against one case. One step, done by the Case
// Officer: they pick the reasons (a multi-select choice) and explain them. Unlike
// a transfer this is terminal — the case leaves the caseworker's hands for good.
export interface RejectionState {
  rejectedBy: string;
  dateRejected: string;
  reasons: string[];
  notes: string;
}

// Every case's rejection record, keyed by case reference. Same shape and the same
// independence rule as `transfers` above.
export type RejectionsState = Record<string, RejectionState>;

// Today, in the out-of-the-box D365 format (DD/MM/YYYY).
function today() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

interface PersistedState {
  tasks: TaskState;
  siteCheckForm: SiteCheckForm;
  wfdForm: WfdForm;
  mppForm: MppForm;
  consultees: ConsulteesState;
  prepForConsulteeMeta: PrepForConsulteeMeta;
  publicRegisterForm: PublicRegisterForm;
  siteNoticeForm: SiteNoticeForm;
  publicNoticeEvidenceMeta: PublicNoticeEvidenceMeta;
  publicNoticeEvidenceResubmissionMeta: PublicNoticeEvidenceResubmissionMeta;
  // Organisations the caseworker has recently picked in the lookup, most-recent
  // first. Shared across every consultee record/case (a per-user "Recent records"
  // list, like the real D365 lookup); empty until they select one.
  recentOrganisations: string[];
  saved: SavedState;
  // Every case's Transfer to MCMS record, keyed by case reference.
  transfers: TransfersState;
  // Every case's rejection record, keyed by case reference.
  rejections: RejectionsState;
  consultations: ConsultationsState;
  // Prototype demo flag (set from the index page): Version 2 (false) = Tasks
  // panel on the Case summary tab only; Version 1 (true) = Tasks panel persists
  // on every case tab. See IndexPage.
  tasksOnAllTabs: boolean;
}

const initialState: PersistedState = {
  tasks: {
    siteCheck: 'To do',
    wfdAssessment: 'Cannot start yet',
    marinePlanPolicies: 'Cannot start yet',
    prepForConsultee: 'Cannot start yet',
    publicRegister: 'Cannot start yet',
    siteNotice: 'Cannot start yet',
    // MLA/2026/10014 represents the point after applicant evidence arrives.
    // The row is only rendered for that case and is ready for officer review.
    publicNoticeEvidence: 'To do',
    // MLA/2026/10013 has received replacement photographs and needs the
    // existing evidence-review task brought back to the officer's queue.
    publicNoticeEvidenceResubmission: 'Resubmitted - to review',
  },
  siteCheckForm: { coordinatesOk: '', withinMile: '', notes: '' },
  wfdForm: { review: '', initialConsiderations: '' },
  mppForm: {},
  consultees: {},
  prepForConsulteeMeta: { completed: false },
  publicRegisterForm: {
    relatesTo: '',
    commercialAgree: '',
    commercialApplicantText: '',
    commercialRationale: '',
    securityAgree: '',
    securityApplicantText: '',
    securityRationale: '',
    personalInfo: '',
    personalInfoDetail: '',
    completed: false,
  },
  siteNoticeForm: { needsNotice: '', rationale: '', summary: '', groups: '' },
  publicNoticeEvidenceMeta: {
    completed: false,
    locations: [
      { decision: '', rejectionComments: '' },
      { decision: '', rejectionComments: '' },
      { decision: '', rejectionComments: '' },
    ],
  },
  publicNoticeEvidenceResubmissionMeta: {
    completed: false,
    review: { decision: '', rejectionComments: '' },
  },
  recentOrganisations: [],
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
  transfers: {},
  rejections: {},
  consultations: {},
  // Default to the "tasks on all tabs" experience — the tested Iteration 1
  // behaviour (formerly the "Version 1" index link). The untested "Version 2"
  // variant that turned this off has been dropped.
  tasksOnAllTabs: true,
};

// Scope the persisted state to the build's base URL so a frozen iteration
// (served under /iteration-N/) keeps its own saved answers rather than sharing
// the live app's. At the domain root the base is '/', preserving the original key.
// Every app's key shares this prefix; "Clear saved data" removes them all (see
// resetAll) so one click wipes live and every frozen iteration on this origin.
const STORAGE_KEY_PREFIX = 'mas-review-assess-state';
const base = import.meta.env.BASE_URL;
const STORAGE_KEY =
  base === '/'
    ? STORAGE_KEY_PREFIX
    : `${STORAGE_KEY_PREFIX}:${base.replace(/\//g, '')}`;

// Lift a pre-`transfers` saved record (one `transfer` object holding its own
// caseId) into the keyed map. Anything without `requestedBy` predates the
// two-step split and is discarded.
function migrateSingleTransfer(old: unknown): TransfersState {
  const t = old as (TransferState & { caseId?: string }) | null | undefined;
  return t?.caseId && t.requestedBy ? { [t.caseId]: t } : {};
}

// Hydrate from localStorage so answers survive a full page refresh.
function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const siteNoticeForm: SiteNoticeForm = {
        ...initialState.siteNoticeForm,
        ...parsed.siteNoticeForm,
        needsNotice: loadPublicNoticeRequirement(parsed.siteNoticeForm?.needsNotice),
      };
      const mppForm: MppForm = { ...initialState.mppForm, ...parsed.mppForm };
      const tasks: TaskState = { ...initialState.tasks, ...parsed.tasks };
      // Site check is the MPP prerequisite. Re-derive the roll-up on hydration
      // so stale or legacy task-status values cannot expose assessments early.
      tasks.marinePlanPolicies =
        tasks.siteCheck !== 'Done'
          ? 'Cannot start yet'
          : allMppAssessmentsComplete(mppForm)
            ? 'Done'
            : 'To do';
      // Earlier saved prototype data used the generic To do label when
      // replacement evidence returned to the officer. Adopt the more specific
      // resubmission status without changing reviews already in progress or done.
      if (tasks.publicNoticeEvidenceResubmission === 'To do') {
        tasks.publicNoticeEvidenceResubmission = 'Resubmitted - to review';
      }
      const savedEvidenceLocations = Array.isArray(parsed.publicNoticeEvidenceMeta?.locations)
        ? parsed.publicNoticeEvidenceMeta.locations
        : [];
      const publicNoticeEvidenceMeta: PublicNoticeEvidenceMeta = {
        ...initialState.publicNoticeEvidenceMeta,
        ...parsed.publicNoticeEvidenceMeta,
        locations: initialState.publicNoticeEvidenceMeta.locations.map((location, index) => {
          const savedLocation = savedEvidenceLocations[index];
          const savedDecision = savedLocation?.decision;
          return {
            ...location,
            ...savedLocation,
            decision:
              savedDecision === 'Accept'
                ? 'Yes'
                : savedDecision === 'Reject'
                  ? 'No'
                  : savedDecision === 'Yes' || savedDecision === 'No'
                    ? savedDecision
                    : location.decision,
          };
        }),
      };
      if (!parsed.publicNoticeEvidenceMeta && tasks.publicNoticeEvidence === 'Done') {
        publicNoticeEvidenceMeta.completed = true;
      }
      const completedEvidenceReviewIsValid = publicNoticeEvidenceMeta.locations.every(
        location =>
          Boolean(location.decision.trim()) &&
          (location.decision !== 'No' || Boolean(location.rejectionComments.trim())),
      );
      const evidenceReviewNeedsMigration =
        publicNoticeEvidenceMeta.completed && !completedEvidenceReviewIsValid;
      if (evidenceReviewNeedsMigration) {
        publicNoticeEvidenceMeta.completed = false;
        tasks.publicNoticeEvidence = 'In progress';
      } else if (
        publicNoticeEvidenceMeta.completed &&
        publicNoticeEvidenceMeta.locations.some(location => location.decision === 'No')
      ) {
        // Existing saved reviews adopt the new hand-off rule as well: one
        // location answered No means the applicant needs to provide new evidence.
        tasks.publicNoticeEvidence = 'Awaiting applicant';
      }

      // Saved records from before the applicant-evidence hand-off marked a
      // required Site notice Done. Lift those records into the new waiting
      // state; MLA/2026/10014 is presented as Done by its case fixture because
      // its evidence has already arrived.
      if (tasks.siteNotice === 'Done' && siteNoticeForm.needsNotice === SITE_NOTICE) {
        tasks.siteNotice = 'Awaiting applicant';
      }

      const publicNoticeEvidenceResubmissionMeta: PublicNoticeEvidenceResubmissionMeta = {
        ...initialState.publicNoticeEvidenceResubmissionMeta,
        ...parsed.publicNoticeEvidenceResubmissionMeta,
        review: {
          ...initialState.publicNoticeEvidenceResubmissionMeta.review,
          ...parsed.publicNoticeEvidenceResubmissionMeta?.review,
        },
      };
      const resubmissionReviewIsValid =
        Boolean(publicNoticeEvidenceResubmissionMeta.review.decision.trim()) &&
        (publicNoticeEvidenceResubmissionMeta.review.decision !== 'No' ||
          Boolean(publicNoticeEvidenceResubmissionMeta.review.rejectionComments.trim()));
      const resubmissionReviewNeedsMigration =
        publicNoticeEvidenceResubmissionMeta.completed && !resubmissionReviewIsValid;
      if (resubmissionReviewNeedsMigration) {
        publicNoticeEvidenceResubmissionMeta.completed = false;
        tasks.publicNoticeEvidenceResubmission = 'Resubmitted - to review';
      }

      return {
        tasks,
        siteCheckForm: { ...initialState.siteCheckForm, ...parsed.siteCheckForm },
        wfdForm: { ...initialState.wfdForm, ...parsed.wfdForm },
        mppForm,
        // Older saved state held one consultee list shared by every case. It
        // cannot be assigned to a case, so it is dropped.
        consultees: Object.fromEntries(
          Object.entries(parsed.consultees ?? {}).flatMap(([caseId, rows]) =>
            Array.isArray(rows) ? [[caseId, (rows as Partial<ConsulteeRow>[])
              .filter(row => typeof row.id === 'string' && typeof row.organisation === 'string')
              .map(row => ({
                id: row.id as string,
                organisation: row.organisation as string,
                consultationType: typeof row.consultationType === 'string' ? row.consultationType : '',
                notes: typeof row.notes === 'string' ? row.notes : '',
              }))]] : []),
        ),
        prepForConsulteeMeta: {
          ...initialState.prepForConsulteeMeta,
          ...parsed.prepForConsulteeMeta,
        },
        publicRegisterForm: {
          ...initialState.publicRegisterForm,
          ...parsed.publicRegisterForm,
        },
        siteNoticeForm,
        publicNoticeEvidenceMeta,
        publicNoticeEvidenceResubmissionMeta,
        recentOrganisations: Array.isArray(parsed.recentOrganisations)
          ? parsed.recentOrganisations
          : initialState.recentOrganisations,
        saved: {
          ...initialState.saved,
          ...parsed.saved,
          ...(evidenceReviewNeedsMigration ? { publicNoticeEvidence: false } : {}),
          ...(resubmissionReviewNeedsMigration
            ? { publicNoticeEvidenceResubmission: false }
            : {}),
        },
        // State saved before transfers were keyed by case held a single `transfer`
        // object carrying its own caseId; lift it into the map. Anything older than
        // the two-step split has no `requestedBy` and would render an empty card,
        // so it is dropped rather than migrated.
        transfers: parsed.transfers ?? migrateSingleTransfer(parsed.transfer),
        rejections: parsed.rejections ?? initialState.rejections,
        consultations: Object.fromEntries(
          Object.entries(parsed.consultations ?? {}).flatMap(([caseId, value]) => {
            if (!value || typeof value !== 'object') return [];
            const record = value as Record<string, unknown>;
            return [[caseId, {
              confirmed: record.confirmed === true,
              saved: record.saved !== false,
              ...(typeof record.startedAt === 'string' && record.startedAt
                ? { startedAt: record.startedAt } : {}),
            }]];
          }),
        ),
        tasksOnAllTabs: parsed.tasksOnAllTabs ?? initialState.tasksOnAllTabs,
      };
    }
  } catch {
    /* ignore corrupt storage */
  }
  return initialState;
}

interface TaskContextValue {
  tasks: TaskState;
  siteCheckForm: SiteCheckForm;
  wfdForm: WfdForm;
  mppForm: MppForm;
  consultees: ConsulteesState;
  prepForConsulteeMeta: PrepForConsulteeMeta;
  publicRegisterForm: PublicRegisterForm;
  siteNoticeForm: SiteNoticeForm;
  publicNoticeEvidenceMeta: PublicNoticeEvidenceMeta;
  publicNoticeEvidenceResubmissionMeta: PublicNoticeEvidenceResubmissionMeta;
  recentOrganisations: string[];
  saved: SavedState;
  transfers: TransfersState;
  rejections: RejectionsState;
  consultations: ConsultationsState;
  tasksOnAllTabs: boolean;
  requestTransferToMcms: (caseId: string, reasons: string, requestedBy: string) => void;
  completeTransferToMcms: (caseId: string, mcmsReference: string, completedBy: string) => void;
  rejectApplication: (
    caseId: string,
    reasons: string[],
    notes: string,
    rejectedBy: string,
  ) => void;
  setTasksOnAllTabs: (value: boolean) => void;
  setSiteCheckField: (field: keyof SiteCheckForm, value: string) => void;
  setWfdReview: (value: string) => void;
  setWfdInitialConsiderations: (value: string) => void;
  setMppField: (code: string, field: keyof MppAnswer, value: string) => void;
  saveConsultee: (caseId: string, consultee: ConsulteeRow) => void;
  removeConsultees: (caseId: string, ids: string[]) => void;
  setPrepForConsulteeCompleted: (completed: boolean) => void;
  setPublicRegisterField: <K extends keyof PublicRegisterForm>(
    field: K,
    value: PublicRegisterForm[K],
  ) => void;
  setSiteNoticeField: (field: keyof SiteNoticeForm, value: string) => void;
  setPublicNoticeEvidenceResubmissionField: (
    field: keyof PublicNoticeEvidenceLocationReview,
    value: string,
  ) => void;
  setPublicNoticeEvidenceLocationField: (
    index: number,
    field: keyof PublicNoticeEvidenceLocationReview,
    value: string,
  ) => void;
  addRecentOrganisation: (name: string) => void;
  markUnsaved: (task: keyof SavedState) => void;
  completeSiteCheck: () => void;
  completeWfd: () => void;
  savePrepForConsultee: () => void;
  savePublicRegister: () => void;
  saveSiteNotice: () => void;
  savePublicNoticeEvidence: () => void;
  savePublicNoticeEvidenceResubmission: () => void;
  setConsultationConfirmed: (caseId: string, confirmed: boolean) => void;
  saveStartConsultation: (caseId: string) => void;
  loadConsultationExample: () => void;
  resetAll: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<PersistedState>(loadState);

  // Index-page shortcut. Assessment answers are shared in this prototype;
  // only MLA 15's case-level decisions are cleared when replaying the example.
  const loadConsultationExample = () => setState(prev => {
    const caseId = 'MLA/2026/10015';
    const consultations = { ...prev.consultations };
    const transfers = { ...prev.transfers };
    const rejections = { ...prev.rejections };
    delete consultations[caseId];
    delete transfers[caseId];
    delete rejections[caseId];
    return {
      ...prev,
      tasks: { ...prev.tasks, siteCheck: 'Done', wfdAssessment: 'Done',
        marinePlanPolicies: 'Done', prepForConsultee: 'Done', publicRegister: 'Done', siteNotice: 'Done' },
      saved: { ...prev.saved, siteCheck: true, wfdAssessment: true,
        marinePlanPolicies: true, prepForConsultee: true, publicRegister: true, siteNotice: true },
      siteCheckForm: { coordinatesOk: 'Yes', withinMile: 'Yes', notes: 'Site and coordinates checked for this example.' },
      wfdForm: { review: 'Yes', initialConsiderations: 'WFD information reviewed. No further assessment required for this example.' },
      mppForm: Object.fromEntries(policies.map(policy => [policy.code, {
        outcome: 'Compliant', reason: `The proposal is consistent with ${policy.code} for this example.`,
      }])),
      consultees: { ...prev.consultees, [caseId]: [{ id: crypto.randomUUID(), organisation: 'Environment Agency (EA)',
        consultationType: 'Request for advice', notes: 'Please provide advice on the proposed works.' }] },
      prepForConsulteeMeta: { completed: true },
      publicRegisterForm: { ...initialState.publicRegisterForm, completed: true, personalInfo: 'No',
        relatesTo: 'Commercial or industrial confidentiality', commercialAgree: 'Agree - withhold all of it',
        commercialRationale: 'Commercially sensitive information checked and redacted for this example.' },
      siteNoticeForm: { needsNotice: NO_NOTICES, rationale: 'No public notice is required for this example.', summary: '', groups: '' },
      consultations, transfers, rejections,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [state]);

  const setConsultationConfirmed = (caseId: string, confirmed: boolean) =>
    setState(prev => {
      if (startConsultationStatus(caseId, prev) !== 'To do') return prev;
      return { ...prev, consultations: { ...prev.consultations,
        [caseId]: { confirmed, saved: false },
      } };
    });

  const saveStartConsultation = (caseId: string) =>
    setState(prev => {
      // Recheck at the action boundary: locked/direct URLs and repeated saves
      // cannot bypass prerequisites or start a consultation twice.
      if (startConsultationStatus(caseId, prev) !== 'To do') return prev;
      const confirmed = prev.consultations[caseId]?.confirmed === true;
      return { ...prev, consultations: { ...prev.consultations,
        [caseId]: { confirmed, saved: true,
          ...(confirmed ? { startedAt: new Date().toISOString() } : {}),
        },
      } };
    });

  const setTasksOnAllTabs = (value: boolean) =>
    setState(prev => ({ ...prev, tasksOnAllTabs: value }));

  // Step 1 (Case Officer): request the transfer, recording the reasons. Other
  // cases' records are untouched.
  const requestTransferToMcms = (caseId: string, reasons: string, requestedBy: string) =>
    setState(prev => ({
      ...prev,
      transfers: {
        ...prev.transfers,
        [caseId]: { requestedBy, dateRequested: today(), reasons },
      },
    }));

  // Step 2 (Business Support Team): record the reference MCMS gave the case, which
  // completes the transfer. No-op unless this case has a pending request.
  const completeTransferToMcms = (caseId: string, mcmsReference: string, completedBy: string) =>
    setState(prev =>
      prev.transfers[caseId]
        ? {
            ...prev,
            transfers: {
              ...prev.transfers,
              [caseId]: {
                ...prev.transfers[caseId],
                completedBy,
                dateTransferred: today(),
                mcmsReference,
              },
            },
          }
        : prev,
    );

  // The Case Officer rejects the application, recording the reasons they picked
  // and their notes. Other cases' records are untouched.
  const rejectApplication = (
    caseId: string,
    reasons: string[],
    notes: string,
    rejectedBy: string,
  ) =>
    setState(prev => ({
      ...prev,
      rejections: {
        ...prev.rejections,
        [caseId]: { rejectedBy, dateRejected: today(), reasons, notes },
      },
    }));

  const setSiteCheckField = (field: keyof SiteCheckForm, value: string) =>
    setState(prev => ({ ...prev, siteCheckForm: { ...prev.siteCheckForm, [field]: value } }));

  const setWfdReview = (value: string) =>
    setState(prev => ({ ...prev, wfdForm: { ...prev.wfdForm, review: value } }));

  const setWfdInitialConsiderations = (value: string) =>
    setState(prev => ({
      ...prev,
      wfdForm: { ...prev.wfdForm, initialConsiderations: value },
    }));

  // Writes one field of one policy's assessment (live, like setSiteCheckField). A
  // policy only counts as assessed once it has both an outcome and a reason — the
  // two business-required fields on its form. Once every policy is assessed the
  // whole MPP task rolls up to Done; otherwise it stays "To do" while it's being
  // worked through.
  const setMppField = (code: string, field: keyof MppAnswer, value: string) =>
    setState(prev => {
      const existing = prev.mppForm[code] ?? { outcome: '', reason: '' };
      const mppForm = {
        ...prev.mppForm,
        [code]: { ...existing, [field]: value },
      };
      const allAssessed = allMppAssessmentsComplete(mppForm);
      // Site check remains authoritative even if stale form data exists. Once it
      // is complete, the MPP roll-up is derived from the 41 assessments.
      const marinePlanPolicies =
        prev.tasks.siteCheck !== 'Done'
          ? 'Cannot start yet'
          : allAssessed
            ? 'Done'
            : 'To do';
      return {
        ...prev,
        mppForm,
        tasks: { ...prev.tasks, marinePlanPolicies },
      };
    });

  // Save and close on a Consultee record: adds it to the case's subgrid, or
  // replaces the existing record with the same id.
  const saveConsultee = (caseId: string, consultee: ConsulteeRow) =>
    setState(prev => {
      const rows = prev.consultees[caseId] ?? [];
      const next = rows.some(row => row.id === consultee.id)
        ? rows.map(row => (row.id === consultee.id ? consultee : row))
        : [...rows, consultee];
      return { ...prev, consultees: { ...prev.consultees, [caseId]: next } };
    });

  // The subgrid's Remove command, for the selected records.
  const removeConsultees = (caseId: string, ids: string[]) =>
    setState(prev => ({
      ...prev,
      consultees: {
        ...prev.consultees,
        [caseId]: (prev.consultees[caseId] ?? []).filter(row => !ids.includes(row.id)),
      },
    }));

  const setPrepForConsulteeCompleted = (completed: boolean) =>
    setState(prev => ({
      ...prev,
      prepForConsulteeMeta: { ...prev.prepForConsulteeMeta, completed },
    }));

  const setPublicRegisterField = <K extends keyof PublicRegisterForm>(
    field: K,
    value: PublicRegisterForm[K],
  ) =>
    setState(prev => ({
      ...prev,
      publicRegisterForm: { ...prev.publicRegisterForm, [field]: value },
    }));

  const setSiteNoticeField = (field: keyof SiteNoticeForm, value: string) =>
    setState(prev => ({ ...prev, siteNoticeForm: { ...prev.siteNoticeForm, [field]: value } }));

  const setPublicNoticeEvidenceResubmissionField = (
    field: keyof PublicNoticeEvidenceLocationReview,
    value: string,
  ) =>
    setState(prev => ({
      ...prev,
      publicNoticeEvidenceResubmissionMeta: {
        ...prev.publicNoticeEvidenceResubmissionMeta,
        review: {
          ...prev.publicNoticeEvidenceResubmissionMeta.review,
          [field]: value,
        },
      },
    }));

  const setPublicNoticeEvidenceLocationField = (
    index: number,
    field: keyof PublicNoticeEvidenceLocationReview,
    value: string,
  ) =>
    setState(prev => ({
      ...prev,
      publicNoticeEvidenceMeta: {
        ...prev.publicNoticeEvidenceMeta,
        locations: prev.publicNoticeEvidenceMeta.locations.map((location, locationIndex) =>
          locationIndex === index ? { ...location, [field]: value } : location,
        ),
      },
    }));

  // Records a lookup pick as the most-recent organisation: moves it to the front,
  // de-duplicates, and keeps at most the last 5 (matches D365's "Recent records").
  const RECENT_ORG_LIMIT = 5;
  const addRecentOrganisation = (name: string) =>
    setState(prev => {
      const trimmed = name.trim();
      if (!trimmed) return prev;
      const next = [trimmed, ...prev.recentOrganisations.filter(o => o !== trimmed)].slice(
        0,
        RECENT_ORG_LIMIT,
      );
      return { ...prev, recentOrganisations: next };
    });

  // An edit marks the task as having unsaved changes (shown in the task header).
  const markUnsaved = (task: keyof SavedState) =>
    setState(prev => ({ ...prev, saved: { ...prev.saved, [task]: false } }));

  // Saving the Site check completes it, marks it saved, and unlocks downstream tasks.
  const completeSiteCheck = () =>
    setState(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        siteCheck: 'Done',
        wfdAssessment: 'To do',
        marinePlanPolicies: allMppAssessmentsComplete(prev.mppForm) ? 'Done' : 'To do',
        prepForConsultee: 'To do',
        publicRegister: 'To do',
        siteNotice: 'To do',
      },
      saved: { ...prev.saved, siteCheck: true },
    }));

  // Saving the WFD assessment completes it and marks it saved; nothing depends on it.
  const completeWfd = () =>
    setState(prev => ({
      ...prev,
      tasks: { ...prev.tasks, wfdAssessment: 'Done' },
      saved: { ...prev.saved, wfdAssessment: true },
    }));

  // Save Prep for consultee: ticked "completed" → Done; otherwise → In progress.
  // Status "In progress" is OOB on Task activities; the checkbox is a Two Options field.
  const savePrepForConsultee = () =>
    setState(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        prepForConsultee: prev.prepForConsulteeMeta.completed ? 'Done' : 'In progress',
      },
      saved: { ...prev.saved, prepForConsultee: true },
    }));

  // Save Public register: same two-options rule as Prep for consultee — ticked
  // "completed" → Done, otherwise → In progress. Nothing depends on this task.
  const savePublicRegister = () =>
    setState(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        publicRegister: prev.publicRegisterForm.completed ? 'Done' : 'In progress',
      },
      saved: { ...prev.saved, publicRegister: true },
    }));

  // A required Site notice hands work to the applicant, so the officer's save
  // leaves the task open as Awaiting applicant. If no notice is required there
  // is no applicant evidence to wait for and the task is Done immediately.
  const saveSiteNotice = () =>
    setState(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        siteNotice:
          prev.siteNoticeForm.needsNotice === SITE_NOTICE ? 'Awaiting applicant' : 'Done',
      },
      saved: { ...prev.saved, siteNotice: true },
    }));

  // Review is deliberately separate from Public notice and only appears once
  // evidence exists (MLA/2026/10014 in this prototype fixture). The form
  // validates every required review before calling this action; any location
  // answered No waits for replacement evidence, otherwise the task is Done.
  const savePublicNoticeEvidence = () =>
    setState(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        publicNoticeEvidence: prev.publicNoticeEvidenceMeta.locations.some(
          location => location.decision === 'No',
        )
          ? 'Awaiting applicant'
          : 'Done',
      },
      saved: { ...prev.saved, publicNoticeEvidence: true },
    }));

  // Replacement photographs follow the same hand-off rule as the original
  // evidence: No returns the task to the applicant; Yes completes the review.
  const savePublicNoticeEvidenceResubmission = () =>
    setState(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        publicNoticeEvidenceResubmission:
          prev.publicNoticeEvidenceResubmissionMeta.review.decision === 'No'
            ? 'Awaiting applicant'
            : 'Done',
      },
      saved: { ...prev.saved, publicNoticeEvidenceResubmission: true },
    }));

  // Clears every prototype key on this origin (live + all frozen iterations),
  // not just this app's own key, so the index page's "Clear saved data" wipes
  // everything as it did before iterations got their own scoped keys. The
  // useEffect below then re-seeds only the current app's key with initialState.
  const resetAll = () => {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEY_PREFIX)) localStorage.removeItem(key);
      }
    } catch {
      /* ignore storage errors */
    }
    setState(initialState);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        siteCheckForm: state.siteCheckForm,
        wfdForm: state.wfdForm,
        mppForm: state.mppForm,
        consultees: state.consultees,
        prepForConsulteeMeta: state.prepForConsulteeMeta,
        publicRegisterForm: state.publicRegisterForm,
        siteNoticeForm: state.siteNoticeForm,
        publicNoticeEvidenceMeta: state.publicNoticeEvidenceMeta,
        publicNoticeEvidenceResubmissionMeta: state.publicNoticeEvidenceResubmissionMeta,
        recentOrganisations: state.recentOrganisations,
        saved: state.saved,
        transfers: state.transfers,
        rejections: state.rejections,
        consultations: state.consultations,
        setConsultationConfirmed,
        saveStartConsultation,
        loadConsultationExample,
        tasksOnAllTabs: state.tasksOnAllTabs,
        requestTransferToMcms,
        completeTransferToMcms,
        rejectApplication,
        setTasksOnAllTabs,
        setSiteCheckField,
        setWfdReview,
        setWfdInitialConsiderations,
        setMppField,
        saveConsultee,
        removeConsultees,
        setPrepForConsulteeCompleted,
        setPublicRegisterField,
        setSiteNoticeField,
        setPublicNoticeEvidenceResubmissionField,
        setPublicNoticeEvidenceLocationField,
        addRecentOrganisation,
        markUnsaved,
        completeSiteCheck,
        completeWfd,
        savePrepForConsultee,
        savePublicRegister,
        saveSiteNotice,
        savePublicNoticeEvidence,
        savePublicNoticeEvidenceResubmission,
        resetAll,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider');
  return ctx;
}
