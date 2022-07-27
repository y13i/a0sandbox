import { FC, ComponentProps } from "react";
import NextLink from "next/link";
import { SxProps } from "@mui/material";
import MuiLink from "@mui/material/Link";

export const Link: FC<
  ComponentProps<typeof NextLink> & {
    underline?: "none" | "hover" | "always";
    sx?: SxProps;
  }
> = (props) => (
  <NextLink {...props} passHref>
    <MuiLink
      target={props.target || "_self"}
      rel="noopener noreferrer"
      underline={props.underline || "always"}
      color={props.color || "secondary"}
      sx={props.sx}
    >
      {props.children}
    </MuiLink>
  </NextLink>
);
