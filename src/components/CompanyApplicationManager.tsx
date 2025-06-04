import React, { useEffect, useState } from 'react';
import { useApiQuery, useApiMutation } from '../hooks/useApiQuery';
import { ApplicationsProvider, useApplications } from '../contexts/ApplicationsContext';

const StatusDropdown: React.FC<{
  currentStatus: string;
  applicationId: string;
  companyId: string;
  fileUrl: string;
}> = ({ currentStatus, applicationId, companyId }) => {
  const updateStatusMutation = useApiMutation(
    `/jobApplications/company/:companyId/:applicationId`,
    'PUT',
    ['companyApplications', companyId]
  );

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    await updateStatusMutation.mutateAsync({
      __params: { companyId, applicationId },
      status: newStatus
    });
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={updateStatusMutation.isPending}
    >
      <option value="applied">Applied</option>
      <option value="interview">Interview</option>
      <option value="offer">Offer</option>
      <option value="rejected">Rejected</option>
    </select>
  );
};

const CompanyApplications: React.FC = () => {

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

const ApplicationsList: React.FC<{ companyId: string }> = ({ companyId }) => {
  const { state, dispatch, rejectApplication } = useApplications();
  const { applications, loading, error } = state;

  const { data: applicationsData, isLoading } = useApiQuery(
    ['companyApplications', companyId],
    `/jobApplications/company/${companyId}`,
    !!companyId
  );


  const [positionFilter, setPositionFilter] = useState<string>('all');


  const jobPositions = Array.from(
    new Set(applications.map(app => app.jobPost.title))
  );

  useEffect(() => {
    if (applicationsData?.applications) {
      dispatch({ type: 'SET_APPLICATIONS', payload: applicationsData.applications });
    }
  }, [applicationsData, dispatch]);

  if (loading || isLoading) return <div>Loading applications...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter applications by selected position
  const filteredApps = applications.filter(app =>
    (positionFilter === 'all' || app.jobPost.title === positionFilter)
  );
  const visibleApps = filteredApps.filter(app => app.status !== 'rejected');

  return (
    <div>
      <h2>Job Applications</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="position-filter"><strong>Filter by position:</strong> </label>
        <select
          id="position-filter"
          value={positionFilter}
          onChange={e => setPositionFilter(e.target.value)}
        >
          <option value="all">All positions</option>
          {jobPositions.map(title => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
      </div>
      {visibleApps.length === 0
        ? <p>No applications found.</p>
        : visibleApps.map(application => (
            <div key={application._id} className="application-card">
              <p><strong>Applicant:</strong> {application.user.username}</p>
              <p><strong>Email:</strong> {application.user.email}</p>
              <p><strong>Job:</strong> {application.jobPost.title}</p>
              <p><a href={application.resume.fileUrl} target='_blank' rel="noopener noreferrer">View Resume</a></p>
              <p><strong>Status:</strong> <StatusDropdown
                currentStatus={application.status}
                applicationId={application._id}
                companyId={companyId}
              /></p>
              <p><strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
            </div>
          ))
      }
    </div>
  )
};

export default CompanyApplications;