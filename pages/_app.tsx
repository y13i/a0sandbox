import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import { Auth0Provider } from "@auth0/auth0-react";

import "../src/global.css";

import { auth0Domain, auth0ClientId, baseUri } from "../src/utils";
import { AppNavigation } from "../components/AppNavigation";

const queryClient = new QueryClient();

// https://material.io/resources/color/
const theme = createTheme({
  palette: {
    primary: {
      main: "#212121",
      light: "#484848",
      dark: "#000",
      contrastText: "#fff",
    },
    secondary: {
      main: "#5e35b1",
      light: "#9162e4",
      dark: "#280680",
      contrastText: "#fff",
    },
  },

  components: { MuiLinearProgress: { defaultProps: { color: "secondary" } } },
});

function App({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      redirectUri={`${baseUri}/auth/callback`}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ display: "flex", height: "100%" }}>
            <AppNavigation />
            <Box
              component="main"
              sx={{ px: 3, py: 10, flexGrow: 1, overflow: "auto" }}
            >
              <Component {...pageProps} />
            </Box>
          </Box>
        </ThemeProvider>
      </QueryClientProvider>
    </Auth0Provider>
  );
}

export default App;
