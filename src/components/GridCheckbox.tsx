// The row-select checkbox of a D365 grid: Fluent's Checkbox, with the D365
// hover state — a grey square behind the box and a grey preview tick while it
// is unticked. Fluent only draws the tick once checked, so the indicator always
// carries it here and the unticked state hides it until hover.
import { Checkbox, checkboxClassNames, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import type { CheckboxProps } from '@fluentui/react-components';
import { Checkmark12Filled, Square12Filled } from '@fluentui/react-icons';

const indicator = `& .${checkboxClassNames.indicator}`;

const useStyles = makeStyles({
  root: { borderRadius: tokens.borderRadiusMedium },
  hover: { ':hover': { backgroundColor: '#e0e0e0' } },
  unticked: { [indicator]: { color: 'transparent' } },
  preview: { ':hover': { [indicator]: { color: tokens.colorNeutralForeground3 } } },
});

type Props = Pick<CheckboxProps, 'checked' | 'disabled' | 'onChange' | 'aria-label'>;

export default function GridCheckbox({ checked = false, ...props }: Props) {
  const styles = useStyles();
  return (
    <Checkbox
      {...props}
      checked={checked}
      className={mergeClasses(
        styles.root,
        !props.disabled && styles.hover,
        !checked && styles.unticked,
        !checked && !props.disabled && styles.preview,
      )}
      indicator={{ children: checked === 'mixed' ? <Square12Filled /> : <Checkmark12Filled /> }}
    />
  );
}
