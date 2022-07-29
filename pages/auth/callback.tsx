import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";

import { WithHead } from "../../components/WithHead";

const _: NextPage = () => {
  const router = useRouter();
  const { returnTo, error, error_description } = router.query;

  useEffect(() => {
    if (router.isReady && !error) {
      router.push((returnTo as string | undefined) ?? "/");
    }
  }, [router, returnTo, error]);

  return (
    <WithHead title="Callback" description="Auth0 authentication callback.">
      {error ? (
        <>
          <Typography variant="h5" component="h2" gutterBottom>
            Error: {error}
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom>
            {error_description}
          </Typography>
        </>
      ) : (
        <></>
      )}
    </WithHead>
  );
};

export default _;
