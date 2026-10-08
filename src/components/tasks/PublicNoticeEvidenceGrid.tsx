// Read-only subgrid of the task's related Location records. Short view column
// names stand in for the full form labels, as a D365 view shows each column's
// display name. Only the Location column opens the record. The last column has
// no width, so it takes the spare space and Location name truncates like
// Application name on the case list.
import { useEffect, useState } from 'react';
import {
  Link, makeStyles, Table, TableBody, TableCell, TableHeader,
  TableHeaderCell, TableRow, Text, tokens,
} from '@fluentui/react-components';
import GridColumnMenu from '../GridColumnMenu';
import type { ColumnFilter } from '../GridColumnMenu';
import TruncatedCell from '../TruncatedCell';

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
const sortValue = (row: LocationRow, key: Key) => key === 'date' ? String(Date.parse(row.date)) : row[key];

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
  table: { tableLayout: 'fixed', minWidth: '880px', width: '100%' },
  row: { height: '42px', ':hover': { backgroundColor: '#edebe9' } },
  filtered: { outline: '1px solid #0078d4', outlineOffset: '-1px', borderRadius: tokens.borderRadiusMedium },
  footer: { paddingTop: tokens.spacingVerticalM, color: '#605e5c' },
});

type Props = { caseId: string; rows: LocationRow[]; onOpen: (index: number) => void };

export default function PublicNoticeEvidenceGrid({ caseId, rows, onOpen }: Props) {
  const styles = useStyles();
  const [view, setView] = useState(() => loadView(caseId));
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
      const compare = sortValue(a, sort.key).localeCompare(sortValue(b, sort.key), undefined, { numeric: true });
      return sort.dir === 'asc' ? compare : -compare;
    });
  const optionsFor = (key: Key) => Array.from(new Set(rows.map(row => row[key]))).sort();

  return <>
    <div className={styles.grid}>
      <Table className={styles.table} aria-label="Site notice locations">
        <colgroup>{columns.map(({ key, width }) => <col key={key} style={width ? { width: `${width}px` } : undefined} />)}</colgroup>
        <TableHeader><TableRow>{columns.map(column =>
          <TableHeaderCell key={column.key} className={filters[column.key] ? styles.filtered : undefined}>
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
        )}</TableRow></TableHeader>
        <TableBody>{shown.map(row =>
          <TableRow className={styles.row} key={row.index}>
            <TableCell><Link as="button" onClick={() => onOpen(row.index)}>{row.location}</Link></TableCell>
            <TableCell><TruncatedCell value={row.name} /></TableCell>
            <TableCell><TruncatedCell value={row.date} /></TableCell>
            <TableCell><TruncatedCell value={row.status} /></TableCell>
            <TableCell><TruncatedCell value={row.accepted} /></TableCell>
          </TableRow>,
        )}</TableBody>
      </Table>
    </div>
    <Text className={styles.footer}>Rows: {shown.length}</Text>
  </>;
}
