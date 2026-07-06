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

/** Zero-based index of a policy in the flattened list, or -1 if not found. */
export function policyIndex(code: string): number {
  return policies.findIndex(p => p.code === code);
}

export function findPolicy(code: string): MarinePlanPolicy | undefined {
  return policies.find(p => p.code === code);
}
