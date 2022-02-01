import { useState, useEffect } from "react";
import { NextPage } from "next";
import { Base64 } from "js-base64";
import Grid from "@mui/material/Grid";
import CodeIcon from "@mui/icons-material/Code";

import { CodeTextField } from "../components/CodeTextField";
import { WithHead } from "../components/WithHead";
import { PageAttribute, encode, decode } from "../utils";

export const pageAttribute: PageAttribute = {
  title: "Base64",
  description: "Encode/decode Base64.",
  path: "/base64",
  icon: <CodeIcon />,
};

type State = {
  plain: string;
  base64: string;
  decodeError?: Error;
};

const _: NextPage = () => {
  const [state, setState] = useState<State>({
    plain: "",
    base64: "",
  });

  const updateData = (plain: string, base64?: string) => {
    setState({
      plain,
      base64: base64 ?? Base64.encode(plain),
    });
  };

  useEffect(() => {
    if (!window) return;

    const encodedData = new URL(window.location.href).searchParams?.get("d");

    if (!encodedData) return;

    (async () => {
      updateData((await decode(encodedData)) as string);
    })();
  }, []);

  useEffect(() => {
    if (!window || state.plain.length === 0) return;

    (async () => {
      const encodedData = await encode(state.plain);
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams();
      searchParams.set("d", encodedData);
      const newUrl = url.origin + url.pathname + "?" + searchParams.toString();

      if (newUrl.length < 2048) {
        history.replaceState(undefined, "", newUrl);
      }
    })();
  }, [state.plain]);

  return (
    <WithHead {...pageAttribute}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CodeTextField
            multiline
            label="Plain Text"
            value={state.plain}
            onChange={(event) => {
              updateData(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CodeTextField
            multiline
            label="Base64 Encoded"
            error={!!state.decodeError}
            helperText={state.decodeError?.toString()}
            value={state.base64}
            onChange={(event) => {
              const base64 = event.target.value;

              try {
                const plain = Base64.decode(base64);
                updateData(plain, base64);
              } catch (e) {
                setState({
                  base64,
                  plain: state.plain,
                  decodeError: e as Error,
                });
              }
            }}
          />
        </Grid>
      </Grid>
    </WithHead>
  );
};

export default _;
