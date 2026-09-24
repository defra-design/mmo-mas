import { useRef, useState } from 'react';
import {
  Button, Popover, PopoverSurface, PopoverTrigger, ToolbarButton,
  makeStyles, mergeClasses, shorthands,
} from '@fluentui/react-components';
import { ChevronDownRegular } from '@fluentui/react-icons';

const colors = [
  '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#f1c40f',
  '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f39c12',
  '#e67e22', '#e74c3c', '#ecf0f1', '#bdc3c7', '#95a5a6', '#ffffff',
  '#d35400', '#c0392b', '#aeb7ba', '#7f8c8d', '#b2b2b2', '#000000',
];

const useStyles = makeStyles({
  trigger: { minWidth: '42px', width: '42px', height: '32px', ...shorthands.padding('0') },
  openTrigger: { backgroundColor: '#fff', ...shorthands.border('1px', 'solid', '#323130') },
  triggerContent: { display: 'flex', alignItems: 'center', gap: '2px' },
  letter: { fontSize: '19px', lineHeight: '19px', fontWeight: 600 },
  underlined: { textDecorationLine: 'underline', textDecorationThickness: '2px' },
  boxed: { color: '#fff', backgroundColor: '#444', width: '20px', textAlign: 'center' },
  chevron: { fontSize: '11px' },
  surface: { width: '208px', ...shorthands.padding('8px'), borderRadius: 0 },
  automatic: {
    display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
    width: '100%', height: '32px', gap: '12px', borderRadius: 0,
    ...shorthands.border('1px', 'solid', '#8ab4ec'),
  },
  autoSwatch: { width: '21px', height: '21px', backgroundColor: '#333' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '3px', marginTop: '8px' },
  swatch: { width: '27px', height: '25px', minWidth: 0, borderRadius: 0, ...shorthands.padding('0') },
  more: { width: '100%', marginTop: '10px', borderRadius: 0 },
  colorInput: { position: 'absolute', width: '1px', height: '1px', opacity: 0 },
});

type Props = {
  kind: 'text' | 'background';
  onSelect: (color: string) => void;
  rememberSelection: () => void;
};

export default function RichTextColorPicker({ kind, onSelect, rememberSelection }: Props) {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const colorInput = useRef<HTMLInputElement>(null);
  const label = kind === 'text' ? 'Text colour' : 'Background colour';

  const select = (color: string) => {
    onSelect(color);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(_, data) => setOpen(data.open)} positioning="below-start">
      <PopoverTrigger disableButtonEnhancement>
        <ToolbarButton
          className={mergeClasses(styles.trigger, open && styles.openTrigger)}
          appearance="subtle" aria-label={label} title={label}
          onMouseDown={rememberSelection}
          icon={
            <span className={styles.triggerContent}>
              <span className={`${styles.letter} ${kind === 'text' ? styles.underlined : styles.boxed}`}>
                A
              </span>
              <ChevronDownRegular className={styles.chevron} />
            </span>
          }
        />
      </PopoverTrigger>
      <PopoverSurface className={styles.surface}>
        <Button className={styles.automatic} appearance="subtle" onClick={() => select(kind === 'text' ? '#000000' : '#ffffff')}>
          <span className={styles.autoSwatch} /> Automatic
        </Button>
        <div className={styles.grid} role="group" aria-label={`${label} palette`}>
          {colors.map((color, index) => (
            <Button
              key={`${color}-${index}`} className={styles.swatch} appearance="outline"
              aria-label={`${label} ${color}`} title={color}
              style={{ backgroundColor: color }} onClick={() => select(color)}
            />
          ))}
        </div>
        <Button className={styles.more} appearance="subtle" onClick={() => colorInput.current?.click()}>
          More Colors...
        </Button>
        <input
          ref={colorInput} className={styles.colorInput} type="color" aria-label={`More ${label.toLowerCase()}`}
          onChange={event => select(event.target.value)}
        />
      </PopoverSurface>
    </Popover>
  );
}
