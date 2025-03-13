import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { AuthProvider } from "@evg-ui/lib/context/AuthProvider";
import { ToastProvider } from "@evg-ui/lib/context/toast";
import {
  isRemoteEnv,
  getCorpLoginURL,
  getUiUrl,
  getSpruceURL,
} from "utils/environmentVariables";

export const ContextProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AuthProvider
    localAppURL={getUiUrl()}
    localAuthURL={`${getSpruceURL()}/login`}
    remoteAuthURL={getCorpLoginURL()}
    shouldUseLocalAuth={!isRemoteEnv()}
  >
    <LeafyGreenProvider baseFontSize={14}>
      <ToastProvider>{children}</ToastProvider>
    </LeafyGreenProvider>
  </AuthProvider>
);
