import packageInfo from "../package.json";
import { createRemoteJWKSet } from "jose";
import axios from "axios";

export const baseUri = process.env.NEXT_PUBLIC_BASE_URI!;
export const auth0Domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
export const auth0ClientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;

export const debounceWait = 333;
export const appName = packageInfo.name;
// prettier-ignore
export const jwksUrl = `https://${auth0Domain}/.well-known/jwks.json`;
export const jwks = createRemoteJWKSet(new URL(jwksUrl));

export const managementApi = axios.create({
  baseURL: `https://${auth0Domain}/api/v2/`,
});
