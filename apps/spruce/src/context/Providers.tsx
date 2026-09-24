import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { ViaProvider } from "@via-ds/components/provider";
import { ColorScheme } from "@via-ds/components/types";
import { useNavigate } from "react-router-dom";
import { ToastProvider } from "@evg-ui/lib/context/toast";
import { NotificationModalProvider } from "components/Notifications/NotificationModalContext";
import GQLWrapper from "gql/GQLWrapper";

const ContextProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  return (
    <GQLWrapper>
      <LeafyGreenProvider baseFontSize={14}>
        {/* Without locale, ViaProvider derives the wrapper's dir/lang from
            navigator.language, so an RTL browser locale flips the whole app. */}
        <ViaProvider
          colorScheme={ColorScheme.Light}
          locale="en-US"
          navigate={navigate}
        >
          <ToastProvider>
            <NotificationModalProvider>{children}</NotificationModalProvider>
          </ToastProvider>
        </ViaProvider>
      </LeafyGreenProvider>
    </GQLWrapper>
  );
};

export default ContextProviders;
