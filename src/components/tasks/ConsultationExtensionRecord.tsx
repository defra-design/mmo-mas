// A Consultation extension record's main form, opened full page from the
// Extensions subgrid on the Extend consultee closing date task: Add extension
// opens a new one, and the Date extended link opens a saved one read-only (it
// has already moved the closing date). Current closing date is the case's
// closing date now: the original one for a first extension, or the latest.
// New closing date is worked out as soon as Extend by is picked: in D365 a small
// form script, or on save from a calculated column.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { makeStyles, shorthands, tokens, Body1, Card, Field, Title3 } from '@fluentui/react-components';
import { DismissCircleRegular } from '@fluentui/react-icons';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import OutcomeDropdown from './OutcomeDropdown';
import TaskRow from './TaskRow';
import TaskTextarea from './TaskTextarea';
import TaskValue from './TaskValue';
import { useCaseTasks } from '../../context/TaskContext';
import { notificationMessage, requiredMessage } from '../../utils/validationMessages';
import {
  EXTEND_BY_OPTIONS, addDays, currentClosingDate, isoDate, showDate, withNewClosingDates,
} from '../../utils/consultationCase';

const LABELS = { days: 'Extend by', reason: 'Reason' };
type Required = keyof typeof LABELS;

const useStyles = makeStyles({
  page: { backgroundColor: tokens.colorNeutralBackground2, display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM },
  card: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL) },
  fields: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  control: { flexGrow: 1, flexBasis: 0, minWidth: '140px' },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS, fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular, color: tokens.colorNeutralForeground2,
  },
});

type Props = { caseId: string };

export default function ConsultationExtensionRecord({ caseId }: Props) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { extensionId } = useParams<{ extensionId: string }>();
  const { consultationExtensions, addConsultationExtension } = useCaseTasks(caseId);
  const extensions = consultationExtensions[caseId] ?? [];
  const saved = withNewClosingDates(extensions).find(row => row.id === extensionId);
  const [draft, setDraft] = useState({ days: '', reason: '' });
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<Required[]>([]);
  const taskUrl = `/receive-assess/cases/${encodeURIComponent(caseId)}/tasks/extend-closing-date`;
  const closingDate = currentClosingDate(extensions);
  const days = parseInt(draft.days, 10);

  if (extensionId !== 'new' && !saved) {
    return <div className={styles.page}>
      <FormCommandBar backTo={taskUrl} />
      <Card className={styles.card}><Title3>Extension not found</Title3></Card>
    </div>;
  }

  const missing = (next: typeof draft) => (['days', 'reason'] as const).filter(field => !next[field].trim());
  const update = (field: Required, value: string) => {
    const next = { ...draft, [field]: value };
    setDraft(next);
    setDirty(true);
    setErrors(previous => previous.filter(error => missing(next).includes(error)));
  };
  const save = () => {
    if (!saved) {
      const gaps = missing(draft);
      setErrors(gaps);
      if (gaps.length) return;
      addConsultationExtension(caseId, {
        id: crypto.randomUUID(), dateExtended: isoDate(new Date()), days, reason: draft.reason.trim(),
      });
    }
    navigate(taskUrl);
  };
  const required = (field: Required) => ({
    className: styles.control,
    validationState: errors.includes(field) ? 'error' as const : 'none' as const,
    validationMessage: errors.includes(field) ? requiredMessage(LABELS[field]) : undefined,
    validationMessageIcon: <DismissCircleRegular />,
  });

  return (
    <div className={styles.page}>
      {errors.length > 0 && (
        <FormNotification level="error">{notificationMessage(errors.map(error => LABELS[error]))}</FormNotification>
      )}
      <FormCommandBar backTo={taskUrl} saveLabel="Save and close" onSave={save} />
      <Card className={styles.card}>
        <Title3>
          {saved ? 'Consultation extension' : 'Add extension'}
          <span className={styles.savedLabel}>- {saved || !dirty ? 'Saved' : 'Unsaved'}</span>
        </Title3>
        <div><Body1>Consultation extension</Body1></div>
      </Card>
      <Card className={styles.card}>
        {saved ? (
          <div className={styles.fields}>
            <TaskRow label="Date extended" locked><TaskValue>{showDate(saved.dateExtended)}</TaskValue></TaskRow>
            <TaskRow label="Extend by" locked><TaskValue>{`${saved.days} days`}</TaskValue></TaskRow>
            <TaskRow label="New closing date" locked><TaskValue>{showDate(saved.newClosingDate)}</TaskValue></TaskRow>
            <TaskRow label="Reason" locked top><TaskValue multiline>{saved.reason}</TaskValue></TaskRow>
          </div>
        ) : (
          <div className={styles.fields}>
            <TaskRow label="Current closing date" locked><TaskValue>{showDate(closingDate)}</TaskValue></TaskRow>
            <TaskRow label="Extend by" required>
              <Field {...required('days')}>
                <OutcomeDropdown value={draft.days} options={EXTEND_BY_OPTIONS} onSelect={value => update('days', value)} />
              </Field>
            </TaskRow>
            <TaskRow label="New closing date" locked>
              <TaskValue>{days ? showDate(addDays(closingDate, days)) : ''}</TaskValue>
            </TaskRow>
            <TaskRow label="Reason" required top>
              <Field {...required('reason')}>
                <TaskTextarea value={draft.reason} onChange={value => update('reason', value)} rows={6} />
              </Field>
            </TaskRow>
          </div>
        )}
      </Card>
    </div>
  );
}
