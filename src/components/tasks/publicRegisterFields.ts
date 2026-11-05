// src/components/tasks/publicRegisterFields.ts
// The Withholding information task's Choice options, D365 field display names, and the
// rule deciding which columns are business-required for a given set of answers.
// In real D365 this is a set of OOB business rules on the form (show/hide field,
// set business required); it lives beside the form here so the rule and the
// layout can't drift apart.
import type { PublicRegisterForm } from '../../context/TaskContext';

// "Do you agree with the applicant's request?"
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

export type FieldKey = Exclude<keyof PublicRegisterForm, 'completed'>;

// Display names D365 uses when it lists the fields that failed validation, each
// qualified by the reason it belongs to.
export const FIELD_NAMES: Record<FieldKey, string> = {
  commercialAgree: 'Commercial or industrial confidentiality decision',
  commercialApplicantText: 'Commercial or industrial confidentiality message to applicant',
  commercialRationale: 'Commercial or industrial confidentiality rationale',
  personalInfo: 'Personal information check',
  personalInfoDetail: 'Personal information to redact',
};

/** Every business-required column currently visible on the form. A hidden field is
 *  never required in D365, so the list changes as the choices above are answered.
 *  `assessed` is false when the applicant asked for nothing to be withheld — the
 *  whole assessment section is off the form, so none of it can be required. */
export function requiredFields(form: PublicRegisterForm, assessed = true): FieldKey[] {
  const keys: FieldKey[] = [];

  if (assessed) {
    keys.push('commercialAgree');
    if (needsRationale(form.commercialAgree)) keys.push('commercialRationale');
    if (needsApplicantText(form.commercialAgree)) keys.push('commercialApplicantText');
  }

  keys.push('personalInfo');
  if (form.personalInfo === YES) keys.push('personalInfoDetail');

  return keys;
}
