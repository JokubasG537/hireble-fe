import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useApiQuery, useApiMutation } from '../hooks/useApiQuery';
import JobPostForm, { JobPostFormValues } from './JobPostForm';

interface JobPost extends JobPostFormValues {
  _id: string;
  title: string;
  location: string;
  description: string;
}

export default function CompanyJobPostsManager() {
  const { data: companyData, isLoading: loadingCompany } = useApiQuery(
    ['currentCompany'],
    '/companies/current/company'
  );
  const companyId = companyData?._id;

  const {
    data: postsData,
    isLoading: loadingPosts,
    refetch: refetchPosts,
  } = useApiQuery(
    ['companyPosts', companyId],
    `/jobPosts?company=${companyId}`,
    !!companyId
  );

  const [posts, setPosts] = useState<JobPost[]>([]);
  const [editing, setEditing] = useState<JobPost | null>(null);

  useEffect(() => {
    if (postsData?.jobPosts) {
      setPosts(postsData.jobPosts);
    }
  }, [postsData]);

  const createMutation = useApiMutation('/jobPosts', 'POST', [
    'companyPosts',
    companyId,
  ]);
  const updateMutation = useApiMutation('/jobPosts/:id', 'PUT', [
    'companyPosts',
    companyId,
  ]);
  const deleteMutation = useApiMutation('/jobPosts/:id', 'DELETE', [
    'companyPosts',
    companyId,
  ]);

  const handleFormSubmit = async (values: JobPostFormValues) => {
    if (!companyId) return;
    if (editing) {
      await updateMutation.mutateAsync({
        __params: { id: editing._id },
        ...values,
        company: companyId,
      });
    } else {
      await createMutation.mutateAsync({ ...values, company: companyId });
    }
    setEditing(null);
    refetchPosts();
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync({ __params: { id } });
    refetchPosts();
  };

  if (loadingCompany) return <p>Loading company information…</p>;

  return (
    <div>
      <h2>{editing ? 'Edit Job Post' : 'Create Job Post'}</h2>
      <JobPostForm
        initialValues={editing ?? undefined}
        onSubmit={handleFormSubmit}
        submitLabel={editing ? 'Update Post' : 'Create Post'}
      />
      {editing && <button onClick={() => setEditing(null)}>Cancel Edit</button>}

      <h2>My Job Posts</h2>
      {loadingPosts ? (
        <p>Loading posts…</p>
      ) : posts.length === 0 ? (
        <p>No job posts found.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post._id} style={{ marginBottom: '1rem' }}>
              <h3>{post.title}</h3>
              <p><em>{post.location}</em></p>
              <div
                // sanitize any incoming HTML before injecting
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.description),
                }}
              />
              <button onClick={() => setEditing(post)}>Edit</button>
              <button onClick={() => handleDelete(post._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
