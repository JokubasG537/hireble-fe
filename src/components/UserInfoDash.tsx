import { useContext, useState, useEffect } from 'react';
import {useApiQuery, useApiMutation} from '../hooks/useApiQuery';
import { UserContext } from '../contexts/UserContext';
import { useParams} from 'react-router-dom';
import Loader from './Loader';
import { Edit3 } from 'lucide-react';
// import { X } from 'lucide-react';

interface UserInfo {
  _id: string;
  username: string;
  email: string;
  role: string;
}
export const UserInfoDash: React.FC = () => {
  const {token} = useContext(UserContext);
  const {userId} = useParams<{userId: string}>();
  const isLoggedIn = Boolean(token)
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    description: ''
  })


  const queryKey = isLoggedIn ? ['currentUserInfo'] : ['userInfo', userId];

  const url = isLoggedIn ? '/users/current' : `/users/${userId}`;
  const enabled = isLoggedIn ? Boolean(token) : Boolean(userId)

  const {data, isLoading } = useApiQuery(queryKey, url, enabled)

  const updateCurrentUser = useApiMutation('/users/:id', 'PUT', ['currentUserInfo']);

  useEffect(() => {
  if (data?.description) {
    setForm({ description: data.description });
  }
}, [data]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};


const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  console.log('🔍 Submitting form:', { form, userId: data._id });

  updateCurrentUser.mutate({
    __params: { id: data._id },
    ...form
  }, {
    onSuccess: (updatedUser) => {
      console.log("✅ User updated:", updatedUser);
      setIsEditing(false);
      setError(null);
    },
    onError: (err: Error) => {
      console.error("❌ Update failed:", err);
      setError(err.message);
    }
  });
};

const handleEditProfile = () => {
  setIsEditing(true);
};

const handleCancel = () => {
  setIsEditing(false);
};


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
        Error loading user info: {(error as Error).message}
      </div>
    );
  }

  if (!data) {
    return <div>No user information available.</div>;
  }


  return (
    <div className="user-info-dashboard">
      <h2 className="name">
        {data.username}
      </h2>

      {(isLoggedIn && !isEditing) ? (
        <div className="p-btn-wrapper">
           <button
            className="edit-profile-btn"
           onClick={handleEditProfile}
            title="Edit Profile"
          >
          <Edit3 size={16} /></button>
          <p>{data.description}</p>
        </div>
      ) : (
        null
      )}


      {(isLoggedIn && isEditing) ? (

        <form onSubmit={handleSubmit}>
          <div className="form-group description">
          <textarea name="description" id="desc" onChange={handleChange} value={form.description}></textarea>
          </div>

          <div className="btn-container form-group">
          <button type="submit">Save</button>
          <button onClick={handleCancel}>Cancel</button>
          </div>

        </form>

      ) : (
        null
      )}

      {!isLoggedIn && (
        <div className="p-btn-wrapper">
          <p className="">{data.description}</p>
        </div>
      )}


      <span className="detail">
        {data.role}
        </span>
    </div>
  )
}