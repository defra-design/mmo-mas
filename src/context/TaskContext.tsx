// src/context/TaskContext.tsx
// Holds every case's task statuses and answers, mirrored to localStorage so a
// caseworker can leave a case and come back to it. Each case is independent:
// answering a task on one case never changes another.
import { createContext, useContext, useEffect, useState } from 'react';
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { allMppAssessmentsComplete } from '../utils/marinePlanPolicies';
import { startConsultationStatus } from '../utils/startConsultation';
import { HAYLING_CONSULTEES } from '../utils/consultationCaseAnswers';
import { BRIXHAM_CONSULTEES } from '../utils/brixhamCaseAnswers';
import { CONSULTATION_CASE_ID, RESUBMISSION_CASE_ID } from '../utils/cases';
import type { ConsultationsState } from '../utils/startConsultation';
import { loadPublicNoticeRequirement, SITE_NOTICE } from '../utils/publicNoticeRequirement';
import { currentDecision, publicNoticeEvidenceStatus } from '../utils/publicNoticeEvidence';
import {
  EVIDENCE_LOCATION_COUNT,
  resubmittedLocationIndexes,
} from '../components/tasks/publicNoticeEvidenceLocations';
import { seedCase } from './caseSeeds';

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
// `consultationPeriod` is an OOB Choice column (14, 21 or 28 days) set once for
// all of the case's consultees; '' is an unset choice.
export interface PrepForConsulteeMeta {
  completed: boolean;
  consultationPeriod: string;
}

