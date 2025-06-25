import { useContext, useState } from 'react';
import {useApiQuery} from '../hooks/useApiQuery';
import { UserContext } from '../contexts/UserContext';
import { useParams} from 'react-router-dom';
import Loader from './Loader';
import { Edit3 } from 'lucide-react';


// interface UserInfo {
//   _id: string;
//   username: string;
//   email: string;
//   role: string;
// }
export const UserInfoDash: React.FC = () => {
  const {token} = useContext(UserContext);
  const {userId} = useParams<{userId: string}>();
  const isLoggedIn = Boolean(token)
  const [userInfo, setUserInfo] = useState<{username: string, role: string} | null>(null);

  const queryKey = isLoggedIn ? ['currentUserInfo'] : ['userInfo', userId];

  const url = isLoggedIn ? '/users/current' : `/users/${userId}`;
  const enabled = isLoggedIn ? Boolean(token) : Boolean(userId)

  const {data, isLoading, error } = useApiQuery(queryKey, url, enabled)

  // const updateCurrentUser = useApiMutation('users/:id', 'PUT', queryKey);

  // const handleUpdateUser = (formData: UserInfo) => {
  //   if(isLoggedIn && data?._id) {
  //     updateCurrentUser.mutate({
  //     _params: {id: data._id},
  //     _body: formData
  //   })
  //   }
  // }
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

      {isLoggedIn ? (
        <div className="p-btn-wrapper">
           <button
            className="edit-profile-btn"
            // onClick={handleEditProfile}
            title="Edit Profile"
          >
          <Edit3 size={16} /></button>
          <p className="">{data.description}</p>
        </div>
      ) : (
          <p className="">{data.description}</p>
      )}

     
      <span className="detail">
        {data.role}
        </span>
    </div>
  )
}