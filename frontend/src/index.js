import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import UserDetailsProvider from "./provider/UserDetailsProvider";
import JobProvider from "./provider/JobProvider";
import QuestionProvider from "./provider/QuestionProvider";
import FeedbackProvider from "./provider/FeedbackProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserDetailsProvider>
      <JobProvider>
        <QuestionProvider>
          <FeedbackProvider>
            <App />
          </FeedbackProvider>
        </QuestionProvider>
      </JobProvider>
    </UserDetailsProvider>
  </React.StrictMode>
);
