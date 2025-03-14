import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { ToastProvider } from "@evg-ui/lib/context/toast";

export const ContextProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <LeafyGreenProvider baseFontSize={14}>
    <ToastProvider>{children}</ToastProvider>
  </LeafyGreenProvider>
);