// Withholding information task form (stored under its old Public register key).
// `commercialAgree` and `personalInfo` are OOB Choice columns; the rest are
// Multiline Text columns revealed by business rules on those choices (see
// publicRegisterFields). The applicant chose the reason for withholding, so the
// live cases only assess commercial or industrial confidentiality. `completed` is
// a Two Options column that decides the status on save (as on Prep for consultee).
// The redaction link itself is a URL column on the case, not a caseworker
// answer, so it isn't stored here.
export interface PublicRegisterForm {
  commercialAgree: string;
  commercialApplicantText: string;
  commercialRationale: string;
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
// column revealed by a business rule when the decision is No - request new photos.
export interface PublicNoticeEvidenceLocationReview {
  decision: string;
  rejectionComments: string;
}

// The evidence-review task's related location records, each reviewed on its own
// form. The task status follows from them (see publicNoticeEvidenceStatus).
export interface PublicNoticeEvidenceMeta {
  locations: PublicNoticeEvidenceLocationReview[];
}

// MLA/2026/10013 is at the resubmission stage. Its original review
// is historical/read-only; each location with replacement photographs gets its
// own new decision, held at that location's index (other entries stay empty).
export interface PublicNoticeEvidenceResubmissionMeta {
  reviews: PublicNoticeEvidenceLocationReview[];
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

// One extension to a case's consultee closing date: a Consultation extension
// record, related to the case. `dateExtended` is an ISO date; the new closing
// date follows from the extensions before it (see utils/consultationCase).
export interface ConsultationExtension {
  id: string;
  dateExtended: string;
  days: number;
  reason: string;
}

// Every case's consultation extensions, keyed by case reference, oldest first.
export type ConsultationExtensionsState = Record<string, ConsultationExtension[]>;

// Today, in the out-of-the-box D365 format (DD/MM/YYYY).
function today() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// One case's tasks: their statuses, the answers saved on each, and whether each
// has unsaved edits.
export interface CaseState {
  tasks: TaskState;
  siteCheckForm: SiteCheckForm;
  wfdForm: WfdForm;
  mppForm: MppForm;
  prepForConsulteeMeta: PrepForConsulteeMeta;
  publicRegisterForm: PublicRegisterForm;
  siteNoticeForm: SiteNoticeForm;
  publicNoticeEvidenceMeta: PublicNoticeEvidenceMeta;
  publicNoticeEvidenceResubmissionMeta: PublicNoticeEvidenceResubmissionMeta;
  saved: SavedState;
}

interface PersistedState {
  // Each case's tasks, keyed by case reference. A case appears here once it is
  // first changed; until then it shows its seed (see caseSeeds).
  cases: Record<string, CaseState>;
  consultees: ConsulteesState;
  // Organisations the caseworker has recently picked in the lookup, most-recent
  // first. Shared across every case (a per-user "Recent records" list, like the
  // real D365 lookup); empty until they select one.
  recentOrganisations: string[];
  // Every case's Transfer to MCMS record, keyed by case reference.
  transfers: TransfersState;
  // Every case's rejection record, keyed by case reference.
  rejections: RejectionsState;
  consultations: ConsultationsState;
  consultationExtensions: ConsultationExtensionsState;
}

const initialState: PersistedState = {
  cases: {},
  // The cases past Prepare for consultation start with their consultees.
  consultees: {
    [CONSULTATION_CASE_ID]: HAYLING_CONSULTEES,
    [RESUBMISSION_CASE_ID]: BRIXHAM_CONSULTEES,
  },
  recentOrganisations: [],
  transfers: {},
  rejections: {},
  consultations: {},
  consultationExtensions: {},
};

// Scope the persisted state to the build's base URL so a frozen iteration
// (served under /iteration-N/) keeps its own saved answers rather than sharing
// the live app's. Every app's key shares this prefix; "Clear saved data" removes
// them all (see resetAll) so one click wipes live and every frozen iteration.
// The live key carries a version: Iteration 2 kept one set of answers for every
// case, which can't be shared out between cases, so that data is left behind.
const STORAGE_KEY_PREFIX = 'mas-review-assess-state';
const base = import.meta.env.BASE_URL;
const STORAGE_KEY =
  base === '/'
    ? `${STORAGE_KEY_PREFIX}:v3`
    : `${STORAGE_KEY_PREFIX}:${base.replace(/\//g, '')}`;

// Re-derive the statuses that follow from saved answers, so stale or partial
// saved data can't show a status its answers don't support.
function normaliseCase(caseId: string, saved: Partial<CaseState> | undefined): CaseState {
  const seed = seedCase(caseId);
  const tasks: TaskState = { ...seed.tasks, ...saved?.tasks };
  const mppForm: MppForm = { ...seed.mppForm, ...saved?.mppForm };
  const siteNoticeForm: SiteNoticeForm = {
    ...seed.siteNoticeForm,
    ...saved?.siteNoticeForm,
  };
  siteNoticeForm.needsNotice = loadPublicNoticeRequirement(siteNoticeForm.needsNotice);
  tasks.marinePlanPolicies = mppRollUp(caseId, tasks.siteCheck, mppForm);
  const reviews = (list: unknown, fallback: PublicNoticeEvidenceLocationReview[]) =>
    fallback.map((review, index) => {
      const savedReview = Array.isArray(list) ? list[index] : undefined;
      return { ...review, ...savedReview, decision: currentDecision(savedReview?.decision) || review.decision };
    });
  const publicNoticeEvidenceMeta = {
    locations: reviews(saved?.publicNoticeEvidenceMeta?.locations, seed.publicNoticeEvidenceMeta.locations),
  };
  const publicNoticeEvidenceResubmissionMeta = {
    reviews: reviews(saved?.publicNoticeEvidenceResubmissionMeta?.reviews, seed.publicNoticeEvidenceResubmissionMeta.reviews),
  };
  tasks.publicNoticeEvidence = publicNoticeEvidenceStatus(publicNoticeEvidenceMeta.locations, seed.tasks.publicNoticeEvidence);
  tasks.publicNoticeEvidenceResubmission = publicNoticeEvidenceStatus(
    resubmittedLocationIndexes.map(index => publicNoticeEvidenceResubmissionMeta.reviews[index]),
    'Resubmitted - to review',
  );
  return {
    tasks,
    siteCheckForm: { ...seed.siteCheckForm, ...saved?.siteCheckForm },
    wfdForm: { ...seed.wfdForm, ...saved?.wfdForm },
    mppForm,
    prepForConsulteeMeta: { ...seed.prepForConsulteeMeta, ...saved?.prepForConsulteeMeta },
    publicRegisterForm: { ...seed.publicRegisterForm, ...saved?.publicRegisterForm },
    siteNoticeForm,
    publicNoticeEvidenceMeta,
    publicNoticeEvidenceResubmissionMeta,
    saved: { ...seed.saved, ...saved?.saved },
  };
}

// Site check is the MPP prerequisite. Once it is done, the MPP task is Done when
// every policy on the case has been assessed.
function mppRollUp(caseId: string, siteCheck: TaskStatus, mppForm: MppForm): TaskStatus {
  if (siteCheck !== 'Done') return 'Cannot start yet';
  return allMppAssessmentsComplete(caseId, mppForm) ? 'Done' : 'To do';
}

// Keep only well-formed per-case records from saved data.
function keyedArrays<T>(saved: unknown, valid: (row: Partial<T>) => boolean): Record<string, T[]> {
  return Object.fromEntries(
    Object.entries((saved ?? {}) as Record<string, unknown>).flatMap(([caseId, rows]) =>
      Array.isArray(rows) ? [[caseId, (rows as Partial<T>[]).filter(valid) as T[]]] : []),
  );
}

// Hydrate from localStorage so answers survive a full page refresh.
function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        cases: Object.fromEntries(
          Object.entries((parsed.cases ?? {}) as Record<string, Partial<CaseState>>)
            .map(([caseId, saved]) => [caseId, normaliseCase(caseId, saved)]),
        ),
        consultees: {
          ...initialState.consultees,
          ...keyedArrays<ConsulteeRow>(parsed.consultees, row =>
            typeof row.id === 'string' && typeof row.organisation === 'string'),
        },
        recentOrganisations: Array.isArray(parsed.recentOrganisations) ? parsed.recentOrganisations : [],
        transfers: parsed.transfers ?? {},
        rejections: parsed.rejections ?? {},
        consultations: parsed.consultations ?? {},
        consultationExtensions: keyedArrays<ConsultationExtension>(parsed.consultationExtensions, row =>
          typeof row.id === 'string' && typeof row.dateExtended === 'string'
            && typeof row.days === 'number' && typeof row.reason === 'string'),
      };
    }
  } catch {
    /* ignore corrupt storage */
  }
  return initialState;
}

