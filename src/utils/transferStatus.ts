// src/utils/transferStatus.ts
import type { TransfersState } from '../context/TaskContext';

// A case's Status while a transfer to MCMS is in flight. Derived, never stored,
// so the case header and the case list can't drift apart. null = the case has no
// transfer record, so show its own status.
export function transferStatus(
  transfers: TransfersState,
  caseId: string,
): 'Transfer pending' | 'Transferred' | null {
  const transfer = transfers[caseId];
  if (!transfer) return null;
  return transfer.mcmsReference ? 'Transferred' : 'Transfer pending';
}
