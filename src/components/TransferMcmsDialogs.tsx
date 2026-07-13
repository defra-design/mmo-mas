// src/components/TransferMcmsDialogs.tsx
// The two Transfer to MCMS modals. Step 1 is raised by the Case Officer; step 2
// by the Business Support Team, once they have done the transfer by hand in MCMS.
//
// Each dialog owns its own field + validation state and is mounted only while it
// is open, so cancelling and reopening starts from an empty field. The title,
// close icon and action buttons come from CaseDialogShell, shared with Reject.
import { useState } from 'react';
import { mergeClasses, Field, Input, Textarea } from '@fluentui/react-components';
import { DismissCircleRegular } from '@fluentui/react-icons';
import { requiredMessage } from '../utils/validationMessages';
import CaseDialogShell, { useDialogFieldStyles } from './CaseDialogShell';

// The field names the required-field messages are built from. Step 2's label is
// phrased as a question, so its message names the field rather than repeating the
// label back at the caseworker.
const REASONS_FIELD = 'Reasons for transfer';
const REFERENCE_FIELD = 'MCMS reference';

/** Step 1 — the Case Officer states why the case is going to MCMS. */
export function RequestTransferDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (reasons: string) => void;
}) {
  const styles = useDialogFieldStyles();
  const [reasons, setReasons] = useState('');
  const [error, setError] = useState('');

  const confirm = () => {
    if (!reasons.trim()) {
      setError(requiredMessage(REASONS_FIELD));
      return;
    }
    onConfirm(reasons.trim());
  };

  return (
    <CaseDialogShell
      title="Request transfer to MCMS"
      confirmLabel="Request transfer"
      onCancel={onCancel}
      onConfirm={confirm}
    >
      <Field
        label={REASONS_FIELD}
        required
        validationState={error ? 'error' : 'none'}
        validationMessage={error || undefined}
        validationMessageIcon={<DismissCircleRegular />}
      >
        <Textarea
          className={mergeClasses(styles.field, styles.textarea)}
          appearance="filled-lighter"
          value={reasons}
          onChange={(_, d) => {
            setReasons(d.value);
            if (error) setError('');
          }}
        />
      </Field>
    </CaseDialogShell>
  );
}

/** Step 2 — the Business Support Team record the reference MCMS gave the case. */
export function CompleteTransferDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (mcmsReference: string) => void;
}) {
  const styles = useDialogFieldStyles();
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  const confirm = () => {
    if (!reference.trim()) {
      setError(requiredMessage(REFERENCE_FIELD));
      return;
    }
    onConfirm(reference.trim());
  };

  return (
    <CaseDialogShell
      title="Complete transfer to MCMS"
      confirmLabel="Complete transfer"
      onCancel={onCancel}
      onConfirm={confirm}
    >
      <Field
        label="What is the MCMS reference for this case?"
        required
        validationState={error ? 'error' : 'none'}
        validationMessage={error || undefined}
        validationMessageIcon={<DismissCircleRegular />}
      >
        <Input
          className={styles.field}
          appearance="filled-lighter"
          value={reference}
          onChange={(_, d) => {
            setReference(d.value);
            if (error) setError('');
          }}
        />
      </Field>
    </CaseDialogShell>
  );
}
