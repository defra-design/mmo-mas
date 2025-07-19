// src/components/ListView.tsx
import { DetailsList } from '@fluentui/react';
import type { IColumn } from '@fluentui/react';
import caseConfig from '../config/entities/case.json';
import cases from '../mock-data/cases.json';

// Build Fluent-UI column objects from the JSON config
const columns: IColumn[] = (caseConfig as any).list.columns.map((c: any) => ({
  key: c.key,
  name: c.name,
  fieldName: c.key,
  minWidth: c.width,
  maxWidth: c.width,
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

export default function ListView() {
  return <DetailsList items={cases as any[]} columns={columns} compact />;
}