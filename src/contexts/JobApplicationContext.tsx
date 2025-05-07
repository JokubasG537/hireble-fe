import React, { createContext, useReducer, useContext, ReactNode } from 'react';

export interface JobApplication {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  } | string;
  jobPost: {
    _id: string;
    title: string;
    company: string;
  } | string;
  resume: {
    _id: string;
    title: string;
    fileUrl: string;
  } | string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobApplicationState {
  applications: JobApplication[];
  currentApplication: JobApplication | null;
  loading: boolean;
  error: string | null;
}

type JobApplicationAction =
  | { type: 'SET_APPLICATIONS'; payload: JobApplication[] }
  | { type: 'SET_CURRENT_APPLICATION'; payload: JobApplication }
  | { type: 'CLEAR_CURRENT_APPLICATION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: JobApplicationState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
};

const JobApplicationStateContext = createContext<JobApplicationState | undefined>(undefined);
const JobApplicationDispatchContext = createContext<React.Dispatch<JobApplicationAction> | undefined>(undefined);

function jobApplicationReducer(state: JobApplicationState, action: JobApplicationAction): JobApplicationState {
  switch (action.type) {
    case 'SET_APPLICATIONS':
      return {
        ...state,
        applications: action.payload,
        loading: false,
      };
    case 'SET_CURRENT_APPLICATION':
      return {
        ...state,
        currentApplication: action.payload,
      };
    case 'CLEAR_CURRENT_APPLICATION':
      return {
        ...state,
        currentApplication: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}

export const JobApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(jobApplicationReducer, initialState);

  return (
    <JobApplicationStateContext.Provider value={state}>
      <JobApplicationDispatchContext.Provider value={dispatch}>
        {children}
      </JobApplicationDispatchContext.Provider>
    </JobApplicationStateContext.Provider>
  );
};

export const useJobApplicationState = () => {
  const context = useContext(JobApplicationStateContext);
  if (context === undefined) {
    throw new Error('useJobApplicationState must be used within a JobApplicationProvider');
  }
  return context;
};

export const useJobApplicationDispatch = () => {
  const context = useContext(JobApplicationDispatchContext);
  if (context === undefined) {
    throw new Error('useJobApplicationDispatch must be used within a JobApplicationProvider');
  }
  return context;
};