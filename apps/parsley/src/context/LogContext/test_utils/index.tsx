import { MockedProvider } from "@evg-ui/lib/test_utils";
import { parsleySettingsMock } from "test_data/parsleySettings";
import { LogContextProvider } from "..";

export const logContextWrapper = (logs: string[] = []) => {
  const renderContent = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={[parsleySettingsMock]}>
      <LogContextProvider initialLogLines={logs}>{children}</LogContextProvider>
    </MockedProvider>
  );
  return renderContent;
};
