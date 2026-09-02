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
    alignItems: 'center',
    columnGap: 0,
    rowGap: tokens.spacingVerticalS,
  },
  // Rows whose control can grow a validation message under it are top-aligned so
  // the label stays level with the control instead of drifting with the message.
  topRow: { alignItems: 'flex-start' },
  label: {
    flexShrink: 0,
    flexBasis: '320px',
    minWidth: '320px',
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
  /** Top-align the label, for controls that grow (textareas, validation messages). */
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
