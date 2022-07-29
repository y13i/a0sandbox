import { useEffect } from "react";
import type { NextPage } from "next";
import { useAuth0 } from "@auth0/auth0-react";

import { WithHead } from "../../components/WithHead";

const _: NextPage = () => {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return (
    <WithHead title="Login" description="Login with Auth0.">
      <></>
    </WithHead>
  );
};

export default _;
