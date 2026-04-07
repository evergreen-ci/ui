import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { FASTER_POLL_INTERVAL } from "constants/index";
import { UserQuery, UserQueryVariables } from "gql/generated/types";
import { USER } from "gql/queries";

/**
 * How much of a buffer we allow before the token expires. Once the token only has
 * this much time left, we request that the user re-authenticate.
 * This is currently set to 20 minutes.
 */
export const SPAWN_HOST_ACCESS_TOKEN_BUFFER_MS = 20 * 60 * 1000;

export const useUserHasValidToken = (skip: boolean): boolean => {
  const { data: userData, refetch } = useUser(skip);
  const tokenExpiresAt = userData?.user?.tokenAccessTokenExpiresAt;

  // While the spawn modal is open, refetch when the user returns to this tab after
  // completing token exchange in another window.
  useEffect(() => {
    if (skip) {
      return;
    }

    const onFocus = () => void refetch();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [skip, refetch]);

  return isTokenValid(tokenExpiresAt);
};

export const useUserIsUndergoingAuthentication = (skip: boolean): boolean => {
  const { data: userData } = useUser(skip);
  return !!userData?.user?.hasTokenExchangePending;
};

const useUser = (skip: boolean) =>
  useQuery<UserQuery, UserQueryVariables>(USER, {
    skip,
    fetchPolicy: "no-cache",
    // We poll faster than normal because users expect to see
    // faster feedback after performing the authentication flow.
    pollInterval: skip ? 0 : FASTER_POLL_INTERVAL,
  });

export const isTokenValid = (
  tokenExpiresAt: Date | string | null | undefined,
  nowMs: number = Date.now(),
): boolean => {
  if (tokenExpiresAt == null) {
    return false;
  }
  const expiresMs = new Date(tokenExpiresAt).getTime();
  if (!Number.isFinite(expiresMs)) {
    return false;
  }
  return expiresMs > nowMs + SPAWN_HOST_ACCESS_TOKEN_BUFFER_MS;
};
