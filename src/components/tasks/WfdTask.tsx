// src/components/tasks/WfdTask.tsx
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Title3,
  Caption1,
  Body1,
  Field,
  Dropdown,
  Option,
  Link,
} from '@fluentui/react-components';
import { GlobeRegular, CheckmarkFilled } from '@fluentui/react-icons';
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
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalL,
  },
  answers: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  answerRow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(200px, 280px) minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
  },
  value: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusSmall,
  },
  docxLink: { display: 'inline-flex', alignItems: 'center', gap: tokens.spacingHorizontalS },
  confirm: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusSmall,
    whiteSpace: 'nowrap',
  },
  // Static visual of a D365 selected checkbox — not interactive.
  confirmCheck: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralForeground1,
    color: tokens.colorNeutralBackground1,
  },
  divider: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
  // Same label column as the applicant answers so both sections line up.
  question: {
    display: 'grid',
    gridTemplateColumns: 'minmax(200px, 280px) minmax(0, 1fr)',
    gap: tokens.spacingHorizontalL,
    alignItems: 'center',
  },
});

const reviewOptions = [
  'Assessment accepted',
  'Assessment not ok to send to EA',
  'New current assessment needed',
];

interface WfdTaskProps {
  caseId: string;
}

export default function WfdTask({ caseId }: WfdTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { wfdForm, setWfdReview, completeWfd } = useTasks();

  const handleSave = () => {
    completeWfd();
    navigate(`/review-assess/cases/${encodeURIComponent(caseId)}`);
  };

  return (
    <div className={styles.page}>
      <FormCommandBar saveLabel="Save task" onSave={handleSave} showReject />

      <Card className={styles.headerCard}>
        <Caption1>Task</Caption1>
        <Title3>Water Framework Directive (WFD)</Title3>
      </Card>

      <Card className={styles.bodyCard}>
        <div>
          <Text block className={styles.sectionHeading}>1. Applicant's answers</Text>
          <div className={styles.answers}>
            <div className={styles.answerRow}>
              <Text>Within the WFD assessment area</Text>
              <div className={styles.value}><Body1>Yes</Body1></div>
              <div className={styles.confirm}>
                <span className={styles.confirmCheck}><CheckmarkFilled fontSize={14} /></span>
                <Body1>Confirmed in Site check</Body1>
              </div>
            </div>
            <div className={styles.answerRow}>
              <Text>Previous assessment (2015–2022)</Text>
              <div className={styles.value}><Body1>Yes</Body1></div>
            </div>
            <div className={styles.answerRow}>
              <Text>Anything changed since</Text>
              <div className={styles.value}><Body1>No</Body1></div>
            </div>
            <div className={styles.answerRow}>
              <Text>Assessment provided</Text>
              <div className={styles.value}>
                <Link href="#" className={styles.docxLink}>
                  <GlobeRegular /> WFD-Exmouth-2019.docx
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div>
          <Text block className={styles.sectionHeading}>2. WFD review</Text>
          <div className={styles.question}>
            <Text>Is the WFD section complete and acceptable?</Text>
            <Field>
              <Dropdown
                placeholder="Select"
                value={wfdForm.review}
                selectedOptions={wfdForm.review ? [wfdForm.review] : []}
                onOptionSelect={(_, d) => setWfdReview(d.optionValue ?? '')}
              >
                {reviewOptions.map(o => (
                  <Option key={o}>{o}</Option>
                ))}
              </Dropdown>
            </Field>
          </div>
        </div>
      </Card>
    </div>
  );
}
