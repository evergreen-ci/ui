import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { ViaProvider } from "@via-ds/components/provider";
import { ColorScheme } from "@via-ds/components/types";
import { useHref, useNavigate } from "react-router-dom";
import { ToastProvider } from "@evg-ui/lib/context/toast";
import GQLWrapper from "gql/GQLWrapper";

const ContextProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  return (
    <GQLWrapper>
      <LeafyGreenProvider baseFontSize={14}>
        {/* Via defaults `navigate` to a full page reload; hand it react-router
            so Via links navigate client-side. */}
        <ViaProvider
          colorScheme={ColorScheme.Light}
          navigate={(path) => navigate(path)}
          useHref={useHref}
        >
          <ToastProvider>{children}</ToastProvider>
        </ViaProvider>
      </LeafyGreenProvider>
    </GQLWrapper>
  );
};

export default ContextProviders;
