import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { QuestionContext } from "../provider/QuestionProvider";
import { JobContext } from "../provider/JobProvider";
import { FeedbackContext } from "../provider/FeedbackProvider";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ReplayIcon from "@mui/icons-material/Replay";
import Webcam from "react-webcam";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Axios from "axios";

const Interview = () => {
  const [questions, setQuestions] = useContext(QuestionContext);
  const [feedback, setFeedback] = useContext(FeedbackContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [spokenQuestion, setSpokenQuestion] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [jobInfo] = useContext(JobContext);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const quesLength = questions.length;

  // Speech recognition
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      // Speak the current question using TTS API
      speakQuestion(questions[currentQuestionIndex].question);
    } else {
      // All questions asked, navigate to the next page
      navigate("/feedback");
    }
  }, [currentQuestionIndex, questions, navigate]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const speakQuestion = async (question) => {
    setSpokenQuestion(question);
  };

  const handleResponseChange = (e) => {
    setUserResponse(e.target.value);
    console.log(userResponse);
  };

  const handleClearResponse = () => {
    setUserResponse("");
    resetTranscript();
  };

  const handleNextQuestion = () => {
    SpeechRecognition.stopListening();
    console.log("User response:", transcript);

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      answer: transcript,
    };

    setQuestions(updatedQuestions);

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

    setUserResponse("");
    resetTranscript();
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      answer: transcript,
    };

    setQuestions(updatedQuestions);
  };
  const handlePreviousQuestion = () => {
    setUserResponse("");
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    setUserResponse(questions[currentQuestionIndex].answer || "");
  };

  // const handleGenerateFeedback = async () => {
  //   setLoading(true); // Start loading before API calls
  //   const collectedFeedback = {};
  //   const { title, type, company, reqs } = jobInfo;
  //   console.log(questions);
  //   Promise.all(
  //     questions.map((qa) =>
  //       Axios.post("https://localhost:3005/chatgpt/generateFeedback", {
  //         question: qa.question,
  //         answer: qa.answer,
  //         title,
  //         type,
  //         company,
  //         reqs,
  //       })
  //         .then((response) => {
  //           collectedFeedback[qa.question] = response.data.feedback;
  //         })
  //         .catch((error) => {
  //           console.log("Error fetching feedback:", error);
  //           // Instead of navigating, handle the error here
  //           setLoading(false); // Stop loading after encountering an error
  //         })
  //     )
  //   )
  //     .then(() => {
  //       // Update the feedback state with all collected feedback
  //       setFeedback(collectedFeedback);
  //       console.log(collectedFeedback);
  //       setLoading(false); // Stop loading after API calls
  //       if (collectedFeedback.length === questions.length) {
  //         navigate("/feedback"); // Redirect to feedback page only if all feedbacks are collected successfully
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching feedback:", error);
  //       setLoading(false); // Stop loading after encountering an error
  //     });
  // };

  const handleGenerateFeedback = async () => {
    setLoading(true); // Start loading before API calls
    const collectedFeedback = {};
    const { title, type, company, reqs } = jobInfo;
    for(const qa of questions){
      Axios.post("http://localhost:3005/feedback/generateFeedback", {
      title,
      type,
      company,
      reqs,
      question:qa.question,
      answer:qa.answer,
    })
      .then((response) => {
        collectedFeedback[qa.question] = response.data.completion;
        console.log(response);
        setLoading(false);
      })
      .catch((err) => {
        alert("err");
      });
    }
    console.log(collectedFeedback)
  };

  return (
    <Box
      sx={{
        background:
          "linear-gradient(90deg, rgba(2,41,79,1) 0%, rgba(19,27,32,1) 91%), #eaafc8",
      }}
      minHeight="100vh"
      display="flex"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "1rem",
          justifyContent: "space-between",
          mt: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
        elevation={8}
        minHeight="60vh"
        width="60vh"
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Interview Question
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {spokenQuestion}
        </Typography>
        <TextField
          label="Your Response"
          variant="outlined"
          value={questions[currentQuestionIndex]?.answer || transcript}
          onChange={handleResponseChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button variant="contained" color="primary" onClick={startListening}>
            <PlayArrowIcon /> Start
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStopListening}
            style={{ marginLeft: "8px" }}
          >
            <StopIcon /> Stop
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClearResponse}
            sx={{ marginLeft: "8px" }}
          >
            <ReplayIcon /> Redo
          </Button>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <IconButton
            variant="contained"
            color="primary"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            sx={{ mt: 1, mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            variant="contained"
            color="primary"
            onClick={handleNextQuestion}
            sx={{ mt: 1 }}
            disabled={currentQuestionIndex === quesLength - 1}
          >
            <ArrowForwardIcon />
          </IconButton>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateFeedback}
          disabled={currentQuestionIndex !== quesLength - 1}
          sx={{ mt: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} /> // Show loading spinner when loading is true
          ) : (
            <FeedbackIcon sx={{ marginRight: 1 }} />
          )}
          Generate Feedback
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "1rem",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
        elevation={8}
      >
        <Card component="li" sx={{ minWidth: 672, minHeight: 480 }}>
          <CardCover></CardCover>
          <CardContent>
            <Webcam ref={videoRef} />
          </CardContent>
        </Card>
      </Box>
      {/* Conditional rendering of CircularProgress with background blur */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backdropFilter: "blur(5px)", // Apply blur effect
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default Interview;
