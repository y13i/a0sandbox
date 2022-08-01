import packageInfo from "../package.json";
import { createRemoteJWKSet } from "jose";

export const {
  NEXT_PUBLIC_BASE_URI: baseUri,
  NEXT_PUBLIC_AUTH0_DOMAIN: auth0Domain,
  NEXT_PUBLIC_AUTH0_CLIENT_ID: auth0ClientId,
} = process.env;

export const debounceWait = 333;
export const appName = packageInfo.name;
// prettier-ignore
export const jwksUrl = `https://${auth0Domain}/.well-known/jwks.json`;
export const jwks = createRemoteJWKSet(new URL(jwksUrl));

// prettier-ignore
export const managementApiBaseUrl = `https://${auth0Domain}/api/v2/`;
