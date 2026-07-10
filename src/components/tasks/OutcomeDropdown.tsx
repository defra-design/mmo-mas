// src/components/tasks/OutcomeDropdown.tsx
import { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Dropdown,
  Option,
} from '@fluentui/react-components';

/**
 * Caseworker outcome select styled to match the D365 dev environment: no border,
 * grey background (like the Case summary data fields), and a "---" placeholder
 * that reads "Select" on hover. The grey background stays once a value is chosen.
 */
const useStyles = makeStyles({
  dropdown: {
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.border('none'),
    // Fluent draws its focus underline via ::after — remove it for the flat look.
    '::after': { ...shorthands.border('none') },
    ':hover': { backgroundColor: tokens.colorNeutralBackground3 },
    ':hover:active': { backgroundColor: tokens.colorNeutralBackground3 },
  },
});

interface OutcomeDropdownProps {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}

export default function OutcomeDropdown({ value, options, onSelect }: OutcomeDropdownProps) {
  const styles = useStyles();
  const [hover, setHover] = useState(false);

  return (
    <Dropdown
      className={styles.dropdown}
      appearance="filled-lighter"
      placeholder={hover ? 'Select' : '---'}
      value={value}
      selectedOptions={value ? [value] : []}
      onOptionSelect={(_, d) => onSelect(d.optionValue ?? '')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {options.map(o => (
        <Option key={o}>{o}</Option>
      ))}
    </Dropdown>
  );
}
