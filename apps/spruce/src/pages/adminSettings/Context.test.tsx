import { act, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { AdminSettingsTabRoutes } from "constants/routes";
import { AdminSettingsProvider, useAdminSettingsContext } from "./Context";
import { WritableAdminSettingsType } from "./tabs/types";

describe("adminSettingsContext", () => {
  it("ensure that tabs are initially saved", () => {
    const { result } = renderHook(() => useAdminSettingsContext(), {
      wrapper: AdminSettingsProvider,
    });
    expect(
      result.current.getTab(AdminSettingsTabRoutes.Announcements).hasChanges,
    ).toBe(false);
  });
  it("test check unsave settings", async () => {
    const { result } = renderHook(() => useAdminSettingsContext(), {
      wrapper: AdminSettingsProvider,
    });

    act(() => {
      result.current.setInitialData({
        [AdminSettingsTabRoutes.Announcements]: {
          vars: [],
        },
      } as Record<WritableAdminSettingsType, any>);
    });

    act(() => {
      result.current.updateForm(AdminSettingsTabRoutes.Announcements)({
        formData: {
          announcements: {
            banner: "banner text!",
          },
        },
        errors: [],
      });
    });

    await waitFor(() => {
      // console.log("After updateForm:", result.current.getChangedTabs());
      expect(result.current.checkHasUnsavedChanges()).toEqual(true);
    });
  });

  it("test get changed tabs", async () => {
    const { result } = renderHook(() => useAdminSettingsContext(), {
      wrapper: AdminSettingsProvider,
    });

    act(() => {
      result.current.setInitialData({
        [AdminSettingsTabRoutes.Announcements]: {
          vars: [],
        },
      } as Record<WritableAdminSettingsType, any>);
    });

    act(() => {
      result.current.updateForm(AdminSettingsTabRoutes.Announcements)({
        formData: {
          announcements: {
            banner: "text!",
          },
        },
        errors: [],
      });
    });

    await waitFor(() => {
      // console.log("After updateForm:", result.current.getChangedTabs());
      expect(result.current.getChangedTabs()).toEqual([
        AdminSettingsTabRoutes.Announcements,
      ]);
    });
  });
});
