// Interaction states of the D365 read-only subgrid, shared by every subgrid:
// a light grey row with a darker grey cell under the pointer; a light blue
// selected row (darker blue on hover); a dark border round a clicked cell until
// focus moves elsewhere; and a blue outline on a column header under the
// pointer. Data cells need tabIndex={0} so a click can focus them. The pressed
// state Fluent's Table adds is pinned to the hover colours, since D365 has none.
import { makeStyles, tokens } from '@fluentui/react-components';

const ROW_HOVER = '#f5f5f5';
const CELL_HOVER = '#e0e0e0';
const SELECTED = '#ebf3fc';
const SELECTED_HOVER = '#cfe4fa';
const SELECTED_CELL_HOVER = '#bccbdc';

export const useSubgridStyles = makeStyles({
  row: {
    cursor: 'default',
    ':hover': { backgroundColor: ROW_HOVER },
    ':active': { backgroundColor: ROW_HOVER },
    ':hover:active': { backgroundColor: ROW_HOVER },
  },
  selectedRow: {
    backgroundColor: SELECTED,
    ':hover': { backgroundColor: SELECTED_HOVER },
    ':active': { backgroundColor: SELECTED_HOVER },
    ':hover:active': { backgroundColor: SELECTED_HOVER },
  },
  cell: {
    ':hover': { backgroundColor: CELL_HOVER },
    ':focus': {
      outline: `2px solid ${tokens.colorNeutralForeground1}`,
      outlineOffset: '-2px',
      borderRadius: tokens.borderRadiusMedium,
    },
  },
  selectedCell: { ':hover': { backgroundColor: SELECTED_CELL_HOVER } },
  headerCell: {
    ':hover': {
      outline: '1px solid #0078d4',
      outlineOffset: '-1px',
      borderRadius: tokens.borderRadiusMedium,
    },
  },
});
