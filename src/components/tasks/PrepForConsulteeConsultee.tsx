// A related Consultee record's native D365 main form, opened full page from the
// Prep for consultee subgrid (Add consultee, or the Organisation link). Edits
// stay on the form until Save and close writes the record; the back arrow
// leaves without saving them. Notes is revealed by a business rule when the
// consultation type is a request for advice.
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { makeStyles, mergeClasses, shorthands, tokens, Body1, Card, Field, Text, Title3 } from '@fluentui/react-components';
import { DismissCircleRegular } from '@fluentui/react-icons';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import OrganisationLookup from './OrganisationLookup';
import OutcomeDropdown from './OutcomeDropdown';
import TaskRow from './TaskRow';
import TaskTextarea from './TaskTextarea';
import type { ConsulteeRow } from '../../context/TaskContext';
import { useTasks } from '../../context/TaskContext';
import { taskStatusForCase } from '../../utils/publicNoticeEvidence';
import { organisationByName } from '../../utils/organisations';
import { CANNOT_START_MESSAGE, notificationMessage, requiredMessage } from '../../utils/validationMessages';

const CONSULTATION_TYPES = ['Application notification', 'Request for advice'];
const LABELS = { organisation: 'Organisation', consultationType: 'Consultation type' };
type Required = keyof typeof LABELS;

const useStyles = makeStyles({
  page: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  card: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL) },
  fields: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  // Help text at the top of the section, as under the Consultees heading.
  desc: { color: tokens.colorNeutralForeground2 },
  control: { flexGrow: 1, flexBasis: 0, minWidth: '140px' },
  // A read-only lookup or choice is just its value on the same grey background.
  value: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.padding(tokens.spacingVerticalSNudge, tokens.spacingHorizontalM),
  },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

const missingFields = (draft: ConsulteeRow): Required[] =>
  (['organisation', 'consultationType'] as const).filter(field => !draft[field].trim());

type Props = { caseId: string };

export default function PrepForConsulteeConsultee({ caseId }: Props) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { tasks, consultees, recentOrganisations, addRecentOrganisation, saveConsultee } = useTasks();
  const { consulteeId } = useParams<{ consulteeId: string }>();
  const existing = (consultees[caseId] ?? []).find(row => row.id === consulteeId);
  const isNew = consulteeId === 'new';
  const [draft, setDraft] = useState<ConsulteeRow>(() =>
    existing ?? { id: crypto.randomUUID(), organisation: '', consultationType: '', notes: '' });
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<Required[]>([]);
  const taskUrl = `/receive-assess/cases/${encodeURIComponent(caseId)}/tasks/prep-for-consultee`;
  const locked =
    taskStatusForCase(caseId, 'prepForConsultee', tasks.prepForConsultee) === 'Cannot start yet';

  if (!isNew && !existing) {
    return <div className={styles.page}>
      <FormCommandBar backTo={taskUrl} />
      <Card className={styles.card}><Title3>Consultee not found</Title3></Card>
    </div>;
  }

  const update = (field: keyof Omit<ConsulteeRow, 'id'>, value: string) => {
    const next = { ...draft, [field]: value };
    setDraft(next);
    setDirty(true);
    setErrors(previous => previous.filter(error => missingFields(next).includes(error)));
  };
  const save = () => {
    if (!locked) {
      const missing = missingFields(draft);
      setErrors(missing);
      if (missing.length) return;
      // Notes only belong to a request for advice; drop any left from switching type.
      saveConsultee(caseId, draft.consultationType === 'Request for advice' ? draft : { ...draft, notes: '' });
    }
    navigate(taskUrl);
  };
  const errorFor = (field: Required) => (errors.includes(field) ? requiredMessage(LABELS[field]) : undefined);
  const required = (field: Required) => ({
    className: styles.control,
    validationState: errorFor(field) ? 'error' as const : 'none' as const,
    validationMessage: errorFor(field),
    validationMessageIcon: <DismissCircleRegular />,
  });

  return (
    <div className={styles.page}>
      {locked && <FormNotification level="read-only">{CANNOT_START_MESSAGE}</FormNotification>}
      {errors.length > 0 && (
        <FormNotification level="error">{notificationMessage(errors.map(error => LABELS[error]))}</FormNotification>
      )}
      <FormCommandBar backTo={taskUrl} saveLabel="Save and close" onSave={save} />
      <Card className={styles.card}>
        <Title3>
          {isNew ? 'Add consultee' : 'Consultee request'}
          <span className={styles.savedLabel}>- {dirty ? 'Unsaved' : 'Saved'}</span>
        </Title3>
        <div><Body1>Consultee</Body1></div>
      </Card>
      <Card className={styles.card}>
        <div className={styles.fields}>
          <Text block className={styles.desc}>
            An application notification tells the organisation about the application. They do not
            need to respond. A request for advice asks the organisation for specific advice. You will
            need to explain what you need advice on.
          </Text>
          <TaskRow label="Organisation" required locked={locked}>
            {locked ? <Body1 className={mergeClasses(styles.control, styles.value)}>{draft.organisation}</Body1> : (
              <Field {...required('organisation')}>
                <OrganisationLookup
                  value={draft.organisation}
                  onOpen={name => {
                    const organisation = organisationByName(name);
                    if (organisation) navigate(`/receive-assess/cases/${encodeURIComponent(caseId)}/organisations/${organisation.id}`, { state: { from: pathname } });
                  }}
                  recent={recentOrganisations}
                  onSelect={value => {
                    update('organisation', value);
                    if (value.trim()) addRecentOrganisation(value);
                  }}
                />
              </Field>
            )}
          </TaskRow>
          <TaskRow label="Consultation type" required locked={locked}>
            {locked ? <Body1 className={mergeClasses(styles.control, styles.value)}>{draft.consultationType}</Body1> : (
              <Field {...required('consultationType')}>
                <OutcomeDropdown
                  value={draft.consultationType}
                  options={CONSULTATION_TYPES}
                  onSelect={value => update('consultationType', value)}
                />
              </Field>
            )}
          </TaskRow>
          {draft.consultationType === 'Request for advice' && (
            <TaskRow label="Notes for the organisation" locked={locked} top>
              <TaskTextarea value={draft.notes} onChange={value => update('notes', value)} locked={locked} rows={8} />
            </TaskRow>
          )}
        </div>
      </Card>
    </div>
  );
}
