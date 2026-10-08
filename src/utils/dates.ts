// Dates in the prototype data arrive as e.g. "18 August 2026". D365 date
// columns show them as DD/MM/YYYY, on forms and in grids alike.
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

function dateParts(date: string) {
  const [day, month, year] = date.split(' ');
  return { day: day.padStart(2, '0'), month: String(months.indexOf(month) + 1).padStart(2, '0'), year };
}

/** "18 August 2026" → "18/08/2026". */
export function d365Date(date: string) {
  const { day, month, year } = dateParts(date);
  return `${day}/${month}/${year}`;
}

/** "18 August 2026" → "20260818", for sorting. */
export function sortableDate(date: string) {
  const { day, month, year } = dateParts(date);
  return `${year}${month}${day}`;
}
