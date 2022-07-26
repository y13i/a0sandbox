import { useEffect } from "react";
import type { NextPage } from "next";
import { useAuth0 } from "@auth0/auth0-react";

import { WithHead } from "../components/WithHead";

const _: NextPage = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <WithHead title="Logout" description="Logout.">
      <></>
    </WithHead>
  );
};

export default _;
