// src/components/GridRowSelect.tsx
import { makeStyles, Avatar, Checkbox } from '@fluentui/react-components';
import { d365Initials } from '../utils/initials';

// The leading slot of a modern D365 read-only grid row: it shows the record's
// coloured avatar at rest and swaps to a selection checkbox on row hover (or when
// the row is selected / select-all is on). The avatar and checkbox share one
// fixed-size slot so there's no layout shift when they swap.
const useStyles = makeStyles({
  slot: {
    width: '32px',
    minWidth: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});

interface GridRowSelectProps {
  /** Seeds the avatar colour and initials. */
  name: string;
  checked: boolean;
  /** Show the checkbox instead of the avatar (row hovered or selected). */
  showCheckbox: boolean;
  onToggle: (checked: boolean) => void;
  ariaLabel: string;
}

export default function GridRowSelect({
  name,
  checked,
  showCheckbox,
  onToggle,
  ariaLabel,
}: GridRowSelectProps) {
  const styles = useStyles();
  return (
    <span className={styles.slot}>
      {showCheckbox ? (
        <Checkbox
          checked={checked}
          onClick={e => e.stopPropagation()}
          onChange={(_, data) => onToggle(!!data.checked)}
          aria-label={ariaLabel}
        />
      ) : (
        <Avatar name={name} initials={d365Initials(name)} color="colorful" size={32} />
      )}
    </span>
  );
}
