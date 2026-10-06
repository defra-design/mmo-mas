import { useNavigate } from 'react-router-dom';
import { Body1, Card, Checkbox, Text, Title3, makeStyles, tokens } from '@fluentui/react-components';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import TaskRow from './TaskRow';
import { useTasks } from '../../context/TaskContext';
import { startConsultationStatus } from '../../utils/startConsultation';

const useStyles = makeStyles({
  page: { backgroundColor: tokens.colorNeutralBackground2, display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM },
  header: { padding: '16px 32px' },
  section: { padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  heading: { fontSize: tokens.fontSizeBase400, fontWeight: tokens.fontWeightSemibold },
  saved: { fontSize: tokens.fontSizeBase300, fontWeight: tokens.fontWeightRegular, color: tokens.colorNeutralForeground3 },
  list: { margin: 0, paddingLeft: '20px', '& li': { marginBottom: '6px' } },
});

export default function StartConsultationTask({ caseId }: { caseId: string }) {
  const styles = useStyles();
  const navigate = useNavigate();
  const context = useTasks();
  const status = startConsultationStatus(caseId, context);
  const locked = status !== 'To do';
  const completed = status === 'Done';
  const form = context.consultations[caseId];
  const backTo = `/receive-assess/cases/${encodeURIComponent(caseId)}`;
  const label = 'I confirm that this case is ready to start consultation';
  const saveAndClose = () => {
    if (!locked) context.saveStartConsultation(caseId);
    navigate(backTo);
  };

  return (
    <div className={styles.page}>
      {locked && (
        <FormNotification level="read-only">
          {completed
            ? 'Consultation has started. This task is read-only.'
            : 'You cannot start consultation until the required assessment tasks are complete.'}
        </FormNotification>
      )}
      <FormCommandBar saveLabel="Save and close" onSave={saveAndClose} backTo={backTo} />
      <Card className={styles.header}>
        <Title3>Start consultation <span className={styles.saved}>– {locked || form?.saved !== false ? 'Saved' : 'Unsaved'}</span></Title3>
        <div><Body1>Task</Body1></div>
      </Card>
      <Card className={styles.section}>
        <Text className={styles.heading}>Ready for consultation</Text>
        <Body1>The required assessment tasks are complete. You can now start consultation for this case.</Body1>
        <Body1>When you start consultation:</Body1>
        <ul className={styles.list}>
          <li>The application is published on the public register.</li>
          <li>Application notifications and requests for advice are sent to the organisations you selected in Prepare for consultation</li>
          <li>The case status changes to Consultation.</li>
        </ul>
      </Card>
      <Card className={styles.section}>
        <Text className={styles.heading}>Confirm</Text>
        <TaskRow label={label} locked={locked}>
          <Checkbox
            aria-label={label}
            aria-readonly={locked}
            checked={completed || form?.confirmed === true}
            onChange={(_, data) => {
              if (!locked) context.setConsultationConfirmed(caseId, Boolean(data.checked));
            }}
          />
        </TaskRow>
      </Card>
    </div>
  );
}
