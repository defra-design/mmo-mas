// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeIcons } from '@fluentui/react';   // NEW
initializeIcons();                                   // NEW

import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);