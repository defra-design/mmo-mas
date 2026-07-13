// src/components/tasks/SiteCheckTask.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Title3,
  Body1,
  Field,
  Textarea,
  Link,
  mergeClasses,
} from '@fluentui/react-components';
import { ArrowDownloadRegular, DismissCircleRegular } from '@fluentui/react-icons';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import OutcomeDropdown from './OutcomeDropdown';
import RequiredLabel from './RequiredLabel';
import { notificationMessage, requiredMessage } from '../../utils/validationMessages';
import { useTasks } from '../../context/TaskContext';
import type { SiteCheckForm } from '../../context/TaskContext';

// Width of the label column on the Site check task. This is the knob to play
// with — widen/narrow to taste. It's deliberately wider than the WFD task's
// 320px label. Once a row can't fit this label plus its control side by side,
// the control wraps underneath (same behaviour as the WFD task).
const LABEL_WIDTH = '360px';

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
  sectionTitleRow: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalL },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  // Extra space above the section-3 row. Applied as margin-top on the row (a
  // plain div we control) rather than margin-bottom on the heading, because the
  // Fluent <Text> heading swallows that margin. Sections 1 & 2 get their
  // separation from the description paragraph above their row; section 3 has
  // none, so it needs this. Adjust to taste.
  notesRowGap: { marginTop: tokens.spacingVerticalM },
  csvLink: { display: 'inline-flex', alignItems: 'center', gap: tokens.spacingHorizontalXS },
  desc: {
    color: tokens.colorNeutralForeground2,
    marginTop: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalL,
  },
  // A fixed-width label beside its control. The control wraps underneath when
  // the row is too narrow to hold both side by side (mirrors the WFD task).
  question: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'start',
    columnGap: tokens.spacingHorizontalXXL,
    rowGap: tokens.spacingVerticalS,
  },
  label: {
    flexShrink: 0,
    flexBasis: LABEL_WIDTH,
    minWidth: LABEL_WIDTH,
  },
  control: {
    flexGrow: 1,
    flexBasis: '320px',
    minWidth: '240px',
  },
  divider: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
  // "- Unsaved" / "- Saved" indicator beside the task name (smaller, normal weight).
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
  // Grey, borderless textarea matching the Case summary data fields.
  textarea: {
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.border('none'),
    '::after': { ...shorthands.border('none') },
  },
});

interface SiteCheckTaskProps {
  caseId: string;
}

// The three business-required fields, in form order, with the display names D365
// would use in its validation messages (not the full question text on the form).
const REQUIRED_FIELDS: { field: keyof SiteCheckForm; name: string }[] = [
  { field: 'coordinatesOk', name: 'Coordinates and shape' },
  { field: 'withinMile', name: 'WFD assessment area' },
  { field: 'notes', name: 'Notes' },
];

