import type { SiteNoticeForm } from '../../context/TaskContext';

export const YES = 'Yes';
export const NO = 'No';
export const yesNoOptions = [YES, NO];
export const groupOptions = ['Marine users', 'Community users', 'Both'];

export type SiteNoticeField = keyof SiteNoticeForm;

// Display names D365 uses when it lists the fields that failed validation.
export const siteNoticeFieldNames: Record<SiteNoticeField, string> = {
  needsNotice: 'Does the applicant need to display a site notice',
  rationale: 'Why the applicant does not need to display a site notice',
  summary: 'Summary of the proposed works',
  groups: 'Who needs to be told about this application',
};

// Mirrors D365 business-required rules: only fields on the visible branch are
// required, while the controlling choice is always required.
export function requiredSiteNoticeFields(form: SiteNoticeForm): SiteNoticeField[] {
  if (form.needsNotice === YES) return ['needsNotice', 'summary', 'groups'];
  if (form.needsNotice === NO) return ['needsNotice', 'rationale'];
  return ['needsNotice'];
}
