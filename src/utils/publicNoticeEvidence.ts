import type { TaskState, TaskStatus } from '../context/TaskContext';

export const PUBLIC_NOTICE_EVIDENCE_CASE_ID = 'MLA/2026/10014';

export function hasSubmittedPublicNoticeEvidence(caseId: string) {
  return caseId === PUBLIC_NOTICE_EVIDENCE_CASE_ID;
}

/**
 * MLA/2026/10014 is a fixed post-submission test fixture. Site check and Public
 * notice are complete; everything Site check gates is available. Other cases
 * continue to use the shared interactive prototype state.
 */
export function taskStatusForCase(
  caseId: string,
  task: keyof TaskState,
  status: TaskStatus,
): TaskStatus {
  if (!hasSubmittedPublicNoticeEvidence(caseId)) return status;
  if (task === 'siteCheck' || task === 'siteNotice') return 'Done';
  if (task === 'publicNoticeEvidence') return status;
  return status === 'Cannot start yet' ? 'To do' : status;
}
