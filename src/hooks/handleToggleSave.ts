import {useApiMutation} from './useApiQuery';


// const saveJob = (jobId: string) => useApiMutation(`/savedJobs`, 'POST');

//  const handleSaveJob = (formData) => {
//   saveJob.mutate(formData);
// }


// const unsaveJob = (jobId: string) => useApiMutation(`/savedJobs/${jobId}`, 'DELETE');

// export const handleUnsaveJob = (jobId: string) => {
//   unsaveJob.mutate({
//     _params: { jobId },
//   });
// }

export const useSavedJobMutations = (jobId: string) => {
  const saveMutation = useApiMutation(`/savedJobs`, 'POST');
  const unsaveMutation = useApiMutation(`/savedJobs/${jobId}`, 'DELETE');

  const saveJob = (jobId: string) => {
    return saveMutation.mutate({jobPost: jobId});
  }

  const unsaveJob = (jobId: string) => {
    return unsaveMutation.mutate({_params: {jobId}})
  }

  return {
    saveJob,
    unsaveJob,
    isSaving: saveMutation.isLoading,
    isUnsaving: unsaveMutation.isLoading,
  };

}