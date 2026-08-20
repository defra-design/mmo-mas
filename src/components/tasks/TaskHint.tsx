// src/components/tasks/TaskHint.tsx
// Full-width guidance shown under a field, matching the WFD excluded-activity
// list. D365's OOB field description is a tooltip (or short hint); this richer
// HTML is custom-injected on the form in the real build.
import type { ReactNode } from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  hint: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalXXL,
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
}

export default function TaskHint({ children }: TaskHintProps) {
  const styles = useStyles();
  return <div className={styles.hint}>{children}</div>;
}
