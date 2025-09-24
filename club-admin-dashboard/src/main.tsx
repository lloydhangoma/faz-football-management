// src/main.tsx (club)
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const el = document.getElementById('root');
if (!el) throw new Error('Root element with id="root" not found');

createRoot(el).render(
  <React.StrictMode>
    {/* Vite config sets base: '/club/' so BASE_URL is '/club/' */}
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
