import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Le routeur lit l'adresse du navigateur et la donne aux composants */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
