// Custom Hook - Autenticação
// Seguindo princípios KISS

import { useState, useEffect } from 'react';
import { serviceFactory } from '../../infrastructure/api/services/serviceFactory';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  error: string | null;
  authenticate: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authenticate = async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      const success = await serviceFactory.authenticate();
      setIsAuthenticated(success);
      
      if (!success) {
        setError('Falha na autenticação com a API');
      }
    } catch (err) {
      setError('Erro ao autenticar');
      setIsAuthenticated(false);
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  return {
    isAuthenticated,
    isAuthenticating,
    error,
    authenticate,
  };
};
