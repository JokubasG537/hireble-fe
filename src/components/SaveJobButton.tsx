import { Button } from '@mantine/core';
import { Bookmark, BookmarkCheck } from "lucide-react";
import Popup from "./Popup";
import { UserContext } from "../contexts/UserContext";
import { useContext, useState } from "react";
import classes from '../style/SaveJobButton.module.scss'; // Import CSS module

interface SaveJobButtonProps {
  jobId: string;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
}

const SaveJobButton: React.FC<SaveJobButtonProps> = ({
  jobId,
  isSaved,
  onToggleSave
}) => {
  const { user: contextUser, token } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);

  const handlePopupShow = () => { setShowPopup(true); };
  const handlePopupClose = () => { setShowPopup(false); };

  return (
    <>
      {token ? (
        <Button
          variant={isSaved ? "filled" : "outline"}
          size="sm"
          leftSection={isSaved ? <BookmarkCheck size={24} /> : <Bookmark size={16} />}
          className={classes.saveButton }
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(jobId);
            console.log(isSaved);
          }}
        >
          {isSaved ? 'Saved' : 'Save'}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
           leftSection={isSaved ? <BookmarkCheck size={24} /> : <Bookmark size={16} />}
          className={classes.saveButton }
          onClick={handlePopupShow}
        >
          Save
        </Button>
      )}

  {showPopup && (
        <Popup
          isOpen={showPopup}
          onClose={handlePopupClose}
          title="Notice"
          message="You need to be logged in to apply for this job."
          confirmText="OK"
          onConfirm={handlePopupClose}
        />
      )}
    </>
  );
};

export default SaveJobButton;
