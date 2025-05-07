import React from 'react';
import { useParams } from 'react-router-dom';
import { useApiQuery } from '../hooks/useApiQuery';

function PublicUserProfile() {
  const { id } = useParams();
  const { data, isLoading, error } = useApiQuery(
    ['publicUser', id],
    `/users/${id}`,
    true
  );

  if (isLoading) return <div className="loading">Loading user profile...</div>;
  if (error) return <div className="error">Failed to load user profile: {error.message}</div>;
  if (!data) return <div className="not-found">User not found</div>;

  const user = data;

  return (
    <div className="user-profile-container">
      <header className="profile-header">
        <h1 className="username">{user.username}</h1>
        <span className="role-badge">{user.role}</span>
      </header>

      <section className="profile-details">
        <div className="info-card">
          <h2>Account Information</h2>
          <div className="info-row">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="info-row">
            <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>

        {user.savedJobs && user.savedJobs.length > 0 && (
          <div className="saved-jobs">
            <h2>Saved Jobs</h2>
            <ul className="job-list">
              {user.savedJobs.map(job => (
                <li key={job} className="job-item">
                  <a href={`/jobs/${job}`}>View Job</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {user.resumes && user.resumes.length > 0 && (
          <div className="resumes">
            <h2>Resumes</h2>
            <ul className="resume-list">
              {user.resumes.map(resume => (
                <li key={resume} className="resume-item">
                  <a href={`/resumes/${resume}`}>View Resume</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default PublicUserProfile;
