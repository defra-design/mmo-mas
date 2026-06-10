// src/components/MarineLicenceListView.tsx
import { useEffect, useState } from 'react';
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
  Table,
  TableHeader,
  TableRow,
  TableCell,
  mergeClasses,
} from '@fluentui/react-components';
import {
  ChevronDownRegular,
  ArrowUpRegular,
  ArrowDownRegular,
  ArrowRightRegular,
  ArrowLeftRegular,
  FilterRegular,
  SettingsRegular,
  DocumentRegular,
} from '@fluentui/react-icons';
import FormCommandBar from './FormCommandBar';

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
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    margin: 0,
  },
  popoverSurface: {
    minWidth: '180px',
    maxWidth: '220px',
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
  tableRow: {
    ':hover': { backgroundColor: tokens.colorNeutralBackground3 },
  },
});

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
}

interface MarineLicenceListViewProps {
  entityConfig: { list: { columns: ColumnConfig[] } };
  items: Record<string, string>[];
  title: string;
}

export default function MarineLicenceListView({
  entityConfig,
  items,
  title,
}: MarineLicenceListViewProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const navigate = useNavigate();
  const styles = useStyles();
  const columns = entityConfig.list.columns;

  useEffect(() => {
    document.title = `${title} - MMO Marine Applications System`;
  }, [title]);

  const navigateToCase = (reference: string) =>
    navigate(`/review-assess/cases/${encodeURIComponent(reference)}`);

  // Non-functional column header menu (matches the D365 filter affordance).
  function ColumnHeaderMenu({ label, includeMoveRight = true }: { label: string; includeMoveRight?: boolean }) {
    const options = [
      { key: 'aToZ', label: 'A to Z', icon: <ArrowUpRegular /> },
      { key: 'zToA', label: 'Z to A', icon: <ArrowDownRegular /> },
      { key: 'filterBy', label: 'Filter by', icon: <FilterRegular /> },
      { key: 'groupBy', label: 'Group by', icon: <DocumentRegular /> },
      { key: 'columnWidth', label: 'Column width', icon: <SettingsRegular /> },
      { key: 'moveLeft', label: 'Move left', icon: <ArrowLeftRegular /> },
      ...(includeMoveRight ? [{ key: 'moveRight', label: 'Move right', icon: <ArrowRightRegular /> }] : []),
    ];
    return (
      <Popover trapFocus>
        <PopoverTrigger>
          <Button
            appearance="transparent"
            className={styles.headerMenuTrigger}
            aria-label={`${label} column menu`}
            icon={null}
            style={{ width: '100%', paddingLeft: 0, justifyContent: 'flex-start' }}
          >
            <Text style={{ fontWeight: tokens.fontWeightSemibold }}>{label}</Text>
            <ChevronDownRegular className={styles.chevron} />
          </Button>
        </PopoverTrigger>
        <PopoverSurface className={styles.popoverSurface}>
          <MenuList className={styles.menuList}>
            {options.map(opt => (
              <MenuItem key={opt.key} className={styles.menuItem}>
                <span className={styles.menuIconStart}>{opt.icon}</span>
                <Text>{opt.label}</Text>
              </MenuItem>
            ))}
          </MenuList>
        </PopoverSurface>
      </Popover>
    );
  }

  function renderCell(col: ColumnConfig, item: Record<string, string>) {
    const value = item[col.key];
    if (col.link) {
      return (
        <button onClick={() => navigateToCase(item.reference)} className="link-button">
          {value}
        </button>
      );
    }
    if (col.tag && value) {
      return <span className={statusClass(value)}>{value}</span>;
    }
    return value;
  }

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

        <Table aria-label="Marine licence cases" style={{ minWidth: 960, marginTop: 12 }}>
          <TableHeader>
            <TableRow>
              <TableCell style={{ width: 32, minWidth: 32, maxWidth: 32, paddingLeft: 8, paddingRight: 8 }}>
                <Checkbox
                  checked={selectedRows.length === items.length && items.length > 0}
                  onChange={(_, data) => setSelectedRows(data.checked ? items.map(i => i.reference) : [])}
                  aria-label="Select all"
                />
              </TableCell>
              {columns.map(col => (
                <TableCell key={col.key} style={{ minWidth: col.width, fontWeight: 600 }}>
                  <ColumnHeaderMenu label={col.name} includeMoveRight={col.key !== 'notification'} />
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <tbody>
            {items.map(item => (
              <TableRow key={item.reference} className={styles.tableRow}>
                <TableCell style={{ width: 32, minWidth: 32, maxWidth: 32, paddingLeft: 8, paddingRight: 8 }}>
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
                  <TableCell key={col.key} style={{ minWidth: col.width }}>
                    {renderCell(col, item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
