import { MockedProvider } from "@evg-ui/lib/test_utils";
import { LogContextProvider } from "..";

export const logContextWrapper = (logs: string[] = []) => {
  const renderContent = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={[]}>
      <LogContextProvider initialLogLines={logs}>{children}</LogContextProvider>
    </MockedProvider>
  );
  return renderContent;
};
