import React, { useReducer } from "react";
// import {
//   DownloadListContext,
//   DownloadListInitialState,
//   DownloadListReducer,
// } from "./context/DownloadList";
import Main from "./Main";

const App: React.FC = () => {
  // const [state, dispatch] = useReducer(
  //   DownloadListReducer,
  //   DownloadListInitialState
  // );
  return (
    // <DownloadListContext.Provider value={{ state, dispatch }}>
    <Main />
    // </DownloadListContext.Provider>
  );
};

export default App;
