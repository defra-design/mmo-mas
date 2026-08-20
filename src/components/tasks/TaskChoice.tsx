// src/components/tasks/TaskChoice.tsx
// A Choice column on a task form: the OutcomeDropdown select wrapped in Field so a
// business-required column can show D365's inline validation message underneath.
// On a read-only record D365 renders no select at all — just the chosen value in
// the standard grey box — which is what `locked` gives.
import { makeStyles, Field } from '@fluentui/react-components';
import { DismissCircleRegular } from '@fluentui/react-icons';
import OutcomeDropdown from './OutcomeDropdown';
import TaskValue from './TaskValue';

const useStyles = makeStyles({
  control: { flexGrow: 1, flexBasis: 0, minWidth: '140px' },
});

interface TaskChoiceProps {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  locked?: boolean;
  /** D365's inline required message; also puts the field in its error state. */
  error?: string;
}

export default function TaskChoice({ value, options, onSelect, locked, error }: TaskChoiceProps) {
  const styles = useStyles();

  if (locked) return <TaskValue>{value}</TaskValue>;

  return (
    <Field
      className={styles.control}
      validationState={error ? 'error' : 'none'}
      validationMessage={error}
      validationMessageIcon={error ? <DismissCircleRegular /> : undefined}
    >
      <OutcomeDropdown value={value} options={options} onSelect={onSelect} />
    </Field>
  );
}
