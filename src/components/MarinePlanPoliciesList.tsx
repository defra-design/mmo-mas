// src/components/MarinePlanPoliciesList.tsx
import { useState } from 'react';
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
import { policies } from '../utils/marinePlanPolicies';

// The MPP task is 1-to-many, so the policies are their own list under Tasks,
// paginated to keep the narrow rail manageable (matching the D365 subgrid pager).
const PAGE_SIZE = 8;

const useStyles = makeStyles({
  section: { marginTop: tokens.spacingVerticalXXL },
  heading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalL,
  },
  // Sort control only (the select-all checkbox is hidden per the confirmed
  // subgrid config), so it sits at the right of the toolbar row.
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
  rowText: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
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

interface MarinePlanPoliciesListProps {
  caseId: string;
}

export default function MarinePlanPoliciesList({ caseId }: MarinePlanPoliciesListProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { tasks, mppForm } = useTasks();
  const [page, setPage] = useState(1);

  const locked = tasks.marinePlanPolicies === 'Cannot start yet';
  const total = policies.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pagePolicies = policies.slice(start, start + PAGE_SIZE);

  return (
    <div className={styles.section}>
      <Text as="h2" className={styles.heading}>Marine plan policies</Text>

      <div className={styles.toolbar}>
        <Button appearance="subtle" icon={<ArrowSortRegular />} aria-label="Sort" />
      </div>

      {pagePolicies.map(policy => {
        const outcome = mppForm[policy.code]?.outcome;
        const status = locked ? 'Cannot start yet' : outcome || 'To do';
        const onClick = locked
          ? undefined
          : () =>
              navigate(
                `/receive-assess/cases/${encodeURIComponent(caseId)}/tasks/marine-plan-policies/${policy.code}`
              );
        return (
          <div
            key={policy.code}
            className={`${styles.row} ${onClick ? styles.rowClickable : ''}`}
            onClick={onClick}
          >
            <div className={styles.rowText}>
              <Text className={styles.taskName}>{policy.label}</Text>
              <Text className={styles.statusText}>{status}</Text>
            </div>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button
                  appearance="subtle"
                  icon={<MoreHorizontalRegular />}
                  aria-label={`${policy.label} actions`}
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
        );
      })}

      <div className={styles.footer}>
        <Text>{start + 1} - {start + pagePolicies.length} of {total}</Text>
        <div className={styles.pager}>
          <Button
            appearance="subtle"
            icon={<PreviousRegular />}
            aria-label="First page"
            disabled={page === 1}
            onClick={() => setPage(1)}
          />
          <Button
            appearance="subtle"
            icon={<ChevronLeftRegular />}
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          />
          <Text>Page {page}</Text>
          <Button
            appearance="subtle"
            icon={<ChevronRightRegular />}
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
          />
        </div>
      </div>
    </div>
  );
}
