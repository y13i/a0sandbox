import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useAuth0 } from "@auth0/auth0-react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "react-query";

import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import DataObjectIcon from "@mui/icons-material/DataObject";

import { CodeTextField } from "../components/CodeTextField";
import { JsonView } from "../components/JsonView";
import { WithHead } from "../components/WithHead";
import { PageAttribute } from "../hooks/usePageAttributes";
import { managementApi, debounceWait } from "../src/constants";

export const pageAttribute: PageAttribute = {
  title: "User Metadata",
  description: "Views and edits user metadata for the authenticated user.",
  path: "/user-metadata",
  icon: <DataObjectIcon />,
};

const _: NextPage = () => {
  const {
    isLoading: auth0IsLoading,
    isAuthenticated,
    getAccessTokenSilently,
    error: auth0Error,
    user,
  } = useAuth0();

  const {
    data: managementApiUser,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    "managementApiUser",
    async () => {
      let accessToken;

      try {
        accessToken = await getAccessTokenSilently({
          audience: managementApi.defaults.baseURL,
          scope: "read:current_user update:current_user_metadata",
        });
      } catch (e) {
        console.error(e);
      }

      const { data } = await managementApi.get(`/users/${user?.sub}`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
      console.log(data);
      return data;
    },
    { enabled: !auth0IsLoading && isAuthenticated }
  );

  const [userMetadata, setUserMetadata] = useState<{}>({});
  const [json, setJson] = useState<string>("");
  const [jsonError, setJsonError] = useState<Error | undefined>(undefined);

  const parseFromJsonDebounced = useDebouncedCallback((newJson: string) => {
    try {
      const newData = JSON.parse(newJson);
      setUserMetadata(newData);
      setJsonError(undefined);
    } catch (e) {
      setJsonError(e as Error);
    }
  }, debounceWait);

  const content = (() => {
    if (isLoading) {
      return <LinearProgress />;
    }

    if (!isAuthenticated) {
      return (
        <Typography variant="h5" component="h2" gutterBottom>
          Authentication required.
        </Typography>
      );
    }

    if (auth0Error) {
      const { name, message, cause, stack } = auth0Error;
      return <JsonView src={{ error: { name, message, cause, stack } }} />;
    }

    return (
      <>
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
                parseFromJsonDebounced(newJson);
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <JsonView
              src={typeof userMetadata === "object" ? userMetadata : {}}
              onAdd={(p) => setUserMetadata(p.updated_src)}
              onEdit={(p) => setUserMetadata(p.updated_src)}
              onDelete={(p) => setUserMetadata(p.updated_src)}
            />
          </Grid>
        </Grid>
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
