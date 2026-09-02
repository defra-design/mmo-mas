// D365 places field-level decorations immediately before the control rather
// than appending them to the label. Business-required comes first, followed by
// the read-only padlock when both apply.
import { makeStyles, tokens } from '@fluentui/react-components';
import FieldLock from './FieldLock';

const useStyles = makeStyles({
  decorations: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalXXS,
    flexShrink: 0,
    width: '26px',
    marginTop: '2px',
  },
  asterisk: {
    color: tokens.colorStatusDangerForeground1,
    lineHeight: tokens.lineHeightBase300,
  },
});

type Props = {
  required?: boolean;
  locked?: boolean;
};

export default function FieldDecorations({ required = false, locked = false }: Props) {
  const styles = useStyles();

  return (
    <span className={styles.decorations} aria-hidden={!locked || undefined}>
      {required && (
        <span className={styles.asterisk} aria-hidden="true">
          *
        </span>
      )}
      {locked && <FieldLock />}
    </span>
  );
}
