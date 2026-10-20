// src/components/tasks/ConsultationPeriodSection.tsx
// "Consultation period" section on the Prepare for consultation task. In D365
// this is an OOB Choice column (14, 21 or 28 days) on the form, set once for
// every consultee on the case rather than per consultee.
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  Card,
  Text,
  Body1,
  Field,
} from '@fluentui/react-components';
import { DismissCircleRegular } from '@fluentui/react-icons';
import TaskRow from './TaskRow';
import OutcomeDropdown from './OutcomeDropdown';

const CONSULTATION_PERIODS = ['14 days', '21 days', '28 days'];
// The field's display name, so it also names the field in required-field errors.
// It carries the explanation itself: help text under a field would need injected
// HTML in D365, which isn't OOB.
export const CONSULTATION_PERIOD_LABEL = 'Days to respond for all consultees';

const useStyles = makeStyles({
  sectionCard: {
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  control: { flexGrow: 1, flexBasis: 0, minWidth: '140px' },
  // Read-only, a choice is just its value on the same grey background.
  value: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.padding(tokens.spacingVerticalSNudge, tokens.spacingHorizontalM),
  },
});

type Props = {
  value: string;
  locked: boolean;
  /** Business-required once the task is ticked complete (a business rule in D365). */
  required: boolean;
  /** Inline required-field message, shown after a failed save. */
  error?: string;
  onSelect: (value: string) => void;
};

export default function ConsultationPeriodSection({ value, locked, required, error, onSelect }: Props) {
  const styles = useStyles();
  return (
    <Card className={styles.sectionCard}>
      <Text block className={styles.sectionHeading}>Consultation period</Text>
      <TaskRow label={CONSULTATION_PERIOD_LABEL} required={required} locked={locked}>
        {locked ? (
          <Body1 className={mergeClasses(styles.control, styles.value)}>{value || '---'}</Body1>
        ) : (
          <Field
            className={styles.control}
            validationState={error ? 'error' : 'none'}
            validationMessage={error}
            validationMessageIcon={<DismissCircleRegular />}
          >
            <OutcomeDropdown value={value} options={CONSULTATION_PERIODS} onSelect={onSelect} />
          </Field>
        )}
      </TaskRow>
    </Card>
  );
}
