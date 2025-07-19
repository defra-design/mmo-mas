// src/components/ListView.tsx
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
  // Build Fluent-UI column objects from the JSON config
  const columns: IColumn[] = entityConfig.list.columns.map((c: any) => ({
    key: c.key,
    name: c.name,
    fieldName: c.key,
    minWidth: c.width,
    isResizable: true,
    onRender: (item: any) =>
      c.tag ? (
        <span
          style={{
            padding: '2px 6px',
            borderRadius: 4,
            background: '#E5F1FF',
            fontSize: 12,
          }}
        >
          {item[c.key]}
        </span>
      ) : (
        item[c.key]
      ),
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
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
    </>
  );
}