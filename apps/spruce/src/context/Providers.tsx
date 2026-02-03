import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { ToastProvider } from "@evg-ui/lib/context";
import GQLWrapper from "gql/GQLWrapper";

const ContextProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <GQLWrapper>
    <LeafyGreenProvider baseFontSize={14}>
      <ToastProvider>{children}</ToastProvider>
    </LeafyGreenProvider>
  </GQLWrapper>
);

export default ContextProviders;
