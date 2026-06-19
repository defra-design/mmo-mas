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
  Field,
  Input,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Tooltip,
  Avatar,
  mergeClasses,
} from '@fluentui/react-components';
import {
  ChevronDownRegular,
  ArrowUpRegular,
  ArrowDownRegular,
  FilterRegular,
  FilterFilled,
  FilterDismissRegular,
  ArrowAutofitWidthRegular,
  DismissRegular,
} from '@fluentui/react-icons';
import FormCommandBar from './FormCommandBar';
import { getAssigneeAvatarColor, getContrastText } from '../utils/avatarColors';
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
  // "Filter by" card (shown after choosing Filter by in the column menu).
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
  filterActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  // Vertical stack of status checkboxes in the Status column "Equals" filter.
  checkboxList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  // Brand border + funnel icon on a column heading whose filter is active.
  filteredHeaderCell: {
    ...shorthands.border('1px', 'solid', '#0078d4'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  staticLink: { color: '#0078d4' },
  tableRow: {
    ':hover': { backgroundColor: tokens.colorNeutralBackground3 },
  },
  // Horizontal scroll when the columns are wider than the panel (like D365).
  tableScroll: {
    overflowX: 'auto',
  },
  // Case officer cell: small coloured avatar + the (truncating) name.
  avatarCell: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    minWidth: 0,
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

// Link cell (Reference column): every reference looks like a blue link, but only
// fully-built cases actually navigate (the rest are non-functional in this
// prototype). Only shows the (immediate) hover card when the value is actually
// truncated, mirroring the D365 grid.
function LinkCell({
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
  type?: string; // 'number' → numeric sort labels (Smaller/Larger to …)
  align?: string; // 'right' → right-aligned header + cells
  avatar?: boolean;
}

type SortState = { key: string; dir: 'asc' | 'desc' } | null;
// key -> filter; absent = no filter. A string is a "contains" text filter; a
// string[] is an "equals one of" filter (used by the Status column checkboxes).
type Filters = Record<string, string | string[]>;

interface MarineLicenceListViewProps {
  entityConfig: {
    list: {
      columns: ColumnConfig[];
      defaultSort?: { key: string; direction: string };
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
    return defaultSort
      ? { key: defaultSort.key, dir: defaultSort.direction === 'desc' ? 'desc' : 'asc' }
      : null;
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

  // Apply active filters then the active sort. A string filter is a
  // case-insensitive "contains"; an array filter is an "equals one of" match.
  const displayed = useMemo(() => {
    let rows = items.filter(item =>
      Object.entries(filters).every(([key, filter]) => {
        const cell = item[key] ?? '';
        return Array.isArray(filter)
          ? filter.includes(cell)
          : cell.toLowerCase().includes(filter.toLowerCase());
      }),
    );
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const cmp = (a[sort.key] ?? '').localeCompare(b[sort.key] ?? '', undefined, { numeric: true });
        return sort.dir === 'asc' ? cmp : -cmp;
      });
    }
    return rows;
  }, [items, filters, sort]);

  // Set (or, when blank, remove) the "contains" filter for a column.
  const setFilter = (key: string, text: string) =>
    setFilters(prev => {
      const updated = { ...prev };
      const trimmed = text.trim();
      if (trimmed) updated[key] = trimmed;
      else delete updated[key];
      return updated;
    });

  // Set (or, when empty, remove) the "equals one of" filter for a column.
  const setEqualsFilter = (key: string, values: string[]) =>
    setFilters(prev => {
      const updated = { ...prev };
      if (values.length) updated[key] = values;
      else delete updated[key];
      return updated;
    });

  const clearFilter = (key: string) =>
    setFilters(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });

  function ColumnHeaderMenu({ col }: { col: ColumnConfig }) {
    // The Status and Case Officer columns filter by an "equals one of" checkbox
    // list (options derived from the values on the page, alphabetised) rather than
    // the free-text "contains" input used by every other column.
    const isEqualsCol = col.key === 'status' || col.key === 'caseOfficer';
    const activeFilter = filters[col.key];
    const isFiltered = Array.isArray(activeFilter)
      ? activeFilter.length > 0
      : Boolean(activeFilter);
    const isNumber = col.type === 'number';
    const ascLabel = isNumber ? 'Smaller to Larger' : 'A to Z';
    const descLabel = isNumber ? 'Larger to Smaller' : 'Z to A';
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<'menu' | 'filter'>('menu');
    const [draft, setDraft] = useState('');
    const [equalsDraft, setEqualsDraft] = useState<string[]>([]);

    // Distinct values present in this column, alphabetised — the checkbox options.
    const equalsOptions = useMemo(
      () =>
        Array.from(new Set(items.map(i => i[col.key]).filter(Boolean))).sort((a, b) =>
          a.localeCompare(b),
        ),
      [col.key],
    );

    const openFilter = () => {
      if (isEqualsCol) {
        setEqualsDraft(Array.isArray(activeFilter) ? activeFilter : []);
      } else {
        setDraft(typeof activeFilter === 'string' ? activeFilter : '');
      }
      setView('filter');
    };
    const applyFilter = () => {
      if (isEqualsCol) setEqualsFilter(col.key, equalsDraft);
      else setFilter(col.key, draft);
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
          if (data.open) setView('menu'); // always reopen on the menu view
        }}
      >
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
          {view === 'menu' ? (
            <MenuList className={styles.menuList}>
              <MenuItem
                className={styles.menuItem}
                onClick={() => { setSort({ key: col.key, dir: 'asc' }); setOpen(false); }}
              >
                <span className={styles.menuIconStart}><ArrowUpRegular /></span>
                <Text>{ascLabel}</Text>
              </MenuItem>
              <MenuItem
                className={styles.menuItem}
                onClick={() => { setSort({ key: col.key, dir: 'desc' }); setOpen(false); }}
              >
                <span className={styles.menuIconStart}><ArrowDownRegular /></span>
                <Text>{descLabel}</Text>
              </MenuItem>

              <Divider style={{ margin: '4px 0' }} />

              <MenuItem className={styles.menuItem} onClick={openFilter}>
                <span className={styles.menuIconStart}><FilterRegular /></span>
                <Text>Filter by</Text>
              </MenuItem>
              {isFiltered && (
                <MenuItem
                  className={styles.menuItem}
                  onClick={() => { clearFilter(col.key); setOpen(false); }}
                >
                  <span className={styles.menuIconStart}><FilterDismissRegular /></span>
                  <Text>Clear filter</Text>
                </MenuItem>
              )}
              {/* Non-functional — present for usability feedback only. */}
              <MenuItem className={styles.menuItem} onClick={() => setOpen(false)}>
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
                      {equalsOptions.map(option => (
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
                  <Button appearance="primary" onClick={applyFilter}>
                    Apply
                  </Button>
                  <Button
                    appearance="secondary"
                    disabled={
                      isEqualsCol
                        ? !isFiltered && equalsDraft.length === 0
                        : !isFiltered && !draft.trim()
                    }
                    onClick={() => {
                      if (isEqualsCol) setEqualsDraft([]);
                      else setDraft('');
                      clearFilter(col.key);
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

  function renderCell(col: ColumnConfig, item: Record<string, string>) {
    const value = item[col.key] ?? '';
    if (col.link) {
      // Every reference looks like a link; only fully-built cases navigate
      // (currently MLA/2026/1002).
      return (
        <LinkCell
          value={value}
          clickable={isClickable(item.reference)}
          onNavigate={() => navigateToCase(item.reference)}
        />
      );
    }
    if (col.tag && value) {
      return <span className={statusClass(value)} title={value}>{value}</span>;
    }
    if (col.avatar) {
      if (!value) return <span className={styles.cellText} />;
      return (
        <span className={styles.avatarCell}>
          {/* Fluent paints the avatar colour on the initials slot, not the root, so
              the override has to target that slot. Sam Evans keeps Fluent's
              "colorful" default; everyone else uses the shared mapping. */}
          <Avatar
            name={value}
            size={24}
            color={value === 'Sam Evans' ? 'colorful' : 'neutral'}
            initials={
              value === 'Sam Evans'
                ? undefined
                : {
                    style: {
                      backgroundColor: getAssigneeAvatarColor(value),
                      color: getContrastText(getAssigneeAvatarColor(value)),
                    },
                  }
            }
            style={{ flexShrink: 0 }}
          />
          <span className={styles.cellText} title={value}>{value}</span>
        </span>
      );
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
                    className={filters[col.key] ? styles.filteredHeaderCell : undefined}
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
