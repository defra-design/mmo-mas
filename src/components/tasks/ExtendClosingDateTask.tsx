// src/components/tasks/ExtendClosingDateTask.tsx
// Task form for "Extend consultee closing date", an optional task on a case in
// consultation (MLA/2026/10006). The consultation dates are read-only. Once
// there is an extension, Consultation period becomes Original consultation
// period, and Original closing date is added: separate columns shown and hidden
// by a business rule, as a label can't change. Consultee closing date always shows the current date. Each
// extension is a related Consultation extension record, added on its own page
// from the Extensions subgrid. Its status is Optional, then Extended.
import { useNavigate } from 'react-router-dom';
import { makeStyles, shorthands, tokens, Body1, Card, Link, Text, Title3 } from '@fluentui/react-components';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import TaskRow from './TaskRow';
import TaskValue from './TaskValue';
import TaskHint from './TaskHint';
import ExtensionsGrid from './ExtensionsGrid';
import { useTasks } from '../../context/TaskContext';
import {
  CONSULTATION_PERIOD_DAYS, CONSULTATION_STARTED, ORIGINAL_CLOSING_DATE, currentClosingDate,
  isoDate, showDate, withNewClosingDates,
} from '../../utils/consultationCase';

const useStyles = makeStyles({
  page: { backgroundColor: tokens.colorNeutralBackground2, display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM },
  headerCard: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL) },
  sectionCard: {
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL,
  },
  sectionHeading: { fontSize: tokens.fontSizeBase400, fontWeight: tokens.fontWeightSemibold },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS, fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular, color: tokens.colorNeutralForeground2,
  },
  list: { margin: 0, paddingLeft: tokens.spacingHorizontalXL, display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS },
});

type Props = { caseId: string };

export default function ExtendClosingDateTask({ caseId }: Props) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { consultationExtensions } = useTasks();
  const extensions = consultationExtensions[caseId] ?? [];
  const extended = extensions.length > 0;
  const closingDate = currentClosingDate(extensions);
  const passed = isoDate(new Date()) > closingDate;
  const caseUrl = `/receive-assess/cases/${encodeURIComponent(caseId)}`;
  const taskUrl = `${caseUrl}/tasks/extend-closing-date`;
  const date = (label: string, value: string) => (
    <TaskRow label={label} locked><TaskValue>{value}</TaskValue></TaskRow>
  );

  return (
    <div className={styles.page}>
      {passed && (
        <FormNotification level="info">
          The consultee closing date passed on {showDate(closingDate)}. You can still extend it.
        </FormNotification>
      )}
      <FormCommandBar saveLabel="Save and close" onSave={() => navigate(caseUrl)} backTo={caseUrl} />

      <Card className={styles.headerCard}>
        <Title3>Extend consultee closing date<span className={styles.savedLabel}>- Saved</span></Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      <Card className={styles.sectionCard}>
        <Text block className={styles.sectionHeading}>Consultation</Text>
        {date('Consultation started', showDate(CONSULTATION_STARTED))}
        {date(extended ? 'Original consultation period' : 'Consultation period', `${CONSULTATION_PERIOD_DAYS} days`)}
        {extended && date('Original closing date', showDate(ORIGINAL_CLOSING_DATE))}
        {date('Consultee closing date', showDate(closingDate))}
        <TaskHint title="Help with extending the closing date">
          <Text block>
            Extend the closing date if a consultee asks for more time, or if you decide more time is
            needed. You can extend it more than once, including after it has passed.
          </Text>
          <ul className={styles.list}>
            <li>The new closing date applies to every consultee on this case, not just the one who asked.</li>
            <li>We do not email consultees when you extend the closing date. If a consultee asked for more time, tell them the new date.</li>
            <li>
              To see who has responded, go to the{' '}
              <Link as="a" href={`${caseUrl}?tab=consultation`}
                onClick={event => { event.preventDefault(); navigate(caseUrl, { state: { tab: 'consultation' } }); }}>
                Consultation responses tab
              </Link>.
            </li>
          </ul>
        </TaskHint>
      </Card>

      <Card className={styles.sectionCard}>
        <Text block className={styles.sectionHeading}>Extensions</Text>
        <div>
          <ExtensionsGrid
            caseId={caseId}
            rows={withNewClosingDates(extensions)}
            onAdd={() => navigate(`${taskUrl}/extensions/new`)}
            onOpen={id => navigate(`${taskUrl}/extensions/${id}`)}
          />
        </div>
      </Card>
    </div>
  );
}
