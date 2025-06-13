import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style/index.scss';
import { UserProvider } from "./contexts/UserContext";
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import { JobApplicationProvider } from './contexts/JobApplicationContext.tsx';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={new QueryClient()}>
        <MantineProvider>
        <UserProvider>
          <JobApplicationProvider>
            <App />
          </JobApplicationProvider>
        </UserProvider>
        </MantineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
