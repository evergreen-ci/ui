import { useEffect, useRef } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
import { UserQuery } from "gql/generated/types";
import { USER } from "gql/queries";
import { isIncompleteForRequiredSpawn } from "./tokenExchange";

export const useSpawnHostTokenExchangeUser = (enabled: boolean) => {
  const prevIncompleteForSpawnRef = useRef<boolean | undefined>(undefined);
  const { data, loading, refetch, startPolling, stopPolling } =
    useQuery<UserQuery>(
      USER,
      enabled
        ? {
            // Fetching the latest user data allows for a fresh check of the token expiration.
            // This allows the user to spawn a host right after they complete the OAuth flow.
            fetchPolicy: "no-cache",
            notifyOnNetworkStatusChange: false,
          }
        : skipToken,
    );

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const onFocus = () => {
      void refetch();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [enabled, refetch]);

  useEffect(() => {
    if (!enabled) {
      prevIncompleteForSpawnRef.current = undefined;
      stopPolling();
    }
  }, [enabled, stopPolling]);

  const incompleteForRequiredSpawn =
    data !== undefined
      ? isIncompleteForRequiredSpawn(data.user ?? undefined)
      : undefined;

  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (incompleteForRequiredSpawn === undefined) {
      return;
    }
    if (
      prevIncompleteForSpawnRef.current === true &&
      incompleteForRequiredSpawn === false
    ) {
      stopPolling();
    }
    prevIncompleteForSpawnRef.current = incompleteForRequiredSpawn;
  }, [enabled, incompleteForRequiredSpawn, stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  return {
    /** True while the `User` query for this modal is in flight. */
    loading,
    /** Start polling after opening OAuth so in-flight exchange updates without waiting for focus. */
    startPolling,
    user: data?.user,
  };
};
