// src/utils/cases.ts
// The cases in Iteration 3 and which applicant's application each one holds.
// Every case shares one design; what differs is its application (the CDP pages
// and marine plan policies) and the stage it starts at (see context/caseSeeds).

export type Application = 'teignmouth' | 'hayling' | 'brixham' | 'exmouth' | 'dart';

/** Not yet allocated to a caseworker; nobody has worked on it. */
export const UNALLOCATED_CASE_ID = 'MLA/2026/10001';
/** The case a caseworker starts from scratch: every task still to do. */
export const FRESH_CASE_ID = 'MLA/2026/10015';
/** Further into assessment: the applicant's public notice photos have arrived. */
export const EVIDENCE_CASE_ID = 'MLA/2026/10014';
/** Replacement public notice photos have arrived after some were not accepted. */
export const RESUBMISSION_CASE_ID = 'MLA/2026/10013';
/** In consultation (see consultationCase.ts). */
export const CONSULTATION_CASE_ID = 'MLA/2026/10006';

const applications: Record<string, Application> = {
  [UNALLOCATED_CASE_ID]: 'dart',
  [FRESH_CASE_ID]: 'teignmouth',
  [EVIDENCE_CASE_ID]: 'exmouth',
  [RESUBMISSION_CASE_ID]: 'brixham',
  [CONSULTATION_CASE_ID]: 'hayling',
};

export function applicationFor(caseId: string): Application {
  return applications[caseId] ?? 'teignmouth';
}

