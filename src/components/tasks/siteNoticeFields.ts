import type { SiteNoticeForm } from '../../context/TaskContext';
import { SITE_NOTICE, NO_NOTICES } from '../../utils/publicNoticeRequirement';

export const groupOptions = ['Marine users', 'Community users', 'Both'];

export type SiteNoticeField = keyof SiteNoticeForm;

// Display names D365 uses when it lists the fields that failed validation.
export const siteNoticeFieldNames: Record<SiteNoticeField, string> = {
  needsNotice: 'What public notices are required',
  rationale: 'Why no public notices are required',
  summary: 'Site notice summary',
  groups: 'Who needs to be told about this application',
};

// Mirrors D365 business-required rules: only fields on the visible branch are
// required, while the controlling choice is always required.
export function requiredSiteNoticeFields(form: SiteNoticeForm): SiteNoticeField[] {
  if (form.needsNotice === SITE_NOTICE) return ['needsNotice', 'summary', 'groups'];
  if (form.needsNotice === NO_NOTICES) return ['needsNotice', 'rationale'];
  return ['needsNotice'];
}
