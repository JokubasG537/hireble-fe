import {useState, useEffect, useContext, use} from 'react';
import {useApiQuery} from '../hooks/useApiQuery';
import { UserContext } from '../contexts/UserContext';
import { useParams } from 'react-router-dom';

export default function UserSavedJobsDashboard() {
  const [savedJobs, setSavedJobs] = useState([]);
  const { token } = useContext(UserContext);
  const { userId } = useParams<{ userId: string }>();

  const isLoggedIn = !!token
  const queryKey = isLoggedIn
    ? ['currentUserSavedJobs' ]
    : ['userSavedJobs', userId]

  const url = isLoggedIn
    ? 'users/current'
    : `/users/${userId}`;

    const enabled = isLoggedIn ? !!token ; !!userId
    
