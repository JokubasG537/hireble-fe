import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { useApiQuery } from "../hooks/useApiQuery";
import { UserContext } from "../contexts/UserContext";
const SaveJobButton : React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(prev => !prev);
  }

//  const { user: contextUser, token } = useContext(UserContext);




  return (
   <button >
    <Bookmark onClick={handleSave}>
      {isSaved ? <BookmarkCheck /> : <Bookmark />}
    </Bookmark>
</button>
  )
}

export default SaveJobButton