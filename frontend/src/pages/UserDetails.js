import { Box, Button, Paper, TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import { Typography, Grid } from "@mui/material";
import {
  AccountCircle,
  ArrowForward,
  ContactPhone,
  TextSnippet,
} from "@mui/icons-material";
import { UserDetailsContext } from "../provider/UserDetailsProvider";
import {useNavigate} from "react-router-dom";

function FeatureBox({ title, text }) {
  return (
    <Grid item xs={4}>
      <Box
        sx={{
          background:
            "linear-gradient(90deg, rgba(2,41,79,1) 0%, rgba(19,27,32,1) 91%), #eaafc8",
          boxShadow: "0px 4px 16.8px 0px #C8D5B9",
          borderRadius: "1rem",
          padding: "2rem",
        }}
      >
        <AccountCircle sx={{ fontSize: "4rem", color: "white" }} />
        <Typography
          sx={{
            fontSize: "1.5rem",
            color: "primary.dark",
            fontWeight: 700,
            marginTop: "0.5rem",
            fontFamily: "Hanken Grotesk, system-ui,Ubuntu",
            // color: "white",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: "white",
            fontFamily: "Hanken Grotesk, system-ui,Ubuntu",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Grid>
  );
}
function FeatureBox2({ title, text }) {
  return (
    <Grid item xs={4}>
      <Box
        sx={{
          background:
            "linear-gradient(90deg, rgba(2,41,79,1) 0%, rgba(19,27,32,1) 91%), #eaafc8",
          boxShadow: "0px 4px 16.8px 0px #C8D5B9",
          borderRadius: "1rem",
          padding: "2rem",
        }}
      >
        <ContactPhone sx={{ fontSize: "4rem", color: "white" }} />
        <Typography
          sx={{
            fontSize: "1.5rem",
            color: "primary.dark",
            fontWeight: 700,
            marginTop: "0.5rem",
            fontFamily: "Hanken Grotesk, system-ui,Ubuntu",
            // color: "white",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: "white",
            fontFamily: "Hanken Grotesk, system-ui,Ubuntu",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Grid>
  );
}

function FeatureBox3({ title, text }) {
  return (
    <Grid item xs={4}>
      <Box
        sx={{
          background:
            "linear-gradient(90deg, rgba(2,41,79,1) 0%, rgba(19,27,32,1) 91%), #eaafc8",
          boxShadow: "0px 4px 16.8px 0px #C8D5B9",
          borderRadius: "1rem",
          padding: "2rem",
        }}
      >
        <TextSnippet sx={{ fontSize: "4rem", color: "white" }} />
        <Typography
          sx={{
            fontSize: "1.5rem",
            color: "primary.dark",
            fontWeight: 700,
            marginTop: "0.5rem",
            fontFamily: "Hanken Grotesk, system-ui,Ubuntu",
            // color: "white",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: "white",
            fontFamily: "Hanken Grotesk, system-ui,Ubuntu",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Grid>
  );
}

const UserDetails = () => {
  const [userDetails, setUserDetails] = useContext(UserDetailsContext);
  const [name, setName] = useState(userDetails.name);
  const navigate = useNavigate();

  
  const handleClick = () => {
    setUserDetails({ name: name });
    console.log(userDetails)
    navigate('/jobinfo');
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
      <Paper
        sx={{
          p: 3,
          display: "flex",
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "1rem",
          mt: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
        elevation={8}
      >
        <Box
          sx={{
            display: "flex",
            width: "70rem",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              textAlign: "center",
              fontWeight: "600",
              color: "#1e293b",
              fontFamily: "Hanken Grotesk, system-ui,Ubuntu",
            }}
          >
            AI Assessment
          </Typography>
          {/* <Box
            sx={{
              width: "32vw",
              borderRadius: "20px",
              margin: "auto 0px",
              height: "5px",
              background:
                "linear-gradient(90deg, rgba(2,41,79,1) 0%, rgba(19,27,32,1) 91%)",
            }}
          ></Box> */}
          <Typography
            sx={{
              marginTop: "2rem",
              fontWeight: "400",
              fontSize: "1.4rem",
              textAlign: "center",
              fontFamily: "Hanken Grotesk, system-ui,Ubuntu",
            }}
          >
            An AI based interview assessment which will
            <br /> generate the feedback and provide recommendation <br />
            provide context for next course to be curated
          </Typography>
          <Grid
            container
            spacing={3}
            sx={{ marginTop: "1rem", marginBottom: "1rem" }}
          >
            <FeatureBox
              title="Personalize"
              text="Provide job details and add your own questions to tailor the interview to your needs."
            ></FeatureBox>
            <FeatureBox2
              title="Assessment"
              text="Sit in an Assessment with our AI interviewer and answer questions, which are tailored for you"
            ></FeatureBox2>
            <FeatureBox3
              title="Feedback"
              text="Read about your strengths and improvements for each of your interview answers to improve"
            ></FeatureBox3>
          </Grid>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "1.5rem",
              gap: 3,
              justifyContent: "center",
            }}
          >
            <TextField
              label="Name"
              margin="normal"
              sx={{
                margin: "0",
                width: "18.75rem",
                boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.5)",
                borderRadius: "10px",
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              disabled={name === ""}
              sx={{
                padding: "1.1rem 1.5rem",
                borderRadius: "10px",
                color: "white",
                fontFamily: "Hanken Grotesk, system-ui,Ubuntu",
                background:
                  "linear-gradient(90deg, rgba(2,41,79,1) 0%, rgba(19,27,32,1) 91%), #eaafc8",
                boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.5)",
              }}
              endIcon={<ArrowForward />}
              onClick={handleClick}
            >
              Start Personalization
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserDetails;
