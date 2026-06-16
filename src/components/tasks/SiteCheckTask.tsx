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
} from '@fluentui/react-components';
import { ArrowDownloadRegular } from '@fluentui/react-icons';
import FormCommandBar from '../FormCommandBar';
import OutcomeDropdown from './OutcomeDropdown';
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
  sectionTitleRow: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalL },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  headingGap: { marginBottom: tokens.spacingVerticalM },
  csvLink: { display: 'inline-flex', alignItems: 'center', gap: tokens.spacingHorizontalXS },
  desc: {
    color: tokens.colorNeutralForeground2,
    marginTop: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalL,
  },
  question: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalXXL,
    alignItems: 'start',
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
            Check that the coordinates accurately represent where the works will physically take
            place, that the shape and size make sense for the activity, and that the site is within
            MMO jurisdiction.
          </Text>
          <div className={styles.question}>
            <Text>Are the coordinates and shape acceptable for assessment?</Text>
            <Field>
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
          <Text block className={styles.sectionHeading}>2. One nautical mile check</Text>
          <Text block className={styles.desc}>
            Check the site location to determine whether the activity is within 1 nautical mile of
            the coast. This is used to confirm whether a Water Framework Directive assessment is
            required.
          </Text>
          <div className={styles.question}>
            <Text>Is the activity within 1 nautical mile of the coast?</Text>
            <Field>
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
          <Text block className={`${styles.sectionHeading} ${styles.headingGap}`}>3. Notes from your site check</Text>
          <div className={styles.question}>
            <Text>Record anything from your site check that should inform later assessment tasks.</Text>
            <Field>
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
