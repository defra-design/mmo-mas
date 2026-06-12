// src/components/tasks/SiteCheckTask.tsx
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Title3,
  Caption1,
  Field,
  Dropdown,
  Option,
  Textarea,
  Link,
} from '@fluentui/react-components';
import { ArrowDownloadRegular } from '@fluentui/react-icons';
import FormCommandBar from '../FormCommandBar';
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
    marginBottom: tokens.spacingVerticalM,
  },
  csvLink: { display: 'inline-flex', alignItems: 'center', gap: tokens.spacingHorizontalXS },
  desc: {
    color: tokens.colorNeutralForeground2,
    marginTop: '0',
    marginBottom: tokens.spacingVerticalL,
  },
  question: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalXXL,
    alignItems: 'start',
  },
  divider: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
});

interface SiteCheckTaskProps {
  caseId: string;
}

export default function SiteCheckTask({ caseId }: SiteCheckTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { siteCheckForm, setSiteCheckField, completeSiteCheck } = useTasks();

  const handleSave = () => {
    completeSiteCheck();
    navigate(`/review-assess/cases/${encodeURIComponent(caseId)}`);
  };

  return (
    <div className={styles.page}>
      <FormCommandBar saveLabel="Save task" onSave={handleSave} />

      <Card className={styles.headerCard}>
        <Caption1>Task</Caption1>
        <Title3>Site check</Title3>
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
              <Dropdown
                placeholder="Select"
                value={siteCheckForm.coordinatesOk}
                selectedOptions={siteCheckForm.coordinatesOk ? [siteCheckForm.coordinatesOk] : []}
                onOptionSelect={(_, d) => setSiteCheckField('coordinatesOk', d.optionValue ?? '')}
              >
                <Option>Yes</Option>
                <Option>No</Option>
              </Dropdown>
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
              <Dropdown
                placeholder="Select"
                value={siteCheckForm.withinMile}
                selectedOptions={siteCheckForm.withinMile ? [siteCheckForm.withinMile] : []}
                onOptionSelect={(_, d) => setSiteCheckField('withinMile', d.optionValue ?? '')}
              >
                <Option>Yes</Option>
                <Option>No</Option>
              </Dropdown>
            </Field>
          </div>
        </div>

        <div className={styles.divider} />

        <div>
          <Text block className={styles.sectionHeading}>3. Notes from your site check</Text>
          <div className={styles.question}>
            <Text>Record anything from your site check that should inform later assessment tasks.</Text>
            <Field>
              <Textarea
                value={siteCheckForm.notes}
                onChange={(_, d) => setSiteCheckField('notes', d.value)}
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
