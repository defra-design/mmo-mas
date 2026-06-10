// src/components/FormCommandBar.tsx
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  mergeClasses,
} from '@fluentui/react-components';
import { ArrowLeftRegular, OpenRegular, SaveRegular } from '@fluentui/react-icons';

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
});

interface FormCommandBarProps {
  saveLabel?: string;
  onSave?: () => void;
}

export default function FormCommandBar({ saveLabel, onSave }: FormCommandBarProps) {
  const styles = useStyles();
  const navigate = useNavigate();

  return (
    <div className={mergeClasses(styles.bar, 'elevated-panel')}>
      <Button
        appearance="subtle"
        icon={<ArrowLeftRegular />}
        aria-label="Back"
        onClick={() => navigate(-1)}
      />
      <Button appearance="subtle" icon={<OpenRegular />} aria-label="Open in new window" />
      {saveLabel && (
        <>
          <div className={styles.divider} />
          <Button appearance="subtle" icon={<SaveRegular />} onClick={onSave}>
            {saveLabel}
          </Button>
        </>
      )}
    </div>
  );
}
