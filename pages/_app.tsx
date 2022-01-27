import "../styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import type { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import { createTheme, ThemeProvider } from "@mui/material/styles";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={createTheme()}>
        <Box sx={{ display: "flex" }}>
          <Component {...pageProps} />
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;