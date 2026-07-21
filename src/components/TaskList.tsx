// src/components/TaskList.tsx
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  MoreHorizontalRegular,
  ArrowSortRegular,
  ChevronLeftRegular,
  ChevronRightRegular,
  PreviousRegular,
} from '@fluentui/react-icons';
import { useTasks } from '../context/TaskContext';
import type { TaskStatus } from '../context/TaskContext';

const useStyles = makeStyles({
  heading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalL,
  },
  // Sort control only (the select-all checkbox is hidden per the D365 subgrid
  // config the dev confirmed), so it sits at the right of the toolbar row.
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    paddingBottom: tokens.spacingVerticalS,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    ...shorthands.padding(tokens.spacingVerticalM, '0'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  rowClickable: { cursor: 'pointer' },
  rowText: { flex: 1, display: 'flex', flexDirection: 'column' },
  taskName: { fontWeight: tokens.fontWeightSemibold },
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
  onClick?: () => void;
}

interface TaskListProps {
  caseId: string;
  /** When true, the policies are shown as their own list, so the single
   *  "Marine plan policies" task row is omitted (exploration cases only). */
  mppInSeparateList?: boolean;
  /** When true, no task is gated: every task is clickable and any
   *  "Cannot start yet" is shown as "To do" (demo case MLA/2026/10014). */
  ungated?: boolean;
}

export default function TaskList({
  caseId,
  mppInSeparateList = false,
  ungated = false,
}: TaskListProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { tasks } = useTasks();

  // In the ungated demo, a locked task reads as "To do" and stays clickable.
  const shownStatus = (s: TaskStatus): TaskStatus =>
    ungated && s === 'Cannot start yet' ? 'To do' : s;
  const canOpen = (s: TaskStatus) => ungated || s !== 'Cannot start yet';

  const rows: TaskRow[] = [
    {
      key: 'siteCheck',
      name: 'Site check',
      status: shownStatus(tasks.siteCheck),
      onClick: canOpen(tasks.siteCheck)
        ? () => navigate(`/receive-assess/cases/${encodeURIComponent(caseId)}/tasks/site-check`)
        : undefined,
    },
    {
      key: 'wfd',
      name: 'Water Framework Directive',
      status: shownStatus(tasks.wfdAssessment),
      onClick: canOpen(tasks.wfdAssessment)
        ? () => navigate(`/receive-assess/cases/${encodeURIComponent(caseId)}/tasks/wfd`)
        : undefined,
    },
    {
      key: 'prepForConsultee',
      name: 'Prep for consultee',
      status: shownStatus(tasks.prepForConsultee),
      onClick: canOpen(tasks.prepForConsultee)
        ? () =>
            navigate(
              `/receive-assess/cases/${encodeURIComponent(caseId)}/tasks/prep-for-consultee`,
            )
        : undefined,
    },
  ];

  // Original single-row treatment (kept for the standard cases, e.g. MLA/2026/10002).
  if (!mppInSeparateList) {
    rows.push({ key: 'mpp', name: 'Marine plan policies', status: tasks.marinePlanPolicies });
  }

  return (
    <div>
      <Text as="h2" className={styles.heading}>Tasks</Text>

      <div className={styles.toolbar}>
        <Button appearance="subtle" icon={<ArrowSortRegular />} aria-label="Sort" />
      </div>

      {rows.map(row => (
        <div
          key={row.key}
          className={`${styles.row} ${row.onClick ? styles.rowClickable : ''}`}
          onClick={row.onClick}
        >
          <div className={styles.rowText}>
            <Text className={styles.taskName}>{row.name}</Text>
            <Text className={styles.statusText}>{row.status}</Text>
          </div>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button
                appearance="subtle"
                icon={<MoreHorizontalRegular />}
                aria-label={`${row.name} actions`}
                onClick={e => e.stopPropagation()}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem>Open</MenuItem>
                <MenuItem>Mark complete</MenuItem>
                <MenuItem>Assign</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      ))}

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
