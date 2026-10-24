import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App';
import { AuthProvider, SESSION_EXPIRED } from '@/auth/AuthContext';
import { ApiError } from '@/lib/api';

// Le cache des données serveur, partagé par toute l'application
const queryClient = new QueryClient({
  // Toute requête qui reçoit 401 signale une session expirée (AuthProvider l'écoute)
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        window.dispatchEvent(new Event(SESSION_EXPIRED));
      }
    },
  }),
  defaultOptions: {
    queries: {
      // Une donnée reste « fraîche » 30 secondes : pas de nouvel appel pendant ce temps
      staleTime: 30_000,
      // Une erreur 4xx ne s'arrangera pas en réessayant : on ne retente que les erreurs serveur
      retry: (failureCount, error) =>
        failureCount < 2 && !(error instanceof ApiError && error.status < 500),
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Le routeur lit l'adresse du navigateur et la donne aux composants */}
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
