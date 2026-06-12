// src/components/HeaderRow.tsx
import { SearchBox } from '@fluentui/react';
import { Tag } from '@fluentui/react-components';

export default function HeaderRow() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        margin: '8px 0',
      }}
    >
      {/* Search input – mimics Dynamics “Ask about data in this table” */}
      <SearchBox
        placeholder="Ask about data in this table."
        styles={{
          root: { width: 320 },
          field: { fontSize: 14 },
        }}
      />

      {/* Status pill */}
      <Tag shape="rounded" appearance="outline">
        Status:&nbsp;<strong>Active</strong>
      </Tag>
    </div>
  );
}