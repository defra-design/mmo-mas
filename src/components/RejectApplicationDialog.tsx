// src/components/RejectApplicationDialog.tsx
// The Reject application modal — one step, raised by the Case Officer from the
// command bar. Same shell, fields and validation behaviour as the Transfer to
// MCMS modals, with a multi-select for the reasons.
//
// The reasons list stands in for a D365 Choices (multi-select option set) column.
// The real build uses a custom component for this control, so treat the dropdown
// here as a placeholder for it rather than the final look.
import { useState } from 'react';
import { mergeClasses, Body1, Field, Dropdown, Option, Textarea } from '@fluentui/react-components';
import { DismissCircleRegular } from '@fluentui/react-icons';
import { requiredMessage } from '../utils/validationMessages';
import CaseDialogShell, { useDialogFieldStyles } from './CaseDialogShell';

// The field names, used as both the labels and the names in the required-field
// messages, so the two can't drift apart.
const REASONS_FIELD = 'Sections of the application with issues';
const NOTES_FIELD = 'Provide details for each issue';

// The option-set values a caseworker can reject an application for.
export const REJECTION_REASONS = [
  'Project details',
  'Site location',
  'Site activities',
  'Marine plan policies',
  'Water Framework Directive',
  'Special legal powers',
  'Harbour authorities',
  'Other authorities',
  'Pre-application consultation',
  'Sharing your project information publicly',
  'Other problems',
];

export default function RejectApplicationDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (reasons: string[], notes: string) => void;
}) {
  const styles = useDialogFieldStyles();
  const [reasons, setReasons] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ reasons?: string; notes?: string }>({});

  // Both fields are business-required, so a caseworker who fills in neither sees
  // both messages at once rather than one after the other.
  const confirm = () => {
    const next: { reasons?: string; notes?: string } = {};
    if (reasons.length === 0) {
      next.reasons = requiredMessage(REASONS_FIELD);
    }
    if (!notes.trim()) {
      next.notes = requiredMessage(NOTES_FIELD);
    }
    if (next.reasons || next.notes) {
      setErrors(next);
      return;
    }
    onConfirm(reasons, notes.trim());
  };

  return (
    <CaseDialogShell
      title="Reject application"
      confirmLabel="Reject application"
      onCancel={onCancel}
      onConfirm={confirm}
    >
      <div className={styles.fields}>
        <Body1>
          What you enter here will be visible to the applicant. Their application will show a
          status of unable to progress.
        </Body1>
        <Field
          label={REASONS_FIELD}
          required
          validationState={errors.reasons ? 'error' : 'none'}
          validationMessage={errors.reasons}
          validationMessageIcon={<DismissCircleRegular />}
        >
          <Dropdown
            className={styles.field}
            appearance="filled-lighter"
            multiselect
            placeholder="Select all that apply"
            selectedOptions={reasons}
            // The closed dropdown shows the chosen reasons as a comma-separated
            // list, the way a D365 multi-select choice field does.
            value={reasons.join(', ')}
            onOptionSelect={(_, d) => {
              setReasons(d.selectedOptions);
              if (errors.reasons) setErrors(e => ({ ...e, reasons: undefined }));
            }}
          >
            {REJECTION_REASONS.map(reason => (
              <Option key={reason}>{reason}</Option>
            ))}
          </Dropdown>
        </Field>

        <Field
          label={NOTES_FIELD}
          required
          validationState={errors.notes ? 'error' : 'none'}
          validationMessage={errors.notes}
          validationMessageIcon={<DismissCircleRegular />}
        >
          <Textarea
            className={mergeClasses(styles.field, styles.textarea)}
            appearance="filled-lighter"
            value={notes}
            onChange={(_, d) => {
              setNotes(d.value);
              if (errors.notes) setErrors(e => ({ ...e, notes: undefined }));
            }}
          />
        </Field>
      </div>
    </CaseDialogShell>
  );
}
