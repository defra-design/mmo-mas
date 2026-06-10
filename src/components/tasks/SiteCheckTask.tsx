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
  sectionHeading: { fontSize: tokens.fontSizeBase500, fontWeight: tokens.fontWeightSemibold },
  csvLink: { display: 'inline-flex', alignItems: 'center', gap: tokens.spacingHorizontalXS },
  question: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalXXL,
    alignItems: 'start',
    paddingTop: tokens.spacingVerticalM,
  },
  divider: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
  desc: { color: tokens.colorNeutralForeground2, marginBottom: tokens.spacingVerticalM },
});

interface SiteCheckTaskProps {
  caseId: string;
}

export default function SiteCheckTask({ caseId }: SiteCheckTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { completeSiteCheck } = useTasks();

  const [coordinatesOk, setCoordinatesOk] = useState('');
  const [withinMile, setWithinMile] = useState('');
  const [notes, setNotes] = useState('');

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
          <Text className={styles.sectionHeading}>1. Coordinates and shape</Text>
          <Body1 as="p" className={styles.desc}>
            Check that the coordinates accurately represent where the works will physically take
            place, that the shape and size make sense for the activity, and that the site is within
            MMO jurisdiction.
          </Body1>
          <div className={styles.question}>
            <Text>Are the coordinates and shape acceptable for assessment?</Text>
            <Field>
              <Dropdown
                placeholder="--- Select ---"
                value={coordinatesOk}
                selectedOptions={coordinatesOk ? [coordinatesOk] : []}
                onOptionSelect={(_, d) => setCoordinatesOk(d.optionValue ?? '')}
              >
                <Option>Yes</Option>
                <Option>No</Option>
              </Dropdown>
            </Field>
          </div>
        </div>

        <div className={styles.divider} />

        <div>
          <Text className={styles.sectionHeading}>2. One nautical mile check</Text>
          <Body1 as="p" className={styles.desc}>
            Check the site location to determine whether the activity is within 1 nautical mile of
            the coast. This is used to confirm whether a Water Framework Directive assessment is
            required.
          </Body1>
          <div className={styles.question}>
            <Text>Is the activity within 1 nautical mile of the coast?</Text>
            <Field>
              <Dropdown
                placeholder="--- Select ---"
                value={withinMile}
                selectedOptions={withinMile ? [withinMile] : []}
                onOptionSelect={(_, d) => setWithinMile(d.optionValue ?? '')}
              >
                <Option>Yes</Option>
                <Option>No</Option>
              </Dropdown>
            </Field>
          </div>
        </div>

        <div className={styles.divider} />

        <div>
          <Text className={styles.sectionHeading}>3. Notes from your site check</Text>
          <div className={styles.question}>
            <Text>Record anything from your site check that should inform later assessment tasks.</Text>
            <Field>
              <Textarea
                value={notes}
                onChange={(_, d) => setNotes(d.value)}
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
