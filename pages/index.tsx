import type { NextPage } from "next";
import Link from "next/link";
import Typography from "@mui/material/Typography";

import { WithHead } from "../components/WithHead";

import { usePageAttributes } from "../hooks/usePageAttributes";
import { appName } from "../src/constants";

const _: NextPage = () => {
  return (
    <WithHead title="Home" description="Auth0 testing app.">
      <Typography variant="h4" component="h1" gutterBottom>
        {appName}
      </Typography>
      {usePageAttributes().map((pa) => (
        <div key={pa.title}>
          <Typography variant="h5" component="h2" gutterBottom>
            <Link href={pa.path} passHref>
              {pa.title}
            </Link>
            {" - "}
            {pa.description}
          </Typography>
        </div>
      ))}
    </WithHead>
  );
};

export default _;
