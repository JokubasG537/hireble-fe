import {toast} from 'sonner'


const useShare = () => {
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard')
    } catch (err) {
      if (err instanceof Error) {
      toast.error(err.message)
    }
    }
  }

  const share = async (text: string ) => {
    try {
      await navigator.share({ text });
    } catch (err) {
      if (err instanceof Error) {
      toast.error(err.message)
    }
    }
  }

  return { copy, share };
}

export default useShare
