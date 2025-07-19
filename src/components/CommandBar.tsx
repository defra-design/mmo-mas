// src/components/CommandBar.tsx
import { CommandBar } from '@fluentui/react';
import type { ICommandBarItemProps, IButtonStyles } from '@fluentui/react';

const buttonStyles: IButtonStyles = {
  root: {         // remove grey hover boxes, shrink padding
    background: 'transparent',
    padding: '0 6px',
    height: 32,
  },
  rootHovered: { background: 'rgba(0,0,0,0.05)' },
  icon: { fontSize: 16 },
  label: { fontSize: 14, marginLeft: 4 },
};

const items: ICommandBarItemProps[] = [
  {
    key: 'showAs',
    text: 'Show As',
    iconProps: { iconName: 'View' },
    buttonStyles,
    submenuProps: {
      items: [
        { key: 'read', text: 'Read view', iconProps: { iconName: 'ReadingMode' } },
        { key: 'edit', text: 'Editable grid', iconProps: { iconName: 'Edit' } },
      ],
    },
  },
  { key: 'new', text: 'New Case', iconProps: { iconName: 'Add' }, buttonStyles },
  { key: 'delete', text: 'Delete', iconProps: { iconName: 'Delete' }, buttonStyles },
  { key: 'refresh', text: 'Refresh', iconProps: { iconName: 'Refresh' }, buttonStyles },
];

const farItems: ICommandBarItemProps[] = [
  { key: 'more', iconOnly: true, iconProps: { iconName: 'More' }, buttonStyles },
];

export default function CaseCommandBar() {
  return (
    <CommandBar
      items={items}
      farItems={farItems}
      ariaLabel="Case command bar"
      styles={{
        root: {
          padding: 0,
          borderBottom: '1px solid #e1e1e1',
          marginBottom: 8,
        },
      }}
    />
  );
}