// Everything a case's screens need: that case's tasks and answers, the records
// kept per case, and the actions. Task actions apply to this case only.
export interface CaseTasks extends CaseState {
  consultees: ConsulteesState;
  recentOrganisations: string[];
  transfers: TransfersState;
  rejections: RejectionsState;
  consultations: ConsultationsState;
  consultationExtensions: ConsultationExtensionsState;
  addConsultationExtension: (caseId: string, extension: ConsultationExtension) => void;
  requestTransferToMcms: (caseId: string, reasons: string, requestedBy: string) => void;
  completeTransferToMcms: (caseId: string, mcmsReference: string, completedBy: string) => void;
  rejectApplication: (caseId: string, reasons: string[], notes: string, rejectedBy: string) => void;
  saveConsultee: (caseId: string, consultee: ConsulteeRow) => void;
  removeConsultees: (caseId: string, ids: string[]) => void;
  addRecentOrganisation: (name: string) => void;
  setConsultationConfirmed: (caseId: string, confirmed: boolean) => void;
  saveStartConsultation: (caseId: string) => void;
  setSiteCheckField: (field: keyof SiteCheckForm, value: string) => void;
  setWfdReview: (value: string) => void;
  setWfdInitialConsiderations: (value: string) => void;
  setMppField: (code: string, field: keyof MppAnswer, value: string) => void;
  setPrepForConsulteeCompleted: (completed: boolean) => void;
  setConsultationPeriod: (period: string) => void;
  setPublicRegisterField: <K extends keyof PublicRegisterForm>(field: K, value: PublicRegisterForm[K]) => void;
  setSiteNoticeField: (field: keyof SiteNoticeForm, value: string) => void;
  setPublicNoticeEvidenceLocation: (index: number, review: PublicNoticeEvidenceLocationReview) => void;
  setPublicNoticeEvidenceResubmissionReview: (index: number, review: PublicNoticeEvidenceLocationReview) => void;
  markUnsaved: (task: keyof SavedState) => void;
  completeSiteCheck: () => void;
  completeWfd: () => void;
  savePrepForConsultee: () => void;
  savePublicRegister: () => void;
  saveSiteNotice: () => void;
}

interface TaskContextValue {
  state: PersistedState;
  setState: Dispatch<SetStateAction<PersistedState>>;
  resetAll: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<PersistedState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [state]);

  // Clears every prototype key on this origin (live + all frozen iterations),
  // so the index page's "Clear saved data" wipes everything. The useEffect
  // above then re-seeds only the current app's key.
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
    <TaskContext.Provider value={{ state, setState, resetAll }}>
      {children}
    </TaskContext.Provider>
  );
}

function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider');
  return ctx;
}

/** The records kept per case across every case: for the case list and index page. */
export function useTasks() {
  const { state, resetAll } = useTaskContext();
  return {
    transfers: state.transfers,
    rejections: state.rejections,
    consultations: state.consultations,
    resetAll,
  };
}

