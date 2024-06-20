import { Grid, TextField, Button, Box, Typography, Paper } from "@mui/material";
import MultipleSelectChip from "../components/multiselect";
import { useContext, useState } from "react";
import { JobContext } from "../provider/JobProvider";
import { useNavigate } from "react-router-dom";
import ArrowForward from "@mui/icons-material/ChevronRightRounded";

const JobInfo = () => {
  const [jobInfo, setJobInfo] = useContext(JobContext);
  const [title, setTitle] = useState(jobInfo.title);
  const [company, setCompany] = useState(jobInfo.company);
  const [reqs, setReqs] = useState(jobInfo.reqs);
  const [type, setType] = useState(jobInfo.type);
  const navigate = useNavigate();

  const removeWhitespace = (text) => {
    return text.trim().length === 0 ? "" : text;
  };

  const handleNext = (e) => {
    e.preventDefault();
    setJobInfo({
      title: removeWhitespace(title),
      type: type,
      company: removeWhitespace(company),
      reqs: removeWhitespace(reqs),
    });
    console.log(jobInfo);
    navigate("/questionform");
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
        <Box component="form" onSubmit={handleNext}>
          <Box
            sx={{
              display: "flex",
              //   backgroundColor: "white",
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
              Fill The Details For A Refined <br />
              Virtual Interview Style Assessment Experience.
            </Typography>
            <Grid container spacing={5} flexDirection="row">
              <Grid item container flexDirection="column" xs={6}>
                <TextField
                  required
                  label="Career Profile"
                  fullWidth
                  margin="normal"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ mb: 0.5 }}
                />
                <MultipleSelectChip jobType={type} setJobType={setType} />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Company Details"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  sx={{ mt: 1.5 }}
                />
              </Grid>
              <Grid item container xs={6} height="100%">
                <TextField
                  inputProps={{ className: "greyScroll" }}
                  fullWidth
                  label="Profile Requirements"
                  margin="normal"
                  multiline
                  minRows={8}
                  maxRows={8}
                  value={reqs}
                  name="reqs"
                  onChange={(e) => setReqs(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            display="flex"
            justifyContent="end"
            alignItems="center"
            marginTop="2rem"
          >
            <Button
              variant="outlined"
              type="submit"
              endIcon={<ArrowForward />}
              sx={{
                padding: "0.8rem 1.5rem",
                borderRadius: "10px",
                color: "white",
                background:
                  "linear-gradient(90deg, rgba(2,41,79,1) 0%, rgba(19,27,32,1) 91%), #eaafc8",
                boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.5)",
              }}
              onClick={handleNext}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default JobInfo;
