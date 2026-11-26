// src/utils/consultationCase.ts
// MLA/2026/10006, Hayling Island groyne repairs: the live case in consultation.
// Its dates are worked out from today, so it is always mid-consultation when
// demoed: the consultation started 11 days ago with the 14-day consultee
// period, so the closing date is 3 days away. The application was submitted
// 34 days ago, matching its 34-day case age. (The design exploration in
// public/mockups/consultation-responses keeps fixed dates for its before,
// passed and extended scenarios.) The Extend consultee closing date task adds
// extensions that move the closing date on; in D365 a Power Automate flow
// updates the case's closing date when an extension is saved.
import type { ConsultationExtension } from '../context/TaskContext';

export const CONSULTATION_CASE_ID = 'MLA/2026/10006';
export const CONSULTATION_PERIOD_DAYS = 14;
const TODAY = isoDate(new Date());
export const CASE_SUBMITTED = addDays(TODAY, -34);
export const CONSULTATION_STARTED = addDays(TODAY, -11);
export const ORIGINAL_CLOSING_DATE = addDays(CONSULTATION_STARTED, CONSULTATION_PERIOD_DAYS);
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

/** Each extension with the closing date it set, in the order they were made. */
export function withNewClosingDates(extensions: ConsultationExtension[]) {
  let closing = ORIGINAL_CLOSING_DATE;
  return extensions.map(extension => {
    closing = addDays(closing, extension.days);
    return { ...extension, newClosingDate: closing };
  });
}

export function currentClosingDate(extensions: ConsultationExtension[]) {
  return extensions.reduce((closing, extension) => addDays(closing, extension.days), ORIGINAL_CLOSING_DATE);
}
