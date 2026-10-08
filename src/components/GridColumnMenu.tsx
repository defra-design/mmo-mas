// D365 read-only grid column header menu: sort, then "Filter by" (Contains for
// text columns, Equals checkboxes for choice columns). Mirrors the column menu in
// MarineLicenceListView.tsx. Each Equals checkbox needs its own id: inside a
// Field they otherwise all share the Field's control id.
import { useId, useState } from 'react';
import {
  Button, Checkbox, Divider, Field, Input, makeStyles, MenuItem, MenuList,
  Popover, PopoverSurface, PopoverTrigger, shorthands, Text, tokens,
} from '@fluentui/react-components';
import {
  ArrowDownRegular, ArrowUpRegular, ChevronDownRegular, DismissRegular,
  FilterDismissRegular, FilterFilled, FilterRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  trigger: { width: '100%', justifyContent: 'flex-start', paddingLeft: 0, minWidth: 0 },
  label: { fontWeight: tokens.fontWeightSemibold, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  icon: { marginLeft: tokens.spacingHorizontalXXS, fontSize: tokens.fontSizeBase300, flexShrink: 0 },
  filtered: { color: tokens.colorBrandForeground1 },
  chevron: { marginLeft: tokens.spacingHorizontalXS, fontSize: tokens.fontSizeBase400, flexShrink: 0 },
  surface: {
    minWidth: '220px', maxWidth: '280px', boxShadow: tokens.shadow16,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
  },
  item: {
    display: 'flex', alignItems: 'center', minHeight: '36px', cursor: 'pointer',
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    ':hover': { backgroundColor: tokens.colorNeutralBackground3 },
  },
  itemIcon: { marginRight: tokens.spacingHorizontalS, fontSize: tokens.fontSizeBase400 },
  filterHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    fontWeight: tokens.fontWeightSemibold,
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
  },
  filterBody: {
    display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
  },
  checkboxes: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS },
  actions: { display: 'flex', gap: tokens.spacingHorizontalS },
});

export type ColumnFilter = string | string[] | undefined;
type Props = {
  label: string;
  sort?: 'asc' | 'desc';
  sortLabels?: [string, string];
  onSort: (dir: 'asc' | 'desc') => void;
  filter: ColumnFilter;
  /** Values for an Equals filter; omit for a Contains filter. */
  options?: string[];
  onFilter: (filter: ColumnFilter) => void;
};

export default function GridColumnMenu({ label, sort, sortLabels = ['A to Z', 'Z to A'], onSort, filter, options, onFilter }: Props) {
  const styles = useStyles();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'filter'>('menu');
  const [text, setText] = useState('');
  const [checked, setChecked] = useState<string[]>([]);
  const isFiltered = Array.isArray(filter) ? filter.length > 0 : Boolean(filter);
  const close = () => setOpen(false);
  const openFilter = () => {
    setText(typeof filter === 'string' ? filter : '');
    setChecked(Array.isArray(filter) ? filter : []);
    setView('filter');
  };
  const apply = () => {
    onFilter(options ? (checked.length ? checked : undefined) : text.trim() || undefined);
    close();
  };
  const clear = () => { onFilter(undefined); close(); };

  return <Popover open={open} positioning="below-start" onOpenChange={(_, data) => { setOpen(data.open); if (data.open) setView('menu'); }}>
    <PopoverTrigger>
      <Button appearance="transparent" icon={null} className={styles.trigger} aria-label={`${label} column menu`}>
        <Text className={styles.label}>{label}</Text>
        {sort === 'asc' && <ArrowUpRegular className={styles.icon} />}
        {sort === 'desc' && <ArrowDownRegular className={styles.icon} />}
        {isFiltered && <FilterFilled className={`${styles.icon} ${styles.filtered}`} />}
        <ChevronDownRegular className={styles.chevron} />
      </Button>
    </PopoverTrigger>
    <PopoverSurface className={styles.surface}>
      {view === 'menu' ? <MenuList>
        <MenuItem className={styles.item} onClick={() => { onSort('asc'); close(); }}>
          <span className={styles.itemIcon}><ArrowUpRegular /></span><Text>{sortLabels[0]}</Text>
        </MenuItem>
        <MenuItem className={styles.item} onClick={() => { onSort('desc'); close(); }}>
          <span className={styles.itemIcon}><ArrowDownRegular /></span><Text>{sortLabels[1]}</Text>
        </MenuItem>
        <Divider style={{ margin: '4px 0' }} />
        <MenuItem className={styles.item} onClick={openFilter}>
          <span className={styles.itemIcon}><FilterRegular /></span><Text>Filter by</Text>
        </MenuItem>
        {isFiltered && <MenuItem className={styles.item} onClick={clear}>
          <span className={styles.itemIcon}><FilterDismissRegular /></span><Text>Clear filter</Text>
        </MenuItem>}
      </MenuList> : <>
        <div className={styles.filterHeader}>
          <span>Filter by</span>
          <Button appearance="transparent" size="small" icon={<DismissRegular />} aria-label="Close filter" onClick={close} />
        </div>
        <div className={styles.filterBody}>
          {options ? <Field label="Equals"><div className={styles.checkboxes}>
            {options.map(option => <Checkbox key={option} id={`${id}-${option}`} label={option} checked={checked.includes(option)}
              onChange={(_, data) => setChecked(previous => data.checked ? [...previous, option] : previous.filter(value => value !== option))} />)}
          </div></Field> : <Field label="Contains">
            <Input value={text} autoFocus onChange={(_, data) => setText(data.value)} onKeyDown={event => { if (event.key === 'Enter') apply(); }} />
          </Field>}
          <div className={styles.actions}>
            <Button appearance="primary" onClick={apply}>Apply</Button>
            <Button appearance="secondary" disabled={!isFiltered && !text.trim() && !checked.length} onClick={clear}>Clear</Button>
          </div>
        </div>
      </>}
    </PopoverSurface>
  </Popover>;
}
