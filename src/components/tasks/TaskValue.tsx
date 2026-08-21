// src/components/tasks/TaskValue.tsx
// A read-only field value: the grey box D365 renders a non-editable column in.
// Used for the applicant's submitted answers, and for any choice field on a
// locked record — a read-only choice has no select at all in D365, just its value
// on the same grey background the editable one uses.
import { makeStyles, mergeClasses, shorthands, tokens, Body1 } from '@fluentui/react-components';

const useStyles = makeStyles({
  value: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: '140px',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusSmall,
  },
  // Sized like the multi-line text control it stands in for.
  multiline: { minHeight: '120px' },
});

interface TaskValueProps {
  /** Empty renders a non-breaking space so the box keeps its height. */
  children?: string;
  multiline?: boolean;
}

export default function TaskValue({ children, multiline }: TaskValueProps) {
  const styles = useStyles();
  return (
    <div className={mergeClasses(styles.value, multiline && styles.multiline)}>
      <Body1>{children || '\u00a0'}</Body1>
    </div>
  );
}
