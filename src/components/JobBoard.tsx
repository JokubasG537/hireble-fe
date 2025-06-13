import React from 'react';
import { useParams, Outlet } from 'react-router-dom';
import JobListingPage from '../pages/JobListingPage';
import '../style/JobBoard.scss';

const JobBoard = () => {
  const { jobId } = useParams();
  console.log('Current jobId from URL:', jobId);

  return (
    <div className="job-board">
      <div className="job-list-panel">
        <JobListingPage />
      </div>
      <div className="job-detail-panel">
        {jobId ? (
          <>
            
            <Outlet />
          </>
        ) : (
          <div className="empty-state">Select a job to view details</div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;