// Theme Toggle Button Component

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <span className="theme-label">{theme === 'light' ? 'Claro' : 'Escuro'}</span>
      <button
        className={`theme-switch ${theme === 'dark' ? 'active' : ''}`}
        onClick={toggleTheme}
        title={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
        aria-label="Alternar tema"
      >
        <span className="theme-slider"></span>
      </button>
    </div>
  );
};
