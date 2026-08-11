import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { ViaProvider } from "@via-ds/components/provider";
import { ColorScheme } from "@via-ds/components/types";
import { useNavigate } from "react-router-dom";
import { ToastProvider } from "@evg-ui/lib/context/toast";
import GQLWrapper from "gql/GQLWrapper";

const ContextProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  return (
    <GQLWrapper>
      <LeafyGreenProvider baseFontSize={14}>
        {/* Pin Via's browser-derived defaults: left unset, `navigate` does a
            full page reload, dir/lang follow navigator.language, and Via's
            light-dark() CSS follows the OS color scheme. */}
        <ViaProvider
          colorScheme={ColorScheme.Light}
          locale="en-US"
          navigate={navigate}
        >
          <ToastProvider>{children}</ToastProvider>
        </ViaProvider>
      </LeafyGreenProvider>
    </GQLWrapper>
  );
};

export default ContextProviders;
