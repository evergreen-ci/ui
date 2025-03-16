import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { AuthProvider } from "@evg-ui/lib/context/AuthProvider";
import { ToastProvider } from "@evg-ui/lib/context/toast";
import { routes } from "constants/routes";
import GQLWrapper from "gql/GQLWrapper";
import { getEvergreenUrl, isLocal } from "utils/environmentVariables";

export const ContextProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AuthProvider
    evergreenAppURL={getEvergreenUrl()}
    localAuthRoute={routes.login}
    remoteAuthURL={`${getEvergreenUrl()}/login`}
    shouldUseLocalAuth={isLocal()}
  >
    <GQLWrapper>
      <LeafyGreenProvider baseFontSize={14}>
        <ToastProvider>{children}</ToastProvider>
      </LeafyGreenProvider>
    </GQLWrapper>
  </AuthProvider>
);
