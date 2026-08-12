// src/components/tasks/PublicRegisterTask.tsx
// Task form for "Public register". Section 1 is the applicant's submitted answers
// (read-only fields on the case). Section 2 is the caseworker's redaction decision
// — an OOB Choice column, plus a URL column that launches the redaction journey on
// CDP. The URL row is shown only for a "Yes" answer: OOB that's a business rule
// (show/hide field on change of the choice), no code needed.
// A Two Options checkbox marks the task complete: ticked → Done on save,
// unticked → In progress (OOB Task activity statuses), as on Prep for consultee.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  Card,
  Text,
  Title3,
  Body1,
  Field,
  Checkbox,
} from '@fluentui/react-components';
import { DismissCircleRegular } from '@fluentui/react-icons';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import OutcomeDropdown from './OutcomeDropdown';
import RequiredLabel from './RequiredLabel';
import UrlField from './UrlField';
import { notificationMessage, requiredMessage } from '../../utils/validationMessages';
import { useTasks } from '../../context/TaskContext';

const useStyles = makeStyles({
  page: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  headerCard: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL) },
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
  // Flex (not grid) so the value can wrap under the label at narrow widths.
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalL,
    rowGap: tokens.spacingVerticalS,
  },
  label: { flexShrink: 0, flexBasis: '320px', minWidth: '320px' },
  // Rows whose control can grow a validation message under it are top-aligned so
  // the label stays level with the control instead of drifting with the message.
  topRow: { alignItems: 'flex-start' },
  topLabel: { paddingTop: tokens.spacingVerticalXS },
  fields: {
    flexGrow: 1,
    flexBasis: '320px',
    minWidth: 0,
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalL,
  },
  value: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: '140px',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusSmall,
  },
  // Multiline read-only answer — sized like the multi-line text control it maps to.
  valueMultiline: { minHeight: '120px' },
  control: { flexGrow: 1, flexBasis: 0, minWidth: '140px' },
  divider: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

// The only choice that reveals the redaction link (see showRedactLink below).
const REDACT_SOME = 'Yes - some of it';
const redactOptions = ['Yes - all of it', REDACT_SOME, 'No - publish all of it'];

// Display name D365 would use for the one business-required field on this form.
const REDACT_FIELD = 'Redact the application';

// The redaction journey on CDP. It doesn't exist yet, so the field is inert.
const REDACT_URL =
  'https://marine-licensing-frontend.test.cdp-int.defra.cloud/redact/6a39375b0e7bc1f2d84a';

interface PublicRegisterTaskProps {
  caseId: string;
}

export default function PublicRegisterTask({ caseId }: PublicRegisterTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { publicRegisterForm, saved, setPublicRegisterField, markUnsaved, savePublicRegister } =
    useTasks();
  // Set on a failed save, cleared as soon as the field is given a value.
  const [error, setError] = useState(false);

  // Only "some of it" needs the redaction journey — "all of it" simply isn't
  // published, and "no" publishes as submitted. OOB this is a business rule
  // showing the URL field when the choice equals that one value.
  const showRedactLink = publicRegisterForm.redact === REDACT_SOME;

  const handleSave = () => {
    if (!publicRegisterForm.redact.trim()) {
      setError(true);
      return;
    }
    savePublicRegister();
    navigate(`/receive-assess/cases/${encodeURIComponent(caseId)}`);
  };

  return (
    <div className={styles.page}>
      {error && (
        <FormNotification level="error">{notificationMessage([REDACT_FIELD])}</FormNotification>
      )}

      <FormCommandBar
        saveLabel="Save and close"
        onSave={handleSave}
        backTo={`/receive-assess/cases/${encodeURIComponent(caseId)}`}
      />

      <Card className={styles.headerCard}>
        <Title3>
          Public register
          <span className={styles.savedLabel}>- {saved.publicRegister ? 'Saved' : 'Unsaved'}</span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      <Card className={styles.bodyCard}>
        <div>
          <Text block className={styles.sectionHeading}>1. Applicant's answers</Text>
          <div className={styles.answers}>
            <div className={styles.row}>
              <Text className={styles.label}>
                Request that information is withheld from the public register?
              </Text>
              <div className={styles.fields}>
                <div className={styles.value}><Body1>Yes</Body1></div>
              </div>
            </div>
            <div className={mergeClasses(styles.row, styles.topRow)}>
              <Text className={mergeClasses(styles.label, styles.topLabel)}>
                The information the applicant wants withheld and why.
              </Text>
              <div className={styles.fields}>
                <div className={mergeClasses(styles.value, styles.valueMultiline)}>
                  <Body1>[Applicants answer]</Body1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div>
          <Text block className={styles.sectionHeading}>2. Redaction</Text>
          <div className={styles.answers}>
            <div className={mergeClasses(styles.row, styles.topRow)}>
              <RequiredLabel className={mergeClasses(styles.label, styles.topLabel)}>
                Do you want to redact the application?
              </RequiredLabel>
              <div className={styles.fields}>
                <Field
                  className={styles.control}
                  validationState={error ? 'error' : 'none'}
                  validationMessage={error ? requiredMessage(REDACT_FIELD) : undefined}
                  validationMessageIcon={<DismissCircleRegular />}
                >
                  <OutcomeDropdown
                    value={publicRegisterForm.redact}
                    options={redactOptions}
                    onSelect={v => {
                      setPublicRegisterField('redact', v);
                      setError(false);
                      markUnsaved('publicRegister');
                    }}
                  />
                </Field>
              </div>
            </div>

            {showRedactLink && (
              <div className={mergeClasses(styles.row, styles.topRow)}>
                <Text className={mergeClasses(styles.label, styles.topLabel)}>
                  Select the link to redact the application. You will be able to choose which
                  parts of the application to redact.
                </Text>
                <div className={styles.fields}>
                  <div className={styles.control}>
                    <UrlField
                      url={REDACT_URL}
                      launchLabel="Redact the application on CDP"
                      inert
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Checkbox
          label="Select to mark the task as complete"
          checked={publicRegisterForm.completed}
          onChange={(_, data) => {
            setPublicRegisterField('completed', Boolean(data.checked));
            markUnsaved('publicRegister');
          }}
        />
      </Card>
    </div>
  );
}
