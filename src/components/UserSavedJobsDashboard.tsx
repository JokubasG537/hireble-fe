import {useState, useEffect, useContext, use} from 'react';
import {useApiQuery, useApiMutation} from '../hooks/useApiQuery';
import { UserContext } from '../contexts/UserContext';
import { useParams } from 'react-router-dom';
import Loader from './Loader';

export default function UserSavedJobsDashboard() {
  // const [savedJobs, setSavedJobs] = useState([]);
  const { token } = useContext(UserContext);
  const { userId } = useParams<{ userId: string }>();

  const isLoggedIn = !!token
  const queryKey = isLoggedIn
    ? ['currentUserSavedJobs' ]
    : ['userSavedJobs', userId]

  const url = isLoggedIn
    ? '/users/current'
    : `/users/${userId}`;

    const enabled = isLoggedIn ? !!token : !!userId
    const { data, isLoading, error} = useApiQuery(queryKey, url, enabled)

    if (isLoading) return <div className="loading"><Loader /></div>;
    if (error) return <div className="error">Error loading saved jobs: {(error as Error).message}</div>;

    const deleteSavedJob = useApiMutation('/savedJobs/:jobId', 'DELETE', ['savedJobs'],  !!token);

    console.log('Saved Jobs Data:', data);

const handleDeleteSavedJob = (jobId: string) => {
  deleteSavedJob.mutate({
    __params: { id: jobId },
  });
};

    return (
      <div className="saved-jobs-container">
        {data.savedJobs && data.savedJobs.length > 0 ? (
          <ul className="saved-jobs-list">
            {data.savedJobs.map((job: any) => (
              <li key={job._id} className="saved-job-item">
                <div className="job-details">
                  <h3>{job.title}</h3>
                  <p>{job.company.name}</p>
                  <p>{job.location}</p>
                </div>
                <button
                  className="delete-saved-job-button"
                  onClick={() => handleDeleteSavedJob(job._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-saved-jobs">
            <p>No saved jobs found.</p>
          </div>
        )}
      </div>
    )
}