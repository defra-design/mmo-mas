// src/components/TopBar.tsx
import { IconButton, mergeStyleSets } from '@fluentui/react';
import { Avatar } from '@fluentui/react-components';
import { useNavigate } from 'react-router-dom';

const classes = mergeStyleSets({
  bar: {
    height: 48,
    background: '#001640',        // Dynamics-style navy
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
  },
  left: { display: 'flex', alignItems: 'center', gap: 12 },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  title: { fontSize: 16, whiteSpace: 'nowrap' },
  titleBrand: { fontWeight: 700 },
  titleDivider: { opacity: 0.5, margin: '0 6px' },
  titleName: { fontWeight: 600 },
  waffle: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 4px)',
    gridTemplateRows: 'repeat(3, 4px)',
    gap: 3,
    padding: 8,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  waffleDot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: 'white',
  },
});

// Proper IButtonStyles object for the icon buttons
const buttonStyles = {
  root: { color: 'white' },
  rootHovered: { background: 'rgba(255,255,255,0.12)' },
};

export default function TopBar() {
  const navigate = useNavigate();
  return (
    <header className={classes.bar}>
      {/* left section: waffle (links to index) & product title */}
      <div className={classes.left}>
        <button
          className={classes.waffle}
          aria-label="Back to home"
          onClick={() => navigate('/')}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={classes.waffleDot} />
          ))}
        </button>
        <span className={classes.title}>
          <span className={classes.titleBrand}>Dynamics 365</span>
          <span className={classes.titleDivider}>|</span>
          <span className={classes.titleName}>Marine Applications System</span>
        </span>
      </div>

      {/* right section: placeholder actions */}
      <div className={classes.right}>
        <IconButton iconProps={{ iconName: 'Search' }}     styles={buttonStyles} />
        <IconButton iconProps={{ iconName: 'Lightbulb' }}  styles={buttonStyles} />
        <IconButton iconProps={{ iconName: 'Add' }}        styles={buttonStyles} />
        <IconButton iconProps={{ iconName: 'Settings' }}   styles={buttonStyles} />
        <IconButton iconProps={{ iconName: 'Help' }}       styles={buttonStyles} />
        {/* Same v9 Avatar + "colorful" colour Sam Evans gets in the case list,
            so the signed-in user's colour matches everywhere. */}
        <Avatar name="Sam Evans" size={32} color="colorful" />
      </div>
    </header>
  );
}