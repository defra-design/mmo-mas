// src/utils/marinePlanPolicies.ts
// Flattened view of the marine plan policies for the caseworker MPP task list and
// per-policy assessment form. The data mirrors public/cdp/marine-plan-policies.json
// (the applicant-facing CDP iframe copy) — keep the two in sync if the seed changes.
import mppData from '../mock-data/marine-plan-policies.json';

export interface MarinePlanPolicy {
  code: string;
  topic: string;
  label: string;
  policyInfo: string;
  consideration: string[];
  /** The policy's category name, e.g. "Cross-cutting". */
  group: string;
}

interface RawPolicy {
  code: string;
  topic: string;
  label: string;
  policyInfo: string;
  consideration: string[];
}

interface RawCategory {
  name: string;
  policies: RawPolicy[];
}

// One ordered array (category order, then policy order within each) so a policy's
// position gives the "X of N" index and next-policy navigation.
export const policies: MarinePlanPolicy[] = (mppData.categories as RawCategory[]).flatMap(cat =>
  cat.policies.map(p => ({ ...p, group: cat.name }))
);

export const policyCount = policies.length;

export type MppAssessmentStatus = 'Cannot start yet' | 'To do' | 'Done';

/**
 * A policy assessment has its own task lifecycle. Its assessment outcome is
 * separate data and must never be used as the task status.
 */
export function mppAssessmentStatus(
  answer?: { outcome?: string; reason?: string },
  locked = false,
): MppAssessmentStatus {
  if (locked) return 'Cannot start yet';
  return answer?.outcome?.trim() && answer?.reason?.trim() ? 'Done' : 'To do';
}

export function allMppAssessmentsComplete(
  answers: Record<string, { outcome?: string; reason?: string }>,
): boolean {
  return (
    policyCount > 0 &&
    policies.every(policy => mppAssessmentStatus(answers[policy.code]) === 'Done')
  );
}

/** Apply the Site-check prerequisite while normalising other MPP task statuses. */
export function mppTaskStatus(status: string, locked = false): MppAssessmentStatus {
  if (locked || status === 'Cannot start yet') return 'Cannot start yet';
  return status === 'Done' ? 'Done' : 'To do';
}

/** Zero-based index of a policy in the flattened list, or -1 if not found. */
export function policyIndex(code: string): number {
  return policies.findIndex(p => p.code === code);
}

export function findPolicy(code: string): MarinePlanPolicy | undefined {
  return policies.find(p => p.code === code);
}
