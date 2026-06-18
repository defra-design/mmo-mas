// src/components/tasks/SiteCheckTask.tsx
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
import { ArrowDownloadRegular } from '@fluentui/react-icons';
import FormCommandBar from '../FormCommandBar';
import OutcomeDropdown from './OutcomeDropdown';
import { useTasks } from '../../context/TaskContext';

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

export default function SiteCheckTask({ caseId }: SiteCheckTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { siteCheckForm, saved, setSiteCheckField, markUnsaved, completeSiteCheck } = useTasks();

  const handleSave = () => {
    completeSiteCheck();
    navigate(`/review-assess/cases/${encodeURIComponent(caseId)}`);
  };

  return (
    <div className={styles.page}>
      <FormCommandBar
        saveLabel="Save task"
        onSave={handleSave}
        backTo={`/review-assess/cases/${encodeURIComponent(caseId)}`}
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
            <Text className={styles.label}>Are the coordinates and shape correct and appropriate?</Text>
            <Field className={styles.control}>
              <OutcomeDropdown
                value={siteCheckForm.coordinatesOk}
                options={['Yes', 'No']}
                onSelect={v => {
                  setSiteCheckField('coordinatesOk', v);
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
            <Text className={styles.label}>Is the site within the WFD assessment area?</Text>
            <Field className={styles.control}>
              <OutcomeDropdown
                value={siteCheckForm.withinMile}
                options={['Yes', 'No']}
                onSelect={v => {
                  setSiteCheckField('withinMile', v);
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
            <Text className={styles.label}>Record anything from your site check that is relevant to later stages of the assessment.</Text>
            <Field className={styles.control}>
              <Textarea
                className={styles.textarea}
                appearance="filled-lighter"
                value={siteCheckForm.notes}
                onChange={(_, d) => setSiteCheckField('notes', d.value)}
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
