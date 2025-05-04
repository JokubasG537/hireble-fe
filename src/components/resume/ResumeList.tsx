import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiQuery } from '../../hooks/useApiQuery';

const ResumeList = () => {
  const navigate = useNavigate();
  const { data: resumes, isLoading, error } = useApiQuery(['resumes'], '/resumes', true);

  if (isLoading) return <p>Loading resumes...</p>;
  if (error) return <p>Error loading resumes</p>;

  return (
    <div>
      <h2>My Resumes</h2>
      <button onClick={() => navigate('/resumes/upload')}>Upload New Resume</button>

      {resumes && resumes.length > 0 ? (
        <div>
          {resumes.map(resume => (
            <div key={resume._id}>
              <h3>{resume.title}</h3>
              <p>Uploaded: {new Date(resume.createdAt).toLocaleDateString()}</p>
              <div>
                <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                <button onClick={() => navigate(`/resumes/${resume._id}/edit`)}>Edit</button>
                <button onClick={() => navigate(`/resumes/${resume._id}`)}>Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No resumes found. Upload your first resume!</p>
      )}
    </div>
  );
};

export default ResumeList;
