import { useContext } from 'react';
import {useApiQuery, useApiMutation} from '../hooks/useApiQuery';
import { UserContext } from '../contexts/UserContext';
import { useParams, Link } from 'react-router-dom';
import Loader from './Loader';
import delImg from '../assets/icons8-delete-60.png';
import { Trash2 } from 'lucide-react';

interface SavedJob {
  _id: string;
  jobPost: {
    _id: string;
    title: string;
  };
}
export default function UserSavedJobsDashboard() {
  const { token } = useContext(UserContext);
  const { userId } = useParams<{ userId: string }>();

  const isLoggedIn = Boolean(token);


  const queryKey = isLoggedIn
    ? ['currentUserSavedJobs']
    : ['userSavedJobs', userId];

  const url = isLoggedIn ? '/savedJobs' : `/users/${userId}`;
  const enabled = isLoggedIn ? Boolean(token) : Boolean(userId);

  const { data, isLoading, error } = useApiQuery(queryKey, url, enabled);


  const deleteSavedJob = useApiMutation(
    '/savedJobs/:id',
    'DELETE',
    queryKey,

  );

  console.log('Saved Jobs Data:', data);

  if (isLoading) {
    return (
      <div className="loading">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        Error loading saved jobs: {(error as Error).message}
      </div>
    );
  }


  const handleDeleteSavedJob = (jobId: string) => {
    deleteSavedJob.mutate({ __params: { id: jobId } });
    console.log(`Deleted saved job with ID: ${jobId}`);
  };


  return (
    <div className="saved-jobs-section">
      <h2>Saved Jobs</h2>
      <div className="saved-jobs-container">
        {data?.length > 0 ? (
          data.map((job: SavedJob) => (
            <div className="saved-job-item" key={job.jobPost._id}>
              <Link to={`/job-posts/${job.jobPost._id}`} className="job-title">
                {job.jobPost.title}
              </Link>
              {token && (
                <button
                  className="delete-job-btn"
                  onClick={() => handleDeleteSavedJob(job._id)}
                  title="Remove from saved jobs"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="no-saved-jobs">
            No saved jobs found.
          </div>
        )}
      </div>
    </div>
  );

}
