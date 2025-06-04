import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
} from 'react';
import { useApiMutation } from '../hooks/useApiQuery';

interface Application {
  _id: string;
  user: { username: string; email: string };
  status: string;
  createdAt: string;
  jobPost: { title: string };
  resume: { title: string; fileUrl: string}
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
  | { type: 'UPDATE_APPLICATION_STATUS'; payload: { id: string; status: string } }
  | { type: 'DELETE_APPLICATION'; payload: string };

type ApplicationsContextType = {
  state: ApplicationsState;
  dispatch: Dispatch<ApplicationsAction>;
  rejectApplication: (applicationId: string) => Promise<void>;
};

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
        applications: state.applications.map(app =>
          app._id === action.payload.id
            ? { ...app, status: action.payload.status }
            : app
        ),
      };
    case 'DELETE_APPLICATION':
      return {
        ...state,
        applications: state.applications.filter(app => app._id !== action.payload),
      };
    default:
      return state;
  }
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(
  undefined
);

export const ApplicationsProvider: React.FC<{
  children: ReactNode;
  companyId: string;
}> = ({ children, companyId }) => {
  const [state, dispatch] = useReducer(applicationsReducer, initialState);

  const rejectMutation = useApiMutation(
    '/jobApplications/company/:companyId/:applicationId',
    'PUT',
    ['companyApplications', companyId]
  );

  const deleteMutation = useApiMutation(
    '/jobApplications/:applicationId',
    'DELETE',
    ['companyApplications', companyId]
  );

  const rejectApplication = async (applicationId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await rejectMutation.mutateAsync({
        __params: { companyId, applicationId },
        status: 'rejected',
      });

      await deleteMutation.mutateAsync({
        __params: { applicationId },
      });

      dispatch({ type: 'DELETE_APPLICATION', payload: applicationId });
    } catch (err: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: err?.message ?? 'Failed to reject and delete',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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

export const useApplications = () => {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) {
    throw new Error(
      'useApplications must be used within an ApplicationsProvider'
    );
  }
  return ctx;
};
