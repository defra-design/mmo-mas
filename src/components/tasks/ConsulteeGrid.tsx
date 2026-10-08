// Read-only subgrid of the case's related Consultee records, with the subgrid's
// own command bar: Add consultee opens a new record full page. Selecting rows
// swaps it for Edit (one record opens its form; several open the OOB bulk edit
// panel) and Remove (the OOB Delete command, relabelled in the command designer).
// Notes are left out of the view because they can be long. As in D365, the
// Organisation link opens the Organisation (Account) record, not the Consultee:
// clicking a row selects it, and double-clicking it, Edit, or the row's Navigate
// icon in the last column opens the Consultee. Consultation type has no width,
// so it takes the spare space.
import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import {
  Button, Checkbox, makeStyles, mergeClasses, Table, TableBody, TableCell, TableHeader,
  TableHeaderCell, TableRow, Text, Tooltip, tokens,
} from '@fluentui/react-components';
import { AddRegular, DeleteRegular, EditRegular, OpenRegular } from '@fluentui/react-icons';
import GridColumnMenu from '../GridColumnMenu';
import type { ColumnFilter } from '../GridColumnMenu';
import TruncatedCell from '../TruncatedCell';
import { useSubgridStyles } from '../subgridStyles';
import CaseDialogShell from '../CaseDialogShell';
import ConsulteeBulkEdit from './ConsulteeBulkEdit';
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
  row: { height: '42px' },
  navigate: {
    color: '#0078d4',
    ':hover': { color: '#0078d4', outline: '2px solid #0078d4', outlineOffset: '-2px' },
  },
  filtered: { outline: '1px solid #0078d4', outlineOffset: '-1px', borderRadius: tokens.borderRadiusMedium },
  empty: { color: '#605e5c' },
  footer: { display: 'flex', gap: tokens.spacingHorizontalL, paddingTop: tokens.spacingVerticalM, color: '#605e5c' },
});

type Props = {
  caseId: string;
  rows: ConsulteeRow[];
  locked: boolean;
  onAdd: () => void;
  onOpen: (id: string) => void;
  onOpenOrganisation: (name: string) => void;
  onRemove: (ids: string[]) => void;
  onUpdate: (rows: ConsulteeRow[]) => void;
};

export default function ConsulteeGrid({ caseId, rows, locked, onAdd, onOpen, onOpenOrganisation, onRemove, onUpdate }: Props) {
  const styles = useStyles();
  const grid = useSubgridStyles();
  const [view, setView] = useState(() => loadView(caseId));
  const [selected, setSelected] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [bulkEditing, setBulkEditing] = useState(false);
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
  const chosen = rows.filter(row => selected.includes(row.id));
  // Clicks on the row's own controls (checkbox, link) are left to them.
  const onControl = (event: MouseEvent) => Boolean((event.target as HTMLElement).closest('button, input, a'));
  const edit = () => (chosen.length === 1 ? onOpen(chosen[0].id) : setBulkEditing(true));

  return <>
    {!locked && <div className={styles.commands}>
      {selected.length > 0 ? <>
        <Button appearance="subtle" icon={<EditRegular />} onClick={edit}>Edit</Button>
        <Button appearance="subtle" icon={<DeleteRegular />} onClick={() => setConfirming(true)}>Remove</Button>
      </> : <Button appearance="subtle" icon={<AddRegular />} onClick={onAdd}>Add consultee</Button>}
    </div>}
    <div className={styles.grid}>
      <Table className={styles.table} aria-label="Consultees">
        <colgroup>
          <col style={{ width: '44px' }} />
          {columns.map(({ key, width }) => <col key={key} style={width ? { width: `${width}px` } : undefined} />)}
          <col style={{ width: '48px' }} />
        </colgroup>
        <TableHeader><TableRow>
          <TableHeaderCell>
            <Checkbox aria-label="Select all" disabled={locked || shown.length === 0}
              checked={allSelected ? true : selected.length > 0 ? 'mixed' : false}
              onChange={() => setSelected(allSelected ? [] : shown.map(row => row.id))} />
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
          <TableHeaderCell>
            <Tooltip content="See all records" relationship="label" positioning="above">
              <Button appearance="transparent" size="small" className={styles.navigate} icon={<OpenRegular />} />
            </Tooltip>
          </TableHeaderCell>
        </TableRow></TableHeader>
        <TableBody>
          {shown.length === 0 && <TableRow><TableCell colSpan={4}><Text className={styles.empty}>No data available</Text></TableCell></TableRow>}
          {shown.map(row =>
            <TableRow
              key={row.id}
              className={mergeClasses(grid.row, styles.row, selected.includes(row.id) && grid.selectedRow)}
              onClick={event => { if (!locked && !onControl(event)) setSelected([row.id]); }}
              onDoubleClick={event => { if (!onControl(event)) onOpen(row.id); }}
            >
              <TableCell>
                <Checkbox aria-label={`Select ${row.organisation}`} disabled={locked}
                  checked={selected.includes(row.id)} onChange={(_, data) => toggle(row.id, Boolean(data.checked))} />
              </TableCell>
              {[
                <TruncatedCell key="organisation" value={row.organisation} onClick={() => onOpenOrganisation(row.organisation)} />,
                <TruncatedCell key="type" value={row.consultationType} />,
              ].map(content =>
                <TableCell key={content.key} tabIndex={0}
                  className={mergeClasses(grid.cell, selected.includes(row.id) && grid.selectedCell)}>{content}</TableCell>)}
              <TableCell>
                <Tooltip content="Navigate" relationship="label" positioning="above">
                  <Button appearance="transparent" size="small" className={styles.navigate} icon={<OpenRegular />}
                    onClick={() => onOpen(row.id)} />
                </Tooltip>
              </TableCell>
            </TableRow>,
          )}
        </TableBody>
      </Table>
    </div>
    <div className={styles.footer}>
      <Text>Rows: {shown.length}</Text>
      {selected.length > 0 && <Text>Selected: {selected.length}</Text>}
    </div>
    {bulkEditing && <ConsulteeBulkEdit
      count={chosen.length}
      onCancel={() => setBulkEditing(false)}
      onSave={changes => {
        onUpdate(chosen.map(row => ({ ...row, ...changes })));
        setSelected([]);
        setBulkEditing(false);
      }}
    />}
    {confirming && <CaseDialogShell
      title={chosen.length === 1 ? 'Remove consultee' : 'Remove consultees'}
      confirmLabel="Remove"
      onCancel={() => setConfirming(false)}
      onConfirm={() => { onRemove(chosen.map(row => row.id)); setSelected([]); setConfirming(false); }}
    >
      {chosen.length === 1 ? chosen[0].organisation : `${chosen.length} organisations`} will be removed
      from the consultees for this application.
    </CaseDialogShell>}
  </>;
}
