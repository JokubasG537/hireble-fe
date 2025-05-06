import React, { useEffect } from 'react';
import { useApiQuery } from '../hooks/useApiQuery';
import { ApplicationsProvider, useApplications } from '../contexts/ApplicationsContext';

// Main component that uses the context
const CompanyApplications: React.FC = () => {
  // Fetch current company
  const { data: companyData, isLoading: isLoadingCompany } = useApiQuery(
    ['currentCompany'],
    `/companies/current/company`
  );

  if (isLoadingCompany) return <div>Loading company information...</div>;

  const companyId = companyData?._id;
  if (!companyId) return <div>No company found</div>;

  return (
    <ApplicationsProvider companyId={companyId}>
      <ApplicationsList companyId={companyId} />
    </ApplicationsProvider>
  );
};

// Component that displays applications and uses rejection functionality
const ApplicationsList: React.FC<{ companyId: string }> = ({ companyId }) => {
  const { state, dispatch, rejectApplication } = useApplications();
  const { applications, loading, error } = state;

  // Fetch applications
  const { data: applicationsData, isLoading } = useApiQuery(
    ['companyApplications', companyId],
    `/jobApplications/company/${companyId}`,
    !!companyId
  );

  // Update state when data changes
  useEffect(() => {
    if (applicationsData?.applications) {
      dispatch({ type: 'SET_APPLICATIONS', payload: applicationsData.applications });
    }
  }, [applicationsData, dispatch]);

  if (loading || isLoading) return <div>Loading applications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Job Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        applications.map(application => (
          <div key={application._id} className="application-card">
            <p><strong>Applicant:</strong> {application.user.username}</p>
            <p><strong>Email:</strong> {application.user.email}</p>
            <p><strong>Status:</strong> {application.status}</p>
            <p><strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>

            {application.status !== 'rejected' && (
              <button
                onClick={() => rejectApplication(application._id)}
                disabled={loading}
              >
                Reject Application
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CompanyApplications;
