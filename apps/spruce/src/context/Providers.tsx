import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { ToastProvider } from "@evg-ui/lib/context/toast";
import { AuthProvider } from "context/Auth";

export const ContextProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AuthProvider>
    <LeafyGreenProvider baseFontSize={14}>
      <ToastProvider>{children}</ToastProvider>
    </LeafyGreenProvider>
  </AuthProvider>
);
