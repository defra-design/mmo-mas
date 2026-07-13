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
 * that reads "--Select--" on hover or while open. The grey background stays once a
 * value is chosen.
 *
 * As in the real system, "--Select--" is a genuine option and always sits at the
 * top of the list: it carries the tick while the field is empty, and picking it
 * clears a chosen value back to nothing. An unset choice field in D365 is empty,
 * not a special value, so it maps back to '' in state.
 */
const PLACEHOLDER = '--Select--';

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
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      className={styles.dropdown}
      appearance="filled-lighter"
      placeholder={hover || open ? PLACEHOLDER : '---'}
      value={value}
      // With nothing chosen the tick sits against "--Select--", as D365 shows it.
      selectedOptions={[value || PLACEHOLDER]}
      onOptionSelect={(_, d) => {
        const selected = d.optionValue ?? '';
        onSelect(selected === PLACEHOLDER ? '' : selected);
      }}
      open={open}
      onOpenChange={(_, d) => setOpen(d.open)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Option key={PLACEHOLDER} value={PLACEHOLDER}>
        {PLACEHOLDER}
      </Option>
      {options.map(o => (
        <Option key={o}>{o}</Option>
      ))}
    </Dropdown>
  );
}
