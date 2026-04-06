import { useEffect } from "react";
import { skipToken, useQuery } from "@apollo/client/react";
import { UserQuery } from "gql/generated/types";
import { USER } from "gql/queries";

export const useSpawnHostTokenExchangeUser = (enabled: boolean) => {
  const { data, loading, refetch, startPolling, stopPolling } =
    useQuery<UserQuery>(
      USER,
      enabled
        ? {
            // Fetching the latest user data allows for a fresh check of the token expiration.
            // This allows the user to spawn a host right after they complete the OAuth flow.
            fetchPolicy: "network-only",
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
