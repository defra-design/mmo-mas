// src/components/TasksSubgrid.tsx
// Full-width D365 subgrid (read-only grid) of the case's caseworker tasks — the
// columnar rendering a related-records list gets at full width, with the status
// in its own right-hand column, matching MarinePlanPoliciesSubgrid. The narrow
// two-line reflow (name over status) lives in TaskList and is only correct in
// the rail/card; a subgrid on a full-width form tab is a real table.
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableCell,
} from '@fluentui/react-components';
import {
  ChevronLeftRegular,
  ChevronRightRegular,
  PreviousRegular,
} from '@fluentui/react-icons';
import { useTasks } from '../context/TaskContext';
import type { TaskStatus } from '../context/TaskContext';

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
  row: { ':hover': { backgroundColor: tokens.colorNeutralBackground3 } },
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
  status: TaskStatus;
  slug: string;
}

interface TasksSubgridProps {
  caseId: string;
}

export default function TasksSubgrid({ caseId }: TasksSubgridProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { tasks } = useTasks();

  // WFD is gated behind Site check: while "Cannot start yet" it's a plain,
  // non-openable row (the same locked treatment the MPP subgrid uses).
  const rows: TaskRow[] = [
    { key: 'siteCheck', name: 'Site check', status: tasks.siteCheck, slug: 'site-check' },
    { key: 'wfd', name: 'Water Framework Directive', status: tasks.wfdAssessment, slug: 'wfd' },
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
              <TableCell className={styles.headerCell} style={{ width: COLS.task }}>Task</TableCell>
              <TableCell className={styles.headerCell} style={{ width: COLS.status }}>Status</TableCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {rows.map(row => {
              const locked = row.status === 'Cannot start yet';
              const openTask = () =>
                navigate(`/receive-assess/cases/${encodeURIComponent(caseId)}/tasks/${row.slug}`);
              return (
                <TableRow key={row.key} className={styles.row}>
                  <TableCell style={{ width: COLS.task }}>
                    {/* Primary column is a hyperlink that opens the record — OOB
                        read-only grid behaviour; a gated row stays plain text. */}
                    {locked ? (
                      <span className={styles.cellText} title={row.name}>{row.name}</span>
                    ) : (
                      <button
                        className={`link-button ${styles.cellText}`}
                        title={row.name}
                        onClick={openTask}
                      >
                        {row.name}
                      </button>
                    )}
                  </TableCell>
                  <TableCell style={{ width: COLS.status }}>
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
