import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style/index.scss';
import { UserProvider } from "./contexts/UserContext";
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import { JobApplicationProvider } from './contexts/JobApplicationContext.tsx'; // Fixed import

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <UserProvider>
          <JobApplicationProvider>
            <App />
          </JobApplicationProvider>
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
