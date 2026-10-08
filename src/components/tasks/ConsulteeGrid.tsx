// Read-only subgrid of the case's related Consultee records, with the subgrid's
// own command bar: Add consultee opens a new record full page, and Remove
// appears once rows are selected (the OOB Delete command, relabelled in the
// command designer). Notes are left out of the view because they can be long.
// Only the Organisation column opens the record; Consultation type has no
// width, so it takes the spare space.
import { useEffect, useState } from 'react';
import {
  Button, Checkbox, makeStyles, Table, TableBody, TableCell, TableHeader,
  TableHeaderCell, TableRow, Text, tokens,
} from '@fluentui/react-components';
import { AddRegular, DeleteRegular } from '@fluentui/react-icons';
import GridColumnMenu from '../GridColumnMenu';
import type { ColumnFilter } from '../GridColumnMenu';
import TruncatedCell from '../TruncatedCell';
import CaseDialogShell from '../CaseDialogShell';
import type { ConsulteeRow } from '../../context/TaskContext';

type Key = 'organisation' | 'consultationType';
type View = { sort: { key: Key; dir: 'asc' | 'desc' }; filters: Partial<Record<Key, ColumnFilter>> };
type Column = { key: Key; label: string; width?: number; choice?: boolean };

const columns: Column[] = [
  { key: 'organisation', label: 'Organisation', width: 360 },
  { key: 'consultationType', label: 'Consultation type', choice: true },
];
const defaultView: View = { sort: { key: 'organisation', dir: 'asc' }, filters: {} };

// D365 remembers a grid's sort and filters while the caseworker opens a record
// and comes back, so keep them per case for the browser session.
const storageKey = (caseId: string) => `mas-grid-view:consultees:${caseId}`;
function loadView(caseId: string): View {
  try {
    const saved = sessionStorage.getItem(storageKey(caseId));
    return saved ? { ...defaultView, ...JSON.parse(saved) } : defaultView;
  } catch {
    return defaultView;
  }
}

const useStyles = makeStyles({
  commands: { display: 'flex', justifyContent: 'flex-end', gap: tokens.spacingHorizontalXS },
  grid: { overflowX: 'auto' },
  table: { tableLayout: 'fixed', minWidth: '600px', width: '100%' },
  row: { height: '42px', ':hover': { backgroundColor: '#edebe9' } },
  filtered: { outline: '1px solid #0078d4', outlineOffset: '-1px', borderRadius: tokens.borderRadiusMedium },
  empty: { color: '#605e5c' },
  footer: { paddingTop: tokens.spacingVerticalM, color: '#605e5c' },
});

type Props = {
  caseId: string;
  rows: ConsulteeRow[];
  locked: boolean;
  onAdd: () => void;
  onOpen: (id: string) => void;
  onRemove: (ids: string[]) => void;
};

export default function ConsulteeGrid({ caseId, rows, locked, onAdd, onOpen, onRemove }: Props) {
  const styles = useStyles();
  const [view, setView] = useState(() => loadView(caseId));
  const [selected, setSelected] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
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
      const compare = a[sort.key].localeCompare(b[sort.key]);
      return sort.dir === 'asc' ? compare : -compare;
    });
  const optionsFor = (key: Key) => Array.from(new Set(rows.map(row => row[key]))).sort();
  const allSelected = shown.length > 0 && shown.every(row => selected.includes(row.id));
  const toggle = (id: string, on: boolean) =>
    setSelected(previous => (on ? [...previous, id] : previous.filter(value => value !== id)));
  const removing = rows.filter(row => selected.includes(row.id));

  return <>
    {!locked && <div className={styles.commands}>
      {selected.length > 0 && <Button appearance="subtle" icon={<DeleteRegular />} onClick={() => setConfirming(true)}>Remove</Button>}
      <Button appearance="subtle" icon={<AddRegular />} onClick={onAdd}>Add consultee</Button>
    </div>}
    <div className={styles.grid}>
      <Table className={styles.table} aria-label="Consultees">
        <colgroup>
          <col style={{ width: '44px' }} />
          {columns.map(({ key, width }) => <col key={key} style={width ? { width: `${width}px` } : undefined} />)}
        </colgroup>
        <TableHeader><TableRow>
          <TableHeaderCell>
            <Checkbox aria-label="Select all" disabled={locked || shown.length === 0}
              checked={allSelected ? true : selected.length > 0 ? 'mixed' : false}
              onChange={() => setSelected(allSelected ? [] : shown.map(row => row.id))} />
          </TableHeaderCell>
          {columns.map(column =>
            <TableHeaderCell key={column.key} className={filters[column.key] ? styles.filtered : undefined}>
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
        <TableBody>
          {shown.length === 0 && <TableRow><TableCell colSpan={3}><Text className={styles.empty}>No data available</Text></TableCell></TableRow>}
          {shown.map(row =>
            <TableRow className={styles.row} key={row.id}>
              <TableCell>
                <Checkbox aria-label={`Select ${row.organisation}`} disabled={locked}
                  checked={selected.includes(row.id)} onChange={(_, data) => toggle(row.id, Boolean(data.checked))} />
              </TableCell>
              <TableCell><TruncatedCell value={row.organisation} onClick={() => onOpen(row.id)} /></TableCell>
              <TableCell><TruncatedCell value={row.consultationType} /></TableCell>
            </TableRow>,
          )}
        </TableBody>
      </Table>
    </div>
    <Text block className={styles.footer}>Rows: {shown.length}</Text>
    {confirming && <CaseDialogShell
      title={removing.length === 1 ? 'Remove consultee' : 'Remove consultees'}
      confirmLabel="Remove"
      onCancel={() => setConfirming(false)}
      onConfirm={() => { onRemove(removing.map(row => row.id)); setSelected([]); setConfirming(false); }}
    >
      {removing.length === 1 ? removing[0].organisation : `${removing.length} organisations`} will be removed
      from the consultees for this application.
    </CaseDialogShell>}
  </>;
}
