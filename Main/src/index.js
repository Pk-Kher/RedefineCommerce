import React from "react";
import "./assets/css/tailwind/admin/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store /* , { persistor } */ from "./store/Store";
import * as ReactDOMClient from "react-dom/client";
// import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOMClient.createRoot(document.getElementById("root"));

root.render(
  <Router>
    <Provider store={store}>
      <Routes>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <Route path="/*" element={<App />} />
      </Routes>
      {/* </PersistGate> */}
    </Provider>
  </Router>
);

reportWebVitals();
