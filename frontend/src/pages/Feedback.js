import React, { useState, useContext } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { QuestionContext } from "../provider/QuestionProvider";

const Feedback = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isStrengthView, setIsStrengthView] = useState(true);
  const [feedbackArray] = useState([
    {
      strengths: [
        {
          feedbackHeading: "Relevant experience",
          feedback:
            "You highlighted your experience in utilizing machine learning algorithms, which is relevant to the position you are applying for.",
        },
        {
          feedbackHeading: "Clear communication",
          feedback:
            "You articulated your experience clearly and concisely, making it easy to understand your background in this area.",
        },
        {
          feedbackHeading: "Emphasizing skills",
          feedback:
            "You emphasized your skills in optimizing business processes using machine learning algorithms, showcasing your expertise in this area.",
        },
      ],
      improvements: [
        {
          feedbackHeading: "Provide examples",
          feedback:
            "Adding specific examples of how you applied machine learning algorithms to optimize business processes would provide more depth to your response.",
        },
        {
          feedbackHeading: "Quantify impact",
          feedback:
            "Try to quantify the impact of your work using machine learning algorithms on business processes, such as cost reduction, efficiency improvement, or revenue increase.",
        },
        {
          feedbackHeading: "Tailor to company",
          feedback:
            "Customize your response to align more closely with the specific requirements and goals of the company you are interviewing for.",
        },
      ],
    },
    {
      strengths: [
        {
          feedbackHeading: "Relevant experience",
          feedback:
            "You mentioned that you have experience using technology to optimize processes in a previous role, which is directly relevant to the position you are applying for.",
        },
        {
          feedbackHeading: "Brief and to the point",
          feedback:
            "Your answer was concise and did not include any unnecessary information, which is good for keeping the interviewer's attention focused on the key points.",
        },
      ],
      improvements: [
        {
          feedbackHeading: "Lack of specific examples",
          feedback:
            "It would be beneficial to provide specific examples of the technology you used and how it helped optimize processes in your previous role.",
        },
        {
          feedbackHeading: "Impact and results",
          feedback:
            "Try to include details about the impact of using technology to optimize processes, such as time or cost savings, efficiency improvements, or other tangible results.",
        },
      ],
    },
    {
      strengths: [
        {
          feedbackHeading: "Honesty",
          feedback:
            "Being honest about your experience is important. It's better to admit when you don't have experience than to pretend.",
        },
      ],
      improvements: [
        {
          feedbackHeading: "Provide context",
          feedback:
            "Even if you don't have direct experience, you could mention if you have knowledge of the concepts or tools related to serverless technologies.",
        },
        {
          feedbackHeading: "Show willingness to learn",
          feedback:
            "Express your eagerness to learn and adapt to new technologies, including serverless technologies, to demonstrate your proactive attitude.",
        },
      ],
    },
  ]);
  const [questions] = useContext(QuestionContext);

  const currentQuestion = questions[currentQuestionIndex];
  const currentFeedback = feedbackArray[currentQuestionIndex];

  const strengths = currentFeedback ? currentFeedback.strengths : [];
  const improvements = currentFeedback ? currentFeedback.improvements : [];

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, feedbackArray.length - 1)
    );
  };

  const toggleView = () => {
    setIsStrengthView((prevIsStrengthView) => !prevIsStrengthView);
  };

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
          value={currentQuestion.answer}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          sx={{ mt: 1, mr: 1 }}
        >
          Previous Question
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === feedbackArray.length - 1}
          sx={{ mt: 1 }}
        >
          Next Question
        </Button>
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
          {isStrengthView ? (
            <StrengthsList strengths={strengths} />
          ) : (
            <ImprovementsList improvements={improvements} />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={toggleView}
            sx={{ mb: 2 }}
          >
            {isStrengthView ? <ThumbUpIcon /> : <ThumbDownIcon />}
            {isStrengthView ? "Strengths" : "Improvements"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const StrengthsList = ({ strengths }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1, color: "white" }}>
        Strengths:
      </Typography>
      {strengths &&
        strengths.map((strength, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{ mb: 1, color: "white" }}
          >
            {strength.feedbackHeading}: {strength.feedback}
          </Typography>
        ))}
    </Box>
  );
};

const ImprovementsList = ({ improvements }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1, color: "white" }}>
        Improvements:
      </Typography>
      {improvements &&
        improvements.map((improvement, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{ mb: 1, color: "white" }}
          >
            {improvement.feedbackHeading}: {improvement.feedback}
          </Typography>
        ))}
    </Box>
  );
};

export default Feedback;
