// src/utils/marinePlanPolicies.ts
// Flattened view of the marine plan policies for the caseworker MPP task list and
// per-policy assessment form. Each application has its own policies, mirroring
// its public/cdp/marine-plan-policies*.json (the applicant-facing CDP iframe
// copy) — keep the two in sync if the seed changes.
import teignmouthData from '../mock-data/marine-plan-policies.json';
import haylingData from '../mock-data/marine-plan-policies-hayling.json';
import brixhamData from '../mock-data/marine-plan-policies-brixham.json';
import exmouthData from '../mock-data/marine-plan-policies-exmouth.json';
import { applicationFor } from './cases';
import type { Application } from './cases';

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

interface RawDocument {
  filename: string;
  type: string;
  policies: { code: string; location: string }[];
}

interface RawCategory {
  name: string;
  policies: RawPolicy[];
}

interface RawData {
  categories: RawCategory[];
  documents?: RawDocument[];
}

const data: Record<Application, RawData> = {
  teignmouth: teignmouthData as RawData,
  hayling: haylingData as RawData,
  brixham: brixhamData as RawData,
  exmouth: exmouthData as RawData,
};

// One ordered array per application (category order, then policy order within
// each) so a policy's position gives the "X of N" index.
const flatten = (raw: RawData): MarinePlanPolicy[] =>
  raw.categories.flatMap(cat => cat.policies.map(p => ({ ...p, group: cat.name })));

const policiesByApplication = Object.fromEntries(
  Object.entries(data).map(([application, raw]) => [application, flatten(raw)]),
) as Record<Application, MarinePlanPolicy[]>;

/** The policies the applicant answered on this case. */
export function policiesForCase(caseId: string): MarinePlanPolicy[] {
  return policiesByApplication[applicationFor(caseId)];
}

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
  caseId: string,
  answers: Record<string, { outcome?: string; reason?: string }>,
): boolean {
  const policies = policiesForCase(caseId);
  return (
    policies.length > 0 &&
    policies.every(policy => mppAssessmentStatus(answers[policy.code]) === 'Done')
  );
}

/** Apply the Site-check prerequisite while normalising other MPP task statuses. */
export function mppTaskStatus(status: string, locked = false): MppAssessmentStatus {
  if (locked || status === 'Cannot start yet') return 'Cannot start yet';
  return status === 'Done' ? 'Done' : 'To do';
}

/** A supporting document the applicant uploaded on CDP, linked to one or more
 *  policies with where in the document the evidence is. */
export interface SupportingDocument {
  filename: string;
  type: string;
  location: string;
}

/** The supporting documents linked to a policy, each with where its evidence is. */
export function documentsForPolicy(code: string, caseId?: string): SupportingDocument[] {
  const documents = data[caseId ? applicationFor(caseId) : 'teignmouth'].documents ?? [];
  return documents.flatMap(doc =>
    doc.policies
      .filter(link => link.code === code)
      .map(link => ({ filename: doc.filename, type: doc.type, location: link.location })),
  );
}
