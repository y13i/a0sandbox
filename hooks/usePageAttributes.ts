import { Token } from "@mui/icons-material";
import { ReactNode } from "react";

import { pageAttribute as idToken } from "../pages/id-token";

export type PageAttribute = {
  title: string;
  description: string;
  path: string;
  icon: ReactNode;
};

export function usePageAttributes(): PageAttribute[] {
  return [idToken];
}
