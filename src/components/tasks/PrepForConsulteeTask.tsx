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
  mergeClasses,
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
import FieldDecorations from './FieldDecorations';
import {
  CANNOT_START_MESSAGE,
  notificationMessage,
  requiredMessage,
} from '../../utils/validationMessages';
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
    // Fluent's TableRow also darkens on press and while a cell inside it holds
    // focus. Neither is real grid behaviour here (see the note above), and the
    // pressed flash fires every time the caseworker clicks into a field, so all
    // three states are pinned to the card's own background.
    ':active': { backgroundColor: tokens.colorNeutralBackground1 },
    ':hover:active': { backgroundColor: tokens.colorNeutralBackground1 },
    ':focus-within': { backgroundColor: tokens.colorNeutralBackground1 },
  },
  headerCell: { fontWeight: tokens.fontWeightSemibold },
  cell: { verticalAlign: 'top', ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalXS) },
  cellField: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS,
  },
  cellControl: { flexGrow: 1, minWidth: 0 },
  // Read-only lookup cell: the value on the same grey background the lookup uses.
  readOnlyCell: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.padding(tokens.spacingVerticalSNudge, tokens.spacingHorizontalM),
    minHeight: '20px',
  },
  textareaReadOnly: { '& textarea': { cursor: 'default' } },
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
    tasks,
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

  // Gated behind Site check. The record still opens — D365 cannot lock a
  // caseworker out — but it opens read-only: padlocked fields, no Save command.
  const locked = tasks.prepForConsultee === 'Cannot start yet';

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
      {locked && <FormNotification level="read-only">{CANNOT_START_MESSAGE}</FormNotification>}

      {showError && (
        <FormNotification level="error">
          {notificationMessage(['Organisation'])}
        </FormNotification>
      )}

      <FormCommandBar
        saveLabel={locked ? undefined : 'Save and close'}
        onSave={locked ? undefined : handleSave}
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
          Add each organisation you need to consult for this case. Include any notes. The service adds a new row underneath each organisation you select.
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
                      <div className={styles.cellField}>
                        <FieldDecorations locked={locked} />
                        <div className={styles.cellControl}>
                          {/* A read-only lookup has no search control in D365 — just
                              the record's name on the same grey background. */}
                          {locked ? (
                            <div className={styles.readOnlyCell}>{row.organisation || '\u00a0'}</div>
                          ) : (
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
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={styles.cell} style={{ width: COLS.notes }}>
                      <div className={styles.cellField}>
                        <FieldDecorations locked={locked} />
                        <Field className={styles.cellControl}>
                          <Textarea
                            className={mergeClasses(
                              styles.textarea,
                              locked && styles.textareaReadOnly,
                            )}
                            appearance="filled-lighter"
                            value={row.notes}
                            onChange={(_, d) => {
                              setPrepForConsulteeRow(row.id, 'notes', d.value);
                              markUnsaved('prepForConsultee');
                            }}
                            readOnly={locked}
                            resize={locked ? 'none' : 'vertical'}
                            rows={4}
                          />
                        </Field>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className={styles.completeRow}>
          {locked && <FieldDecorations locked />}
          <Checkbox
            label="Select to mark the task as complete"
            checked={prepForConsulteeMeta.completed}
            disabled={locked}
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
