// src/components/tasks/WfdTask.tsx
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
  Link,
} from '@fluentui/react-components';
import { ArrowDownloadRegular, DismissCircleRegular } from '@fluentui/react-icons';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import OutcomeDropdown from './OutcomeDropdown';
import RequiredLabel from './RequiredLabel';
import { notificationMessage, requiredMessage } from '../../utils/validationMessages';
import { useTasks } from '../../context/TaskContext';
import { asset } from '../../utils/asset';

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
  // Flex (not grid) so the value area can wrap under the label at narrow widths.
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalL,
    rowGap: tokens.spacingVerticalS,
  },
  label: { flexShrink: 0, flexBasis: '320px', minWidth: '320px' },
  // The review row's control can grow a validation message under it, so top-align
  // the row (rather than centring it, as the read-only answer rows do) to keep the
  // label level with the select instead of drifting with the message.
  reviewRow: { alignItems: 'flex-start' },
  reviewLabel: { paddingTop: tokens.spacingVerticalXS },
  // Holds one or two field boxes; wraps them under each other when cramped.
  fields: {
    flexGrow: 1,
    flexBasis: '320px',
    minWidth: 0,
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalL,
  },
  // flexBasis 0 + equal grow → each field box takes an equal share (50/50 when paired).
  value: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: '140px',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusSmall,
  },
  docxLink: { display: 'inline-flex', alignItems: 'center', gap: tokens.spacingHorizontalS },
  divider: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
  control: { flexGrow: 1, flexBasis: 0, minWidth: '140px' },
  // "- Unsaved" / "- Saved" indicator beside the task name (smaller, normal weight).
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

const reviewOptions = ['Yes', 'No'];

// Display name D365 would use for the one business-required field on this form.
const REVIEW_FIELD = 'WFD review';

interface WfdTaskProps {
  caseId: string;
}

export default function WfdTask({ caseId }: WfdTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { wfdForm, saved, setWfdReview, markUnsaved, completeWfd } = useTasks();
  // Set on a failed save, cleared as soon as the field is given a value.
  const [error, setError] = useState(false);

  const handleSave = () => {
    if (!wfdForm.review.trim()) {
      setError(true);
      return;
    }
    completeWfd();
    navigate(`/receive-assess/cases/${encodeURIComponent(caseId)}`);
  };

  return (
    <div className={styles.page}>
      {error && (
        <FormNotification level="error">{notificationMessage([REVIEW_FIELD])}</FormNotification>
      )}

      <FormCommandBar
        saveLabel="Save and close"
        onSave={handleSave}
        backTo={`/receive-assess/cases/${encodeURIComponent(caseId)}`}
      />

      <Card className={styles.headerCard}>
        <Title3>
          Water Framework Directive (WFD)
          <span className={styles.savedLabel}>- {saved.wfdAssessment ? 'Saved' : 'Unsaved'}</span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      <Card className={styles.bodyCard}>
        <div>
          <Text block className={styles.sectionHeading}>1. Applicant's answers</Text>
          <div className={styles.answers}>
            <div className={styles.row}>
              <Text className={styles.label}>Site located in the WFD assessment area</Text>
              <div className={styles.fields}>
                <div className={styles.value}><Body1>Yes (Confirmed in Site check)</Body1></div>
              </div>
            </div>
            <div className={styles.row}>
              <Text className={styles.label}>Excluded activity</Text>
              <div className={styles.fields}>
                <div className={styles.value}><Body1>No</Body1></div>
              </div>
            </div>
            <div className={styles.row}>
              <Text className={styles.label}>Assessment provided</Text>
              <div className={styles.fields}>
                <div className={styles.value}>
                  <Link
                    href={asset('documents/WFD-Teignmouth-2026.docx')}
                    target="_blank"
                    rel="noopener"
                    className={styles.docxLink}
                  >
                    <ArrowDownloadRegular /> WFD-Teignmouth-2026.docx
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div>
          <Text block className={styles.sectionHeading}>2. WFD review</Text>
          <div className={mergeClasses(styles.row, styles.reviewRow)}>
            <RequiredLabel className={mergeClasses(styles.label, styles.reviewLabel)}>
              Is the WFD section complete and acceptable?
            </RequiredLabel>
            <div className={styles.fields}>
              <Field
                className={styles.control}
                validationState={error ? 'error' : 'none'}
                validationMessage={error ? requiredMessage(REVIEW_FIELD) : undefined}
                validationMessageIcon={<DismissCircleRegular />}
              >
                <OutcomeDropdown
                  value={wfdForm.review}
                  options={reviewOptions}
                  onSelect={v => {
                    setWfdReview(v);
                    setError(false);
                    markUnsaved('wfdAssessment');
                  }}
                />
              </Field>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
