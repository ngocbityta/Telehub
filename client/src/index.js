import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import { SocketProvider } from './context/SocketProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { ErrorBoundary } from "react-error-boundary";
import Loading from './components/Loading';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
  <ErrorBoundary fallback={<Loading />}>
    <AuthProvider>

      <SocketProvider>

        <ThemeProvider>

          <BrowserRouter>
            <App />
          </BrowserRouter>

        </ThemeProvider>

      </SocketProvider>

    </AuthProvider>
  </ErrorBoundary>
  // </React.StrictMode >
);


