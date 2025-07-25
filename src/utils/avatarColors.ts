// src/utils/avatarColors.ts
// Central mapping for assignee avatar colors (Fluent UI v9)
export const assigneeAvatarColors: Record<string, string> = {
  'Alex Morrison': '#E57373', // Red
  'Priya Patel': '#81C784', // Green
  "Daniel O'Sullivan": '#64B5F6', // Blue
  'Sadia Khan': '#FFB74D', // Orange
  'Michael Grant': '#BA68C8', // Purple
  'Emma Thompson': '#26C6DA', // Teal (saturated)
  'James Carter': '#EC407A', // Pink (saturated)
};

export function getAssigneeAvatarColor(name: string): string {
  return assigneeAvatarColors[name] || '#A1887F'; // Default brown
}
