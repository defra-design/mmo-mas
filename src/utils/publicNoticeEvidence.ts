import type { TaskState, TaskStatus } from '../context/TaskContext';

export const PUBLIC_NOTICE_EVIDENCE_CASE_ID = 'MLA/2026/10014';
export const PUBLIC_NOTICE_EVIDENCE_RESUBMISSION_CASE_ID = 'MLA/2026/10013';

export function hasSubmittedPublicNoticeEvidence(caseId: string) {
  return (
    caseId === PUBLIC_NOTICE_EVIDENCE_CASE_ID ||
    caseId === PUBLIC_NOTICE_EVIDENCE_RESUBMISSION_CASE_ID
  );
}

export function hasResubmittedPublicNoticeEvidence(caseId: string) {
  return caseId === PUBLIC_NOTICE_EVIDENCE_RESUBMISSION_CASE_ID;
}

export function publicNoticeEvidenceStatusForCase(caseId: string, tasks: TaskState) {
  return hasResubmittedPublicNoticeEvidence(caseId)
    ? tasks.publicNoticeEvidenceResubmission
    : tasks.publicNoticeEvidence;
}

/**
 * MLA/2026/10014 is the initial-review fixture. MLA/2026/10013 is further into
 * Consultation: all Review and assess work is complete apart from the evidence
 * task reopened by replacement photographs. Other cases use shared state.
 */
export function taskStatusForCase(
  caseId: string,
  task: keyof TaskState,
  status: TaskStatus,
): TaskStatus {
  if (hasResubmittedPublicNoticeEvidence(caseId)) return 'Done';
  if (!hasSubmittedPublicNoticeEvidence(caseId)) return status;
  if (task === 'siteCheck' || task === 'siteNotice') return 'Done';
  if (task === 'publicNoticeEvidence') return status;
  return status === 'Cannot start yet' ? 'To do' : status;
}
