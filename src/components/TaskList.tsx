// src/components/TaskList.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Checkbox,
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
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
}

export default function TaskList({ caseId }: TaskListProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const [selected, setSelected] = useState<string[]>([]);

  const rows: TaskRow[] = [
    {
      key: 'siteCheck',
      name: 'Site check',
      status: tasks.siteCheck,
      onClick:
        tasks.siteCheck !== 'Cannot start yet'
          ? () => navigate(`/review-assess/cases/${encodeURIComponent(caseId)}/tasks/site-check`)
          : undefined,
    },
    {
      key: 'wfd',
      name: 'Water Framework Directive (WFD)',
      status: tasks.wfdAssessment,
      onClick:
        tasks.wfdAssessment !== 'Cannot start yet'
          ? () => navigate(`/review-assess/cases/${encodeURIComponent(caseId)}/tasks/wfd`)
          : undefined,
    },
    { key: 'mpp', name: 'Marine plan policies', status: tasks.marinePlanPolicies },
  ];

  return (
    <div>
      <Text as="h2" className={styles.heading}>Tasks</Text>

      <div className={styles.toolbar}>
        <Checkbox
          label="Select all"
          checked={selected.length === rows.length && rows.length > 0}
          onChange={(_, data) => setSelected(data.checked ? rows.map(r => r.key) : [])}
        />
        <Button appearance="subtle" icon={<ArrowSortRegular />} aria-label="Sort" />
      </div>

      {rows.map(row => (
        <div
          key={row.key}
          className={`${styles.row} ${row.onClick ? styles.rowClickable : ''}`}
          onClick={row.onClick}
        >
          <Checkbox
            checked={selected.includes(row.key)}
            onClick={e => e.stopPropagation()}
            onChange={(_, data) =>
              setSelected(s => (data.checked ? [...s, row.key] : s.filter(k => k !== row.key)))
            }
            aria-label={`Select ${row.name}`}
          />
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
