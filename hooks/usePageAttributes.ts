import { ReactNode } from "react";

import { pageAttribute as jsonYaml } from "../pages/json-yaml";
import { pageAttribute as encodeDecode } from "../pages/encode-decode";
import { pageAttribute as myip } from "../pages/myip";
import { pageAttribute as password } from "../pages/password";
import { pageAttribute as uuid } from "../pages/uuid";

export type PageAttribute = {
  title: string;
  description: string;
  path: string;
  icon: ReactNode;
};

export function usePageAttributes(): PageAttribute[] {
  return [jsonYaml, encodeDecode, myip, password, uuid];
}
