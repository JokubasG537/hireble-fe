import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiMutation } from '../../hooks/useApiQuery';
import Loader from '../Loader';
import '../../style/ResumeUpload.scss';

const ResumeUpload = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const { mutate: uploadResume, isLoading } = useApiMutation(
    '/resumes',
    'POST',
    ['resumes']
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);

      if (!title) {
        setTitle(e.target.files[0].name);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    uploadResume(formData, {
      onSuccess: () => {
        navigate('/user-dashboard');
      }
    });
  };

  return (
    <div className="resume-upload-container">
      <section>
      <h2>Upload Resume</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor="title">Resume Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor="file">Resume File (PDF, DOC, DOCX)</label>
          <input
            type="file"
            id="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="form-group">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Resume'}
        </button>
        </div>
        <div className="form-group">
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
        </div>
      </form>
      </section>
    </div>
  );
};

export default ResumeUpload;
