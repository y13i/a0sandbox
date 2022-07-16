import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const _: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace((router.query.backTo as string | undefined) ?? "/");
  }, [router]);

  return <></>;
};

export default _;
