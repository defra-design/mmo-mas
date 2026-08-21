// src/components/tasks/publicRegisterFields.ts
// The Public register task's Choice options, D365 field display names, and the
// rule deciding which columns are business-required for a given set of answers.
// In real D365 this is a set of OOB business rules on the form (show/hide field,
// set business required); it lives beside the form here so the rule and the
// layout can't drift apart.
import type { PublicRegisterForm } from '../../context/TaskContext';

// "What does the request relate to?" — the two grounds for withholding, either
// singly or together, so the caseworker never assesses a ground that isn't raised.
export const RELATES_COMMERCIAL = 'Commercial or industrial confidentiality';
export const RELATES_SECURITY = 'National security';
export const RELATES_BOTH = 'Both';
export const relatesOptions = [RELATES_COMMERCIAL, RELATES_SECURITY, RELATES_BOTH];

// "Do you agree with the applicant's request?" — asked once per ground raised.
export const AGREE_ALL = 'Agree - withhold all of it';
export const AGREE_SOME = 'Agree - but only withhold some of it';
export const DISAGREE = 'Disagree';
export const agreeOptions = [AGREE_ALL, AGREE_SOME, DISAGREE];

export const YES = 'Yes';
export const yesNoOptions = [YES, 'No'];

/** Agreeing in full needs only an internal rationale — the applicant asked for it
 *  and got it. A partial agreement or a refusal also needs the wording the
 *  applicant receives explaining what wasn't withheld. */
export const needsApplicantText = (agree: string) => agree === AGREE_SOME || agree === DISAGREE;

/** Every decision is rationalised — but there's nothing to justify until one is made. */
export const needsRationale = (agree: string) => agree !== '';

export const showsCommercial = (relatesTo: string) =>
  relatesTo === RELATES_COMMERCIAL || relatesTo === RELATES_BOTH;
export const showsSecurity = (relatesTo: string) =>
  relatesTo === RELATES_SECURITY || relatesTo === RELATES_BOTH;

export type FieldKey = Exclude<keyof PublicRegisterForm, 'completed'>;

// Display names D365 uses when it lists the fields that failed validation. The two
// grounds ask identical questions, so each is qualified by the ground it belongs to.
export const FIELD_NAMES: Record<FieldKey, string> = {
  relatesTo: 'What the request relates to',
  commercialAgree: 'Commercial or industrial confidentiality decision',
  commercialApplicantText: 'Commercial or industrial confidentiality message to applicant',
  commercialRationale: 'Commercial or industrial confidentiality rationale',
  securityAgree: 'National security decision',
  securityApplicantText: 'National security message to applicant',
  securityRationale: 'National security rationale',
  personalInfo: 'Personal information check',
  personalInfoDetail: 'Personal information to redact',
};

/** Every business-required column currently visible on the form. A hidden field is
 *  never required in D365, so the list changes as the choices above are answered. */
export function requiredFields(form: PublicRegisterForm): FieldKey[] {
  const keys: FieldKey[] = ['relatesTo'];

  if (showsCommercial(form.relatesTo)) {
    keys.push('commercialAgree');
    if (needsRationale(form.commercialAgree)) keys.push('commercialRationale');
    if (needsApplicantText(form.commercialAgree)) keys.push('commercialApplicantText');
  }
  if (showsSecurity(form.relatesTo)) {
    keys.push('securityAgree');
    if (needsRationale(form.securityAgree)) keys.push('securityRationale');
    if (needsApplicantText(form.securityAgree)) keys.push('securityApplicantText');
  }

  keys.push('personalInfo');
  if (form.personalInfo === YES) keys.push('personalInfoDetail');

  return keys;
}
