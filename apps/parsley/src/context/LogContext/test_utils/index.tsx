import { MockedProvider } from "@apollo/client/testing";
import { SectionsFeatureDiscoveryContextProvider } from "context/SectionsFeatureDiscoveryContext";
import { parsleySettingsMock } from "test_data/parsleySettings";
import { LogContextProvider } from "..";

export const logContextWrapper = (logs: string[] = []) =>
  function ({ children }: { children: React.ReactNode }) {
    return (
      <SectionsFeatureDiscoveryContextProvider>
        <MockedProvider mocks={[parsleySettingsMock]}>
          <LogContextProvider initialLogLines={logs}>
            {children}
          </LogContextProvider>
        </MockedProvider>
      </SectionsFeatureDiscoveryContextProvider>
    );
  };
