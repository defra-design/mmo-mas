// src/components/tasks/WithholdDecision.tsx
// One ground for withholding information from the public register — commercial
// confidentiality or national security. A request can raise either or both, so
// the same block is rendered once per ground raised, pointed at that ground's
// own columns via `fields`.
//
// The decision is a Choice column; which Multiline Text columns follow it is an
// OOB business rule on that choice: agreeing in full needs only the internal
// rationale, while a partial agreement or a refusal also needs the wording the
// applicant will receive. The sub-heading is a form section header.
import type { ReactNode } from 'react';
import { makeStyles, shorthands, tokens, Text } from '@fluentui/react-components';
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
  divider: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
  heading: { fontWeight: tokens.fontWeightSemibold },
});

/** This ground's three columns on the form. */
interface DecisionFields {
  agree: FieldKey;
  applicantText: FieldKey;
  rationale: FieldKey;
}

interface WithholdDecisionProps {
  /** The ground being assessed, e.g. "Commercial or industrial confidentiality". */
  heading: string;
  locked?: boolean;
  fields: DecisionFields;
  values: Record<FieldKey, string>;
  errorFor: (field: FieldKey) => string | undefined;
  onChange: (field: FieldKey, value: string) => void;
  /** Full-width guidance under the rationale field (custom HTML, as on WFD). */
  rationaleHint?: ReactNode;
}

export default function WithholdDecision({
  heading,
  locked,
  fields,
  values,
  errorFor,
  onChange,
  rationaleHint,
}: WithholdDecisionProps) {
  const styles = useStyles();
  const agree = values[fields.agree];

  return (
    <div className={styles.block}>
      <div className={styles.divider} />
      <Text block className={styles.heading}>
        {heading}
      </Text>

      <TaskRow label="Do you agree with the applicant's request?" required locked={locked} top>
        <TaskChoice
          value={agree}
          options={agreeOptions}
          onSelect={v => onChange(fields.agree, v)}
          locked={locked}
          error={errorFor(fields.agree)}
        />
      </TaskRow>

      {needsRationale(agree) && (
        <>
          <TaskRow label="What is your rationale?" required locked={locked} top>
            <TaskTextarea
              value={values[fields.rationale]}
              onChange={v => onChange(fields.rationale, v)}
              locked={locked}
              error={errorFor(fields.rationale)}
            />
          </TaskRow>
          {rationaleHint}
        </>
      )}

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
    </div>
  );
}
