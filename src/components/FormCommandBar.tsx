// src/components/FormCommandBar.tsx
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  mergeClasses,
} from '@fluentui/react-components';
import { ArrowLeftRegular, OpenRegular, SaveRegular, DismissSquareRegular, ArrowExportRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  bar: {
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    marginTop: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalM,
  },
  divider: {
    width: '1px',
    height: '20px',
    backgroundColor: tokens.colorNeutralStroke2,
    margin: `0 ${tokens.spacingHorizontalXS}`,
  },
  // Plain, non-interactive back icon shown when there is nowhere to go back to.
  backIconInactive: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
    fontSize: '20px',
    color: tokens.colorNeutralForegroundDisabled,
  },
});

interface FormCommandBarProps {
  saveLabel?: string;
  onSave?: () => void;
  showReject?: boolean;
  /** Show the transfer command; clicking it calls onTransfer. */
  showTransfer?: boolean;
  /** Label for the transfer command — it changes as the transfer progresses. */
  transferLabel?: string;
  /** Icon for the transfer command; changes with the label (see MarineCaseSummary). */
  transferIcon?: ReactElement;
  onTransfer?: () => void;
  /** Route the back chevron returns to. When omitted, back is disabled. */
  backTo?: string;
}

export default function FormCommandBar({
  saveLabel,
  onSave,
  showReject,
  showTransfer,
  transferLabel = 'Transfer to MCMS',
  transferIcon = <ArrowExportRegular />,
  onTransfer,
  backTo,
}: FormCommandBarProps) {
  const styles = useStyles();
  const navigate = useNavigate();

  return (
    <div className={mergeClasses(styles.bar, 'elevated-panel')}>
      {backTo ? (
        <Button
          appearance="subtle"
          icon={<ArrowLeftRegular />}
          aria-label="Back"
          onClick={() => navigate(backTo)}
        />
      ) : (
        <span className={styles.backIconInactive} aria-hidden="true">
          <ArrowLeftRegular />
        </span>
      )}
      {/* D365 "Open in new window" pop-out: reopens the current record in a new
          browser tab (same URL, so it lands on the record's default tab). */}
      <Button
        appearance="subtle"
        icon={<OpenRegular />}
        aria-label="Open in new window"
        onClick={() => window.open(window.location.href, '_blank', 'noopener,noreferrer')}
      />
      {saveLabel && (
        <>
          <div className={styles.divider} />
          <Button appearance="subtle" icon={<SaveRegular />} onClick={onSave}>
            {saveLabel}
          </Button>
        </>
      )}
      {showTransfer && (
        <Button appearance="subtle" icon={transferIcon} onClick={onTransfer}>
          {transferLabel}
        </Button>
      )}
      {showReject && (
        <Button appearance="subtle" icon={<DismissSquareRegular />}>
          Reject application
        </Button>
      )}
    </div>
  );
}
