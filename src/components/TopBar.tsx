// src/components/TopBar.tsx
import { IconButton, mergeStyleSets } from '@fluentui/react';
import { Persona, PersonaSize } from '@fluentui/react';

const classes = mergeStyleSets({
  bar: {
    height: 48,
    background: '#001640',        // Dynamics-style navy
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
  },
  left: { display: 'flex', alignItems: 'center', gap: 12 },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  title: { fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap' },
});

// Proper IButtonStyles object for the icon buttons
const buttonStyles = {
  root: { color: 'white' },
  rootHovered: { background: 'rgba(255,255,255,0.12)' },
};

export default function TopBar() {
  return (
    <header className={classes.bar}>
      {/* left section: waffle & product title */}
      <div className={classes.left}>
        <IconButton iconProps={{ iconName: 'GlobalNavButton' }} styles={buttonStyles} />
        <span className={classes.title}>Get permission for marine work</span>
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