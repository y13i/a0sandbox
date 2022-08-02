import { useEffect } from "react";
import type { NextPage } from "next";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";

import { baseUri } from "../../src/utils";
import { WithHead } from "../../components/WithHead";

const _: NextPage = () => {
  const { logout } = useAuth0();
  const router = useRouter();

  const { returnTo } = router.query;

  useEffect(() => {
    logout({ returnTo: `${baseUri}/${returnTo}` });
  }, [logout, returnTo]);

  return (
    <WithHead title="Logout" description="Logout.">
      <></>
    </WithHead>
  );
};

export default _;
