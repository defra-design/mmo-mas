// src/components/tasks/TaskFieldLabel.tsx
// A task-form field label. The task forms lay their labels out themselves (a
// fixed-width column beside the control) rather than using Field's own label, so
// the red asterisk D365 draws on a business-required field lives here. The
// padlock for a locked record is attached to the field itself — see FieldLock.
import type { ReactNode } from 'react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  asterisk: {
    color: tokens.colorStatusDangerForeground1,
    marginLeft: tokens.spacingHorizontalXXS,
  },
});

interface TaskFieldLabelProps {
  className?: string;
  /** Business-required field — draws the red asterisk. */
  required?: boolean;
  children: ReactNode;
}

export default function TaskFieldLabel({
  className,
  required = false,
  children,
}: TaskFieldLabelProps) {
  const styles = useStyles();
  return (
    <Text className={className}>
      {children}
      {required && (
        <span className={styles.asterisk} aria-hidden="true">
          *
        </span>
      )}
    </Text>
  );
}
