import { ClipLoader } from 'react-spinners';
import "../style/Loader.scss";
function Loader() {
  return (
  <ClipLoader
  color="#2557a7"
  cssOverride={{
    borderWidth: "3px",
    animationDuration: "1s",
    margin: "0 auto",
    display: "flex",
    alignSelf: "center"
  }}
/>
  );
}

export default Loader;