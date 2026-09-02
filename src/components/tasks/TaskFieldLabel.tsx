// src/components/tasks/TaskFieldLabel.tsx
// A task-form field label. The task forms lay their labels out themselves (a
// fixed-width column beside the control) rather than using Field's own label.
// Field-level markers live beside the input in FieldDecorations.
import type { ReactNode } from 'react';
import { Text } from '@fluentui/react-components';

interface TaskFieldLabelProps {
  className?: string;
  children: ReactNode;
}

export default function TaskFieldLabel({
  className,
  children,
}: TaskFieldLabelProps) {
  return <Text className={className}>{children}</Text>;
}
