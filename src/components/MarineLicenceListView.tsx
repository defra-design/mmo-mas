// src/components/MarineLicenceListView.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Text,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Button,
  MenuList,
  MenuItem,
  Checkbox,
  Divider,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Tooltip,
  mergeClasses,
} from '@fluentui/react-components';
import {
  ChevronDownRegular,
  ArrowUpRegular,
  ArrowDownRegular,
  FilterRegular,
  FilterFilled,
} from '@fluentui/react-icons';
import FormCommandBar from './FormCommandBar';
import marineCaseDetails from '../mock-data/marine-case-details.json';

const useStyles = makeStyles({
  pageContainer: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  tablePanel: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingHorizontalXL, tokens.spacingHorizontalXL),
    marginBottom: tokens.spacingVerticalM,
  },
  headerMenuTrigger: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    ':hover': { backgroundColor: tokens.colorNeutralBackground3 },
  },
  chevron: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase400,
  },
  activeFilterIcon: {
    marginLeft: tokens.spacingHorizontalXXS,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorBrandForeground1,
  },
  // Direction arrow shown on the header of the column the grid is sorted by.
  activeSortIcon: {
    marginLeft: tokens.spacingHorizontalXXS,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    margin: 0,
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
  menuIconStart: {
    marginRight: tokens.spacingHorizontalS,
    fontSize: tokens.fontSizeBase400,
  },
  filterLabel: {
    fontWeight: tokens.fontWeightSemibold,
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
  },
  filterList: {
    maxHeight: '200px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    ...shorthands.padding('0', tokens.spacingHorizontalS),
  },
  clearRow: {
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
  },
  staticLink: { color: '#0078d4' },
  tableRow: {
    ':hover': { backgroundColor: tokens.colorNeutralBackground3 },
  },
  // Horizontal scroll when the columns are wider than the panel (like D365).
  tableScroll: {
    overflowX: 'auto',
  },
  // Single-line cell content that truncates with an ellipsis (full value on hover).
  cellText: {
    display: 'block',
    minWidth: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

// Project-name cell: a link that only shows the (immediate) hover card when the
// name is actually truncated, mirroring the D365 grid.
function ProjectNameCell({
  value,
  clickable,
  onNavigate,
}: {
  value: string;
  clickable: boolean;
  onNavigate: () => void;
}) {
  const styles = useStyles();
  const triggerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  const setRef = (el: HTMLElement | null) => {
    triggerRef.current = el;
  };

  const inner = clickable ? (
    <button ref={setRef} onClick={onNavigate} className={`link-button ${styles.cellText}`}>
      {value}
    </button>
  ) : (
    <span ref={setRef} className={mergeClasses(styles.staticLink, styles.cellText)}>{value}</span>
  );

  return (
    <Tooltip
      content={value}
      relationship="label"
      positioning="below"
      withArrow={false}
      showDelay={0}
      visible={open}
      onVisibleChange={(_, data) => {
        const el = triggerRef.current;
        // Only show when the text is clipped (scroll width exceeds visible width).
        setOpen(data.visible && !!el && el.scrollWidth > el.clientWidth);
      }}
    >
      {inner}
    </Tooltip>
  );
}

// Maps a status value to its tag CSS class (see App.css).
function statusClass(status: string) {
  switch (status) {
    case 'Awaiting allocation': return 'tag tag-mla-awaiting-allocation';
    case 'Assessment in progress': return 'tag tag-mla-assessment';
    case 'Awaiting applicant': return 'tag tag-mla-awaiting-applicant';
    case 'Consultation': return 'tag tag-mla-consultation';
    default: return 'tag';
  }
}

interface ColumnConfig {
  key: string;
  name: string;
  width: number;
  link?: boolean;
  tag?: boolean;
  type?: 'number';
  align?: 'right';
}

type SortState = { key: string; dir: 'asc' | 'desc' } | null;
type Filters = Record<string, string[]>; // key -> allowed values; absent = all

interface MarineLicenceListViewProps {
  entityConfig: {
    list: {
      columns: ColumnConfig[];
      defaultSort?: { key: string; direction: 'asc' | 'desc' };
    };
  };
  items: Record<string, string>[];
  title: string;
}

export default function MarineLicenceListView({
  entityConfig,
  items,
  title,
}: MarineLicenceListViewProps) {
  const columns = entityConfig.list.columns;
  const defaultSort = entityConfig.list.defaultSort;

  // Like D365: the grid always has a sort, and it remembers the column you last
  // sorted by. Last-used sort is persisted per list view; otherwise fall back to
  // the view's configured default sort.
  const sortStorageKey = `mas-list-sort:${title}`;
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sort, setSort] = useState<SortState>(() => {
    try {
      const saved = localStorage.getItem(sortStorageKey);
      if (saved) return JSON.parse(saved) as SortState;
    } catch {
      /* ignore unavailable/corrupt storage */
    }
    return defaultSort ? { key: defaultSort.key, dir: defaultSort.direction } : null;
  });
  const [filters, setFilters] = useState<Filters>({});
  const navigate = useNavigate();
  const styles = useStyles();

  useEffect(() => {
    document.title = `${title} - MMO Marine Applications System`;
  }, [title]);

  // Remember the last-used sort across reloads.
  useEffect(() => {
    try {
      if (sort) localStorage.setItem(sortStorageKey, JSON.stringify(sort));
      else localStorage.removeItem(sortStorageKey);
    } catch {
      /* ignore unavailable storage */
    }
  }, [sort, sortStorageKey]);

  // Only cases with full data (in marine-case-details.json) are navigable.
  const isClickable = (reference: string) =>
    Object.prototype.hasOwnProperty.call(marineCaseDetails, reference);

  const navigateToCase = (reference: string) =>
    navigate(`/review-assess/cases/${encodeURIComponent(reference)}`);

  // Apply active filters then the active sort.
  const displayed = useMemo(() => {
    let rows = items.filter(item =>
      Object.entries(filters).every(
        ([key, allowed]) => allowed.length === 0 || allowed.includes(item[key]),
      ),
    );
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const cmp = (a[sort.key] ?? '').localeCompare(b[sort.key] ?? '', undefined, { numeric: true });
        return sort.dir === 'asc' ? cmp : -cmp;
      });
    }
    return rows;
  }, [items, filters, sort]);

  // Distinct values for a column, blanks shown last as "(Blank)".
  const distinctValues = (key: string) =>
    [...new Set(items.map(i => i[key]))].sort((a, b) => {
      if (a === '') return 1;
      if (b === '') return -1;
      return a.localeCompare(b, undefined, { numeric: true });
    });

  const toggleFilterValue = (key: string, value: string) => {
    setFilters(prev => {
      const all = distinctValues(key);
      const current = prev[key] ?? all;
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      const updated = { ...prev };
      if (next.length === all.length) {
        delete updated[key]; // all selected = no filter
      } else {
        updated[key] = next;
      }
      return updated;
    });
  };

  const clearFilter = (key: string) =>
    setFilters(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });

  function ColumnHeaderMenu({ col }: { col: ColumnConfig }) {
    const isFiltered = Boolean(filters[col.key]);
    const allowed = filters[col.key]; // undefined = all selected
    const isNumber = col.type === 'number';
    const ascLabel = isNumber ? 'Smaller to Larger' : 'A to Z';
    const descLabel = isNumber ? 'Larger to Smaller' : 'Z to A';
    return (
      <Popover>
        <PopoverTrigger>
          <Button
            appearance="transparent"
            className={styles.headerMenuTrigger}
            aria-label={`${col.name} column menu`}
            icon={null}
            style={{
              width: '100%',
              paddingLeft: 0,
              // Drop the button's right padding so the chevron sits flush with the
              // cell's right edge — i.e. directly above the right-aligned numbers.
              paddingRight: col.align === 'right' ? 0 : undefined,
              justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
            }}
          >
            <Text style={{ fontWeight: tokens.fontWeightSemibold }}>{col.name}</Text>
            {sort?.key === col.key &&
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
          <MenuList className={styles.menuList}>
            <MenuItem
              className={styles.menuItem}
              onClick={() => setSort({ key: col.key, dir: 'asc' })}
            >
              <span className={styles.menuIconStart}><ArrowUpRegular /></span>
              <Text>{ascLabel}</Text>
            </MenuItem>
            <MenuItem
              className={styles.menuItem}
              onClick={() => setSort({ key: col.key, dir: 'desc' })}
            >
              <span className={styles.menuIconStart}><ArrowDownRegular /></span>
              <Text>{descLabel}</Text>
            </MenuItem>
          </MenuList>

          <Divider style={{ margin: '4px 0' }} />

          <div className={styles.filterLabel}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <FilterRegular /> Filter by
            </span>
          </div>
          <div className={styles.filterList}>
            {distinctValues(col.key).map(value => (
              <Checkbox
                key={value || '__blank__'}
                label={value === '' ? '(Blank)' : value}
                checked={!allowed || allowed.includes(value)}
                onChange={() => toggleFilterValue(col.key, value)}
              />
            ))}
          </div>
          <div className={styles.clearRow}>
            <Button
              appearance="subtle"
              size="small"
              disabled={!isFiltered}
              onClick={() => clearFilter(col.key)}
            >
              Clear filter
            </Button>
          </div>
        </PopoverSurface>
      </Popover>
    );
  }

  function renderCell(col: ColumnConfig, item: Record<string, string>) {
    const value = item[col.key] ?? '';
    if (col.link) {
      // Only fully-built cases navigate; all project names look like links.
      return (
        <ProjectNameCell
          value={value}
          clickable={isClickable(item.reference)}
          onNavigate={() => navigateToCase(item.reference)}
        />
      );
    }
    if (col.tag && value) {
      return <span className={statusClass(value)} title={value}>{value}</span>;
    }
    return (
      <span
        className={styles.cellText}
        title={value}
        style={col.align === 'right' ? { textAlign: 'right' } : undefined}
      >
        {value}
      </span>
    );
  }

  const allDisplayedSelected =
    displayed.length > 0 && displayed.every(i => selectedRows.includes(i.reference));

  // Sum of column widths (+ checkbox) — the table floor before it scrolls.
  const minTableWidth = 32 + columns.reduce((sum, c) => sum + c.width, 0);

  return (
    <div className={styles.pageContainer}>
      <FormCommandBar />
      <div className={mergeClasses(styles.tablePanel, 'elevated-panel')}>
        <Popover>
          <PopoverTrigger>
            <Button appearance="transparent" className={styles.headerMenuTrigger} icon={null} style={{ paddingLeft: 0 }}>
              <Text as="h1" className={styles.title}>{title}</Text>
              <ChevronDownRegular className={styles.chevron} />
            </Button>
          </PopoverTrigger>
          <PopoverSurface className={styles.popoverSurface}>
            <MenuList className={styles.menuList}>
              <MenuItem className={styles.menuItem}><Text>Marine licence cases</Text></MenuItem>
              <MenuItem className={styles.menuItem}><Text>My marine licence cases</Text></MenuItem>
              <MenuItem className={styles.menuItem}><Text>All cases</Text></MenuItem>
            </MenuList>
          </PopoverSurface>
        </Popover>

        <div className={styles.tableScroll}>
          <Table
            aria-label="Marine licence cases"
            style={{ tableLayout: 'fixed', width: '100%', minWidth: minTableWidth, marginTop: 12 }}
          >
            <TableHeader>
              <TableRow>
                <TableCell style={{ width: 32, paddingLeft: 8, paddingRight: 8 }}>
                  <Checkbox
                    checked={allDisplayedSelected}
                    onChange={(_, data) =>
                      setSelectedRows(data.checked ? displayed.map(i => i.reference) : [])
                    }
                    aria-label="Select all"
                  />
                </TableCell>
                {columns.map(col => (
                  <TableCell
                    key={col.key}
                    style={{ width: col.width, fontWeight: 600, ...(col.align === 'right' ? { paddingRight: 12 } : {}) }}
                  >
                    <ColumnHeaderMenu col={col} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <tbody>
              {displayed.map(item => (
                <TableRow key={item.reference} className={styles.tableRow}>
                  <TableCell style={{ width: 32, paddingLeft: 8, paddingRight: 8 }}>
                    <Checkbox
                      checked={selectedRows.includes(item.reference)}
                      onChange={(_, data) =>
                        setSelectedRows(rows =>
                          data.checked ? [...rows, item.reference] : rows.filter(r => r !== item.reference)
                        )
                      }
                      aria-label="Select row"
                    />
                  </TableCell>
                  {columns.map(col => (
                    <TableCell
                      key={col.key}
                      style={{ width: col.width, ...(col.align === 'right' ? { paddingRight: 12 } : {}) }}
                    >
                      {renderCell(col, item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
