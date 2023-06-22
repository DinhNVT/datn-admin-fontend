import { useDispatch } from "react-redux";
import "./App.scss";
import { useEffect } from "react";
import { checkRefreshTokenFetch } from "./stores/apiAuthRequest";
import Routers from "./routes/routers";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    checkRefreshTokenFetch(dispatch);
    // eslint-disable-next-line
  }, []);
  return (
    <div className="App">
      <Routers />
    </div>
  );
}

export default App;
