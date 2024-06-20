import React, { useContext, useState } from "react";
import { Box, TextField, Typography, Button, IconButton } from "@mui/material";
import { UserDetailsContext } from "../provider/UserDetailsProvider";
import { JobContext } from "../provider/JobProvider";
import { QuestionContext } from "../provider/QuestionProvider";
import { FeedbackContext } from "../provider/FeedbackProvider";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Feedback = () => {
  const [questions] = useContext(QuestionContext);
  const [feedback] = useContext(FeedbackContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isStrengthView, setIsStrengthView] = useState(true);
  const quesLength = questions.length;
  console.log(questions);
  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const toggleView = () => {
    setIsStrengthView((prevIsStrengthView) => !prevIsStrengthView);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const feedbackContent = isStrengthView ? "Strengths" : "Improvements";
  const icon = isStrengthView ? <ThumbUpIcon /> : <ThumbDownIcon />;

  return (
    <Box
      sx={{
        background:
          "linear-gradient(90deg, rgba(2,41,79,1) 0%, rgba(19,27,32,1) 91%), #eaafc8",
      }}
      minHeight="100vh"
      display="flex"
      justifyContent="center"
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
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          mt: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          height: "60vh", // Fixed height
          width: "60vh", // Fixed width
        }}
        elevation={8}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Interview Question
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Question No. {currentQuestionIndex + 1} : {currentQuestion.question}
        </Typography>

        <TextField
          label="Your Response"
          variant="outlined"
          value={currentQuestion.answer || ""}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
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
        {/* <Button
          variant="contained"
          color="primary"
          onClick={generateFeedback}
          sx={{ mt: 2 }}
        >
          Generate Feedback
        </Button> */}
      </Box>
      <Box
        sx={{
          p: 3,
          display: "flex",
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "1rem",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          justifyContent: "space-between",
          mt: "2rem",
          backgroundColor: "#1e293b",
          height: "60vh", // Fixed height
          width: "60vh", // Fixed width
        }}
        elevation={8}
      >
        <Typography variant="h4" sx={{ mb: 2 }} color="white">
          Feedback
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={toggleView}
            sx={{ mb: 2 }}
          >
            {icon}
            {feedbackContent}
          </Button>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Feedback;
