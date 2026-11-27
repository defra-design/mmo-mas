// src/utils/consultationCase.ts
// A case's consultation dates. Any case can be moved into consultation with the
// Start consultation task: its consultation starts that day, with the consultee
// period chosen on Prepare for consultation.
//
// MLA/2026/10006, Hayling Island groyne repairs, starts in consultation.
// Its dates are worked out from today, so it is always mid-consultation when
// demoed: the consultation started 11 days ago with the 14-day consultee
// period, so the closing date is 3 days away. The application was submitted
// 34 days ago, matching its 34-day case age. (The design exploration in
// public/mockups/consultation-responses keeps fixed dates for its before,
// passed and extended scenarios.) The Extend consultee closing date task adds
// extensions that move the closing date on; in D365 a Power Automate flow
// updates the case's closing date when an extension is saved.
import type { ConsultationExtension, ConsultationExtensionsState, PrepForConsulteeMeta } from '../context/TaskContext';
import type { ConsultationsState } from './startConsultation';
import { CONSULTATION_CASE_ID } from './cases';

export { CONSULTATION_CASE_ID };
export const CONSULTATION_PERIOD_DAYS = 14;
const TODAY = isoDate(new Date());
export const CASE_SUBMITTED = addDays(TODAY, -34);
export const CONSULTATION_STARTED = addDays(TODAY, -11);
// Extensions are in 7-day blocks (CIP14).
export const EXTEND_BY_OPTIONS = ['7 days', '14 days', '21 days', '28 days'];

function parse(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function addDays(iso: string, days: number) {
  const date = parse(iso);
  date.setDate(date.getDate() + days);
  return isoDate(date);
}

/** The out-of-the-box D365 date format, DD/MM/YYYY. */
export function showDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export interface Consultation {
  started: string;
  periodDays: number;
  originalClosing: string;
  extensions: ConsultationExtension[];
  /** The closing date after every extension. */
  closing: string;
}

/** A case's consultation, or undefined if it hasn't started. Dates are ISO. */
export function consultationFor(
  caseId: string,
  state: {
    consultations: ConsultationsState;
    consultationExtensions: ConsultationExtensionsState;
    prepForConsulteeMeta: PrepForConsulteeMeta;
  },
): Consultation | undefined {
  const startedAt = state.consultations[caseId]?.startedAt;
  const hayling = caseId === CONSULTATION_CASE_ID;
  if (!hayling && !startedAt) return undefined;
  const started = hayling ? CONSULTATION_STARTED : isoDate(new Date(startedAt!));
  const periodDays = hayling
    ? CONSULTATION_PERIOD_DAYS
    : parseInt(state.prepForConsulteeMeta.consultationPeriod, 10) || CONSULTATION_PERIOD_DAYS;
  const originalClosing = addDays(started, periodDays);
  const extensions = state.consultationExtensions[caseId] ?? [];
  return { started, periodDays, originalClosing, extensions, closing: currentClosingDate(extensions, originalClosing) };
}

/** Each extension with the closing date it set, in the order they were made. */
export function withNewClosingDates(extensions: ConsultationExtension[], originalClosing: string) {
  let closing = originalClosing;
  return extensions.map(extension => {
    closing = addDays(closing, extension.days);
    return { ...extension, newClosingDate: closing };
  });
}

export function currentClosingDate(extensions: ConsultationExtension[], originalClosing: string) {
  return extensions.reduce((closing, extension) => addDays(closing, extension.days), originalClosing);
}
