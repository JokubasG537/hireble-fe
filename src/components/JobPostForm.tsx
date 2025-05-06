import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { useApiMutation, useApiQuery } from '../hooks/useApiQuery';
import { UserContext } from '../contexts/UserContext';


const CreateJobPost = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(UserContext);
  const editor = useRef(null);

  const { data: companyData, isLoading: companyLoading } = useApiQuery(
    ['company', 'current'],
    `/companies/current/company`,
    !!token
  );

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    employmentType: 'full-time',
    industry: '',
    experienceLevel: 'entry',
    salary: '',
    salaryCurrency: 'USD',
    salaryPeriod: 'yearly'
  });

  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { mutate: createJobPost, isLoading, isError, error } = useApiMutation(
    '/jobPosts',
    'POST',
    ['job-posts']
  );

  useEffect(() => {
    if (companyData) {
      setFormData(prev => ({
        ...prev,
        company: companyData._id,
        industry: companyData.industry || prev.industry
      }));
    }
  }, [companyData]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'recruiter' && user.role !== 'admin') {
      navigate('/unauthorized');
    }
  }, [user, token, navigate]);

  const config = {
    readonly: false,
    height: 400,
    toolbar: true,
    toolbarButtonSize: 'middle',
    toolbarAdaptive: false,
    buttons: [
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'h1', 'h2', 'h3', '|',
      'link', '|',
      'paragraph'
    ],
    placeholder: 'Describe the job role, responsibilities, requirements, benefits, etc.'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!description.trim()) newErrors.description = 'Job description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    createJobPost({
      ...formData,
      salary: formData.salary ? Number(formData.salary) : undefined,
      description
    }, {
      onSuccess: () => {
        navigate('/job-posts');
      },
      onError: (err) => {
        console.error('Error creating job post:', err);
      }
    });
  };

  return (
    <div>
      <h2>Create New Job Post</h2>

      {isError && (
        <div>
          {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Job Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
          {errors.title && <div>{errors.title}</div>}
        </div>

        <div>
          <label htmlFor="company">Company *</label>
          <input
            type="text"
            id="company"
            value={companyLoading ? "Loading..." : (companyData?.name || "")}
            disabled
          />
          <small>Company is automatically filled based on your profile</small>
        </div>

        <div>
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
          {errors.location && <div>{errors.location}</div>}
        </div>

        <div>
          <label htmlFor="salary">Salary</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
          />
          <input
            type="hidden"
            id="salaryCurrency"
            name="salaryCurrency"
            value="USD"
          />
          <label htmlFor="salaryPeriod">Period</label>
          <select
            id="salaryPeriod"
            name="salaryPeriod"
            value={formData.salaryPeriod}
            onChange={handleInputChange}
          >
            <option value="hourly">Per Hour</option>
            <option value="monthly">Per Month</option>
            <option value="yearly">Per Year</option>
          </select>
        </div>

        <div>
          <label htmlFor="employmentType">Employment Type</label>
          <select
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleInputChange}
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="temporary">Temporary</option>
          </select>
        </div>

        <div>
          <label htmlFor="industry">Industry</label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="experienceLevel">Experience Level</label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleInputChange}
          >
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="lead">Lead Level</option>
          </select>
        </div>

        <div>
          <label htmlFor="description">Job Description *</label>
          <JoditEditor
            ref={editor}
            value={description}
            config={config}
            onBlur={newContent => setDescription(newContent)}
            onChange={(newContent) => {}}
          />
          {errors.description && <div>{errors.description}</div>}
        </div>

        <div>
          <h5>Preview:</h5>
          <div dangerouslySetInnerHTML={{ __html: description }}></div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => navigate('/job-posts')}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPost;