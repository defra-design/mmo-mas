// Read-only subgrid of the case's Consultation extension records, on the Extend
// consultee closing date task. Configured without a select column, like the
// Tasks subgrid: extensions can't be removed, as each one has already moved the
// closing date. Its command bar only has Add extension. Date extended is the
// primary column, so its link (or a double-click on the row) opens the extension
// read-only. Reason has no width, so it takes the spare space and is cut off
// with an ellipsis, showing in full in a tooltip only when it is cut off.
import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import {
  Button, makeStyles, mergeClasses, Table, TableBody, TableCell, TableHeader,
  TableHeaderCell, TableRow, Text, tokens,
} from '@fluentui/react-components';
import { AddRegular, TableFilled } from '@fluentui/react-icons';
import GridColumnMenu from '../GridColumnMenu';
import type { ColumnFilter } from '../GridColumnMenu';
import TruncatedCell from '../TruncatedCell';
import { useSubgridStyles } from '../subgridStyles';
import { showDate } from '../../utils/consultationCase';

export type ExtensionGridRow = { id: string; dateExtended: string; days: number; newClosingDate: string; reason: string };
type Key = 'dateExtended' | 'days' | 'newClosingDate' | 'reason';
type View = { sort: { key: Key; dir: 'asc' | 'desc' }; filters: Partial<Record<Key, ColumnFilter>> };

const columns: { key: Key; label: string; width?: number; sortLabels: [string, string] }[] = [
  { key: 'dateExtended', label: 'Date extended', width: 150, sortLabels: ['Old to new', 'New to old'] },
  { key: 'days', label: 'Extended by', width: 130, sortLabels: ['Smaller to larger', 'Larger to smaller'] },
  { key: 'newClosingDate', label: 'New closing date', width: 160, sortLabels: ['Old to new', 'New to old'] },
  { key: 'reason', label: 'Reason', sortLabels: ['A to Z', 'Z to A'] },
];
const text = (row: ExtensionGridRow, key: Key) =>
  key === 'days' ? `${row.days} days` : key === 'reason' ? row.reason : showDate(row[key]);
// Newest first, as the extension that set today's closing date matters most.
const defaultView: View = { sort: { key: 'dateExtended', dir: 'desc' }, filters: {} };

const storageKey = (caseId: string) => `mas-grid-view:extensions:${caseId}`;
function loadView(caseId: string): View {
  try {
    const saved = sessionStorage.getItem(storageKey(caseId));
    return saved ? { ...defaultView, ...JSON.parse(saved) } : defaultView;
  } catch {
    return defaultView;
  }
}

const useStyles = makeStyles({
  commands: { display: 'flex', justifyContent: 'flex-end' },
  grid: { overflowX: 'auto' },
  table: { tableLayout: 'fixed', minWidth: '600px', width: '100%' },
  row: { height: '42px' },
  filtered: { outline: '1px solid #0078d4', outlineOffset: '-1px', borderRadius: tokens.borderRadiusMedium },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: tokens.spacingVerticalS,
    paddingTop: tokens.spacingVerticalL, paddingBottom: tokens.spacingVerticalL, color: '#323130',
  },
  emptyIcon: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '112px', height: '112px',
    borderRadius: '50%', backgroundColor: '#c8c6c4', color: '#ffffff', fontSize: '80px',
  },
  footer: { paddingTop: tokens.spacingVerticalM, color: '#605e5c' },
});

type Props = { caseId: string; rows: ExtensionGridRow[]; onAdd: () => void; onOpen: (id: string) => void };

export default function ExtensionsGrid({ caseId, rows, onAdd, onOpen }: Props) {
  const styles = useStyles();
  const grid = useSubgridStyles();
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
      if (!filter || Array.isArray(filter)) return true;
      return text(row, key).toLowerCase().includes(filter.toLowerCase());
    }))
    .sort((a, b) => {
      const compare = sort.key === 'days' ? a.days - b.days : a[sort.key].localeCompare(b[sort.key]);
      return sort.dir === 'asc' ? compare : -compare;
    });
  const onControl = (event: MouseEvent) => Boolean((event.target as HTMLElement).closest('button, input, a'));

  return <>
    <div className={styles.commands}>
      <Button appearance="subtle" icon={<AddRegular />} onClick={onAdd}>Add extension</Button>
    </div>
    <div className={styles.grid}>
      <Table className={styles.table} aria-label="Extensions">
        <colgroup>
          {columns.map(({ key, width }) => <col key={key} style={width ? { width: `${width}px` } : undefined} />)}
        </colgroup>
        <TableHeader><TableRow>
          {columns.map(column =>
            <TableHeaderCell key={column.key} className={mergeClasses(grid.headerCell, filters[column.key] && styles.filtered)}>
              <GridColumnMenu
                label={column.label}
                sort={sort.key === column.key ? sort.dir : undefined}
                sortLabels={column.sortLabels}
                onSort={dir => setView({ ...view, sort: { key: column.key, dir } })}
                filter={filters[column.key]}
                onFilter={filter => setView({ ...view, filters: { ...filters, [column.key]: filter } })}
              />
            </TableHeaderCell>,
          )}
        </TableRow></TableHeader>
        <TableBody>
          {shown.length === 0 && <TableRow><TableCell colSpan={columns.length}>
            <div className={styles.empty}>
              <span className={styles.emptyIcon}><TableFilled aria-hidden /></span>
              <Text>We didn't find anything to show here</Text>
            </div>
          </TableCell></TableRow>}
          {shown.map(row =>
            <TableRow key={row.id} className={mergeClasses(grid.row, styles.row)}
              onDoubleClick={event => { if (!onControl(event)) onOpen(row.id); }}>
              {columns.map(({ key }) =>
                <TableCell key={key} tabIndex={0} className={grid.cell}>
                  <TruncatedCell value={text(row, key)} onClick={key === 'dateExtended' ? () => onOpen(row.id) : undefined} />
                </TableCell>)}
            </TableRow>,
          )}
        </TableBody>
      </Table>
    </div>
    <Text block className={styles.footer}>Rows: {shown.length}</Text>
  </>;
}
