import {
  ApolloMock,
  MockedProvider,
  RenderFakeToastContext,
  act,
  renderHook,
  waitFor,
} from "@evg-ui/lib/test_utils";
import {
  UpdateParsleySettingsMutation,
  UpdateParsleySettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_PARSLEY_SETTINGS } from "gql/mutations";
import { parsleySettingsMock } from "test_data/parsleySettings";
import { useParsleySettings } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[parsleySettingsMock, updateSettingsFailedMock]}>
    {children}
  </MockedProvider>
);

describe("useParsleySettings", () => {
  it("fetches user settings", async () => {
    RenderFakeToastContext();

    const { result } = renderHook(() => useParsleySettings(), { wrapper });
    await waitFor(() => {
      expect(result.current?.settings?.jumpToFailingLineEnabled).toBe(true);
    });
  });

  it("dispatches warning toast if an error occurs when saving preferences", async () => {
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
