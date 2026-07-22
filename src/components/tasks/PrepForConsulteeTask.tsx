// src/components/tasks/PrepForConsulteeTask.tsx
// Task form for "Prep for consultee". The body is an editable subgrid of related
// Consultee rows (Organisation lookup + Notes) — OOB Power Apps grid pattern.
// The Consultee *table* itself is custom (see chat notes); the controls are not.
// A Two Options checkbox marks the task complete: ticked → Done on save,
// unticked → In progress (OOB Task activity statuses).
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
  Field,
  Textarea,
  Checkbox,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableBody,
} from '@fluentui/react-components';
import { DismissCircleRegular } from '@fluentui/react-icons';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import OrganisationLookup from './OrganisationLookup';
import { notificationMessage, requiredMessage } from '../../utils/validationMessages';
import { useTasks } from '../../context/TaskContext';

const COLS = { organisation: 320, notes: 400 };

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
  scroll: { overflowX: 'auto' },
  // Each consultee row holds its own editable fields, so the whole-row hover
  // highlight Fluent's Table adds by default just reads as a glitch here — keep
  // the row background flat (matches the white body card).
  row: {
    ':hover': { backgroundColor: tokens.colorNeutralBackground1 },
  },
  headerCell: { fontWeight: tokens.fontWeightSemibold },
  cell: { verticalAlign: 'top', ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalXS) },
  textarea: {
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.border('none'),
    '::after': { ...shorthands.border('none') },
  },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
  completeRow: {
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: tokens.spacingVerticalL,
  },
});

interface PrepForConsulteeTaskProps {
  caseId: string;
}

export default function PrepForConsulteeTask({ caseId }: PrepForConsulteeTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const {
    prepForConsulteeForm,
    prepForConsulteeMeta,
    recentOrganisations,
    saved,
    setPrepForConsulteeRow,
    setPrepForConsulteeCompleted,
    addRecentOrganisation,
    markUnsaved,
    savePrepForConsultee,
  } = useTasks();
  const [showError, setShowError] = useState(false);

  const filled = prepForConsulteeForm.filter(r => r.organisation.trim());

  const handleSave = () => {
    if (filled.length === 0) {
      setShowError(true);
      return;
    }
    savePrepForConsultee();
    navigate(`/receive-assess/cases/${encodeURIComponent(caseId)}`);
  };

  const setOrg = (id: string, value: string) => {
    setPrepForConsulteeRow(id, 'organisation', value);
    markUnsaved('prepForConsultee');
    if (value.trim()) {
      setShowError(false);
      addRecentOrganisation(value);
    }
  };

  return (
    <div className={styles.page}>
      {showError && (
        <FormNotification level="error">
          {notificationMessage(['Organisation'])}
        </FormNotification>
      )}

      <FormCommandBar
        saveLabel="Save and close"
        onSave={handleSave}
        backTo={`/receive-assess/cases/${encodeURIComponent(caseId)}`}
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

      <Card className={styles.bodyCard}>
        <div>
          <Text block className={styles.sectionHeading}>Consultees</Text>
          <Text block className={styles.desc}>
          Add each organisation you need to consult for this application. Include any notes. The service adds a new row for each organisation you select.
          </Text>
        </div>

        <div className={styles.scroll}>
          <Table
            aria-label="Consultees"
            style={{ tableLayout: 'fixed', width: '100%', minWidth: COLS.organisation + COLS.notes }}
          >
            <TableHeader>
              <TableRow>
                <TableHeaderCell className={styles.headerCell} style={{ width: COLS.organisation }}>
                  Organisation
                </TableHeaderCell>
                <TableHeaderCell className={styles.headerCell} style={{ width: COLS.notes }}>
                  Notes for the organisation
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prepForConsulteeForm.map(row => {
                const orgError = showError && !row.organisation.trim() && filled.length === 0
                  && row.id === prepForConsulteeForm[0]?.id;
                return (
                  <TableRow key={row.id} className={styles.row}>
                    <TableCell className={styles.cell} style={{ width: COLS.organisation }}>
                      <Field
                        validationState={orgError ? 'error' : 'none'}
                        validationMessage={orgError ? requiredMessage('Organisation') : undefined}
                        validationMessageIcon={<DismissCircleRegular />}
                      >
                        <OrganisationLookup
                          value={row.organisation}
                          recent={recentOrganisations}
                          onSelect={v => setOrg(row.id, v)}
                        />
                      </Field>
                    </TableCell>
                    <TableCell className={styles.cell} style={{ width: COLS.notes }}>
                      <Field>
                        <Textarea
                          className={styles.textarea}
                          appearance="filled-lighter"
                          value={row.notes}
                          onChange={(_, d) => {
                            setPrepForConsulteeRow(row.id, 'notes', d.value);
                            markUnsaved('prepForConsultee');
                          }}
                          resize="vertical"
                          rows={4}
                        />
                      </Field>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className={styles.completeRow}>
          <Checkbox
            label="Select to mark the task as complete"
            checked={prepForConsulteeMeta.completed}
            onChange={(_, data) => {
              setPrepForConsulteeCompleted(Boolean(data.checked));
              markUnsaved('prepForConsultee');
            }}
          />
        </div>
      </Card>
    </div>
  );
}