/** One case's tasks and answers, and the actions that change them. */
export function useCaseTasks(caseId: string): CaseTasks {
  const { state, setState } = useTaskContext();
  const current = state.cases[caseId] ?? seedCase(caseId);

  // Apply a change to this case only.
  const update = (change: (c: CaseState) => Partial<CaseState>) =>
    setState(prev => {
      const c = prev.cases[caseId] ?? seedCase(caseId);
      return { ...prev, cases: { ...prev.cases, [caseId]: { ...c, ...change(c) } } };
    });

  return {
    ...current,
    consultees: state.consultees,
    recentOrganisations: state.recentOrganisations,
    transfers: state.transfers,
    rejections: state.rejections,
    consultations: state.consultations,
    consultationExtensions: state.consultationExtensions,

    // Saving an extension adds the record; the case's closing date follows from it.
    addConsultationExtension: (id, extension) =>
      setState(prev => ({
        ...prev,
        consultationExtensions: {
          ...prev.consultationExtensions,
          [id]: [...(prev.consultationExtensions[id] ?? []), extension],
        },
      })),

    // Step 1 (Case Officer): request the transfer, recording the reasons.
    requestTransferToMcms: (id, reasons, requestedBy) =>
      setState(prev => ({
        ...prev,
        transfers: { ...prev.transfers, [id]: { requestedBy, dateRequested: today(), reasons } },
      })),

    // Step 2 (Business Support Team): record the reference MCMS gave the case.
    // No-op unless this case has a pending request.
    completeTransferToMcms: (id, mcmsReference, completedBy) =>
      setState(prev =>
        prev.transfers[id]
          ? {
              ...prev,
              transfers: {
                ...prev.transfers,
                [id]: { ...prev.transfers[id], completedBy, dateTransferred: today(), mcmsReference },
              },
            }
          : prev,
      ),

    rejectApplication: (id, reasons, notes, rejectedBy) =>
      setState(prev => ({
        ...prev,
        rejections: { ...prev.rejections, [id]: { rejectedBy, dateRejected: today(), reasons, notes } },
      })),

    // Save and close on a Consultee record: adds it to the case's subgrid, or
    // replaces the existing record with the same id.
    saveConsultee: (id, consultee) =>
      setState(prev => {
        const rows = prev.consultees[id] ?? [];
        const next = rows.some(row => row.id === consultee.id)
          ? rows.map(row => (row.id === consultee.id ? consultee : row))
          : [...rows, consultee];
        return { ...prev, consultees: { ...prev.consultees, [id]: next } };
      }),

    removeConsultees: (id, ids) =>
      setState(prev => ({
        ...prev,
        consultees: { ...prev.consultees, [id]: (prev.consultees[id] ?? []).filter(row => !ids.includes(row.id)) },
      })),

    // Records a lookup pick as the most-recent organisation: moves it to the
    // front, de-duplicates, and keeps the last 5 (D365's "Recent records").
    addRecentOrganisation: name =>
      setState(prev => {
        const trimmed = name.trim();
        if (!trimmed) return prev;
        const next = [trimmed, ...prev.recentOrganisations.filter(o => o !== trimmed)].slice(0, 5);
        return { ...prev, recentOrganisations: next };
      }),

    setConsultationConfirmed: (id, confirmed) =>
      setState(prev => {
        const readiness = { ...prev, ...(prev.cases[id] ?? seedCase(id)) };
        if (startConsultationStatus(id, readiness) === 'Cannot start yet') return prev;
        return { ...prev, consultations: { ...prev.consultations,
          [id]: { ...prev.consultations[id], confirmed, saved: false },
        } };
      }),

    // Keep the form editable after consultation starts without reversing or
    // repeating the case transition when the confirmation is edited.
    saveStartConsultation: id =>
      setState(prev => {
        const readiness = { ...prev, ...(prev.cases[id] ?? seedCase(id)) };
        const status = startConsultationStatus(id, readiness);
        if (status === 'Cannot start yet') return prev;
        const form = prev.consultations[id];
        const confirmed = form?.confirmed ?? status === 'Done';
        return { ...prev, consultations: { ...prev.consultations,
          [id]: { ...form, confirmed, saved: true,
            ...(confirmed && status === 'To do' ? { startedAt: new Date().toISOString() } : {}),
          },
        } };
      }),

    setSiteCheckField: (field, value) =>
      update(c => ({ siteCheckForm: { ...c.siteCheckForm, [field]: value } })),

    setWfdReview: value => update(c => ({ wfdForm: { ...c.wfdForm, review: value } })),

    setWfdInitialConsiderations: value =>
      update(c => ({ wfdForm: { ...c.wfdForm, initialConsiderations: value } })),

    // Writes one field of one policy's assessment. Once every policy on the
    // case is assessed the MPP task rolls up to Done.
    setMppField: (code, field, value) =>
      update(c => {
        const existing = c.mppForm[code] ?? { outcome: '', reason: '' };
        const mppForm = { ...c.mppForm, [code]: { ...existing, [field]: value } };
        return {
          mppForm,
          tasks: { ...c.tasks, marinePlanPolicies: mppRollUp(caseId, c.tasks.siteCheck, mppForm) },
        };
      }),

    setPrepForConsulteeCompleted: completed =>
      update(c => ({ prepForConsulteeMeta: { ...c.prepForConsulteeMeta, completed } })),

    setConsultationPeriod: consultationPeriod =>
      update(c => ({ prepForConsulteeMeta: { ...c.prepForConsulteeMeta, consultationPeriod } })),

    setPublicRegisterField: (field, value) =>
      update(c => ({ publicRegisterForm: { ...c.publicRegisterForm, [field]: value } })),

    setSiteNoticeField: (field, value) =>
      update(c => ({ siteNoticeForm: { ...c.siteNoticeForm, [field]: value } })),

    // Saving a location's form writes that related record's review. The task
    // status follows: Done once every location has a complete review, or
    // Awaiting applicant if any is not accepted. In D365 a flow on the save.
    setPublicNoticeEvidenceLocation: (index, review) =>
      update(c => {
        const locations = Array.from({ length: EVIDENCE_LOCATION_COUNT }, (_, i) =>
          i === index ? review : c.publicNoticeEvidenceMeta.locations[i] ?? { decision: '', rejectionComments: '' });
        return {
          tasks: { ...c.tasks, publicNoticeEvidence: publicNoticeEvidenceStatus(locations, 'To do') },
          publicNoticeEvidenceMeta: { locations },
        };
      }),

    // The same rule for 10013, judged on the new reviews of the resubmitted locations.
    setPublicNoticeEvidenceResubmissionReview: (index, review) =>
      update(c => {
        const reviews = c.publicNoticeEvidenceResubmissionMeta.reviews.map((current, i) =>
          i === index ? review : current);
        return {
          tasks: {
            ...c.tasks,
            publicNoticeEvidenceResubmission: publicNoticeEvidenceStatus(
              resubmittedLocationIndexes.map(i => reviews[i]),
              'Resubmitted - to review',
            ),
          },
          publicNoticeEvidenceResubmissionMeta: { reviews },
        };
      }),

    // An edit marks the task as having unsaved changes (shown in the task header).
    markUnsaved: task => update(c => ({ saved: { ...c.saved, [task]: false } })),

    // Saving the Site check completes it and unlocks the tasks that wait for it.
    completeSiteCheck: () =>
      update(c => ({
        tasks: {
          ...c.tasks,
          siteCheck: 'Done',
          wfdAssessment: c.tasks.wfdAssessment === 'Cannot start yet' ? 'To do' : c.tasks.wfdAssessment,
          marinePlanPolicies: mppRollUp(caseId, 'Done', c.mppForm),
          prepForConsultee: c.tasks.prepForConsultee === 'Cannot start yet' ? 'To do' : c.tasks.prepForConsultee,
          publicRegister: c.tasks.publicRegister === 'Cannot start yet' ? 'To do' : c.tasks.publicRegister,
          siteNotice: c.tasks.siteNotice === 'Cannot start yet' ? 'To do' : c.tasks.siteNotice,
        },
        saved: { ...c.saved, siteCheck: true },
      })),

    completeWfd: () =>
      update(c => ({
        tasks: { ...c.tasks, wfdAssessment: 'Done' },
        saved: { ...c.saved, wfdAssessment: true },
      })),

    // Ticked "completed" → Done; otherwise → In progress.
    savePrepForConsultee: () =>
      update(c => ({
        tasks: { ...c.tasks, prepForConsultee: c.prepForConsulteeMeta.completed ? 'Done' : 'In progress' },
        saved: { ...c.saved, prepForConsultee: true },
      })),

    // Same two-options rule as Prepare for consultation.
    savePublicRegister: () =>
      update(c => ({
        tasks: { ...c.tasks, publicRegister: c.publicRegisterForm.completed ? 'Done' : 'In progress' },
        saved: { ...c.saved, publicRegister: true },
      })),

    // A required Site notice hands work to the applicant, so the task stays open
    // as Awaiting applicant. With no notice it is Done straight away.
    saveSiteNotice: () =>
      update(c => ({
        tasks: {
          ...c.tasks,
          siteNotice: c.siteNoticeForm.needsNotice === SITE_NOTICE ? 'Awaiting applicant' : 'Done',
        },
        saved: { ...c.saved, siteNotice: true },
      })),
  };
}
