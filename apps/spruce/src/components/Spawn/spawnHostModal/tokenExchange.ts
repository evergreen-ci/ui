import { UserQuery } from "gql/generated/types";

type User = UserQuery["user"];

/**
 * How much of a buffer we allow before the token expires. Once the token only has
 * this much time left, we request that the user re-authenticate.
 * This is currently set to 20 minutes.
 */
export const REAUTH_BUFFER_MS = 20 * 60 * 1000;

export const getReauthenticationOpensAt = (
  expiresAt: Date | string | number,
): Date => {
  const expiryMs = new Date(expiresAt).getTime();
  return new Date(expiryMs - REAUTH_BUFFER_MS);
};

export const isExchangeBlocking = (user: User | undefined) => {
  if (user?.hasTokenExchangePending) {
    return true;
  }
  const expiresAt = user?.tokenAccessTokenExpiresAt;
  if (expiresAt != null && new Date(expiresAt).getTime() < Date.now()) {
    return true;
  }
  return false;
};

export const isIncompleteForRequiredSpawn = (user: User | undefined) => {
  if (isExchangeBlocking(user)) {
    return true;
  }
  if (user?.tokenAccessTokenExpiresAt != null) {
    return false;
  }
  return !user?.hasTokenExchangePending;
};

export const isNeedlesslyFresh = (
  user: User | undefined,
  nowMs: number = Date.now(),
) => {
  if (user?.hasTokenExchangePending) {
    return false;
  }
  const expiresAt = user?.tokenAccessTokenExpiresAt;
  if (expiresAt == null) {
    return false;
  }
  const expiryMs = new Date(expiresAt).getTime();
  if (expiryMs <= nowMs) {
    return false;
  }
  const opensAtMs = getReauthenticationOpensAt(expiresAt).getTime();
  return nowMs < opensAtMs;
};

export const formatExpiresAtLocal = (expiresAt: Date, timeZone: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeZone,
    timeStyle: "short",
  }).format(expiresAt);
