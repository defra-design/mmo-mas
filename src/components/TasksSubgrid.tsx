// src/components/TasksSubgrid.tsx
// Full-width D365 subgrid (read-only grid) of the case's caseworker tasks, with
// the status in its own right-hand column, matching MarinePlanPoliciesSubgrid.
// Every case shows its tasks here, on the Tasks tab.
import { useNavigate } from 'react-router-dom';
import { CONSULTATION_CASE_ID } from '../utils/cases';
import { startConsultationStatus } from '../utils/startConsultation';
import {
  makeStyles,
  mergeClasses,
  tokens,
  Text,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableCell,
} from '@fluentui/react-components';
import { useSubgridStyles } from './subgridStyles';
import {
  ChevronLeftRegular,
  ChevronRightRegular,
  PreviousRegular,
} from '@fluentui/react-icons';
import { useCaseTasks } from '../context/TaskContext';
import type { TaskStatus } from '../context/TaskContext';
import {
  hasSubmittedPublicNoticeEvidence,
  publicNoticeEvidenceStatusForCase,
} from '../utils/publicNoticeEvidence';

// Column widths. table-layout:fixed + width:100% shares any extra space in
// proportion to these, so Task grows most. The leading row-select column is
// hidden (per the D365 subgrid config the dev confirmed), so Task leads.
const COLS = { task: 420, status: 180 };
const MIN_WIDTH = COLS.task + COLS.status;

const useStyles = makeStyles({
  heading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalL,
  },
  scroll: { overflowX: 'auto' },
  headerCell: { fontWeight: tokens.fontWeightSemibold },
  cellText: {
    display: 'block',
    minWidth: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  statusText: { color: tokens.colorNeutralForeground3 },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: tokens.spacingVerticalL,
    color: tokens.colorNeutralForeground3,
  },
  pager: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS },
});

interface TaskRow {
  key: string;
  name: string;
  status: TaskStatus | 'Optional' | 'Extended';
  slug: string;
}

interface TasksSubgridProps {
  caseId: string;
}

export default function TasksSubgrid({ caseId }: TasksSubgridProps) {
  const styles = useStyles();
  const grid = useSubgridStyles();
  const navigate = useNavigate();
  const taskContext = useCaseTasks(caseId);
  const { tasks } = taskContext;
  const evidenceSubmitted = hasSubmittedPublicNoticeEvidence(caseId);

  // Every task opens, whatever its status. A task still gated behind Site check
  // ("Cannot start yet") opens read-only rather than being unclickable — D365
  // cannot lock a caseworker out of a record. Rows appear once they apply: the
  // evidence review when the applicant's photos arrive, and the extension once
  // the case is in consultation.
  const rows: TaskRow[] = [
    { key: 'siteCheck', name: 'Site check', status: tasks.siteCheck, slug: 'site-check' },
    { key: 'wfd', name: 'Water Framework Directive', status: tasks.wfdAssessment, slug: 'wfd' },
    { key: 'publicRegister', name: 'Withholding information', status: tasks.publicRegister, slug: 'public-register' },
    { key: 'siteNotice', name: 'Public notice', status: tasks.siteNotice, slug: 'site-notice' },
    ...(evidenceSubmitted
      ? [{
          key: 'publicNoticeEvidence',
          name: 'Review public notice evidence',
          status: publicNoticeEvidenceStatusForCase(caseId, tasks),
          slug: 'review-public-notice-evidence',
        }]
      : []),
    { key: 'prepForConsultee', name: 'Prepare for consultation', status: tasks.prepForConsultee, slug: 'prep-for-consultee' },
    {
      key: 'startConsultation',
      name: 'Start consultation',
      status: startConsultationStatus(caseId, taskContext),
      slug: 'start-consultation',
    },
    ...(caseId === CONSULTATION_CASE_ID
      ? [{
          key: 'extendConsultation',
          name: 'Extend consultee closing date',
          status: (taskContext.consultationExtensions[caseId] ?? []).length > 0 ? 'Extended' as const : 'Optional' as const,
          slug: 'extend-closing-date',
        }]
      : []),
  ];

  return (
    <div>
      <Text as="h2" className={styles.heading}>Tasks</Text>

      <div className={styles.scroll}>
        <Table
          aria-label="Tasks"
          style={{ tableLayout: 'fixed', width: '100%', minWidth: MIN_WIDTH }}
        >
          <TableHeader>
            <TableRow>
              <TableCell className={mergeClasses(styles.headerCell, grid.headerCell)} style={{ width: COLS.task }}>Task</TableCell>
              <TableCell className={mergeClasses(styles.headerCell, grid.headerCell)} style={{ width: COLS.status }}>Status</TableCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {rows.map(row => {
              const openTask = () => {
                navigate(`/receive-assess/cases/${encodeURIComponent(caseId)}/tasks/${row.slug}`);
              };
              return (
                <TableRow
                  key={row.key}
                  className={grid.row}
                  // Double-clicking a row opens the record, as in D365.
                  onDoubleClick={event => { if (!(event.target as HTMLElement).closest('button')) openTask(); }}
                >
                  <TableCell tabIndex={0} className={grid.cell} style={{ width: COLS.task }}>
                    {/* Primary column is a hyperlink that opens the record — OOB
                        read-only grid behaviour. Gated rows open read-only. */}
                    <button
                      className={`link-button ${styles.cellText}`}
                      title={row.name}
                      onClick={openTask}
                    >
                      {row.name}
                    </button>
                  </TableCell>
                  <TableCell tabIndex={0} className={grid.cell} style={{ width: COLS.status }}>
                    <span className={`${styles.cellText} ${styles.statusText}`} title={row.status}>{row.status}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </div>

      <div className={styles.footer}>
        <Text>1 - {rows.length} of {rows.length}</Text>
        <div className={styles.pager}>
          <Button appearance="subtle" icon={<PreviousRegular />} aria-label="First page" disabled />
          <Button appearance="subtle" icon={<ChevronLeftRegular />} aria-label="Previous page" disabled />
          <Text>Page 1</Text>
          <Button appearance="subtle" icon={<ChevronRightRegular />} aria-label="Next page" disabled />
        </div>
      </div>
    </div>
  );
}
