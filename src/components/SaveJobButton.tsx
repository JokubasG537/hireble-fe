import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { useApiQuery } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
// import { useSavedJobMutations } from "../hooks/handleToggleSave";

interface SaveJobButtonProps {
  jobId: string
  isSaved: boolean
  onToggleSave: (jobId: string) => void
}
// const SaveJobButton : React.FC<SaveJobButtonProps> = ({jobId, isSaved, onToggleSave}) => {

// // const [savedJob, setSavedJob] = useState(false);


//   const handleSave = () => {
//     setSavedJob(prev => !prev);
//     console.log(jobId)
//   }


//  const { user: contextUser, token } = useContext(UserContext);


//   return (
//    <button
//    onClick={(e) => {
//     e.stopPropagation();
//     onToggleSave(jobId);
//     console.log(isSaved);
//    }}>
//     <Bookmark onClick={handleSave}>
//       {isSaved ? <BookmarkCheck /> : <Bookmark />}
//     </Bookmark>
// </button>
//   )
// }

const SaveJobButton: React.FC<SaveJobButtonProps> = ({
  jobId,
  isSaved,
  onToggleSave
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleSave(jobId);
      }}
    >
      {isSaved ? <BookmarkCheck /> : <Bookmark />}
    </button>
  );
};

export default SaveJobButton