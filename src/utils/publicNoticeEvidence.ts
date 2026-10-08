import type {
  PublicNoticeEvidenceLocationReview,
  TaskState,
  TaskStatus,
} from '../context/TaskContext';

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

export function siteCheckCompleteForCase(caseId: string, tasks: TaskState): boolean {
  return taskStatusForCase(caseId, 'siteCheck', tasks.siteCheck) === 'Done';
}

/** A location review is complete when it has a decision, plus comments for a No. */
export function locationReviewIsValid(review: PublicNoticeEvidenceLocationReview) {
  return Boolean(review.decision.trim()) && (review.decision !== 'No' || Boolean(review.rejectionComments.trim()));
}

export type LocationStatus = 'To do' | 'Resubmitted' | 'Done';

/** The Status column on a location record: Done once its current review is complete. */
export function locationStatus(
  review: PublicNoticeEvidenceLocationReview,
  resubmitted: boolean,
): LocationStatus {
  if (locationReviewIsValid(review)) return 'Done';
  return resubmitted ? 'Resubmitted' : 'To do';
}
