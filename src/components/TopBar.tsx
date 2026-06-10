// src/components/TopBar.tsx
import { IconButton, mergeStyleSets } from '@fluentui/react';
import { Persona, PersonaSize } from '@fluentui/react';
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
        <IconButton
          iconProps={{ iconName: 'GlobalNavButton' }}
          styles={buttonStyles}
          ariaLabel="Back to home"
          onClick={() => navigate('/')}
        />
        <span className={classes.title}>
          <span className={classes.titleBrand}>MMO</span>
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
        <Persona text="User" size={PersonaSize.size32} hidePersonaDetails />
      </div>
    </header>
  );
}