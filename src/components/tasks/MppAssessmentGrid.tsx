// Read-only subgrid of the task's related Policy assessment records, one per
// marine plan policy. Policy is the record's primary column, so it is the link
// that opens the assessment; double-clicking a row does the same. Outcome is the
// assessment's choice column, shown in the view so the caseworker can filter by
// it. Rows can be selected (checkbox, or clicking the row) but the subgrid has
// no commands that act on a selection yet. Outcome has no width, so it takes the
// spare space and Policy truncates.
import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import {
  makeStyles, mergeClasses, Table, TableBody, TableCell, TableHeader,
  TableHeaderCell, TableRow, Text, tokens,
} from '@fluentui/react-components';
import GridColumnMenu from '../GridColumnMenu';
import type { ColumnFilter } from '../GridColumnMenu';
import TruncatedCell from '../TruncatedCell';
import GridCheckbox from '../GridCheckbox';
import { useSubgridStyles } from '../subgridStyles';

export type PolicyRow = { code: string; policy: string; group: string; status: string; outcome: string };
type Key = Exclude<keyof PolicyRow, 'code'>;
type View = { sort: { key: Key; dir: 'asc' | 'desc' }; filters: Partial<Record<Key, ColumnFilter>> };
type Column = { key: Key; label: string; width?: number; choice?: boolean };

const columns: Column[] = [
  { key: 'policy', label: 'Policy', width: 300 },
  { key: 'group', label: 'Group', width: 140, choice: true },
  { key: 'status', label: 'Status', width: 150, choice: true },
  { key: 'outcome', label: 'Outcome', choice: true },
];
const defaultView: View = { sort: { key: 'group', dir: 'asc' }, filters: {} };

// D365 remembers a grid's sort and filters while the caseworker opens a record
// and comes back, so keep them per case for the browser session.
const storageKey = (caseId: string) => `mas-grid-view:policy-assessments:${caseId}`;
function loadView(caseId: string): View {
  try {
    const saved = sessionStorage.getItem(storageKey(caseId));
    return saved ? { ...defaultView, ...JSON.parse(saved) } : defaultView;
  } catch {
    return defaultView;
  }
}

const useStyles = makeStyles({
  grid: { overflowX: 'auto' },
  table: { tableLayout: 'fixed', minWidth: '784px', width: '100%' },
  row: { height: '42px' },
  // Subgrid links are underlined by default; .link-button removes it with !important.
  link: { textDecorationLine: 'underline !important' },
  filtered: { outline: '1px solid #0078d4', outlineOffset: '-1px', borderRadius: tokens.borderRadiusMedium },
  footer: { display: 'flex', gap: tokens.spacingHorizontalL, paddingTop: tokens.spacingVerticalM, color: '#605e5c' },
});

type Props = { caseId: string; rows: PolicyRow[]; onOpen: (code: string) => void };

export default function MppAssessmentGrid({ caseId, rows, onOpen }: Props) {
  const styles = useStyles();
  const grid = useSubgridStyles();
  const [view, setView] = useState(() => loadView(caseId));
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey(caseId), JSON.stringify(view));
    } catch {
      /* ignore storage errors */
    }
  }, [caseId, view]);
  const { sort, filters } = view;
  const shown = rows
    .filter(row => columns.every(({ key }) => {
      const filter = filters[key];
      if (!filter) return true;
      return Array.isArray(filter) ? filter.includes(row[key]) : row[key].toLowerCase().includes(filter.toLowerCase());
    }))
    .sort((a, b) => {
      const compare = a[sort.key].localeCompare(b[sort.key], undefined, { numeric: true });
      return sort.dir === 'asc' ? compare : -compare;
    });
  const optionsFor = (key: Key) => Array.from(new Set(rows.map(row => row[key]))).sort();
  const allSelected = shown.length > 0 && shown.every(row => selected.includes(row.code));
  const toggle = (code: string, on: boolean) =>
    setSelected(previous => (on ? [...previous, code] : previous.filter(value => value !== code)));
  // Clicks on the row's own controls (checkbox, link) are left to them.
  const onControl = (event: MouseEvent) => Boolean((event.target as HTMLElement).closest('button, input, a'));

  return <>
    <div className={styles.grid}>
      <Table className={styles.table} aria-label="Policy assessments">
        <colgroup>
          <col style={{ width: '44px' }} />
          {columns.map(({ key, width }) => <col key={key} style={width ? { width: `${width}px` } : undefined} />)}
        </colgroup>
        <TableHeader><TableRow>
          <TableHeaderCell>
            <GridCheckbox aria-label="Select all" disabled={shown.length === 0}
              checked={allSelected ? true : selected.length > 0 ? 'mixed' : false}
              onChange={() => setSelected(allSelected ? [] : shown.map(row => row.code))} />
          </TableHeaderCell>
          {columns.map(column =>
            <TableHeaderCell key={column.key} className={mergeClasses(grid.headerCell, filters[column.key] && styles.filtered)}>
              <GridColumnMenu
                label={column.label}
                sort={sort.key === column.key ? sort.dir : undefined}
                onSort={dir => setView({ ...view, sort: { key: column.key, dir } })}
                filter={filters[column.key]}
                options={column.choice ? optionsFor(column.key) : undefined}
                onFilter={filter => setView({ ...view, filters: { ...filters, [column.key]: filter } })}
              />
            </TableHeaderCell>,
          )}
        </TableRow></TableHeader>
        <TableBody>{shown.map(row =>
          <TableRow
            key={row.code}
            className={mergeClasses(grid.row, styles.row, selected.includes(row.code) && grid.selectedRow)}
            onClick={event => { if (!onControl(event)) setSelected([row.code]); }}
            onDoubleClick={event => { if (!onControl(event)) onOpen(row.code); }}
          >
            <TableCell>
              <GridCheckbox aria-label={`Select ${row.policy}`} checked={selected.includes(row.code)}
                onChange={(_, data) => toggle(row.code, Boolean(data.checked))} />
            </TableCell>
            {[
              <TruncatedCell key="policy" value={row.policy} className={styles.link} onClick={() => onOpen(row.code)} />,
              <TruncatedCell key="group" value={row.group} />,
              <TruncatedCell key="status" value={row.status} />,
              <TruncatedCell key="outcome" value={row.outcome} />,
            ].map(content => <TableCell key={content.key} tabIndex={0}
              className={mergeClasses(grid.cell, selected.includes(row.code) && grid.selectedCell)}>{content}</TableCell>)}
          </TableRow>,
        )}</TableBody>
      </Table>
    </div>
    <div className={styles.footer}>
      <Text>Rows: {shown.length}</Text>
      {selected.length > 0 && <Text>Selected: {selected.length}</Text>}
    </div>
  </>;
}
