// src/components/CdpFrame.tsx
import { makeStyles } from '@fluentui/react-components';

/**
 * Renders a CDP (Core Development Platform) application-data page inside an
 * iframe, mimicking how the real D365 system embeds CDP-hosted HTML. The HTML
 * and its CSS live in `public/cdp/` and are served as plain static files.
 *
 * The frame fills the height left under the sticky case header and scrolls its
 * own content, so longer sections stay readable without resizing the shell.
 */
const useStyles = makeStyles({
  frame: {
    flexGrow: 1,
    minHeight: 0,
    width: '100%',
    border: 'none',
    display: 'block',
  },
});

interface CdpFrameProps {
  /** Path under the served root, e.g. "/cdp/project-details.html". */
  src: string;
  /** Accessible title for the embedded document. */
  title: string;
}

export default function CdpFrame({ src, title }: CdpFrameProps) {
  const styles = useStyles();
  return <iframe className={styles.frame} src={src} title={title} />;
}
