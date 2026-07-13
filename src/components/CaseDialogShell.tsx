// src/components/CaseDialogShell.tsx
// The shell every case-level action modal uses (Transfer to MCMS, Reject
// application). Custom modals following the OOB Resolve Case pattern:
// command-bar action → modal → close. Title + close icon + primary/Cancel
// actions, so each action's dialog only has to supply its own fields.
//
// The field styles live here too, so every dialog's controls match the grey,
// borderless boxes used across the prototype's task forms.
import type { ReactNode } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

export const useDialogFieldStyles = makeStyles({
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
  // Stacks a dialog's fields when it has more than one.
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXL,
  },
});

const useStyles = makeStyles({
  // Breathing room between the last field and the action buttons.
  actions: { marginTop: tokens.spacingVerticalXL },
  // The action row shrinks its buttons to fit, which wraps the longer primary
  // labels onto two lines. Keep each label on one line and let the button size
  // to it, as D365 does.
  actionButton: { whiteSpace: 'nowrap' },
});

type Props = {
  title: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  children: ReactNode;
};

export default function CaseDialogShell({
  title,
  confirmLabel,
  onCancel,
  onConfirm,
  children,
}: Props) {
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
