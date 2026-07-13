// src/utils/caseStatus.ts
import type { TransfersState, RejectionsState } from '../context/TaskContext';

export type DerivedCaseStatus = 'Rejected' | 'Transfer pending' | 'Transferred';

// A case's Status once a caseworker has acted on it from the command bar.
// Derived, never stored, so the case header and the case list can't drift apart.
// null = the case has been neither rejected nor transferred, so show its own status.
//
// Rejection wins over a transfer: it is terminal, and the command bar stops
// offering either action once a case has been rejected.
export function caseStatus(
  transfers: TransfersState,
  rejections: RejectionsState,
  caseId: string,
): DerivedCaseStatus | null {
  if (rejections[caseId]) return 'Rejected';
  const transfer = transfers[caseId];
  if (!transfer) return null;
  return transfer.mcmsReference ? 'Transferred' : 'Transfer pending';
}
