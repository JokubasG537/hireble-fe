import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { useApiQuery, useApiMutation } from '../hooks/useApiQuery';

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
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_APPLICATION'; payload: JobApplication }
  | { type: 'UPDATE_APPLICATION'; payload: JobApplication }
  | { type: 'DELETE_APPLICATION'; payload: string };

const initialState: JobApplicationState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null
};

// Fixed context type definitions
const JobApplicationStateContext = createContext<JobApplicationState | undefined>(undefined);
const JobApplicationDispatchContext = createContext<React.Dispatch<JobApplicationAction> | undefined>(undefined);

function jobApplicationReducer(state: JobApplicationState, action: JobApplicationAction): JobApplicationState {
  switch (action.type) {
    case 'SET_APPLICATIONS':
      return {
        ...state,
        applications: action.payload,
        loading: false
      };
    case 'SET_CURRENT_APPLICATION':
      return {
        ...state,
        currentApplication: action.payload
      };
    case 'CLEAR_CURRENT_APPLICATION':
      return {
        ...state,
        currentApplication: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'ADD_APPLICATION':
      return {
        ...state,
        applications: [...state.applications, action.payload]
      };
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(app =>
          app._id === action.payload._id ? action.payload : app
        ),
        currentApplication: state.currentApplication?._id === action.payload._id
          ? action.payload
          : state.currentApplication
      };
    case 'DELETE_APPLICATION':
      return {
        ...state,
        applications: state.applications.filter(app => app._id !== action.payload),
        currentApplication: state.currentApplication?._id === action.payload
          ? null
          : state.currentApplication
      };
    default:
      return state;
  }
}

export const JobApplicationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(jobApplicationReducer, initialState);

  // Fetch user applications when the provider mounts
  const { data, isLoading, error } = useApiQuery(
    ['userApplications'],
    '/jobApplications',
    {
      enabled: true
    }
  );

  useEffect(() => {
    if (isLoading) {
      dispatch({ type: 'SET_LOADING', payload: true });
    }

    if (data) {
      dispatch({ type: 'SET_APPLICATIONS', payload: data.applications });
    }

    if (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [data, isLoading, error]);

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

// Utility hooks for common operations
export const useCompanyApplications = (companyId: string) => {
  const dispatch = useJobApplicationDispatch();

  return useApiQuery(
    ['companyApplications', companyId],
    `/jobApplications/company/${companyId}`,
    {
      enabled: !!companyId,
      onSuccess: (data) => {
        dispatch({ type: 'SET_APPLICATIONS', payload: data.applications });
      },
      onError: (error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
  );
};

export const useUpdateApplicationStatus = () => {
  const dispatch = useJobApplicationDispatch();

  const mutation = useApiMutation(
    (data: { applicationId: string; status: string; notes?: string }) => ({
      url: `/jobApplications/company/${data.applicationId}`,
      method: 'PUT',
      data: { status: data.status, notes: data.notes }
    })
  );

  return {
    ...mutation,
    updateStatus: async (applicationId: string, status: string, notes?: string) => {
      try {
        const result = await mutation.mutateAsync({ applicationId, status, notes });
        if (result.application) {
          dispatch({ type: 'UPDATE_APPLICATION', payload: result.application });
        }
        return result;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    }
  };
};

export const useDeleteApplication = () => {
  const dispatch = useJobApplicationDispatch();

  const mutation = useApiMutation(
    (applicationId: string) => ({
      url: `/jobApplications/${applicationId}`,
      method: 'DELETE'
    })
  );

  return {
    ...mutation,
    deleteApplication: async (applicationId: string) => {
      try {
        await mutation.mutateAsync(applicationId);
        dispatch({ type: 'DELETE_APPLICATION', payload: applicationId });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    }
  };
};
