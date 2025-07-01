import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { apiFetcher } from '../api/fetcher';


export function useApiMutation(
  url: string,
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  invalidateKey?: any[]
) {
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);

  return useMutation({
    mutationFn: (data: any) => {
      let finalUrl = url;

      if (data?.__params) {
        Object.entries(data.__params).forEach(([key, value]) => {
          finalUrl = finalUrl.replace(`:${key}`, value as string);
        });
        const { __params, ...bodyData } = data;
        data = bodyData;
      }

      const isFormData = data instanceof FormData;
      return apiFetcher(finalUrl, token, {
        method,
        body: isFormData ? data : JSON.stringify(data),
        headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      if (invalidateKey) queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
  });
}

export function useApiQuery(key: any[], url: string, enabled: boolean = true) {
  const { token } = useContext(UserContext);
  return useQuery({
    queryKey: key,
    queryFn: () => apiFetcher(url, token),
    enabled,
  });
}

// In your useApiQuery.ts file, update the useUserImages hook:
export function useUserImages(targetUserId?: string) {
  const { token } = useContext(UserContext);
  const [enabled, setEnabled] = useState(false);

  // Determine if we're fetching current user or specific user
  const isCurrentUser = !targetUserId;
  const userUrl = isCurrentUser ? '/users/current' : `/users/${targetUserId}`;
  const userKey = isCurrentUser ? ['currentUser'] : ['user', targetUserId];

  const { data: userData, isLoading: userLoading, error: userError } = useApiQuery(
    userKey,
    userUrl,
    enabled && Boolean(token || targetUserId) 
  );

  const { data: profileImageData, isLoading: profileLoading } = useApiQuery(
    ['profileImage', userData?.profileImage],
    `/images/${userData?.profileImage}`,
    Boolean(enabled && userData?.profileImage)
  );

  const { data: coverImageData, isLoading: coverLoading } = useApiQuery(
    ['coverImage', userData?.coverImage],
    userData?.coverImage || '',
    Boolean(enabled && userData?.coverImage)
  );

  const fetchImages = () => setEnabled(true);
  const resetImages = () => setEnabled(false);

  const queryClient = useQueryClient();
  const refetchImages = () => {
    queryClient.invalidateQueries({ queryKey: userKey });
    queryClient.invalidateQueries({ queryKey: ['profileImage'] });
    queryClient.invalidateQueries({ queryKey: ['coverImage'] });
  };

  return {
    fetchImages,
    resetImages,
    refetchImages,
    userData,
    profileImageUrl: profileImageData?.fileUrl || null,
    coverImageUrl: coverImageData?.fileUrl || null,
    isLoading: userLoading || profileLoading || coverLoading,
    error: userError,
    isEnabled: enabled,
  };
}
