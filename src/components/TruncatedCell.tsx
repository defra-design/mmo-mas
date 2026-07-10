// src/components/TruncatedCell.tsx
// A single-line grid cell that truncates with an ellipsis and shows a Fluent
// hover card with the full value — but only when the text is actually clipped,
// and with no delay. This is the D365 read-only grid behaviour. The native
// `title` attribute is not a substitute: it waits ~1s and fires even when the
// whole value is already on screen.
import { useRef, useState } from 'react';
import { makeStyles, mergeClasses, Tooltip } from '@fluentui/react-components';

const useStyles = makeStyles({
  cellText: {
    display: 'block',
    minWidth: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

type TruncatedCellProps = {
  value: string;
  /** Extra classes for the text element (e.g. a muted or link colour). */
  className?: string;
  /** When given, the cell renders as a hyperlink button that opens the record. */
  onClick?: () => void;
};

export default function TruncatedCell({ value, className, onClick }: TruncatedCellProps) {
  const styles = useStyles();
  const triggerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  const setRef = (el: HTMLElement | null) => {
    triggerRef.current = el;
  };

  const inner = onClick ? (
    <button
      ref={setRef}
      onClick={onClick}
      className={mergeClasses('link-button', styles.cellText, className)}
    >
      {value}
    </button>
  ) : (
    <span ref={setRef} className={mergeClasses(styles.cellText, className)}>
      {value}
    </span>
  );

  return (
    <Tooltip
      content={value}
      relationship="label"
      positioning="below"
      withArrow={false}
      showDelay={0}
      visible={open}
      onVisibleChange={(_, data) => {
        const el = triggerRef.current;
        // Only show when the text is clipped (scroll width exceeds visible width).
        setOpen(data.visible && !!el && el.scrollWidth > el.clientWidth);
      }}
    >
      {inner}
    </Tooltip>
  );
}
