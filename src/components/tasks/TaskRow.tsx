// src/components/tasks/TaskRow.tsx
// One field row on a task form: the label column D365 draws to the left of a
// control and its D365 field decorations. Layout only — this stands in for the
// standard main-form field arrangement, it is not a Fluent component in disguise.
import type { ReactNode } from 'react';
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import TaskFieldLabel from './TaskFieldLabel';
import FieldDecorations from './FieldDecorations';

const useStyles = makeStyles({
  // Flex (not grid) so the value can wrap under the label at narrow widths.
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    columnGap: 0,
    rowGap: tokens.spacingVerticalS,
  },
  topRow: { alignItems: 'flex-start' },
  label: {
    flexShrink: 0,
    flexBasis: '160px',
    minWidth: '160px',
    paddingTop: tokens.spacingVerticalXS,
    marginRight: tokens.spacingHorizontalL,
  },
  topLabel: { paddingTop: tokens.spacingVerticalXS },
  fields: {
    flexGrow: 1,
    flexBasis: '320px',
    minWidth: 0,
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalL,
    marginLeft: tokens.spacingHorizontalS,
  },
});

interface TaskRowProps {
  label: ReactNode;
  /** Business-required — draws D365's red asterisk beside the control. */
  required?: boolean;
  /** Read-only record — draws the padlock immediately before the control. */
  locked?: boolean;
  /** Identifies controls that can grow; all native D365 rows are top-aligned. */
  top?: boolean;
  children: ReactNode;
}

export default function TaskRow({ label, required, locked, top, children }: TaskRowProps) {
  const styles = useStyles();
  return (
    <div className={mergeClasses(styles.row, top && styles.topRow)}>
      <TaskFieldLabel className={mergeClasses(styles.label, top && styles.topLabel)}>
        {label}
      </TaskFieldLabel>
      <FieldDecorations required={required} locked={locked} />
      <div className={styles.fields}>{children}</div>
    </div>
  );
}
