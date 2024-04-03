import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  UpdateParsleySettingsMutation,
  UpdateParsleySettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_PARSLEY_SETTINGS } from "gql/mutations";
import { parsleySettingsMock } from "test_data/parsleySettings";
import { act, renderHook, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { useParsleySettings } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[parsleySettingsMock, updateSettingsFailedMock]}>
    {children}
  </MockedProvider>
);

describe("useParsleySettings", () => {
  it("properly fetches user settings", async () => {
    RenderFakeToastContext();

    const { result } = renderHook(() => useParsleySettings(), { wrapper });
    await waitFor(() => {
      expect(result.current.settings.jumpToFailingLineEnabled).toBe(true);
    });
  });

  it("dispatches warning toast if failed to save preferences", async () => {
    const { dispatchToast } = RenderFakeToastContext();

    const { result } = renderHook(() => useParsleySettings(), { wrapper });
    act(() => {
      result.current.updateSettings({ jumpToFailingLineEnabled: false });
    });
    await waitFor(() => {
      expect(dispatchToast.warning).toHaveBeenCalledTimes(1);
    });
  });
});

const updateSettingsFailedMock: ApolloMock<
  UpdateParsleySettingsMutation,
  UpdateParsleySettingsMutationVariables
> = {
  error: new Error("Failed to update Parsley settings!"),
  request: {
    query: UPDATE_PARSLEY_SETTINGS,
    variables: {
      opts: {
        parsleySettings: {
          jumpToFailingLineEnabled: false,
        },
      },
    },
  },
};
