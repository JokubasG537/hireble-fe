import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiQuery, useApiMutation } from '../../hooks/useApiQuery';

const ResumeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: resume, isLoading, error } = useApiQuery(
    ['resume', id],
    `/resumes/${id}`,
    !!id
  );

  const { mutate: deleteResume, isLoading: isDeleting } = useApiMutation(
    `/resumes/:id`,
    'DELETE',
    ['resumes']
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      deleteResume({ __params: { id } }, {
        onSuccess: () => {
          navigate('/resumes');
        }
      });
    }
  };

  if (isLoading) return <p>Loading resume details...</p>;
  if (error) return <p>Error loading resume</p>;
  if (!resume) return <p>Resume not found</p>;

  return (
    <div>
      <h2>{resume.title}</h2>
      <p>Uploaded: {new Date(resume.createdAt).toLocaleDateString()}</p>
      <p>Last Updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>

      <div>
        <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
          View Resume
        </a>
      </div>

      <div>
        <button onClick={() => navigate(`/resumes/${resume._id}/edit`)}>Edit</button>
        <button onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
        <button onClick={() => navigate('/resumes')}>Back to List</button>
      </div>
    </div>
  );
};

export default ResumeDetail;
