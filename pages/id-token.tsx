import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useAuth0, IdToken } from "@auth0/auth0-react";

import BadgeIcon from "@mui/icons-material/Badge";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

import { CodeTextField } from "../components/CodeTextField";
import { JsonView } from "../components/JsonView";
import { WithHead } from "../components/WithHead";
import { PageAttribute } from "../hooks/usePageAttributes";

export const pageAttribute: PageAttribute = {
  title: "ID Token",
  description: "Shows the ID Token for the authenticated user.",
  path: "/id-token",
  icon: <BadgeIcon />,
};

const _: NextPage = () => {
  const { isLoading, isAuthenticated, getIdTokenClaims, error, user } =
    useAuth0();

  const [idToken, setIdToken] = useState<IdToken>();

  useEffect(() => {
    getIdTokenClaims()
      .then((idToken) => setIdToken(idToken))
      .catch((e) => console.error(e));
  }, [getIdTokenClaims]);

  return (
    <WithHead {...pageAttribute}>
      <JsonView src={{ isLoading, isAuthenticated, error, user }} />
    </WithHead>
  );
  // const content = (() => {
  //   if (isLoading) {
  //     return <LinearProgress />;
  //   }

  //   if (!isAuthenticated) {
  //     return (
  //       <Typography variant="h3" gutterBottom>
  //         Authentication required.
  //       </Typography>
  //     );
  //   }

  //   if (error) {
  //     const { name, message, cause, stack } = error;
  //     return <JsonView src={{ error: { name, message, cause, stack } }} />;
  //   }

  //   return (
  //     <>
  //       <CodeTextField label="Raw" disabled value={idToken?.__raw} />
  //       <JsonView src={typeof user === "object" ? user : {}} />
  //     </>
  //   );
  // })();

  // return <WithHead {...pageAttribute}>{content}</WithHead>;
};

export default _;
