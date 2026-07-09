// src/components/tasks/MarinePlanPolicyTask.tsx
import { useNavigate, useParams } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
  Card,
  Text,
  Title3,
  Body1,
  Button,
  Field,
  Textarea,
} from '@fluentui/react-components';
import {
  ArrowLeftRegular,
  OpenRegular,
  SaveRegular,
} from '@fluentui/react-icons';
import OutcomeDropdown from './OutcomeDropdown';
import { useTasks } from '../../context/TaskContext';
import { policies, policyIndex } from '../../utils/marinePlanPolicies';

const outcomeOptions = ['Compliant', 'Non-compliant', 'Consultation required', 'Not applicable'];

const useStyles = makeStyles({
  page: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  // Command bar, matching FormCommandBar's look (white, subtle buttons, divider).
  bar: {
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    marginTop: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalM,
  },
  divider: {
    width: '1px',
    height: '20px',
    backgroundColor: tokens.colorNeutralStroke2,
    margin: `0 ${tokens.spacingHorizontalXS}`,
  },
  headerCard: {
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalL,
  },
  bodyCard: {
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXL,
  },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalL,
  },
  answers: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  // Label beside value; the value wraps under the label at narrow widths.
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    columnGap: tokens.spacingHorizontalL,
    rowGap: tokens.spacingVerticalS,
  },
  label: { flexShrink: 0, flexBasis: '220px', minWidth: '220px', paddingTop: tokens.spacingVerticalXS },
  fields: { flexGrow: 1, flexBasis: '320px', minWidth: 0 },
  value: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusSmall,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  dividerLine: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
  // Grey, borderless textarea matching the Site check notes / Case summary fields.
  reason: {
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.border('none'),
    '::after': { ...shorthands.border('none') },
  },
});

interface MarinePlanPolicyTaskProps {
  caseId: string;
}

export default function MarinePlanPolicyTask({ caseId }: MarinePlanPolicyTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { policyCode } = useParams<{ policyCode: string }>();
  const { tasks, mppForm, setMppField } = useTasks();

  // On MLA/2026/10014 the policies stay openable before Site check, but their
  // assessment fields are gated: disabled, with the Outcome reading "Cannot start
  // yet". Completing Site check unlocks them (marinePlanPolicies → "To do").
  const locked =
    caseId === 'MLA/2026/10014' && tasks.marinePlanPolicies === 'Cannot start yet';

  const caseUrl = `/receive-assess/cases/${encodeURIComponent(caseId)}`;
  // MLA/2026/10014 keeps its policies on the "Marine plan policies" tab, so on
  // Save and close it returns there (not the Case summary) to let the caseworker
  // continue straight to the next assessment.
  const saveAndClose = () =>
    navigate(caseUrl, caseId === 'MLA/2026/10014' ? { state: { tab: 'mpp' } } : undefined);
  const index = policyCode ? policyIndex(policyCode) : -1;
  const policy = index >= 0 ? policies[index] : undefined;

  if (!policy) {
    return (
      <div className={styles.page}>
        <div className={mergeClasses(styles.bar, 'elevated-panel')}>
          <Button
            appearance="subtle"
            icon={<ArrowLeftRegular />}
            aria-label="Back"
            onClick={() => navigate(caseUrl)}
          />
        </div>
        <Card className={styles.headerCard}>
          <Title3>Policy not found</Title3>
        </Card>
      </div>
    );
  }

  const answer = mppForm[policy.code];

  return (
    <div className={styles.page}>
      <div className={mergeClasses(styles.bar, 'elevated-panel')}>
        <Button
          appearance="subtle"
          icon={<ArrowLeftRegular />}
          aria-label="Back"
          onClick={() => navigate(caseUrl)}
        />
        <Button appearance="subtle" icon={<OpenRegular />} aria-label="Open in new window" />
        <div className={styles.divider} />
        <Button appearance="subtle" icon={<SaveRegular />} onClick={saveAndClose}>
          Save and close
        </Button>
      </div>

      <Card className={styles.headerCard}>
        <div>
          <Title3>{policy.label}</Title3>
          <div><Body1>Marine plan policy assessment</Body1></div>
        </div>
      </Card>

      <Card className={styles.bodyCard}>
        <div>
          <Text block className={styles.sectionHeading}>
            1. Policy and applicant's consideration
          </Text>
          <div className={styles.answers}>
            <div className={styles.row}>
              <Text className={styles.label}>Policy group</Text>
              <div className={styles.fields}>
                <div className={styles.value}><Body1>{policy.group}</Body1></div>
              </div>
            </div>
            <div className={styles.row}>
              <Text className={styles.label}>Policy information</Text>
              <div className={styles.fields}>
                <div className={styles.value}><Body1>{policy.policyInfo}</Body1></div>
              </div>
            </div>
            <div className={styles.row}>
              <Text className={styles.label}>Applicant's consideration</Text>
              <div className={styles.fields}>
                <div className={styles.value}>
                  {policy.consideration.length > 0 ? (
                    policy.consideration.map((para, i) => <Body1 key={i}>{para}</Body1>)
                  ) : (
                    <Body1>No consideration provided.</Body1>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.dividerLine} />

        <div>
          <Text block className={styles.sectionHeading}>2. Your assessment</Text>
          <div className={styles.answers}>
            <div className={styles.row}>
              <Text className={styles.label}>Outcome</Text>
              <div className={styles.fields}>
                <Field>
                  <OutcomeDropdown
                    value={locked ? 'Cannot start yet' : answer?.outcome ?? ''}
                    options={outcomeOptions}
                    disabled={locked}
                    onSelect={v => setMppField(policy.code, 'outcome', v)}
                  />
                </Field>
              </div>
            </div>
            <div className={styles.row}>
              <Text className={styles.label}>Reason for your decision</Text>
              <div className={styles.fields}>
                <Field>
                  <Textarea
                    className={styles.reason}
                    appearance="filled-lighter"
                    resize="vertical"
                    rows={5}
                    disabled={locked}
                    value={answer?.reason ?? ''}
                    onChange={(_, data) => setMppField(policy.code, 'reason', data.value)}
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
