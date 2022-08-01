import { ReactNode } from "react";

import { pageAttribute as idToken } from "../pages/id-token";
import { pageAttribute as jwks } from "../pages/jwks";
import { pageAttribute as userMetadata } from "../pages/user-metadata";

export type PageAttribute = {
  title: string;
  description: string;
  path: string;
  icon: ReactNode;
};

export function usePageAttributes(): PageAttribute[] {
  return [idToken, jwks, userMetadata];
}
