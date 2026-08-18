// src/utils/validationMessages.ts
// D365's OOB wording for a business-required field left empty on save. The same
// sentence appears twice: inline under the field, and in the ERROR-level form
// notification above the command bar listing every field that failed.
const REQUIRED = 'Required fields must be filled in.';

/** Inline message shown under an empty required field. */
export const requiredMessage = (name: string) => `${name}: ${REQUIRED}`;

/** Form-notification text listing every field left empty. */
export const notificationMessage = (names: string[]) => `${names.join(', ')} : ${REQUIRED}`;

/** D365 read-only notification shown on a task that is gated behind Site check.
 *  The record is still openable — it is read-only, not hidden. */
export const CANNOT_START_MESSAGE =
  'You cannot start this task until you complete the Site check task';
