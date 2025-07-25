// src/components/ListView.tsx
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
  Input,
  Button,
  MenuList,
  MenuItem,
  Checkbox,
  Avatar,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  mergeClasses
} from '@fluentui/react-components';
import CommandBar from './CommandBar';
import FilterControls from './FilterControls';
import {
  ChevronDownRegular,
  PersonRegular,
  CheckmarkRegular,
  SettingsRegular,
  DocumentRegular,
  SearchRegular
} from '@fluentui/react-icons';
// Remove IColumn import, not needed for v9 Table
const useStyles = makeStyles({
  pageContainer: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  headerPanel: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalXL),
    marginTop: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalM,
  },
  tablePanel: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingHorizontalM),
    marginBottom: tokens.spacingVerticalM,
  },
  headerMenuTrigger: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    transitionDuration: tokens.durationFast,
    transitionProperty: 'background',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  chevron: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase400,
  },
  popoverSurface: {
    minWidth: '320px',
    boxShadow: tokens.shadow16,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
  },
  searchInput: {
    marginBottom: tokens.spacingVerticalXS,
    width: '100%',
  },
  menuList: {
    padding: 0,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '36px',
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transitionDuration: tokens.durationFast,
    transitionProperty: 'background',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  // Table row and cell hover styles
  tableRow: {
    transition: 'background 0.2s',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  tableRowHovered: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  tableCell: {
    transition: 'background 0.2s',
  },
  tableCellHovered: {
    backgroundColor: tokens.colorNeutralBackground5,
  },
  menuItemSelected: {
    backgroundColor: tokens.colorNeutralBackground4,
    fontWeight: tokens.fontWeightSemibold,
  },
  menuIconStart: {
    marginRight: tokens.spacingHorizontalS,
    fontSize: tokens.fontSizeBase400,
  },
  menuIconEnd: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase400,
  },
  checkIcon: {
    marginRight: tokens.spacingHorizontalXS,
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase400,
  },
  header: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalM,
  },
});
const VIEW_OPTIONS = [
  { key: 'activeApplications', label: 'Active applications', iconEnd: <PersonRegular /> },
  { key: 'applicationsSubmitted', label: 'Applications submitted', iconEnd: <PersonRegular /> },
  { key: 'activeCases', label: 'Active cases' },
  { key: 'allCases', label: 'All cases' },
  { key: 'myActiveCases', label: 'My active cases' },
  { key: 'myCases', label: 'My cases' },
  { key: 'myResolvedCases', label: 'My resolved cases' },
  { key: 'resolvedCases', label: 'Resolved cases' },
  { key: 'setDefault', label: 'Set as default view', iconStart: <DocumentRegular /> },
  { key: 'manageViews', label: 'Manage and share views', iconStart: <SettingsRegular /> },
];

interface HeaderPanelMenuProps {
  selectedKey: string;
  onSelect: (key: string) => void;
  styles: ReturnType<typeof useStyles>;
}

function HeaderPanelMenu({ selectedKey, onSelect, styles }: HeaderPanelMenuProps) {
  const [search, setSearch] = useState('');
  const filteredOptions = VIEW_OPTIONS.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  return (
    <Popover trapFocus>
      <PopoverTrigger>
        <Button
          appearance="transparent"
          className={styles.headerMenuTrigger}
          icon={<ChevronDownRegular className={styles.chevron} />}
        >
          <Text as="h1" className={styles.header} style={{ margin: 0 }}>
            Active cases
          </Text>
        </Button>
      </PopoverTrigger>
      <PopoverSurface className={styles.popoverSurface}>
        <Input
          className={styles.searchInput}
          contentBefore={<SearchRegular />}
          placeholder="Search views"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="medium"
        />
        <MenuList className={styles.menuList}>
          {filteredOptions.map(opt => (
            <MenuItem
              key={opt.key}
              className={mergeClasses(
                styles.menuItem,
                selectedKey === opt.key && styles.menuItemSelected
              )}
              onClick={() => onSelect(opt.key)}
            >
              {selectedKey === opt.key && (
                <CheckmarkRegular className={styles.checkIcon} />
              )}
              {opt.iconStart && (
                <span className={styles.menuIconStart}>{opt.iconStart}</span>
              )}
              <Text>{opt.label}</Text>
              {opt.iconEnd && (
                <span className={styles.menuIconEnd}>{opt.iconEnd}</span>
              )}
            </MenuItem>
          ))}
        </MenuList>
      </PopoverSurface>
    </Popover>
  );
}

