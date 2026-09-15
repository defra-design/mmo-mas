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
import TaskFieldLabel from './TaskFieldLabel';
import FieldDecorations from './FieldDecorations';
import TaskTextarea from './TaskTextarea';
import {
  CANNOT_START_MESSAGE,
  notificationMessage,
  requiredMessage,
} from '../../utils/validationMessages';
import { useTasks } from '../../context/TaskContext';
import type { WfdForm } from '../../context/TaskContext';
import { taskStatusForCase } from '../../utils/publicNoticeEvidence';
import { asset } from '../../utils/asset';

const useStyles = makeStyles({
  page: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  headerCard: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL) },
  sectionCard: {
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalL,
  },
  reviewFields: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  answers: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  // Flex (not grid) so the value area can wrap under the label at narrow widths.
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    columnGap: 0,
    rowGap: tokens.spacingVerticalS,
  },
  label: {
    flexShrink: 0,
    flexBasis: '160px',
    minWidth: '160px',
    paddingTop: tokens.spacingVerticalXS,
    marginRight: tokens.spacingHorizontalL,
  },
  // Holds one or two field boxes; wraps them under each other when cramped.
  fields: {
    flexGrow: 1,
    flexBasis: '320px',
    minWidth: 0,
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalL,
    marginLeft: tokens.spacingHorizontalS,
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
  // Excluded-activity guidance bullets, shown full width under the question.
  // (Dev will custom-inject this HTML for real; here it's a static list.)
  hintList: {
    margin: 0,
    paddingLeft: '22px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    '& li': { lineHeight: tokens.lineHeightBase300 },
  },
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

const ASSESSMENT_DOCUMENT: { fileName: string; href: string } | undefined = {
  fileName: 'WFD-Exmouth-2026.docx',
  href: asset('documents/WFD-Exmouth-2026.docx'),
};

// D365 display names used in the inline and form-level validation messages.
const FIELD_NAMES: Record<keyof WfdForm, string> = {
  initialConsiderations: 'Record your considerations',
  review: 'WFD review',
};

interface WfdTaskProps {
  caseId: string;
}

export default function WfdTask({ caseId }: WfdTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const {
    tasks,
    wfdForm,
    saved,
    setWfdReview,
    setWfdInitialConsiderations,
    markUnsaved,
    completeWfd,
  } = useTasks();
  // Gated behind Site check. The record still opens — D365 cannot lock a
  // caseworker out — but it opens read-only: padlocked fields, no Save command.
  const locked =
    taskStatusForCase(caseId, 'wfdAssessment', tasks.wfdAssessment) === 'Cannot start yet';
  const hasAssessment = Boolean(ASSESSMENT_DOCUMENT);
  // Set on a failed save, cleared as soon as the field is given a value.
  const [errors, setErrors] = useState<(keyof WfdForm)[]>([]);

  const errorFor = (field: keyof WfdForm) =>
    errors.includes(field) ? requiredMessage(FIELD_NAMES[field]) : undefined;

  const handleSave = () => {
    const missing: (keyof WfdForm)[] = [];
    if (hasAssessment && !wfdForm.initialConsiderations.trim()) {
      missing.push('initialConsiderations');
    }
    if (!wfdForm.review.trim()) missing.push('review');
    setErrors(missing);
    if (missing.length) return;
    completeWfd();
    navigate(`/receive-assess/cases/${encodeURIComponent(caseId)}`);
  };

  return (
    <div className={styles.page}>
      {locked && <FormNotification level="read-only">{CANNOT_START_MESSAGE}</FormNotification>}

      {errors.length > 0 && (
        <FormNotification level="error">
          {notificationMessage(errors.map(field => FIELD_NAMES[field]))}
        </FormNotification>
      )}

      <FormCommandBar
        saveLabel={locked ? undefined : 'Save and close'}
        onSave={locked ? undefined : handleSave}
        backTo={`/receive-assess/cases/${encodeURIComponent(caseId)}`}
      />

      <Card className={styles.headerCard}>
        <Title3>
          Water Framework Directive (WFD)
          <span className={styles.savedLabel}>- {saved.wfdAssessment ? 'Saved' : 'Unsaved'}</span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      <Card className={styles.sectionCard}>
        <Text block className={styles.sectionHeading}>Applicant's answers</Text>
        <div className={styles.answers}>
            <div className={styles.row}>
              <TaskFieldLabel className={styles.label}>
                Are your proposed works within one nautical mile (1.85km) of the low-water line, or in a
                tidal river or estuary?
              </TaskFieldLabel>
              <FieldDecorations locked />
              <div className={styles.fields}>
                <div className={styles.value}><Body1>Yes</Body1></div>
              </div>
            </div>
            <div className={styles.row}>
              <TaskFieldLabel className={styles.label}>
                Are your proposed works limited to one of the following excluded activities?
              </TaskFieldLabel>
              <FieldDecorations locked />
              <div className={styles.fields}>
                <div className={styles.value}><Body1>No</Body1></div>
              </div>
            </div>
            <ul className={styles.hintList}>
              <li>
                maintaining pumps at pumping stations - if you do it regularly, avoid low
                dissolved oxygen levels during maintenance and minimise silt movement when
                restarting the pumps
              </li>
              <li>
                removing blockages or obstacles like litter or debris within 10m of an existing
                structure to maintain flow
              </li>
              <li>
                replacing or removing existing pipes, cables or services crossing over a water
                body - but not including any new structure or supports, or new bed or bank
                reinforcement
              </li>
              <li>
                'over water' replacement or repairs to, for example bridge, pier and jetty
                surfaces - if you minimise bank or bed disturbance
              </li>
            </ul>
            {ASSESSMENT_DOCUMENT && <div className={styles.row}>
              <TaskFieldLabel className={styles.label}>
                Assessment provided
              </TaskFieldLabel>
              <FieldDecorations />
              <div className={styles.fields}>
                <div className={styles.value}>
                  <Link
                    href={ASSESSMENT_DOCUMENT.href}
                    target="_blank"
                    rel="noopener"
                    className={styles.docxLink}
                  >
                    <ArrowDownloadRegular /> {ASSESSMENT_DOCUMENT.fileName}
                  </Link>
                </div>
              </div>
            </div>}
        </div>
      </Card>

      <Card className={styles.sectionCard}>
        <Text block className={styles.sectionHeading}>WFD review</Text>
        <div className={styles.reviewFields}>
          <div className={styles.row}>
            <TaskFieldLabel className={styles.label}>
              Is the WFD section complete and acceptable?
            </TaskFieldLabel>
            <FieldDecorations required locked={locked} />
            <div className={styles.fields}>
              {/* A read-only choice field has no select at all in D365 — just its
                  value on the same grey background the editable one uses. */}
              {locked ? (
                <div className={mergeClasses(styles.value, styles.control)}>
                  <Body1>{wfdForm.review || '\u00a0'}</Body1>
                </div>
              ) : (
                <Field
                  className={styles.control}
                  validationState={errorFor('review') ? 'error' : 'none'}
                  validationMessage={errorFor('review')}
                  validationMessageIcon={<DismissCircleRegular />}
                >
                  <OutcomeDropdown
                    value={wfdForm.review}
                    options={reviewOptions}
                    onSelect={v => {
                      setWfdReview(v);
                      setErrors(previous => previous.filter(field => field !== 'review'));
                      markUnsaved('wfdAssessment');
                    }}
                  />
                </Field>
              )}
            </div>
          </div>

          {hasAssessment && (
            <div className={styles.row}>
              <TaskFieldLabel className={styles.label}>
                Record your considerations
              </TaskFieldLabel>
              <FieldDecorations required locked={locked} />
              <div className={styles.fields}>
                <TaskTextarea
                  value={wfdForm.initialConsiderations}
                  onChange={value => {
                    setWfdInitialConsiderations(value);
                    if (value.trim()) {
                      setErrors(previous =>
                        previous.filter(field => field !== 'initialConsiderations'),
                      );
                    }
                    markUnsaved('wfdAssessment');
                  }}
                  locked={locked}
                  error={errorFor('initialConsiderations')}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
