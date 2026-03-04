// Loading Component - Seguindo KISS

import React from 'react';
import './Loading.css';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = 'Carregando...', 
  fullScreen = false 
}) => {
  const content = (
    <div className="text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      {message && <p className="mt-3 text-muted">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        {content}
      </div>
    );
  }

  return content;
};
