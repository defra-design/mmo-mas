// src/components/FormNotification.tsx
// D365's form-level notification strip — the thin bar that sits above the command
// bar on a record. It stands in for the OOB notification surface a real form uses
// (`formContext.ui.setFormNotification` for errors/warnings, and the built-in
// read-only notification when a record is inactive). It is not a custom banner:
// all three levels are native D365, so nothing here needs a PCF control.
//
// It spans the whole content area, so it pulls out past main's 20px side padding
// rather than sitting inside the form.
import type { ReactNode } from 'react';
import { makeStyles, mergeClasses, shorthands, tokens, Body1 } from '@fluentui/react-components';
import { DismissCircleFilled, InfoFilled, LockClosedFilled } from '@fluentui/react-icons';

const useStyles = makeStyles({
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    // Tight vertical padding — the real system's strip is a single 32px-ish line,
    // not the roomier bar the prototype used to draw.
    ...shorthands.padding(tokens.spacingVerticalSNudge, tokens.spacingHorizontalM),
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginLeft: '-20px',
    marginRight: '-20px',
  },
  readOnly: { backgroundColor: '#f3f2f1' },
  // Pale pink strip with a red dismiss-circle, exactly as D365 renders an ERROR
  // level notification.
  error: { backgroundColor: tokens.colorStatusDangerBackground1 },
  icon: { fontSize: '16px', flexShrink: 0, color: tokens.colorNeutralForeground1 },
  errorIcon: { color: tokens.colorStatusDangerForeground3 },
  // INFO level: a pale blue strip with a blue (i).
  info: { backgroundColor: '#ebf3fc' },
  infoIcon: { color: '#0f6cbd' },
});

interface FormNotificationProps {
  /** 'error' = ERROR-level form notification. 'info' = INFO-level. 'read-only' = the inactive-record lock strip. */
  level: 'error' | 'info' | 'read-only';
  children: ReactNode;
}

export default function FormNotification({ level, children }: FormNotificationProps) {
  const styles = useStyles();
  const isError = level === 'error';

  return (
    <div
      className={mergeClasses(styles.bar, isError ? styles.error : level === 'info' ? styles.info : styles.readOnly)}
      role={isError ? 'alert' : undefined}
    >
      {isError ? (
        <DismissCircleFilled className={mergeClasses(styles.icon, styles.errorIcon)} />
      ) : level === 'info' ? (
        <InfoFilled className={mergeClasses(styles.icon, styles.infoIcon)} />
      ) : (
        <LockClosedFilled className={styles.icon} />
      )}
      <Body1>{children}</Body1>
    </div>
  );
}
