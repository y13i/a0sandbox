import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";

import { WithHead } from "../components/WithHead";

const _: NextPage = () => {
  const router = useRouter();
  const { isReady, returnTo, error, error_description } = router.query;

  useEffect(() => {
    if (isReady && !error) {
      router.replace((returnTo as string | undefined) ?? "/");
    }
  }, [router, isReady, returnTo, error]);

  return (
    <WithHead title="Callback" description="Auth0 authentication callback.">
      <Typography variant="h3" gutterBottom>
        Error: {error}
      </Typography>
      <Typography variant="h4" gutterBottom>
        {error_description}
      </Typography>
    </WithHead>
  );
};

export default _;
