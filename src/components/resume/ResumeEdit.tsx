import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiQuery, useApiMutation } from '../../hooks/useApiQuery';

const ResumeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const { data: resume, isLoading, error } = useApiQuery(
    ['resume', id],
    `/resumes/${id}`,
    !!id
  );

  const { mutate: updateTitle } = useApiMutation(
    `/resumes/:id`,
    'PUT',
    ['resumes', id]
  );

  const { mutate: updateFile } = useApiMutation(
    `/resumes/:id/file`,
    'PUT',
    ['resumes', id]
  );

  useEffect(() => {
    if (resume) {
      setTitle(resume.title);
    }
  }, [resume]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTitleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateTitle({ __params: { id }, title }, {
      onSuccess: () => navigate(`/resumes/${id}`)
    });
  };

  const handleFileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    updateFile({ __params: { id }, formData }, {
      onSuccess: () => navigate(`/resumes/${id}`)
    });
  };

  if (isLoading) return <p>Loading resume...</p>;
  if (error) return <p>Error loading resume</p>;
  if (!resume) return <p>Resume not found</p>;

  return (
    <div>
      <h2>Edit Resume</h2>

      <form onSubmit={handleTitleUpdate}>
        <h3>Update Title</h3>
        <div>
          <label htmlFor="title">Resume Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Title</button>
      </form>

      <form onSubmit={handleFileUpdate}>
        <h3>Replace File</h3>
        <div>
          <label htmlFor="file">New Resume File (PDF, DOC, DOCX)</label>
          <input
            type="file"
            id="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" disabled={!file}>
          Replace File
        </button>
      </form>

      <button onClick={() => navigate(`/resumes/${id}`)}>
        Cancel
      </button>
    </div>
  );
};

export default ResumeEdit;
