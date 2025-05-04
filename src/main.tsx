import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { UserProvider } from "./contexts/UserContext";
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JobApplicationProvider } from '../src/contexts/JobApplicationContext.tsx';
import App from './App.tsx'

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
)
