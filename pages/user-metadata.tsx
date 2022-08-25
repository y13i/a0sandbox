import { useState, SyntheticEvent } from "react";
import { NextPage } from "next";
import { useAuth0 } from "@auth0/auth0-react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { InteractionProps } from "react-json-view";

import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import DataObjectIcon from "@mui/icons-material/DataObject";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { CodeTextField } from "../components/CodeTextField";
import { JsonView } from "../components/JsonView";
import { WithHead } from "../components/WithHead";
import { PageAttribute } from "../hooks/usePageAttributes";
import { managementApi, debounceWait, baseUri } from "../src/utils";

export const pageAttribute: PageAttribute = {
  title: "User Metadata",
  description: "Views and edits user metadata for the authenticated user.",
  path: "/user-metadata",
  icon: <DataObjectIcon />,
};

const _: NextPage = () => {
  const queryClient = useQueryClient();

  const {
    isLoading: auth0IsLoading,
    isAuthenticated,
    getAccessTokenSilently,
    getAccessTokenWithPopup,
    error: auth0Error,
    user,
  } = useAuth0();

  async function getAccessToken(): Promise<string | undefined> {
    // https://auth0.com/docs/secure/tokens/access-tokens/get-management-api-tokens-for-single-page-applications
    const managementApiAuthConfig = {
      audience: managementApi.defaults.baseURL,
      scope: "read:current_user update:current_user_metadata",
    };

    try {
      return await getAccessTokenSilently({ ...managementApiAuthConfig });
    } catch (e: any) {
      if (e.error === "login_required" || e.error === "consent_required") {
        return await getAccessTokenWithPopup({ ...managementApiAuthConfig });
      }
    }
  }

  const {
    data: userMetadata,
    error: queryError,
    isLoading: queryIsLoading,
    isFetching,
    refetch,
  } = useQuery(
    "userMetadata",
    async () => {
      const accessToken = await getAccessToken();

      if (accessToken === undefined) return;

      const { data } = await managementApi.get(`/users/${user?.sub}`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });

      return data.user_metadata || {};
    },
    {
      enabled: !auth0IsLoading && isAuthenticated,
      initialData: {},
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (fetchedUserMetadata) => {
        setNewUserMetadata(fetchedUserMetadata);
        updateJson(fetchedUserMetadata);
      },
    }
  );

  const { mutate } = useMutation(
    async () => {
      const accessToken = await getAccessToken();

      if (accessToken === undefined) return;

      const { data } = await managementApi.patch(
        `/users/${user?.sub}`,
        { user_metadata: { ...newUserMetadata } },
        {
          headers: { authorization: `Bearer ${accessToken}` },
        }
      );
    },
    {
      onMutate: () => {
        setSnackbarOpen(true);
        setAlertColor("info");
        setAlertMessage("Updating...");
      },
      onSuccess: () => {
        setNewUserMetadata(undefined);
        setSnackbarOpen(true);
        setAlertColor("success");
        setAlertMessage("Updated successfully.");
        queryClient.invalidateQueries("userMetadata");
      },
      onError: (error) => {
        console.error(error);
        setSnackbarOpen(true);
        setAlertColor("error");
        setAlertMessage("Update error!");
      },
    }
  );

  const [newUserMetadata, setNewUserMetadata] = useState<{} | undefined>(
    undefined
  );

  const [json, setJson] = useState<string>("{}");
  const [jsonError, setJsonError] = useState<Error | undefined>(undefined);

  const handleJsonUpdateDebounced = useDebouncedCallback((newJson: string) => {
    try {
      const newData = JSON.parse(newJson);
      setNewUserMetadata(newData);
      setJsonError(undefined);
    } catch (e) {
      setJsonError(e as Error);
    }
  }, debounceWait);

  const updateJson = (data: any) => setJson(JSON.stringify(data, undefined, 2));
  const handleJsonViewUpdate = (p: InteractionProps) => {
    setNewUserMetadata(p.updated_src);
    updateJson(p.updated_src);
  };

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [alertColor, setAlertColor] = useState<AlertColor>("info");
  const [alertMessage, setAlertMessage] = useState<string>("alert");

  const handleSnackBarClose = (
    event?: SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const content = (() => {
    if (auth0IsLoading || queryIsLoading || isFetching) {
      return <LinearProgress />;
    }

    if (!isAuthenticated) {
      return (
        <Typography variant="h5" component="h2" gutterBottom>
          Authentication required.
        </Typography>
      );
    }

    const buttons = (
      <>
        <Button
          startIcon={<CloudDownloadIcon />}
          onClick={() => {
            setSnackbarOpen(false);
            refetch();
          }}
        >
          Refetch
        </Button>
        <Button startIcon={<CloudUploadIcon />} onClick={() => mutate()}>
          Save
        </Button>
      </>
    );

    if (auth0Error || queryError) {
      return (
        <>
          {buttons}
          <JsonView
            src={{
              auth0Error: {
                name: auth0Error?.name,
                message: auth0Error?.message,
                cause: auth0Error?.cause,
                stack: auth0Error?.stack,
              },
              queryError,
            }}
          />
        </>
      );
    }

    return (
      <>
        {buttons}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CodeTextField
              multiline
              label="JSON"
              error={!!jsonError}
              helperText={jsonError?.toString()}
              value={json}
              onChange={(event) => {
                const newJson = event.target.value;
                setJson(newJson);
                handleJsonUpdateDebounced(newJson);
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <JsonView
              src={
                typeof newUserMetadata === "object"
                  ? newUserMetadata
                  : userMetadata
              }
              onAdd={handleJsonViewUpdate}
              onEdit={handleJsonViewUpdate}
              onDelete={handleJsonViewUpdate}
            />
          </Grid>
        </Grid>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackBarClose}
        >
          <Alert
            onClose={handleSnackBarClose}
            variant="filled"
            severity={alertColor}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </>
    );
  })();

  return (
    <WithHead {...pageAttribute}>
      <Typography variant="h4" component="h1" gutterBottom>
        {pageAttribute.title}
      </Typography>
      {content}
    </WithHead>
  );
};

export default _;
