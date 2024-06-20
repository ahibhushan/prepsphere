import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Homepage,
  SignUp,
  SignIn,
  ResetPassword,
  Home,
  JobInfo,
  QuestionForm,
  Interview,
  Feedback
} from "./pages";
import ForgotPassword from "./pages/ForgotPassword";
import UserDetails from "./pages/UserDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/userdetails" element={<UserDetails />} />
        <Route path="/jobinfo" element={<JobInfo />} />
        <Route path="/questionform" element={<QuestionForm />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/feedback" element={<Feedback/>}/>
      </Routes>
    </Router>
  );
}

export default App;
