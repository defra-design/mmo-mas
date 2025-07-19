// src/components/FilterControls.tsx
import { SearchBox, Stack, Text, Icon, mergeStyleSets } from '@fluentui/react';

const styles = mergeStyleSets({
  root: {
    padding: '12px 0',
  },
  filterPill: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e1dfdd',
    borderRadius: 16,
    padding: '4px 8px',
    height: 32,
  },
  filterIcon: {
    marginLeft: 8,
    cursor: 'pointer',
    color: '#605e5c',
  },
});

const stackTokens = { childrenGap: 12 };

export default function FilterControls() {
  return (
    <Stack horizontal verticalAlign="center" tokens={stackTokens} className={styles.root}>
      <SearchBox
        placeholder="Ask about data in this table"
        styles={{ root: { width: 350, height: 32 } }}
      />
      <div className={styles.filterPill}>
        <Text>Status: Active</Text>
        <Icon iconName="Cancel" className={styles.filterIcon} />
      </div>
    </Stack>
  );
}
