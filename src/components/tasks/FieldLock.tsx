// src/components/tasks/FieldLock.tsx
// The padlock D365 puts against a field on a locked (read-only) record. It sits
// between the label column and the control — attached to the field, not trailing
// the label text — exactly as the real system renders it. OOB form decoration.
import { makeStyles, tokens } from '@fluentui/react-components';
import { LockClosedRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  lock: {
    flexShrink: 0,
    fontSize: '16px',
    // Full-strength foreground so it reads clearly against the grey field
    // background rather than fading into the label.
    color: tokens.colorNeutralForeground1,
    // The row's column gap sits on both sides of the lock; pull it in on the
    // right so it reads as belonging to the field, not floating between the two.
    marginRight: `calc(-1 * ${tokens.spacingHorizontalS})`,
    // Nudged down so it centres against the first line of the field, not the
    // very top of the row.
    marginTop: '2px',
  },
});

export default function FieldLock() {
  const styles = useStyles();
  return <LockClosedRegular className={styles.lock} aria-label="Read-only" />;
}
