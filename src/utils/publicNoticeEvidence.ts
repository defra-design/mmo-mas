import type {
  PublicNoticeEvidenceLocationReview,
  TaskState,
  TaskStatus,
} from '../context/TaskContext';
import { EVIDENCE_CASE_ID, RESUBMISSION_CASE_ID } from './cases';

// The applicant's public notice photos have arrived on these cases.
const PUBLIC_NOTICE_EVIDENCE_CASE_ID = EVIDENCE_CASE_ID;
const PUBLIC_NOTICE_EVIDENCE_RESUBMISSION_CASE_ID = RESUBMISSION_CASE_ID;

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

/** The No option on "Do you accept the photographs for this location?". It says
 *  what No leads to, and stands out from Yes in the location grid. */
export const NOT_ACCEPTED = 'No - request new photos';

/** Older saved data and labels for a decision, mapped to the current options. */
export function currentDecision(decision: string | undefined) {
  if (decision === 'Accept' || decision === 'Yes') return 'Yes';
  if (decision === 'Reject' || decision === 'No' || decision === NOT_ACCEPTED) return NOT_ACCEPTED;
  return '';
}

/** A location review is complete when it has a decision, plus comments for a No. */
export function locationReviewIsValid(review: PublicNoticeEvidenceLocationReview) {
  return Boolean(review.decision.trim()) && (review.decision !== NOT_ACCEPTED || Boolean(review.rejectionComments.trim()));
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

/**
 * The evidence-review task's status, from its location reviews: Done or Awaiting
 * applicant (any not accepted) once every review is complete, In progress once any is,
 * otherwise the starting status.
 */
export function publicNoticeEvidenceStatus(
  reviews: PublicNoticeEvidenceLocationReview[],
  initial: TaskStatus,
): TaskStatus {
  if (reviews.every(locationReviewIsValid)) {
    return reviews.some(review => review.decision === NOT_ACCEPTED) ? 'Awaiting applicant' : 'Done';
  }
  return reviews.some(locationReviewIsValid) ? 'In progress' : initial;
}
