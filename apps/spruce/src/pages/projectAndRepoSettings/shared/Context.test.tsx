import { AjvError } from "@rjsf/core";
import { act, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { ProjectSettingsProvider, useProjectSettingsContext } from "./Context";
import { WritableProjectSettingsType } from "./tabs/types";

describe("projectSettingsContext", () => {
  it("ensure that tab are initially saved", async () => {
    const { result } = renderHook(() => useProjectSettingsContext(), {
      wrapper: ProjectSettingsProvider,
    });

    expect(
      result.current.getTab(ProjectSettingsTabRoutes.General).hasChanges,
    ).toBe(false);
  });

  it("updating the form state unsaves the tab", async () => {
    const { result } = renderHook(() => useProjectSettingsContext(), {
      wrapper: ProjectSettingsProvider,
    });

    act(() => {
      result.current.setInitialData({
        [ProjectSettingsTabRoutes.Variables]: {
          vars: [],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as Record<WritableProjectSettingsType, any>);
    });

    act(() => {
      result.current.updateForm(ProjectSettingsTabRoutes.Variables)({
        errors: [],
        formData: {
          vars: [
            {
              isAdminOnly: false,
              isDisabled: false,
              isPrivate: false,
              varDescription: "",
              varName: "test_name",
              varValue: "test_value",
            },
          ],
        },
      });
    });

    await waitFor(() => {
      expect(
        result.current.getTab(ProjectSettingsTabRoutes.Variables).hasChanges,
      ).toBe(true);
    });
  });

  it("updating the form state with identical data does not unsave the tab", async () => {
    const { result } = renderHook(() => useProjectSettingsContext(), {
      wrapper: ProjectSettingsProvider,
    });

    act(() => {
      result.current.setInitialData({
        [ProjectSettingsTabRoutes.Variables]: {
          vars: [
            {
              isAdminOnly: false,
              isDisabled: false,
              isPrivate: false,
              varDescription: "",
              varName: "test_name",
              varValue: "test_value",
            },
          ],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as Record<WritableProjectSettingsType, any>);
    });

    act(() => {
      result.current.updateForm(ProjectSettingsTabRoutes.Variables)({
        errors: [],
        formData: {
          vars: [
            {
              isAdminOnly: false,
              isDisabled: false,
              isPrivate: false,
              varDescription: "",
              varName: "test_name",
              varValue: "test_value",
            },
          ],
        },
      });
    });

    expect(
      result.current.getTab(ProjectSettingsTabRoutes.Variables).hasChanges,
    ).toBe(false);
  });

  it("updating push an error updates the tab's hasError state", async () => {
    const { result } = renderHook(() => useProjectSettingsContext(), {
      wrapper: ProjectSettingsProvider,
    });

    act(() => {
      result.current.setInitialData({
        [ProjectSettingsTabRoutes.Variables]: {
          vars: [],
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as Record<WritableProjectSettingsType, any>);
    });

    act(() => {
      result.current.updateForm(ProjectSettingsTabRoutes.Variables)({
        errors: [{ name: "err" } as AjvError],
        formData: {
          vars: [],
        },
      });
    });

    expect(
      result.current.getTab(ProjectSettingsTabRoutes.Variables).hasError,
    ).toBe(true);
  });
});
