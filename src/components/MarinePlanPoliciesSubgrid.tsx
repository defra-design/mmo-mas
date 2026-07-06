// src/components/MarinePlanPoliciesSubgrid.tsx
// Full-width D365 subgrid (read-only grid) of the marine plan policies — the
// columnar rendering a related-records list actually gets at full width, rather
// than the narrow two-line reflow used in the rail. Leading column shows the
// avatar↔checkbox swap; paged like an OOB subgrid.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Checkbox,
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
import { policies } from '../utils/marinePlanPolicies';
import GridRowSelect from './GridRowSelect';

// OOB subgrids page their records; 25 is a standard "records per page" value and
// makes the 41 policies span two pages so the pager is exercised.
const PAGE_SIZE = 25;

// Column widths (leading select column is a fixed 32). table-layout:fixed +
// width:100% shares any extra space in proportion to these, so Policy grows most.
const COLS = { policy: 420, group: 180, outcome: 180 };
const MIN_WIDTH = 32 + COLS.policy + COLS.group + COLS.outcome;

const useStyles = makeStyles({
  heading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalL,
  },
  scroll: { overflowX: 'auto' },
  headerCell: { fontWeight: tokens.fontWeightSemibold },
  selectCell: { width: '32px', paddingLeft: '8px', paddingRight: '8px' },
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

interface MarinePlanPoliciesSubgridProps {
  caseId: string;
  /** Status shown for a policy that hasn't been assessed yet. */
  defaultStatus?: string;
  /** When true, ignore the task gating: every policy is always openable. */
  ungated?: boolean;
}

export default function MarinePlanPoliciesSubgrid({
  caseId,
  defaultStatus = 'Not started',
  ungated = false,
}: MarinePlanPoliciesSubgridProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { tasks, mppForm } = useTasks();
  const [selected, setSelected] = useState<string[]>([]);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const locked = !ungated && tasks.marinePlanPolicies === 'Cannot start yet';
  const total = policies.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pagePolicies = policies.slice(start, start + PAGE_SIZE);
  const allSelected =
    pagePolicies.length > 0 && pagePolicies.every(p => selected.includes(p.code));

  return (
    <div>
      <Text as="h2" className={styles.heading}>Marine plan policies</Text>

      <div className={styles.scroll}>
        <Table
          aria-label="Marine plan policies"
          style={{ tableLayout: 'fixed', width: '100%', minWidth: MIN_WIDTH }}
        >
          <TableHeader>
            <TableRow>
              <TableCell className={styles.selectCell}>
                <Checkbox
                  checked={allSelected}
                  onChange={(_, data) =>
                    setSelected(data.checked ? pagePolicies.map(p => p.code) : [])
                  }
                  aria-label="Select all"
                />
              </TableCell>
              <TableCell className={styles.headerCell} style={{ width: COLS.policy }}>Policy</TableCell>
              <TableCell className={styles.headerCell} style={{ width: COLS.group }}>Group</TableCell>
              <TableCell className={styles.headerCell} style={{ width: COLS.outcome }}>Outcome</TableCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {pagePolicies.map(policy => {
              const outcome = mppForm[policy.code]?.outcome;
              const status = locked ? 'Cannot start yet' : outcome || defaultStatus;
              const openPolicy = () =>
                navigate(
                  `/receive-assess/cases/${encodeURIComponent(caseId)}/tasks/marine-plan-policies/${policy.code}`
                );
              return (
                <TableRow
                  key={policy.code}
                  className={styles.row}
                  onMouseEnter={() => setHoveredKey(policy.code)}
                  onMouseLeave={() => setHoveredKey(k => (k === policy.code ? null : k))}
                >
                  <TableCell className={styles.selectCell}>
                    <GridRowSelect
                      name={policy.label}
                      checked={selected.includes(policy.code)}
                      showCheckbox={selected.includes(policy.code) || hoveredKey === policy.code}
                      onToggle={checked =>
                        setSelected(s =>
                          checked ? [...s, policy.code] : s.filter(k => k !== policy.code)
                        )
                      }
                      ariaLabel={`Select ${policy.label}`}
                    />
                  </TableCell>
                  <TableCell style={{ width: COLS.policy }}>
                    {/* Primary column is a hyperlink that opens the record — OOB
                        read-only grid behaviour; other cells stay plain text. */}
                    {locked ? (
                      <span className={styles.cellText} title={policy.label}>{policy.label}</span>
                    ) : (
                      <button
                        className={`link-button ${styles.cellText}`}
                        title={policy.label}
                        onClick={openPolicy}
                      >
                        {policy.label}
                      </button>
                    )}
                  </TableCell>
                  <TableCell style={{ width: COLS.group }}>
                    <span className={styles.cellText} title={policy.group}>{policy.group}</span>
                  </TableCell>
                  <TableCell style={{ width: COLS.outcome }}>
                    <span className={`${styles.cellText} ${styles.statusText}`} title={status}>{status}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </div>

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