export default function SiteCheckTask({ caseId }: SiteCheckTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { siteCheckForm, saved, setSiteCheckField, markUnsaved, completeSiteCheck } = useTasks();
  // Empty required fields, populated on a failed save. D365 validates on save, not
  // as you type, then clears a field's error as soon as it is given a value.
  const [errors, setErrors] = useState<(keyof SiteCheckForm)[]>([]);

  const errorFor = (field: keyof SiteCheckForm) =>
    errors.includes(field)
      ? requiredMessage(REQUIRED_FIELDS.find(f => f.field === field)!.name)
      : undefined;

  const setField = (field: keyof SiteCheckForm, value: string) => {
    setSiteCheckField(field, value);
    if (value.trim()) setErrors(prev => prev.filter(f => f !== field));
  };

  const handleSave = () => {
    const empty = REQUIRED_FIELDS.filter(f => !siteCheckForm[f.field].trim()).map(f => f.field);
    if (empty.length > 0) {
      setErrors(empty);
      return;
    }
    completeSiteCheck();
    navigate(`/receive-assess/cases/${encodeURIComponent(caseId)}`);
  };

  const missing = REQUIRED_FIELDS.filter(f => errors.includes(f.field)).map(f => f.name);

  return (
    <div className={styles.page}>
      {missing.length > 0 && (
        <FormNotification level="error">{notificationMessage(missing)}</FormNotification>
      )}

      <FormCommandBar
        saveLabel="Save and close"
        onSave={handleSave}
        backTo={`/receive-assess/cases/${encodeURIComponent(caseId)}`}
      />

      <Card className={styles.headerCard}>
        <Title3>
          Site check
          <span className={styles.savedLabel}>- {saved.siteCheck ? 'Saved' : 'Unsaved'}</span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      <Card className={styles.bodyCard}>
        <div className={styles.sectionTitleRow}>
          <Text className={styles.sectionHeading}>Site coordinates</Text>
          <Link href="#" className={styles.csvLink}>
            <ArrowDownloadRegular /> Download CSV
          </Link>
        </div>

        <div className={styles.divider} />

        <div>
          <Text block className={styles.sectionHeading}>1. Coordinates and shape</Text>
          <Text block className={styles.desc}>
            Check that the coordinates accurately represent the location of the works, that the
            shape and size are appropriate for the activity, and that the site is within MMO
            jurisdiction.
          </Text>
          <div className={styles.question}>
            <RequiredLabel className={styles.label}>
              Are the coordinates and shape correct and appropriate?
            </RequiredLabel>
            <Field
              className={styles.control}
              validationState={errorFor('coordinatesOk') ? 'error' : 'none'}
              validationMessage={errorFor('coordinatesOk')}
              validationMessageIcon={<DismissCircleRegular />}
            >
              <OutcomeDropdown
                value={siteCheckForm.coordinatesOk}
                options={['Yes', 'No']}
                onSelect={v => {
                  setField('coordinatesOk', v);
                  markUnsaved('siteCheck');
                }}
              />
            </Field>
          </div>
        </div>

        <div className={styles.divider} />

        <div>
          <Text block className={styles.sectionHeading}>2. Site located in the Water Framework Directive assessment (WFD) area</Text>
          <Text block className={styles.desc}>
            Confirm whether the site is within the WFD assessment area. Within one nautical mile
            (1.85km) of the low water line, or in a tidal river or estuary - including the shore
            between low and Mean High Water Springs.
          </Text>
          <div className={styles.question}>
            <RequiredLabel className={styles.label}>
              Is the site within the WFD assessment area?
            </RequiredLabel>
            <Field
              className={styles.control}
              validationState={errorFor('withinMile') ? 'error' : 'none'}
              validationMessage={errorFor('withinMile')}
              validationMessageIcon={<DismissCircleRegular />}
            >
              <OutcomeDropdown
                value={siteCheckForm.withinMile}
                options={['Yes', 'No']}
                onSelect={v => {
                  setField('withinMile', v);
                  markUnsaved('siteCheck');
                }}
              />
            </Field>
          </div>
        </div>

        <div className={styles.divider} />

        <div>
          <Text block className={styles.sectionHeading}>3. Notes from your site check</Text>
          <div className={mergeClasses(styles.question, styles.notesRowGap)}>
            <RequiredLabel className={styles.label}>
              Record anything from your site check that is relevant to later stages of the assessment.
            </RequiredLabel>
            <Field
              className={styles.control}
              validationState={errorFor('notes') ? 'error' : 'none'}
              validationMessage={errorFor('notes')}
              validationMessageIcon={<DismissCircleRegular />}
            >
              <Textarea
                className={styles.textarea}
                appearance="filled-lighter"
                value={siteCheckForm.notes}
                onChange={(_, d) => setField('notes', d.value)}
                onBlur={() => markUnsaved('siteCheck')}
                resize="vertical"
                rows={5}
              />
            </Field>
          </div>
        </div>
      </Card>
    </div>
  );
}
