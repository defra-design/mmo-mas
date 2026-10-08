// Read-only subgrid of the task's related Location records. Short view column
// names stand in for the full form labels, as a D365 view shows each column's
// display name. Location name is the record's primary column, so it is the
// link that opens the record. The last column has no width, so it takes the
// spare space and Location name truncates like Application name on the case list.
// Rows can be selected (checkbox, or clicking the row) but the subgrid has no
// commands that act on a selection yet. Double-clicking a row opens the record.
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
import { d365Date, sortableDate } from '../../utils/dates';

export type LocationRow = {
  index: number; location: string; name: string; date: string; status: string; accepted: string;
};
type Key = Exclude<keyof LocationRow, 'index'>;
type View = { sort: { key: Key; dir: 'asc' | 'desc' }; filters: Partial<Record<Key, ColumnFilter>> };
type Column = { key: Key; label: string; width?: number; choice?: boolean; sortLabels?: [string, string] };

const columns: Column[] = [
  { key: 'location', label: 'Location', width: 140 },
  { key: 'name', label: 'Location name', width: 240 },
  { key: 'date', label: 'Date displayed', width: 160, sortLabels: ['Older to Newer', 'Newer to Older'] },
  { key: 'status', label: 'Status', width: 130, choice: true },
  { key: 'accepted', label: 'Photographs accepted', choice: true },
];
// The view's default sort is Location, ascending; the caseworker can change it.
const defaultView: View = { sort: { key: 'location', dir: 'asc' }, filters: {} };
const sortValue = (row: LocationRow, key: Key) => key === 'date' ? sortableDate(row.date) : row[key];
const cellValue = (row: LocationRow, key: Key) => key === 'date' ? d365Date(row.date) : row[key];

// D365 remembers a grid's sort and filters while the caseworker opens a record
// and comes back, so keep them per case for the browser session.
const storageKey = (caseId: string) => `mas-grid-view:public-notice-locations:${caseId}`;
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
  table: { tableLayout: 'fixed', minWidth: '924px', width: '100%' },
  row: { height: '42px' },
  // Subgrid links are underlined by default; .link-button removes it with !important.
  link: { textDecorationLine: 'underline !important' },
  filtered: { outline: '1px solid #0078d4', outlineOffset: '-1px', borderRadius: tokens.borderRadiusMedium },
  footer: { display: 'flex', gap: tokens.spacingHorizontalL, paddingTop: tokens.spacingVerticalM, color: '#605e5c' },
});

type Props = { caseId: string; rows: LocationRow[]; onOpen: (index: number) => void };

export default function PublicNoticeEvidenceGrid({ caseId, rows, onOpen }: Props) {
  const styles = useStyles();
  const grid = useSubgridStyles();
  const [view, setView] = useState(() => loadView(caseId));
  const [selected, setSelected] = useState<number[]>([]);
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
      const value = cellValue(row, key);
      return Array.isArray(filter) ? filter.includes(value) : value.toLowerCase().includes(filter.toLowerCase());
    }))
    .sort((a, b) => {
      const compare = sortValue(a, sort.key).localeCompare(sortValue(b, sort.key), undefined, { numeric: true });
      return sort.dir === 'asc' ? compare : -compare;
    });
  const optionsFor = (key: Key) => Array.from(new Set(rows.map(row => row[key]))).sort();
  const allSelected = shown.length > 0 && shown.every(row => selected.includes(row.index));
  const toggle = (index: number, on: boolean) =>
    setSelected(previous => (on ? [...previous, index] : previous.filter(value => value !== index)));
  // Clicks on the row's own controls (checkbox, link) are left to them.
  const onControl = (event: MouseEvent) => Boolean((event.target as HTMLElement).closest('button, input, a'));

  return <>
    <div className={styles.grid}>
      <Table className={styles.table} aria-label="Site notice locations">
        <colgroup>
          <col style={{ width: '44px' }} />
          {columns.map(({ key, width }) => <col key={key} style={width ? { width: `${width}px` } : undefined} />)}
        </colgroup>
        <TableHeader><TableRow>
          <TableHeaderCell>
            <GridCheckbox aria-label="Select all" disabled={shown.length === 0}
              checked={allSelected ? true : selected.length > 0 ? 'mixed' : false}
              onChange={() => setSelected(allSelected ? [] : shown.map(row => row.index))} />
          </TableHeaderCell>
          {columns.map(column =>
          <TableHeaderCell key={column.key} className={mergeClasses(grid.headerCell, filters[column.key] && styles.filtered)}>
            <GridColumnMenu
              label={column.label}
              sort={sort.key === column.key ? sort.dir : undefined}
              sortLabels={column.sortLabels}
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
            key={row.index}
            className={mergeClasses(grid.row, styles.row, selected.includes(row.index) && grid.selectedRow)}
            onClick={event => { if (!onControl(event)) setSelected([row.index]); }}
            onDoubleClick={event => { if (!onControl(event)) onOpen(row.index); }}
          >
            <TableCell>
              <GridCheckbox aria-label={`Select ${row.name}`} checked={selected.includes(row.index)}
                onChange={(_, data) => toggle(row.index, Boolean(data.checked))} />
            </TableCell>
            {[
              <TruncatedCell key="location" value={row.location} />,
              <TruncatedCell key="name" value={row.name} className={styles.link} onClick={() => onOpen(row.index)} />,
              <TruncatedCell key="date" value={d365Date(row.date)} />,
              <TruncatedCell key="status" value={row.status} />,
              <TruncatedCell key="accepted" value={row.accepted} />,
            ].map(content => <TableCell key={content.key} tabIndex={0}
              className={mergeClasses(grid.cell, selected.includes(row.index) && grid.selectedCell)}>{content}</TableCell>)}
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
