// src/components/tasks/MarinePlanPolicyTask.tsx
import { useState } from 'react';
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
  DismissCircleRegular,
} from '@fluentui/react-icons';
import FormNotification from '../FormNotification';
import OutcomeDropdown from './OutcomeDropdown';
import RequiredLabel from './RequiredLabel';
import { notificationMessage, requiredMessage } from '../../utils/validationMessages';
import { useTasks } from '../../context/TaskContext';
import { policies, policyIndex } from '../../utils/marinePlanPolicies';

const outcomeOptions = ['Compliant', 'Non-compliant', 'Consultation required'];

// Both assessment fields are business-required on an active policy record. Names
// are the D365 display names, used in the inline and form-level messages.
const REQUIRED_FIELDS = [
  { field: 'outcome', name: 'Outcome' },
  { field: 'reason', name: 'Reason for your decision' },
] as const;

type MppField = (typeof REQUIRED_FIELDS)[number]['field'];

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
  // A read-only record's fields look exactly like an editable one's — D365 greys
  // nothing out and dims no text. Only the caret gives it away, so take the text
  // cursor off the textarea and leave the pointer as a plain arrow.
  reasonReadOnly: { '& textarea': { cursor: 'default' } },
});

interface MarinePlanPolicyTaskProps {
  caseId: string;
}

export default function MarinePlanPolicyTask({ caseId }: MarinePlanPolicyTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { policyCode } = useParams<{ policyCode: string }>();
  const { tasks, mppForm, setMppField } = useTasks();
  // Empty required fields, populated on a failed save. Only ever set on an active
  // record — a locked one has no Save command to fail against.
  const [errors, setErrors] = useState<MppField[]>([]);

  // On MLA/2026/10014 the policies stay openable before Site check, but their
  // assessment fields are gated: disabled, with the Outcome reading "Cannot start
  // yet". Completing Site check unlocks them (marinePlanPolicies → "To do").
  const locked =
    caseId === 'MLA/2026/10014' && tasks.marinePlanPolicies === 'Cannot start yet';

  const caseUrl = `/receive-assess/cases/${encodeURIComponent(caseId)}`;
  // Back and Save and close both return to the tab the policy was opened from,
  // as D365 does — the subgrid lives on MLA/2026/10014's "Marine plan policies"
  // tab, and going back restores the case form with that tab still active.
  const returnToCase = () =>
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
            onClick={returnToCase}
          />
        </div>
        <Card className={styles.headerCard}>
          <Title3>Policy not found</Title3>
        </Card>
      </div>
    );
  }

  const answer = mppForm[policy.code];
  const valueOf = (field: MppField) => answer?.[field] ?? '';

  const errorFor = (field: MppField) =>
    errors.includes(field)
      ? requiredMessage(REQUIRED_FIELDS.find(f => f.field === field)!.name)
      : undefined;

  const setField = (field: MppField, value: string) => {
    setMppField(policy.code, field, value);
    if (value.trim()) setErrors(prev => prev.filter(f => f !== field));
  };

  // Both fields are required before a policy assessment can be saved. Fields are
  // written to context live, so a failed save leaves the entered values in place —
  // it only blocks the close and raises the notification, as D365 does.
  const saveAndClose = () => {
    const empty = REQUIRED_FIELDS.filter(f => !valueOf(f.field).trim()).map(f => f.field);
    if (empty.length > 0) {
      setErrors(empty);
      return;
    }
    returnToCase();
  };

  const missing = REQUIRED_FIELDS.filter(f => errors.includes(f.field)).map(f => f.name);

  return (
    <div className={styles.page}>
      {/* Verbatim from the real system: the record is inactive until Site check
          completes, so D365 shows its standard read-only notification. */}
      {locked && (
        <FormNotification level="read-only">
          Read-only&nbsp;&nbsp;This record's status: Inactive
        </FormNotification>
      )}

      {missing.length > 0 && (
        <FormNotification level="error">{notificationMessage(missing)}</FormNotification>
      )}

      <div className={mergeClasses(styles.bar, 'elevated-panel')}>
        <Button
          appearance="subtle"
          icon={<ArrowLeftRegular />}
          aria-label="Back"
          onClick={returnToCase}
        />
        <Button
          appearance="subtle"
          icon={<OpenRegular />}
          aria-label="Open in new window"
          onClick={() => window.open(window.location.href, '_blank', 'noopener,noreferrer')}
        />
        {/* There is nothing to save on a read-only record, so D365 drops Save from
            the command bar entirely — Back and Open in new window are all it keeps. */}
        {!locked && (
          <>
            <div className={styles.divider} />
            <Button appearance="subtle" icon={<SaveRegular />} onClick={saveAndClose}>
              Save and close
            </Button>
          </>
        )}
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
              {/* A locked record's fields aren't required — there is nothing to save
                  — so the asterisk only appears once the policy is active. */}
              {locked ? (
                <Text className={styles.label}>Outcome</Text>
              ) : (
                <RequiredLabel className={styles.label}>Outcome</RequiredLabel>
              )}
              <div className={styles.fields}>
                {/* A read-only choice field has no select at all in D365 — just
                    its value on the same grey background the editable one uses. */}
                {locked ? (
                  <div className={styles.value}><Body1>Cannot start yet</Body1></div>
                ) : (
                  <Field
                    validationState={errorFor('outcome') ? 'error' : 'none'}
                    validationMessage={errorFor('outcome')}
                    validationMessageIcon={<DismissCircleRegular />}
                  >
                    <OutcomeDropdown
                      value={valueOf('outcome')}
                      options={outcomeOptions}
                      onSelect={v => setField('outcome', v)}
                    />
                  </Field>
                )}
              </div>
            </div>
            <div className={styles.row}>
              {locked ? (
                <Text className={styles.label}>Reason for your decision</Text>
              ) : (
                <RequiredLabel className={styles.label}>Reason for your decision</RequiredLabel>
              )}
              <div className={styles.fields}>
                <Field
                  validationState={errorFor('reason') ? 'error' : 'none'}
                  validationMessage={errorFor('reason')}
                  validationMessageIcon={<DismissCircleRegular />}
                >
                  <Textarea
                    className={mergeClasses(styles.reason, locked && styles.reasonReadOnly)}
                    appearance="filled-lighter"
                    resize={locked ? 'none' : 'vertical'}
                    rows={5}
                    readOnly={locked}
                    value={valueOf('reason')}
                    onChange={(_, data) => setField('reason', data.value)}
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
