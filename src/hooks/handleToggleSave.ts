// import { useApiMutation } from './useApiQuery';
// import { useQueryClient } from '@tanstack/react-query';

// export const useSavedJobMutations = () => {
//   const queryClient = useQueryClient();

//   const saveMutation = useApiMutation('/savedJobs', 'POST', {
//     onSuccess: () => queryClient.invalidateQueries(['savedJobs']),
//   });

//   const unsaveMutation = useApiMutation(
//     (jobId: string) => `/savedJobs/${jobId}`,
//     'DELETE',
//     {
//       onSuccess: () => queryClient.invalidateQueries(['savedJobs']),
//     }
//   );

//   const saveJob = (jobId: string) => {
//     return saveMutation.mutate({ jobPostId: jobId });
//   };

//   const unsaveJob = (jobId: string) => {
//     return unsaveMutation.mutate(jobId);
//   };

//   return {
//     saveJob,
//     unsaveJob,
//     isSaving: saveMutation.isLoading,
//     isUnsaving: unsaveMutation.isLoading,
//   };
// };


import { useApiMutation } from './useApiQuery';
import { useQueryClient } from '@tanstack/react-query';

export const useSavedJobMutations = () => {
  const queryClient = useQueryClient();

  const saveMutation = useApiMutation('/savedJobs', 'POST', {
    onSuccess: () => queryClient.invalidateQueries(['savedJobs']),
  });

  const unsaveMutation = useApiMutation(
    (jobId: string) => `/savedJobs/${jobId}`,
    'DELETE',
    {
      onSuccess: () => queryClient.invalidateQueries(['savedJobs']),
    }
  );

  const saveJob = (
    jobId: string,
    options?: Parameters<typeof saveMutation.mutate>[1]
  ) => {
    return saveMutation.mutate({ jobPostId: jobId }, options);
  };

  const unsaveJob = (
    jobId: string,
    options?: Parameters<typeof unsaveMutation.mutate>[1]
  ) => {
    return unsaveMutation.mutate(jobId, options);
  };

  return {
    saveJob,
    unsaveJob,
    isSaving: saveMutation.isLoading,
    isUnsaving: unsaveMutation.isLoading,
  };
};
