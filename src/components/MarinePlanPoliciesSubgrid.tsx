// src/components/MarinePlanPoliciesSubgrid.tsx
// Full-width D365 subgrid (read-only grid) of the marine plan policies — the
// columnar rendering a related-records list actually gets at full width, rather
// than the narrow two-line reflow used in the rail. Paged like an OOB subgrid;
// the leading row-select column is hidden per the confirmed subgrid config.
// Column headers carry the same click-to-open sort/filter menu as the Case list.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  MenuList,
  MenuItem,
  Divider,
  Field,
  Input,
  Checkbox,
} from '@fluentui/react-components';
import {
  ChevronLeftRegular,
  ChevronRightRegular,
  PreviousRegular,
  ChevronDownRegular,
  ArrowUpRegular,
  ArrowDownRegular,
  CheckmarkRegular,
  FilterRegular,
  FilterFilled,
  FilterDismissRegular,
  ArrowAutofitWidthRegular,
  DismissRegular,
} from '@fluentui/react-icons';
import { useTasks } from '../context/TaskContext';
import { policies } from '../utils/marinePlanPolicies';

// OOB subgrids page their records; 25 is a standard "records per page" value and
// makes the 41 policies span two pages so the pager is exercised.
const PAGE_SIZE = 25;

// Column widths. table-layout:fixed + width:100% shares any extra space in
// proportion to these, so Policy grows most. The leading row-select column is
// hidden (per the D365 subgrid config the dev confirmed), so Policy leads.
const COLS = { policy: 420, group: 180, outcome: 180 };
const MIN_WIDTH = COLS.policy + COLS.group + COLS.outcome;

// Left padding shared by every header and body cell so the heading text and the
// cell values line up in one vertical edge. Applied on the cell (not the content)
// so it also indents the Policy link, whose `.link-button` sets padding:0.
const CELL_PAD_LEFT = tokens.spacingHorizontalS;

// The three grid columns, keyed to the fields on the computed row objects.
const COLUMNS: { key: ColKey; name: string; width: number }[] = [
  { key: 'label', name: 'Policy', width: COLS.policy },
  { key: 'group', name: 'Group', width: COLS.group },
  { key: 'status', name: 'Outcome', width: COLS.outcome },
];

type ColKey = 'label' | 'group' | 'status';
type SortState = { key: ColKey; dir: 'asc' | 'desc' };
// A string is a "contains" text filter (Policy); a string[] is an "equals one of"
// filter (Group, Outcome — matching the Case list Status column).
type Filters = Partial<Record<ColKey, string | string[]>>;

// The Group and Outcome columns filter by an "equals one of" checkbox list.
// Group options follow the category order; Outcome the four assessment outcomes.
const EQUALS_OPTIONS: Partial<Record<ColKey, string[]>> = {
  group: Array.from(new Set(policies.map(p => p.group))),
  status: ['Compliant', 'Non-compliant', 'Consultation required', 'Not applicable'],
};

