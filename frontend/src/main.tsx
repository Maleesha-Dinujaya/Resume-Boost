import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setAuthToken } from './services/api';

// expose for quick manual testing
// @ts-expect-error attach for console usage
window.setAuthToken = setAuthToken;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
