import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
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
