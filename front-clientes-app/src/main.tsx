import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClienteProvider } from './context/ClienteContext';
import { AppRoutes } from './routes';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClienteProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ClienteProvider>
  </React.StrictMode>
);
