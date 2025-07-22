// src/components/ListView.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailsList, DetailsListLayoutMode, SelectionMode } from '@fluentui/react';
import type { IColumn } from '@fluentui/react';
import CommandBar from './CommandBar';
import FilterControls from './FilterControls';

interface ListViewProps {
  entityConfig: any;
  items: any[];
  title: string;
  view: string;
}

export default function ListView({ entityConfig, items, title }: ListViewProps) {
  const navigate = useNavigate();

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

  // Build Fluent-UI column objects from the JSON config
  const columns: IColumn[] = entityConfig.list.columns.map((c: any) => ({
    key: c.key,
    name: c.name,
    fieldName: c.key,
    minWidth: c.width,
    isResizable: true,
    onRender: (item: any) => {
      // Handle different column types with clickable links
      if (c.key === 'project') {
        return (
          <button
            onClick={() => navigateToCase(item.reference)}
            className="link-button"
          >
            {item[c.key]}
          </button>
        );
      }
      
      // Handle tags (status, type)
      if (c.tag) {
        return (
          <span className={getTagClass(c.key, item[c.key])}>
            {item[c.key]}
          </span>
        );
      }
      
      // Default rendering for other columns (applicant, owner, etc.)
      return item[c.key];
    },
  }));

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>{title}</h1>
        <CommandBar />
      </div>
      <FilterControls />
      <DetailsList
        items={items}
        columns={columns}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        selectionMode={SelectionMode.none}
      />
    </>
  );
}