export const SITE_NOTICE = 'Site notice';
export const NO_NOTICES = 'None';
export const publicNoticeOptions = [SITE_NOTICE, NO_NOTICES];

// Keep the existing persisted field, translating answers from the old Yes/No
// choice on hydration. Unknown values become unanswered, not an implicit None.
export function loadPublicNoticeRequirement(value: unknown): string {
  if (value === 'Yes' || value === SITE_NOTICE) return SITE_NOTICE;
  if (value === 'No' || value === NO_NOTICES) return NO_NOTICES;
  return '';
}
