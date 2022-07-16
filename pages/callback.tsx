import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";

const _: NextPage = () => {
  const { handleRedirectCallback } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    handleRedirectCallback().then(() => {
      router.replace((router.query.backTo as string | undefined) ?? "/");
    });
  }, [handleRedirectCallback, router]);

  return <></>;
};

export default _;
