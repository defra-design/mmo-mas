// src/components/tasks/RequiredLabel.tsx
// A task-form label carrying the red asterisk D365 puts beside a business-required
// field. The task forms lay their labels out themselves (fixed-width column beside
// the control) rather than using Field's own label, so the asterisk lives here.
import type { ReactNode } from 'react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  asterisk: {
    color: tokens.colorStatusDangerForeground1,
    marginLeft: tokens.spacingHorizontalXXS,
  },
});

export default function RequiredLabel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const styles = useStyles();
  return (
    <Text className={className}>
      {children}
      <span className={styles.asterisk} aria-hidden="true">
        *
      </span>
    </Text>
  );
}
