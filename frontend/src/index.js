import React from "react";
import ReactDOM from "react-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { eventsSlice } from "./slices/eventSlice";
import { runnerSlice } from "./slices/runnerSlice";
import { BrowserRouter } from "react-router-dom";
import { resultsSlice } from "./slices/resultsSlice";

const store = configureStore({
  reducer: {
    events: eventsSlice.reducer,
    runners: runnerSlice.reducer,
    results: resultsSlice.reducer,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
