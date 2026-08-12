// src/components/tasks/UrlField.tsx
// Read-only rendering of an OOB D365 URL column: the raw URL truncated inside the
// standard grey field box, with the native globe "launch" button on the right that
// opens it in a new window. This is exactly how the case's Application URL renders
// in the real D365 instance — a URL column has no friendly display text OOB, so
// don't swap the value for a label without accepting a web-resource/PCF cost.
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Link,
} from '@fluentui/react-components';
import { GlobeRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  box: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.padding('0', tokens.spacingHorizontalXS, '0', tokens.spacingHorizontalM),
    minHeight: '32px',
  },
  url: {
    flexGrow: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: tokens.fontSizeBase300,
  },
  launch: { flexShrink: 0 },
});

interface UrlFieldProps {
  url: string;
  /** Accessible name for the launch button, e.g. "Open redaction in a new window". */
  launchLabel: string;
  /** Prototype only: the target doesn't exist yet, so clicking does nothing. */
  inert?: boolean;
}

export default function UrlField({ url, launchLabel, inert = false }: UrlFieldProps) {
  const styles = useStyles();
  const open = () => {
    if (!inert) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.box}>
      <Link
        className={styles.url}
        href={inert ? undefined : url}
        target={inert ? undefined : '_blank'}
        rel="noopener noreferrer"
        title={url}
        onClick={e => {
          if (inert) e.preventDefault();
        }}
      >
        {url}
      </Link>
      <Button
        className={styles.launch}
        appearance="subtle"
        size="small"
        icon={<GlobeRegular />}
        aria-label={launchLabel}
        onClick={open}
      />
    </div>
  );
}
