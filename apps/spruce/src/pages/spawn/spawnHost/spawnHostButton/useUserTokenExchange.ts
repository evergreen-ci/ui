import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { TokenExchangeState } from "components/Spawn/spawnHostModal/constants";
import { FASTER_POLL_INTERVAL } from "constants/index";
import {
  UserTokenExchangeQuery,
  UserTokenExchangeQueryVariables,
} from "gql/generated/types";
import { USER_TOKEN_EXCHANGE } from "gql/queries";

/**
 * How much of a buffer we allow before the token expires. Once the token only has
 * this much time left, we request that the user re-authenticate.
 * This is currently set to 20 minutes.
 */
export const SPAWN_HOST_ACCESS_TOKEN_BUFFER_MS = 20 * 60 * 1000;

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

export const getSpawnHostTokenExchangeState = (
  tokenExpiresAt: Date | string | null | undefined,
  hasTokenExchangePending: boolean | undefined,
  nowMs: number = Date.now(),
): TokenExchangeState => {
  if (hasTokenExchangePending) {
    return TokenExchangeState.ExchangePending;
  }
  if (isTokenValid(tokenExpiresAt, nowMs)) {
    return TokenExchangeState.TokenValid;
  }
  return TokenExchangeState.NeedsAuthentication;
};

export const useUserTokenExchange = (skip: boolean): TokenExchangeState => {
  const [loadTokenExchange, { data: userData, refetch, stopPolling }] =
    useLazyQuery<UserTokenExchangeQuery, UserTokenExchangeQueryVariables>(
      USER_TOKEN_EXCHANGE,
      {
        fetchPolicy: "no-cache",
        // Polling begins after the first time `loadTokenExchange` runs.
        pollInterval: FASTER_POLL_INTERVAL,
      },
    );

  useEffect(() => {
    if (skip) {
      return;
    }
    void loadTokenExchange();
    return () => {
      stopPolling?.();
    };
  }, [skip, loadTokenExchange, stopPolling]);

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

  if (skip) {
    return TokenExchangeState.NeedsAuthentication;
  }

  return getSpawnHostTokenExchangeState(
    userData?.user?.tokenAccessTokenExpiresAt,
    userData?.user?.hasTokenExchangePending,
  );
};
