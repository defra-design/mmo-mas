// src/components/tasks/TaskTextarea.tsx
// A Multiline Text column on a task form: Fluent's Textarea flattened to the grey,
// borderless box the D365 dev environment renders, wrapped in Field so a
// business-required column can show D365's inline validation message underneath.
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  Field,
  Textarea,
} from '@fluentui/react-components';
import { DismissCircleRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  control: { flexGrow: 1, flexBasis: 0, minWidth: '140px' },
  textarea: {
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.border('none'),
    '::after': { ...shorthands.border('none') },
  },
  // A read-only record's fields look exactly like an editable one's — D365 greys
  // nothing out. Only the caret gives it away, so drop the text cursor.
  readOnly: { '& textarea': { cursor: 'default' } },
});

interface TaskTextareaProps {
  value: string;
  onChange: (value: string) => void;
  locked?: boolean;
  /** D365's inline required message; also puts the field in its error state. */
  error?: string;
  rows?: number;
}

export default function TaskTextarea({
  value,
  onChange,
  locked,
  error,
  rows = 5,
}: TaskTextareaProps) {
  const styles = useStyles();
  return (
    <Field
      className={styles.control}
      validationState={error ? 'error' : 'none'}
      validationMessage={error}
      validationMessageIcon={error ? <DismissCircleRegular /> : undefined}
    >
      <Textarea
        className={mergeClasses(styles.textarea, locked && styles.readOnly)}
        appearance="filled-lighter"
        value={value}
        onChange={(_, d) => onChange(d.value)}
        readOnly={locked}
        resize={locked ? 'none' : 'vertical'}
        rows={rows}
      />
    </Field>
  );
}