const useStyles = makeStyles({
  heading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalL,
  },
  scroll: { overflowX: 'auto' },
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
  // Header cell: click-to-open menu trigger, matching the Case list grid.
  headerMenuTrigger: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'flex-start',
    paddingLeft: 0,
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    ':hover': { backgroundColor: tokens.colorNeutralBackground3 },
  },
  chevron: { marginLeft: tokens.spacingHorizontalXS, fontSize: tokens.fontSizeBase400 },
  activeSortIcon: {
    marginLeft: tokens.spacingHorizontalXXS,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
  activeFilterIcon: {
    marginLeft: tokens.spacingHorizontalXXS,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorBrandForeground1,
  },
  filteredHeaderCell: {
    ...shorthands.border('1px', 'solid', '#0078d4'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  popoverSurface: {
    minWidth: '220px',
    maxWidth: '280px',
    boxShadow: tokens.shadow16,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
  },
  menuList: { padding: 0 },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '36px',
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    ':hover': { backgroundColor: tokens.colorNeutralBackground3 },
  },
  // Leading tick column so active/inactive sort rows line up (like the image).
  menuCheck: {
    width: '20px',
    display: 'inline-flex',
    justifyContent: 'center',
    fontSize: tokens.fontSizeBase300,
  },
  menuIconStart: { marginRight: tokens.spacingHorizontalS, fontSize: tokens.fontSizeBase400 },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
  },
  filterBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
  },
  filterActions: { display: 'flex', gap: tokens.spacingHorizontalS },
  // Vertical stack of checkboxes in the Group / Outcome "Equals" filter.
  checkboxList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
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
  const [page, setPage] = useState(1);
  // The grid always has a sort; it opens sorted A→Z on Policy like the image.
  const [sort, setSort] = useState<SortState>({ key: 'label', dir: 'asc' });
  const [filters, setFilters] = useState<Filters>({});

  const locked = !ungated && tasks.marinePlanPolicies === 'Cannot start yet';

  // Build the display rows (with the computed Outcome value) once, then filter
  // and sort them so both operate on what the caseworker actually sees.
  const rows = useMemo(() => {
    const built = policies.map(policy => ({
      code: policy.code,
      label: policy.label,
      group: policy.group,
      status: locked
        ? 'Cannot start yet'
        : mppForm[policy.code]?.outcome || defaultStatus,
    }));

    const filtered = built.filter(r =>
      (Object.entries(filters) as [ColKey, string | string[]][]).every(([key, filter]) =>
        Array.isArray(filter)
          ? filter.includes(r[key])
          : r[key].toLowerCase().includes(filter.toLowerCase()),
      ),
    );

    const sorted = [...filtered].sort((a, b) => {
      const cmp = a[sort.key].localeCompare(b[sort.key], undefined, { numeric: true });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [locked, mppForm, defaultStatus, filters, sort]);

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = rows.slice(start, start + PAGE_SIZE);

  // Set (or, when blank, remove) the "contains" text filter for a column.
  const setFilter = (key: ColKey, text: string) =>
    setFilters(prev => {
      const updated = { ...prev };
      const trimmed = text.trim();
      if (trimmed) updated[key] = trimmed;
      else delete updated[key];
      return updated;
    });

  // Set (or, when empty, remove) the "equals one of" filter for a column.
  const setEqualsFilter = (key: ColKey, values: string[]) =>
    setFilters(prev => {
      const updated = { ...prev };
      if (values.length) updated[key] = values;
      else delete updated[key];
      return updated;
    });

  function ColumnHeaderMenu({ col }: { col: (typeof COLUMNS)[number] }) {
    const equalsOptions = EQUALS_OPTIONS[col.key];
    const isEqualsCol = Boolean(equalsOptions);
    const isSorted = sort.key === col.key;
    const activeFilter = filters[col.key];
    const isFiltered = Array.isArray(activeFilter)
      ? activeFilter.length > 0
      : Boolean(activeFilter);
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<'menu' | 'filter'>('menu');
    const [draft, setDraft] = useState('');
    const [equalsDraft, setEqualsDraft] = useState<string[]>([]);

    const openFilter = () => {
      if (isEqualsCol) setEqualsDraft(Array.isArray(activeFilter) ? activeFilter : []);
      else setDraft(typeof activeFilter === 'string' ? activeFilter : '');
      setView('filter');
    };
    const applyFilter = () => {
      if (isEqualsCol) setEqualsFilter(col.key, equalsDraft);
      else setFilter(col.key, draft);
      setPage(1);
      setOpen(false);
    };
    const toggleEqualsValue = (value: string, checked: boolean) =>
      setEqualsDraft(prev => (checked ? [...prev, value] : prev.filter(v => v !== value)));

    return (
      <Popover
        open={open}
        positioning="below-start"
        onOpenChange={(_, data) => {
          setOpen(data.open);
          if (data.open) setView('menu');
        }}
      >
        <PopoverTrigger>
          <Button
            appearance="transparent"
            className={styles.headerMenuTrigger}
            aria-label={`${col.name} column menu`}
            icon={null}
            // The cell supplies the left indent; keep the trigger flush so the
            // heading text starts exactly at the cell's padding edge.
            style={{ paddingLeft: 0 }}
          >
            <Text style={{ fontWeight: tokens.fontWeightSemibold }}>{col.name}</Text>
            {isSorted &&
              (sort.dir === 'asc' ? (
                <ArrowUpRegular className={styles.activeSortIcon} />
              ) : (
                <ArrowDownRegular className={styles.activeSortIcon} />
              ))}
            {isFiltered && <FilterFilled className={styles.activeFilterIcon} />}
            <ChevronDownRegular className={styles.chevron} />
          </Button>
        </PopoverTrigger>
        <PopoverSurface className={styles.popoverSurface}>
          {view === 'menu' ? (
            <MenuList className={styles.menuList}>
              <MenuItem
                className={styles.menuItem}
                onClick={() => { setSort({ key: col.key, dir: 'asc' }); setPage(1); setOpen(false); }}
              >
                <span className={styles.menuCheck}>
                  {isSorted && sort.dir === 'asc' && <CheckmarkRegular />}
                </span>
                <span className={styles.menuIconStart}><ArrowUpRegular /></span>
                <Text>A to Z</Text>
              </MenuItem>
              <MenuItem
                className={styles.menuItem}
                onClick={() => { setSort({ key: col.key, dir: 'desc' }); setPage(1); setOpen(false); }}
              >
                <span className={styles.menuCheck}>
                  {isSorted && sort.dir === 'desc' && <CheckmarkRegular />}
                </span>
                <span className={styles.menuIconStart}><ArrowDownRegular /></span>
                <Text>Z to A</Text>
              </MenuItem>

              <Divider style={{ margin: '4px 0' }} />

              <MenuItem className={styles.menuItem} onClick={openFilter}>
                <span className={styles.menuCheck} />
                <span className={styles.menuIconStart}><FilterRegular /></span>
                <Text>Filter by</Text>
              </MenuItem>
              {isFiltered && (
                <MenuItem
                  className={styles.menuItem}
                  onClick={() => { setFilters(prev => { const u = { ...prev }; delete u[col.key]; return u; }); setPage(1); setOpen(false); }}
                >
                  <span className={styles.menuCheck} />
                  <span className={styles.menuIconStart}><FilterDismissRegular /></span>
                  <Text>Clear filter</Text>
                </MenuItem>
              )}
              {/* Non-functional — present for usability feedback only. */}
              <MenuItem className={styles.menuItem} onClick={() => setOpen(false)}>
                <span className={styles.menuCheck} />
                <span className={styles.menuIconStart}><ArrowAutofitWidthRegular /></span>
                <Text>Column width</Text>
              </MenuItem>
            </MenuList>
          ) : (
            <>
              <div className={styles.filterHeader}>
                <span>Filter by</span>
                <Button
                  appearance="transparent"
                  size="small"
                  icon={<DismissRegular />}
                  aria-label="Close filter"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className={styles.filterBody}>
                {isEqualsCol ? (
                  <Field label="Equals">
                    <div className={styles.checkboxList}>
                      {equalsOptions!.map(option => (
                        <Checkbox
                          key={option}
                          label={option}
                          checked={equalsDraft.includes(option)}
                          onChange={(_, data) => toggleEqualsValue(option, !!data.checked)}
                        />
                      ))}
                    </div>
                  </Field>
                ) : (
                  <Field label="Contains">
                    <Input
                      value={draft}
                      autoFocus
                      onChange={(_, data) => setDraft(data.value)}
                      onKeyDown={e => { if (e.key === 'Enter') applyFilter(); }}
                    />
                  </Field>
                )}
                <div className={styles.filterActions}>
                  <Button appearance="primary" onClick={applyFilter}>Apply</Button>
                  <Button
                    appearance="secondary"
                    disabled={
                      isEqualsCol
                        ? !isFiltered && equalsDraft.length === 0
                        : !isFiltered && !draft.trim()
                    }
                    onClick={() => {
                      if (isEqualsCol) { setEqualsDraft([]); setEqualsFilter(col.key, []); }
                      else { setDraft(''); setFilter(col.key, ''); }
                      setPage(1);
                      setOpen(false);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </>
          )}
        </PopoverSurface>
      </Popover>
    );
  }

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
              {COLUMNS.map(col => (
                <TableCell
                  key={col.key}
                  className={filters[col.key] ? styles.filteredHeaderCell : undefined}
                  style={{ width: col.width, fontWeight: 600, paddingLeft: CELL_PAD_LEFT }}
                >
                  <ColumnHeaderMenu col={col} />
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <tbody>
            {pageRows.map(row => {
              const openPolicy = () =>
                navigate(
                  `/receive-assess/cases/${encodeURIComponent(caseId)}/tasks/marine-plan-policies/${row.code}`
                );
              return (
                <TableRow key={row.code} className={styles.row}>
                  <TableCell style={{ width: COLS.policy, paddingLeft: CELL_PAD_LEFT }}>
                    {/* Primary column is a hyperlink that opens the record — OOB
                        read-only grid behaviour; other cells stay plain text. */}
                    {locked ? (
                      <span className={styles.cellText} title={row.label}>{row.label}</span>
                    ) : (
                      <button
                        className={`link-button ${styles.cellText}`}
                        title={row.label}
                        onClick={openPolicy}
                      >
                        {row.label}
                      </button>
                    )}
                  </TableCell>
                  <TableCell style={{ width: COLS.group, paddingLeft: CELL_PAD_LEFT }}>
                    <span className={styles.cellText} title={row.group}>{row.group}</span>
                  </TableCell>
                  <TableCell style={{ width: COLS.outcome, paddingLeft: CELL_PAD_LEFT }}>
                    <span className={`${styles.cellText} ${styles.statusText}`} title={row.status}>{row.status}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </div>

      <div className={styles.footer}>
        <Text>{total === 0 ? 0 : start + 1} - {start + pageRows.length} of {total}</Text>
        <div className={styles.pager}>
          <Button
            appearance="subtle"
            icon={<PreviousRegular />}
            aria-label="First page"
            disabled={currentPage === 1}
            onClick={() => setPage(1)}
          />
          <Button
            appearance="subtle"
            icon={<ChevronLeftRegular />}
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          />
          <Text>Page {currentPage}</Text>
          <Button
            appearance="subtle"
            icon={<ChevronRightRegular />}
            aria-label="Next page"
            disabled={currentPage >= pageCount}
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
          />
        </div>
      </div>
    </div>
  );
}
