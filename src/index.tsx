// Entry Point - React 18

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './presentation/contexts/ThemeContext';
import { App } from './presentation/pages/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './presentation/styles/theme.css';
import './presentation/styles/nav-icons.css';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find root element');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
