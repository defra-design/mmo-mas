import type { MppForm, RejectionsState, SavedState, TaskState, TransfersState } from '../context/TaskContext';
import caseDetails from '../mock-data/marine-case-details.json';
import { mppAssessmentStatus } from './marinePlanPolicies';
import { taskStatusForCase } from './publicNoticeEvidence';

export interface StartConsultationForm {
  confirmed: boolean;
  saved: boolean;
  startedAt?: string;
}
export type ConsultationsState = Record<string, StartConsultationForm>;

// Prototype shortcut: only these first two assessments gate consultation.
// The remaining MPP records keep their own independent completion statuses.
export const CONSULTATION_MPP_CODES = ['SW-CC-1', 'SW-CC-3'] as const;
const REQUIRED_TASKS = ['siteCheck', 'publicRegister', 'wfdAssessment', 'prepForConsultee'] as const;

export interface ConsultationReadiness {
  tasks: TaskState;
  mppForm: MppForm;
  saved: SavedState;
  consultations: ConsultationsState;
  transfers: TransfersState;
  rejections: RejectionsState;
}

export function consultationAlreadyStarted(caseId: string, consultations: ConsultationsState) {
  const seededStatus = (caseDetails as Record<string, { status: string }>)[caseId]?.status;
  return Boolean(consultations[caseId]?.startedAt) || seededStatus === 'Consultation';
}

export function startConsultationStatus(caseId: string, state: ConsultationReadiness) {
  if (consultationAlreadyStarted(caseId, state.consultations)) return 'Done';
  if (state.transfers[caseId] || state.rejections[caseId]) return 'Cannot start yet';
  const tasksDone = REQUIRED_TASKS.every(task =>
    taskStatusForCase(caseId, task, state.tasks[task]) === 'Done' && state.saved[task]);
  const notice = taskStatusForCase(caseId, 'siteNotice', state.tasks.siteNotice);
  // Awaiting applicant means the officer has prepared the notice; evidence is
  // deliberately not a prerequisite for beginning consultation.
  const noticeReady = (notice === 'Done' || notice === 'Awaiting applicant') && state.saved.siteNotice;
  const policiesDone = CONSULTATION_MPP_CODES.every(code => mppAssessmentStatus(state.mppForm[code]) === 'Done');
  return tasksDone && noticeReady && policiesDone ? 'To do' : 'Cannot start yet';
}
