// src/components/tasks/FieldLock.tsx
// The padlock D365 puts against a field on a locked (read-only) record. Its
// spacing and position alongside other field markers is owned by FieldDecorations.
import { makeStyles, tokens } from '@fluentui/react-components';
import { LockClosedRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  lock: {
    flexShrink: 0,
    fontSize: '16px',
    // Full-strength foreground so it reads clearly against the grey field
    // background rather than fading into the label.
    color: tokens.colorNeutralForeground1,
  },
});

export default function FieldLock() {
  const styles = useStyles();
  return <LockClosedRegular className={styles.lock} aria-label="Read-only" />;
}
