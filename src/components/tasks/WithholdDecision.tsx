// src/components/tasks/WithholdDecision.tsx
// One ground for withholding information from the public register — commercial
// confidentiality or national security. A request can raise either, both or
// neither, so the same block is rendered once per ground raised, pointed at that
// ground's own columns via `fields`.
//
// The decision is a Choice column; which Multiline Text columns follow it is an
// OOB business rule on that choice: agreeing in full needs only the internal
// rationale, while a partial agreement or a refusal also needs the wording the
// applicant will receive. The sub-heading is a form section header.
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import TaskRow from './TaskRow';
import TaskChoice from './TaskChoice';
import TaskTextarea from './TaskTextarea';
import {
  agreeOptions,
  needsApplicantText,
  needsRationale,
  type FieldKey,
} from './publicRegisterFields';

const useStyles = makeStyles({
  block: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  heading: { fontWeight: tokens.fontWeightSemibold },
});

/** This ground's three columns on the form. */
interface DecisionFields {
  agree: FieldKey;
  applicantText: FieldKey;
  rationale: FieldKey;
}

interface WithholdDecisionProps {
  /** The ground being assessed, e.g. "Commercial confidentiality". */
  heading: string;
  locked?: boolean;
  fields: DecisionFields;
  values: Record<FieldKey, string>;
  errorFor: (field: FieldKey) => string | undefined;
  onChange: (field: FieldKey, value: string) => void;
}

export default function WithholdDecision({
  heading,
  locked,
  fields,
  values,
  errorFor,
  onChange,
}: WithholdDecisionProps) {
  const styles = useStyles();
  const agree = values[fields.agree];

  return (
    <div className={styles.block}>
      <Text block className={styles.heading}>
        {heading}
      </Text>

      <TaskRow label="Do you agree with this request?" required locked={locked} top>
        <TaskChoice
          value={agree}
          options={agreeOptions}
          onSelect={v => onChange(fields.agree, v)}
          locked={locked}
          error={errorFor(fields.agree)}
        />
      </TaskRow>

      {needsApplicantText(agree) && (
        <TaskRow label="What do you want to tell the applicant?" required locked={locked} top>
          <TaskTextarea
            value={values[fields.applicantText]}
            onChange={v => onChange(fields.applicantText, v)}
            locked={locked}
            error={errorFor(fields.applicantText)}
          />
        </TaskRow>
      )}

      {needsRationale(agree) && (
        <TaskRow label="What is your rationale?" required locked={locked} top>
          <TaskTextarea
            value={values[fields.rationale]}
            onChange={v => onChange(fields.rationale, v)}
            locked={locked}
            error={errorFor(fields.rationale)}
          />
        </TaskRow>
      )}
    </div>
  );
}
