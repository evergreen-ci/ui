import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { UserQuery } from "gql/generated/types";
import { USER } from "gql/queries";

export const useSpawnHostTokenExchangeUser = (enabled: boolean) => {
  const { data, loading, refetch, startPolling, stopPolling } =
    useQuery<UserQuery>(USER, {
      skip: !enabled,
      // Avoid trusting cached User from the rest of the app for spawn gating: stale
      // tokenAccessTokenExpiresAt can keep "Spawn a host" enabled incorrectly.
      fetchPolicy: enabled ? "network-only" : undefined,
      notifyOnNetworkStatusChange: false,
    });

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
      stopPolling();
    }
    return () => {
      stopPolling();
    };
  }, [enabled, stopPolling]);

  return {
    /** True while the `User` query for this modal is in flight. */
    loading,
    /** Start polling after opening OAuth so in-flight exchange updates without waiting for focus. */
    startPolling,
    user: data?.user,
  };
};
