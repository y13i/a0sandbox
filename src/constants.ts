import packageInfo from "../package.json";
import { createRemoteJWKSet } from "jose";

export const debounceWait = 333;
export const appName = packageInfo.name;
// prettier-ignore
export const jwksUrl = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}/.well-known/jwks.json`;
export const jwks = createRemoteJWKSet(new URL(jwksUrl));
