// src/components/tasks/PrepForConsulteeTask.tsx
// Task form for "Prep for consultee". The body is a read-only subgrid of the
// case's related Consultee records; each one is added and edited on its own
// full-page form (PrepForConsulteeConsultee). A Two Options checkbox marks the
// task complete: ticked → Done on save, unticked → In progress (OOB Task
// activity statuses). Completing needs at least one consultee, and no
// organisation can be added twice — in D365 an OnSave form script that checks
// the related records and sets the notification.
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
  Checkbox,
} from '@fluentui/react-components';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import ConsulteeGrid from './ConsulteeGrid';
import TaskRow from './TaskRow';
import { CANNOT_START_MESSAGE } from '../../utils/validationMessages';
import { useTasks } from '../../context/TaskContext';
import { taskStatusForCase } from '../../utils/publicNoticeEvidence';
import { organisationByName } from '../../utils/organisations';

const NO_CONSULTEES_MESSAGE = 'Add at least one consultee before you mark the task as complete';

const DUPLICATES_MESSAGE = 'You have added an organisation more than once. Remove the duplicate before you save the task';

const useStyles = makeStyles({
  page: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  headerCard: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL) },
  sectionCard: {
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  desc: {
    color: tokens.colorNeutralForeground2,
    marginTop: tokens.spacingVerticalS,
  },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

interface PrepForConsulteeTaskProps {
  caseId: string;
}

export default function PrepForConsulteeTask({ caseId }: PrepForConsulteeTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const {
    tasks,
    consultees,
    prepForConsulteeMeta,
    saved,
    setPrepForConsulteeCompleted,
    removeConsultees,
    markUnsaved,
    savePrepForConsultee,
  } = useTasks();
  const [error, setError] = useState<string>();
  const rows = consultees[caseId] ?? [];
  const caseUrl = `/receive-assess/cases/${encodeURIComponent(caseId)}`;
  const taskUrl = `${caseUrl}/tasks/prep-for-consultee`;

  // Gated behind Site check. The record still opens — D365 cannot lock a
  // caseworker out — but it opens read-only: padlocked fields, no Save command.
  const locked =
    taskStatusForCase(caseId, 'prepForConsultee', tasks.prepForConsultee) ===
    'Cannot start yet';

  const handleSave = () => {
    const organisations = rows.map(row => row.organisation);
    if (new Set(organisations).size < organisations.length) {
      setError(DUPLICATES_MESSAGE);
      return;
    }
    if (prepForConsulteeMeta.completed && rows.length === 0) {
      setError(NO_CONSULTEES_MESSAGE);
      return;
    }
    savePrepForConsultee();
    navigate(caseUrl);
  };

  return (
    <div className={styles.page}>
      {locked && <FormNotification level="read-only">{CANNOT_START_MESSAGE}</FormNotification>}

      {error && <FormNotification level="error">{error}</FormNotification>}

      <FormCommandBar
        saveLabel="Save and close"
        onSave={locked ? () => navigate(caseUrl) : handleSave}
        backTo={caseUrl}
      />

      <Card className={styles.headerCard}>
        <Title3>
          Prepare for consultation
          <span className={styles.savedLabel}>
            - {saved.prepForConsultee ? 'Saved' : 'Unsaved'}
          </span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      <Card className={styles.sectionCard}>
        <div>
          <Text block className={styles.sectionHeading}>Consultees</Text>
          <Text block className={styles.desc}>
            Add each organisation you need to consult about this application.
          </Text>
        </div>
        <div>
          <ConsulteeGrid
            caseId={caseId}
            rows={rows}
            locked={locked}
            onAdd={() => navigate(`${taskUrl}/consultees/new`)}
            onOpen={id => navigate(`${taskUrl}/consultees/${id}`)}
            onOpenOrganisation={name => {
              const organisation = organisationByName(name);
              if (organisation) navigate(`${caseUrl}/organisations/${organisation.id}`, { state: { from: taskUrl } });
            }}
            onRemove={ids => {
              removeConsultees(caseId, ids);
              setError(undefined);
            }}
          />
        </div>
      </Card>

      <Card className={styles.sectionCard}>
        <Text block className={styles.sectionHeading}>Complete task</Text>
        <TaskRow label="Select to mark the task as complete" locked={locked}>
          <Checkbox
            aria-label="Select to mark the task as complete"
            checked={prepForConsulteeMeta.completed}
            disabled={locked}
            onChange={(_, data) => {
              setPrepForConsulteeCompleted(Boolean(data.checked));
              markUnsaved('prepForConsultee');
              if (!data.checked && error === NO_CONSULTEES_MESSAGE) setError(undefined);
            }}
          />
        </TaskRow>
      </Card>
    </div>
  );
}
