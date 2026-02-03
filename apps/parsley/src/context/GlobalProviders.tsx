import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { ToastProvider } from "@evg-ui/lib/context";
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
}) => (
  <LeafyGreenProvider>
    <ToastProvider>
      <GQLProvider>
        <LogContextProvider>
          <MultiLineSelectContextProvider>
            <ChatProvider>{children}</ChatProvider>
          </MultiLineSelectContextProvider>
        </LogContextProvider>
      </GQLProvider>
    </ToastProvider>
  </LeafyGreenProvider>
);

export default GlobalProviders;
