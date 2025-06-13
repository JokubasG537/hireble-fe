import { ClipLoader } from 'react-spinners';

function Loader() {
  return (
  <ClipLoader
  color="#ffffff"
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