import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Stack,
  Input,
  Alert,
  IconButton,
  Collapse,
} from "@mui/material";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
// import ArrowBackward from "@mui/icons-material/ChevronLeftRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseIcon from "@mui/icons-material/Close";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { QuestionContext } from "../provider/QuestionProvider";
import { JobContext } from "../provider/JobProvider";
import Axios from "axios";

export default function QuestionForm() {
  const [questions, setQuestions] = useContext(QuestionContext);
  const [jobInfo] = useContext(JobContext);
  const navigate = useNavigate();
  const [questionList, setQuestionList] = useState(
    Array.isArray(questions) ? questions : []
  );
  const [alertText, setAlertText] = useState("");

  const addQuestion = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newQuestion = e.target.value.trim();
      if (!newQuestion) {
        setAlertText(
          'Question is invalid. Please type out a question and press "Enter"'
        );
        return;
      }
      if (questionList.some((q) => q.question === newQuestion)) {
        setAlertText("You have already added this question");
        return;
      }

      setQuestionList((prevList) => [
        ...prevList,
        { question: newQuestion, answer: "", isAI: false },
      ]);
      e.target.value = ""; // Reset input
      setAlertText(""); // Reset alert
    }
  };

  const deleteQuestion = (deleteIndex) => {
    setQuestionList((prevList) =>
      prevList.filter((_, index) => index !== deleteIndex)
    );
  };

  const handleComplete = (e) => {
    e.preventDefault();
    if (questionList.length < 3) {
      setAlertText("Please have at least three questions");
      return;
    }
    setQuestions(questionList);
    // Implement navigation to next step
    navigate("/interview");
  };

  // const handleBack = (e) => {
  //   e.preventDefault();
  //   setQuestions(questionList);
  //   // Implement navigation to previous step
  // };

  const generateQuestion = async (e) => {
    e.preventDefault();
    const { title, type, company, reqs } = jobInfo;
    const questions = questionList;
    Axios.post("http://localhost:3005/chatgpt/generateQuestion", {
      title,
      type,
      company,
      reqs,
      questions,
    })
      .then((response) => {
        
        setQuestionList((prevList) => [
          ...prevList,
          { question: response.data.completion, isAI: true },
        ]);
      })
      .catch((err) => {
        alert("err");
      });
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
      <Box component="form" onSubmit={handleComplete}>
        <Box
          sx={{
            display: "flex",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            padding: "4rem",
            borderRadius: "15px",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{ textAlign: "center", fontSize: "4rem", fontWeight: "600" }}
          >
            Curate Personalization
          </Typography>

          <Typography
            sx={{
              marginTop: "2rem",
              marginBottom: "1rem",
              fontWeight: "400",
              fontSize: "1.4rem",
              textAlign: "center",
            }}
          >
            Write Or Generate Assessment Questions <br />
            Curated From The Context in Database.
          </Typography>
          <Box
            width="90%"
            mt={-2}
            height={alertText && questionList.length >= 4 ? "20rem" : "18rem"}
            sx={{ paddingTop: "20px" }}
          >
            <Stack
              width="100%"
              maxHeight="13.9rem"
              overflow="auto"
              className="greyScroll"
            >
              {questionList.map((item, index) => (
                <Stack
                  key={item.question}
                  direction="row"
                  gap={1}
                  sx={{
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: "black",
                    borderRadius: 2,
                    py: 0.1,
                    px: 1,
                    display: "flex",
                    alignItems: "center",
                    mb: 1.5,
                    mx: 3,
                  }}
                >
                  <Typography variant="body1" py={1} sx={{ flexGrow: 1 }}>
                    {item.question}
                  </Typography>
                  {item.isAI && (
                    <Box
                      sx={{
                        borderRadius: "0.2rem",
                        padding: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: -1,
                        marginLeft: 1,
                      }}
                    >
                      <AutoAwesomeRoundedIcon
                        sx={{
                          color: "black",
                          fontSize: "1.3rem",
                        }}
                      />
                    </Box>
                  )}
                  <IconButton
                    aria-label="delete"
                    onClick={() => deleteQuestion(index)}
                  >
                    <DeleteRoundedIcon htmlColor="black" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
            <Box px={3} mr={questionList.length > 4 ? 1 : 0}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mb: 1.5,
                  gap: 1.5,
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: "black",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#042c50",
                    fontSize: "2rem",
                    flexGrow: 1,
                  }}
                >
                  <AddBoxRoundedIcon
                    htmlColor="white"
                    fontSize="inherit"
                    sx={{ margin: 0.7 }}
                  />
                  <Input
                    placeholder="Fill with a relevant question"
                    disableUnderline={true}
                    fullWidth
                    onKeyDown={addQuestion}
                    inputProps={{
                      "aria-label": "Add a question",
                    }}
                    sx={{
                      pr: 2,
                      color: "white",
                      "&::placeholder": { color: "white" },
                    }}
                    disabled={false}
                  />
                </Stack>
                <Button
                  sx={{
                    padding: "0.7rem 1.5rem",
                    borderRadius: "10px",
                    color: "white",
                    background:
                      "linear-gradient(90deg, rgba(2,41,79,1) 0%, rgba(19,27,32,1) 91%), #eaafc8",
                    boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.5)",
                  }}
                  startIcon={<AutoAwesomeRoundedIcon />}
                  onClick={generateQuestion}
                >
                  Surprise Me
                </Button>
              </Box>
              <Collapse in={alertText}>
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    border: "1px solid #DEAFAF",
                    width: "95.5%",
                  }}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setAlertText(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {alertText}
                </Alert>
              </Collapse>
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            marginTop="2rem"
            marginLeft="2rem"
            marginRight="2rem"
          >
            {/* <Button
              variant="outlined"
              onClick={handleBack}
              startIcon={<ArrowBackward />}
              sx={{
                pr: 6,
                padding: "0.7rem 1.5rem",
                borderRadius: "10px",
                color: "white",
                background:
                  "linear-gradient(90deg, rgba(2,41,79,1) 0%, rgba(19,27,32,1) 91%), #eaafc8",
                boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.5)",
              }}
            >
              Back
            </Button> */}
            <Button
              type="submit"
              variant="outlined"
              sx={{
                padding: "0.7rem 1.5rem",
                borderRadius: "10px",
                color: "white",
                background:
                  "linear-gradient(90deg, rgba(2,41,79,1) 0%, rgba(19,27,32,1) 91%), #eaafc8",
                boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.5)",
              }}
              endIcon={<CheckRoundedIcon />}
            >
              Start Interview
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
