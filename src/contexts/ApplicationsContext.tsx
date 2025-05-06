import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
} from 'react';
import { useApiMutation } from '../hooks/useApiQuery';

// --- Types ---

interface Application {
  _id: string;
  user: { username: string; email: string };
  status: string;
  createdAt: string;
  jobPost: { title: string };
}

interface ApplicationsState {
  applications: Application[];
  loading: boolean;
  error: string | null;
}

type ApplicationsAction =
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_APPLICATION_STATUS'; payload: { id: string; status: string } };

interface ApplicationsContextType {
  state: ApplicationsState;
  dispatch: Dispatch<ApplicationsAction>;
  rejectApplication: (applicationId: string) => Promise<void>;
}

// --- Reducer & Initial State ---

const initialState: ApplicationsState = {
  applications: [],
  loading: false,
  error: null,
};

function applicationsReducer(
  state: ApplicationsState,
  action: ApplicationsAction
): ApplicationsState {
  switch (action.type) {
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'UPDATE_APPLICATION_STATUS':
      return {
        ...state,
        applications: state.applications.map((app) =>
          app._id === action.payload.id
            ? { ...app, status: action.payload.status }
            : app
        ),
      };
    default:
      return state;
  }
}

// --- Context Creation ---

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(
  undefined
);

// --- Provider ---

export const ApplicationsProvider: React.FC<{
  children: ReactNode;
  companyId?: string;
}> = ({ children, companyId }) => {
  const [state, dispatch] = useReducer(
    applicationsReducer,
    initialState
  );

  // Only set up mutation if companyId is provided
  const rejectApplicationMutation = companyId
    ? useApiMutation(
        '/jobApplications/company/:companyId/:applicationId',
        'PUT',
        ['companyApplications', companyId]
      )
    : null;

  const rejectApplication = async (applicationId: string) => {
    if (!companyId || !rejectApplicationMutation) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Cannot reject application: no company ID available',
      });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      await rejectApplicationMutation.mutateAsync({
        __params: { companyId, applicationId },
        status: 'rejected',
      });

      dispatch({
        type: 'UPDATE_APPLICATION_STATUS',
        payload: { id: applicationId, status: 'rejected' },
      });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (err: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: err?.message || 'Failed to reject application',
      });
    }
  };

  return (
    <ApplicationsContext.Provider
      value={{ state, dispatch, rejectApplication }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
};

// --- Hook to consume context ---

export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error(
      'useApplications must be used within an ApplicationsProvider'
    );
  }
  return context;
};
