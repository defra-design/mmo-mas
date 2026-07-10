// src/components/TransferMcmsDialogs.tsx
// The two Transfer to MCMS modals. Custom modals following the OOB Resolve Case
// pattern (command-bar action → modal → close). Step 1 is raised by the Case
// Officer; step 2 by the Business Support Team, once they have done the transfer
// by hand in MCMS.
//
// Each dialog owns its own field + validation state and is mounted only while it
// is open, so cancelling and reopening starts from an empty field.
import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  Button,
  Field,
  Input,
  Textarea,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  // Grey, borderless fields matching the Site check task and the read-only value
  // boxes — the prototype never uses a white/bordered input.
  field: {
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.border('none'),
    '::after': { ...shorthands.border('none') },
  },
  textarea: { minHeight: '160px' },
  // Breathing room between the field and the action buttons.
  actions: { marginTop: tokens.spacingVerticalXL },
  // The action row shrinks its buttons to fit, which wraps the longer primary
  // labels onto two lines. Keep each label on one line and let the button size
  // to it, as D365 does.
  actionButton: { whiteSpace: 'nowrap' },
});

type ShellProps = {
  title: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  children: ReactNode;
};

// Title + close icon + primary/Cancel actions, shared by both steps.
function DialogShell({ title, confirmLabel, onCancel, onConfirm, children }: ShellProps) {
  const styles = useStyles();
  return (
    <Dialog open onOpenChange={(_, d) => !d.open && onCancel()} modalType="modal">
      <DialogSurface>
        <DialogBody>
          <DialogTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<DismissRegular />}
                onClick={onCancel}
              />
            }
          >
            {title}
          </DialogTitle>
          <DialogContent>{children}</DialogContent>
          <DialogActions className={styles.actions}>
            <Button appearance="primary" className={styles.actionButton} onClick={onConfirm}>
              {confirmLabel}
            </Button>
            <Button appearance="secondary" className={styles.actionButton} onClick={onCancel}>
              Cancel
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

/** Step 1 — the Case Officer states why the case is going to MCMS. */
export function RequestTransferDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (reasons: string) => void;
}) {
  const styles = useStyles();
  const [reasons, setReasons] = useState('');
  const [error, setError] = useState('');

  const confirm = () => {
    if (!reasons.trim()) {
      setError('You must provide a value for Reasons for transfer.');
      return;
    }
    onConfirm(reasons.trim());
  };

  return (
    <DialogShell
      title="Request transfer to MCMS"
      confirmLabel="Request transfer"
      onCancel={onCancel}
      onConfirm={confirm}
    >
      <Field
        label="Reasons for transfer"
        required
        validationState={error ? 'error' : 'none'}
        validationMessage={error || undefined}
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
    </DialogShell>
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
  const styles = useStyles();
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  const confirm = () => {
    if (!reference.trim()) {
      setError('You must provide a value for MCMS reference.');
      return;
    }
    onConfirm(reference.trim());
  };

  return (
    <DialogShell
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
    </DialogShell>
  );
}