interface ListViewProps {
  entityConfig: any;
  items: any[];
  title: string;
  view: string;
}

export default function ListView({ entityConfig, items, title }: ListViewProps) {
  // Track selected view for menu
  const [selectedView, setSelectedView] = useState('activeCases');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{row: string, col: string} | null>(null);
  const navigate = useNavigate();
  const styles = useStyles();

  // Set page title when component mounts or title changes
  useEffect(() => {
    document.title = `${title} - Marine Management`;
  }, [title]);

  // Handle case detail navigation
  const navigateToCase = (caseReference: string) => {
    console.log('Navigate to case:', caseReference);
    // URL encode the case reference to handle slashes
    const encodedReference = encodeURIComponent(caseReference);
    navigate(`/cases/${encodedReference}`);
  };

  // Helper function to get tag CSS class
  const getTagClass = (columnKey: string, value: string) => {
    if (columnKey === 'type') {
      return 'tag tag-type';
    }
    if (columnKey === 'status') {
      const status = value.toLowerCase();
      if (status === 'active') return 'tag tag-status-active';
      if (status === 'scheduled') return 'tag tag-status-scheduled';
      if (status === 'finished') return 'tag tag-status-finished';
      return 'tag tag-status-active'; // fallback
    }
    return 'tag'; // fallback for other tag columns
  };

  // Helper for avatar color based on assignee name
  // Hardcoded color array for avatar backgrounds
  const avatarColors = [
    '#E57373', // red
    '#81C784', // green
    '#64B5F6', // blue
    '#FFB74D', // orange
    '#BA68C8', // purple
    '#4DD0E1', // teal
    '#F06292', // pink
    '#A1887F', // brown
  ];
  const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % avatarColors.length;
    return avatarColors[idx];
  };

  // Compose columns for v9 Table with improved widths
  const tableColumns = [
    { key: 'select', name: '', width: 24 }, // Checkbox column narrower
    ...entityConfig.list.columns.map((c: any) => {
      if (c.key === 'reference') {
        return { ...c, width: 140 };
      }
      if (c.key === 'project') {
        return { ...c, width: 220 };
      }
      if (c.key === 'type') {
        return { ...c, width: 100 };
      }
      if (c.key === 'assignedTo') {
        return { ...c, width: 160 };
      }
      return { ...c, width: c.width || 100 };
    })
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Header panel with title, search and filters */}
      <div className={mergeClasses(styles.headerPanel, 'elevated-panel')}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacingVerticalXS }}>
          <HeaderPanelMenu
            selectedKey={selectedView}
            onSelect={setSelectedView}
            styles={styles}
          />
          <CommandBar />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FilterControls />
        </div>
      </div>
      {/* Separate elevated panel for the table */}
      <div className={mergeClasses(styles.tablePanel, 'elevated-panel')}>
        <Table aria-label="Case list" style={{ minWidth: 900 }}>
          <TableHeader>
            <TableRow>
              {tableColumns.map(col => (
                <TableCell
                  key={col.key}
                  style={
                    col.key === 'select'
                      ? { width: 32, minWidth: 32, maxWidth: 32, fontWeight: 600, paddingLeft: 8, paddingRight: 8 }
                      : col.key === 'reference'
                        ? { width: 110, minWidth: 110, maxWidth: 110, fontWeight: 600 }
                        : col.key === 'project'
                          ? { width: 300, minWidth: 300, maxWidth: 500, fontWeight: 600 }
                          : { minWidth: col.width, fontWeight: 600 }
                  }
                >
                  {col.key === 'select' ? (
                    <Checkbox
                      checked={selectedRows.length === items.length && items.length > 0}
                      onChange={(_, data) => {
                        setSelectedRows(data.checked ? items.map(i => i.reference) : []);
                      }}
                      aria-label="Select all"
                    />
                  ) : col.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <tbody>
            {items.map(item => (
              <TableRow
                key={item.reference}
                className={mergeClasses(styles.tableRow, hoveredRow === item.reference && styles.tableRowHovered)}
                onMouseEnter={() => setHoveredRow(item.reference)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Checkbox cell */}
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(item.reference)}
                    onChange={(_, data) => {
                      setSelectedRows(rows =>
                        data.checked
                          ? [...rows, item.reference]
                          : rows.filter(r => r !== item.reference)
                      );
                    }}
                    aria-label="Select row"
                  />
                </TableCell>
                {/* Data cells */}
                {entityConfig.list.columns.map((c: any) => {
                  const isCellHovered = hoveredCell && hoveredCell.row === item.reference && hoveredCell.col === c.key;
                  // Reference column: fixed width
                  if (c.key === 'reference') {
                    return (
                      <TableCell
                        key={c.key}
                        className={isCellHovered ? styles.tableCellHovered : styles.tableCell}
                        style={{ width: 140, minWidth: 140, maxWidth: 140 }}
                        onMouseEnter={() => setHoveredCell({row: item.reference, col: c.key})}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {item[c.key]}
                      </TableCell>
                    );
                  }
                  // Project column: fixed width and clickable link
                  if (c.key === 'project') {
                    return (
                      <TableCell
                        key={c.key}
                        className={isCellHovered ? styles.tableCellHovered : styles.tableCell}
                        style={{ width: 220, minWidth: 220, maxWidth: 220 }}
                        onMouseEnter={() => setHoveredCell({row: item.reference, col: c.key})}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <button
                          onClick={() => navigateToCase(item.reference)}
                          className="link-button"
                        >
                          {item[c.key]}
                        </button>
                      </TableCell>
                    );
                  }
                  // Type column: render as normal text
                  if (c.key === 'type') {
                    return (
                      <TableCell
                        key={c.key}
                        className={isCellHovered ? styles.tableCellHovered : styles.tableCell}
                        onMouseEnter={() => setHoveredCell({row: item.reference, col: c.key})}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {item[c.key]}
                      </TableCell>
                    );
                  }
                  // Tag columns (except type)
                  if (c.tag && c.key !== 'type') {
                    return (
                      <TableCell
                        key={c.key}
                        className={isCellHovered ? styles.tableCellHovered : styles.tableCell}
                        onMouseEnter={() => setHoveredCell({row: item.reference, col: c.key})}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <span className={getTagClass(c.key, item[c.key])}>{item[c.key]}</span>
                      </TableCell>
                    );
                  }
                  // Assigned to column: avatar with consistent color
                  if (c.key === 'assignedTo') {
                    const name = item[c.key];
                    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
                    return (
                      <TableCell
                        key={c.key}
                        className={isCellHovered ? styles.tableCellHovered : styles.tableCell}
                        onMouseEnter={() => setHoveredCell({row: item.reference, col: c.key})}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            name={name}
                            initials={initials}
                            size={28}
                            style={{ marginRight: 8, background: getAvatarColor(name) }}
                          />
                          {name}
                        </div>
                      </TableCell>
                    );
                  }
                  // Default rendering
                  return (
                    <TableCell
                      key={c.key}
                      className={isCellHovered ? styles.tableCellHovered : styles.tableCell}
                      onMouseEnter={() => setHoveredCell({row: item.reference, col: c.key})}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {item[c.key]}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}