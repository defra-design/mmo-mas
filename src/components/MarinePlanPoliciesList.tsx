// src/components/MarinePlanPoliciesList.tsx
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
import { policies } from '../utils/marinePlanPolicies';

// The MPP task is 1-to-many, so the policies are their own list under Tasks,
// paginated to keep the rail manageable (matching the D365 subgrid pager).
const PAGE_SIZE = 8;

const useStyles = makeStyles({
  section: { marginTop: tokens.spacingVerticalXXL },
  // Full-width (unpaginated) placement is its own card, so no top margin needed.
  sectionStandalone: {},
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
  /** When false, show every policy in one list with no pager (full-width layout). */
  paginate?: boolean;
}

export default function MarinePlanPoliciesList({
  caseId,
  paginate = true,
}: MarinePlanPoliciesListProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { tasks, mppForm } = useTasks();
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const locked = tasks.marinePlanPolicies === 'Cannot start yet';
  const total = policies.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = paginate ? (page - 1) * PAGE_SIZE : 0;
  const pagePolicies = paginate ? policies.slice(start, start + PAGE_SIZE) : policies;

  return (
    <div className={paginate ? styles.section : styles.sectionStandalone}>
      <Text as="h2" className={styles.heading}>Marine plan policies</Text>

      <div className={styles.toolbar}>
        <Checkbox
          label="Select all"
          checked={
            pagePolicies.length > 0 && pagePolicies.every(p => selected.includes(p.code))
          }
          onChange={(_, data) =>
            setSelected(data.checked ? pagePolicies.map(p => p.code) : [])
          }
        />
        <Button appearance="subtle" icon={<ArrowSortRegular />} aria-label="Sort" />
      </div>

      {pagePolicies.map(policy => {
        const outcome = mppForm[policy.code]?.outcome;
        const status = locked ? 'Cannot start yet' : outcome || 'Not started';
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
            <Checkbox
              checked={selected.includes(policy.code)}
              onClick={e => e.stopPropagation()}
              onChange={(_, data) =>
                setSelected(s =>
                  data.checked ? [...s, policy.code] : s.filter(k => k !== policy.code)
                )
              }
              aria-label={`Select ${policy.label}`}
            />
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

      {paginate ? (
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
      ) : (
        <div className={styles.footer}>
          <Text>1 - {total} of {total}</Text>
        </div>
      )}
    </div>
  );
}
