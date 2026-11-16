// src/utils/consultationCase.ts
// MLA/2026/10006, Hayling Island groyne repairs: the live case in consultation.
// Its consultation started on 27 October 2026 with the 14-day consultee period,
// so consultees were asked to respond by 10 November. The Extend consultee
// closing date task adds extensions that move that date on; in D365 a Power
// Automate flow updates the case's closing date when an extension is saved.
import type { ConsultationExtension } from '../context/TaskContext';

export const CONSULTATION_CASE_ID = 'MLA/2026/10006';
export const CONSULTATION_STARTED = '2026-10-27';
export const CONSULTATION_PERIOD_DAYS = 14;
export const ORIGINAL_CLOSING_DATE = '2026-11-10';
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
