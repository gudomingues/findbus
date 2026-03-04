// Main App Component - Seguindo KISS e componentização

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/common/Loading';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { LineView } from '../components/features/LineView';
import { StopView } from '../components/features/StopView';
import { CorridorView } from '../components/features/CorridorView';
import './App.css';

type TabType = 'line' | 'stop' | 'corridor';

export const App: React.FC = () => {
  const { isAuthenticated, isAuthenticating, error: authError } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('line');

  // Early Return Pattern - Loading
  if (isAuthenticating) {
    return <Loading message="Conectando à API SPTrans..." fullScreen />;
  }

  // Early Return Pattern - Error
  if (authError || !isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Erro de Autenticação</h4>
          <p>{authError || 'Não foi possível autenticar com a API do Olho Vivo'}</p>
          <hr />
          <p className="mb-0">
            Verifique se o token está configurado corretamente no arquivo .env
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="findbus-app">
        <header className="app-header">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-0">FindBus</h1>
                <p className="mb-0 text-muted">Sistema de Informações de Transporte Público</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <nav className="app-nav">
          <div className="container">
            <ul className="nav nav-tabs border-0">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'line' ? 'active' : ''}`}
                  onClick={() => setActiveTab('line')}
                  type="button"
                >
                  De Olho na Linha
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'stop' ? 'active' : ''}`}
                  onClick={() => setActiveTab('stop')}
                  type="button"
                >
                  De Olho no Ponto
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'corridor' ? 'active' : ''}`}
                  onClick={() => setActiveTab('corridor')}
                  type="button"
                >
                  De Olho na Via
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <main className="app-main">
          <div className="container">
            {activeTab === 'line' && <LineView />}
            {activeTab === 'stop' && <StopView />}
            {activeTab === 'corridor' && <CorridorView />}
          </div>
        </main>

        <footer className="app-footer">
          <div className="container text-center">
            <small className="text-muted">
              Dados fornecidos pela API Olho Vivo - SPTrans
            </small>
          </div>
        </footer>
      </div>
    </>
  );
};
