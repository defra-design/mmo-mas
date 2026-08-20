// src/components/tasks/TaskHint.tsx
// Full-width guidance shown under a field, matching the WFD excluded-activity
// list. D365's OOB field description is a tooltip (or short hint); this richer
// HTML is custom-injected on the form in the real build. The info icon is the
// same Regular outline treatment as FieldLock — native D365 puts (i) on the
// field label, not beside the body copy.
import type { ReactNode } from 'react';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { InfoRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  hint: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalXXL,
  },
  spaceAbove: { marginTop: tokens.spacingVerticalXXL },
  icon: {
    flexShrink: 0,
    fontSize: '20px',
    color: tokens.colorNeutralForeground1,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    minWidth: 0,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground1,
    '& p': { margin: 0 },
    '& ul': {
      margin: 0,
      paddingLeft: '22px',
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacingVerticalS,
    },
    '& li': { lineHeight: tokens.lineHeightBase300 },
  },
});

interface TaskHintProps {
  children: ReactNode;
  /** Extra space above the guidance — used when it sits under a short control. */
  spaceAbove?: boolean;
}

export default function TaskHint({ children, spaceAbove }: TaskHintProps) {
  const styles = useStyles();
  return (
    <div className={mergeClasses(styles.hint, spaceAbove && styles.spaceAbove)}>
      <InfoRegular className={styles.icon} aria-hidden />
      <div className={styles.body}>{children}</div>
    </div>
  );
}
