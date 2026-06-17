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
  'Sam Evans': '#5C6BC0', // Indigo
  // Active case-list officers — distinct hues so the avatars don't all look alike.
  'Rachel Patel': '#81C784', // Green
  'Gary Whitfield': '#AB47BC', // Purple
  'James Okafor': '#64B5F6', // Blue
};

export function getAssigneeAvatarColor(name: string): string {
  return assigneeAvatarColors[name] || '#A1887F'; // Default brown
}

// Pick black or white initials so they stay legible on any avatar colour.
export function getContrastText(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#323130' : '#ffffff';
}
