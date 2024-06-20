import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";

import Highlights from "../components/Highlights";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import getLPTheme from "./getLPTheme";

//const defaultTheme = createTheme({});

export default function Homepage() {
  const [mode, setMode] = React.useState("dark");
  // const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    // <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <NavBar mode={mode} toggleColorMode={toggleColorMode} />
      <Hero />
      <Box sx={{ bgcolor: "background.default" }}>
        <Divider />
        <Features />
        <Divider />

        <Divider />
        <Highlights />
        <Divider />

        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
