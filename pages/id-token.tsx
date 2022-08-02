import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useAuth0 } from "@auth0/auth0-react";

import BadgeIcon from "@mui/icons-material/Badge";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

import { jwtVerify, JWTPayload, ProtectedHeaderParameters } from "jose";

import { CodeTextField } from "../components/CodeTextField";
import { JsonView } from "../components/JsonView";
import { WithHead } from "../components/WithHead";
import { PageAttribute } from "../hooks/usePageAttributes";
import { jwks } from "../src/utils";

export const pageAttribute: PageAttribute = {
  title: "ID Token",
  description: "Shows the ID Token for the authenticated user.",
  path: "/id-token",
  icon: <BadgeIcon />,
};

const _: NextPage = () => {
  const { isLoading, isAuthenticated, getIdTokenClaims, error, user } =
    useAuth0();

  const [rawIdToken, setRawIdToken] = useState<string>("");
  const [header, setHeader] = useState<ProtectedHeaderParameters | undefined>(
    undefined
  );
  const [payload, setPayload] = useState<JWTPayload | undefined>(undefined);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | undefined>(undefined);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      getIdTokenClaims()
        .then((idToken) => {
          const jwt = idToken?.__raw as string;
          setRawIdToken(jwt || "");
          return jwtVerify(jwt, jwks);
        })
        .then((jwtVerifyResult) => {
          setHeader(jwtVerifyResult.protectedHeader);
          setPayload(jwtVerifyResult.payload);
          setCryptoKey(jwtVerifyResult.key as CryptoKey);
        })
        .catch((e) => console.error(e));
    }
  }, [isLoading, isAuthenticated, getIdTokenClaims]);

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

    if (error) {
      const { name, message, cause, stack } = error;
      return <JsonView src={{ error: { name, message, cause, stack } }} />;
    }

    const { type, extractable, usages, algorithm } = cryptoKey || {};

    return (
      <>
        <CodeTextField label="Raw" disabled value={rawIdToken} />
        <Typography variant="h6" component="h2" gutterBottom>
          <code>user</code> from <code>useAuth0()</code>
        </Typography>
        <JsonView src={typeof user === "object" ? user : {}} />
        <Typography variant="h6" component="h2" gutterBottom>
          Header
        </Typography>
        <JsonView src={typeof header === "object" ? header : {}} />
        <Typography variant="h6" component="h2" gutterBottom>
          Payload
        </Typography>
        <JsonView src={typeof payload === "object" ? payload : {}} />
        <Typography variant="h6" component="h2" gutterBottom>
          CryptoKey
        </Typography>
        <JsonView src={{ type, extractable, usages, algorithm }} />
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
