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

import { AppNavigation } from "../components/AppNavigation";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      redirectUri={`${process.env.NEXT_PUBLIC_BASE_URI!}/callback`}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={createTheme()}>
          <CssBaseline />
          <Box sx={{ display: "flex" }}>
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
