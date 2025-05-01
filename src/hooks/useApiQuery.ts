// src/hooks/useApiQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { apiFetcher } from '../api/fetcher';

export function useApiMutation<T, V = any>(
  url: string,
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  invalidateKey?: any[]
) {
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext); // ✅ CORRECT USAGE

  return useMutation<T, Error, V>({
    mutationFn: (data: V) =>
      apiFetcher(url, token, {
        method,
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      if (invalidateKey) queryClient.invalidateQueries({ queryKey: invalidateKey });
    },
  });
}

// Similarly, update useApiQuery if you use it for GET requests:
export function useApiQuery<T>(key: any[], url: string, enabled: boolean = true) {
  const { token } = useContext(UserContext);
  return useQuery<T>({
    queryKey: key,
    queryFn: () => apiFetcher(url, token),
    enabled,
  });
}
