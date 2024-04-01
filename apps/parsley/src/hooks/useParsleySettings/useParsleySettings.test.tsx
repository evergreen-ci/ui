import { MockedProvider } from "@apollo/client/testing";
import { parsleySettingsMock } from "test_data/parsleySettings";
import { renderHook, waitFor } from "test_utils";
import { useParsleySettings } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[parsleySettingsMock]}>{children}</MockedProvider>
);

describe("useParsleySettings", () => {
  it("properly fetches user settings", async () => {
    const { result } = renderHook(() => useParsleySettings(), { wrapper });
    await waitFor(() => {
      expect(result.current.settings.jumpToFailingLineEnabled).toBe(true);
    });
  });
});
