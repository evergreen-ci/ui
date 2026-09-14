import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { ViaProvider } from "@via-ds/components/provider";
import { ColorScheme } from "@via-ds/components/types";
import { useNavigate } from "react-router-dom";
import { ToastProvider } from "@evg-ui/lib/context/toast";
import { ChatProvider } from "components/Chatbot";
import GQLProvider from "gql/GQLProvider";
import { LogContextProvider } from "./LogContext";
import { MultiLineSelectContextProvider } from "./MultiLineSelectContext";

/**
 * GlobalProviders wrap our application with our global contexts
 * @param props - React props
 * @param props.children - Children to be wrapped
 * @returns the application wrapped with our global contexts
 */
const GlobalProviders: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const navigate = useNavigate();

  return (
    <LeafyGreenProvider>
      {/* Without locale, ViaProvider derives the wrapper's dir/lang from
          navigator.language, so an RTL browser locale flips the whole app. */}
      <ViaProvider
        colorScheme={ColorScheme.Light}
        locale="en-US"
        navigate={navigate}
      >
        <ToastProvider portalClassName="parsley-toast-portal">
          <GQLProvider>
            <LogContextProvider>
              <MultiLineSelectContextProvider>
                <ChatProvider>{children}</ChatProvider>
              </MultiLineSelectContextProvider>
            </LogContextProvider>
          </GQLProvider>
        </ToastProvider>
      </ViaProvider>
    </LeafyGreenProvider>
  );
};

export default GlobalProviders;
