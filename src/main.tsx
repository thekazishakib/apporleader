import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './context/ToastContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </HelmetProvider>
  </StrictMode>,
);
