import { NextPage } from "next";
import { useQuery } from "react-query";
import axios from "axios";

import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import KeyIcon from "@mui/icons-material/Key";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";

import { JsonView } from "../components/JsonView";
import { WithHead } from "../components/WithHead";
import { PageAttribute } from "../hooks/usePageAttributes";
import { jwksUrl } from "../src/utils";

export const pageAttribute: PageAttribute = {
  title: "JWKS",
  description: "Shows the Auth0 tenant's JSON Web Key Set.",
  path: "/jwks",
  icon: <KeyIcon />,
};

const _: NextPage = () => {
  const {
    data: jwks,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery("jwks", async () => {
    const { data } = await axios.get(jwksUrl);
    return data;
  });

  const content = (() => {
    if (isLoading || isFetching) {
      return <LinearProgress />;
    }

    if (error) {
      return <JsonView src={{ error }} />;
    }

    return (
      <>
        <JsonView src={jwks} />
      </>
    );
  })();

  return (
    <WithHead {...pageAttribute}>
      <Typography variant="h4" component="h1" gutterBottom>
        {pageAttribute.title}
      </Typography>
      <Button startIcon={<RefreshIcon />} onClick={() => refetch()}>
        Refetch
      </Button>
      {content}
    </WithHead>
  );
};

export default _;
