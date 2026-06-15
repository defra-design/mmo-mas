// src/components/tasks/WfdTask.tsx
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
  // Flex (not grid) so the value area can wrap under the label at narrow widths.
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalL,
    rowGap: tokens.spacingVerticalS,
  },
  label: { flexShrink: 0, flexBasis: '220px', minWidth: '220px' },
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
  confirm: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: '180px',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusSmall,
  },
  // Static visual of a D365 selected checkbox — not interactive.
  confirmCheck: {
    flexShrink: 0,
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
  control: { flexGrow: 1, flexBasis: 0, minWidth: '140px' },
  dropdown: { width: '100%' },
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
      <FormCommandBar
        saveLabel="Save task"
        onSave={handleSave}
        showReject
        backTo={`/review-assess/cases/${encodeURIComponent(caseId)}`}
      />

      <Card className={styles.headerCard}>
        <Title3>Water Framework Directive (WFD)</Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      <Card className={styles.bodyCard}>
        <div>
          <Text block className={styles.sectionHeading}>1. Applicant's answers</Text>
          <div className={styles.answers}>
            <div className={styles.row}>
              <Text className={styles.label}>Within the WFD assessment area</Text>
              <div className={styles.fields}>
                <div className={styles.value}><Body1>Yes</Body1></div>
                <div className={styles.confirm}>
                  <span className={styles.confirmCheck}><CheckmarkFilled fontSize={14} /></span>
                  <Body1>Confirmed in Site check</Body1>
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <Text className={styles.label}>Previous assessment (2015–2022)</Text>
              <div className={styles.fields}>
                <div className={styles.value}><Body1>Yes</Body1></div>
              </div>
            </div>
            <div className={styles.row}>
              <Text className={styles.label}>Anything changed since</Text>
              <div className={styles.fields}>
                <div className={styles.value}><Body1>No</Body1></div>
              </div>
            </div>
            <div className={styles.row}>
              <Text className={styles.label}>Assessment provided</Text>
              <div className={styles.fields}>
                <div className={styles.value}>
                  <Link href="#" className={styles.docxLink}>
                    <GlobeRegular /> WFD-Teignmouth-2019.docx
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div>
          <Text block className={styles.sectionHeading}>2. WFD review</Text>
          <div className={styles.row}>
            <Text className={styles.label}>Is the WFD section complete and acceptable?</Text>
            <div className={styles.fields}>
              <Field className={styles.control}>
                <Dropdown
                  className={styles.dropdown}
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
        </div>
      </Card>
    </div>
  );
}
