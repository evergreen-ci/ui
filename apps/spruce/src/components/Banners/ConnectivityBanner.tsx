import { Banner } from "@via-ds/components";
import { useNetworkStatus } from "hooks";

export const ConnectivityBanner = () => {
  const isOnline = useNetworkStatus();
  return !isOnline ? <Banner variant="warning">You are offline.</Banner> : null;
};
