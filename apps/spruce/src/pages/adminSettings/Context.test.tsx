import { act, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { AdminSettingsTabRoutes } from "constants/routes";
import { BannerTheme } from "gql/generated/types";
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
  it("checkHasUnsavedChanges", async () => {
    const { result } = renderHook(() => useAdminSettingsContext(), {
      wrapper: AdminSettingsProvider,
    });

    act(() => {
      result.current.setInitialData({
        [AdminSettingsTabRoutes.Announcements]: {
          announcements: {
            banner: "initial text",
            BannerTheme: BannerTheme.Announcement,
          },
        },
      } as Record<WritableAdminSettingsType, any>);
    });

    act(() => {
      result.current.updateForm(AdminSettingsTabRoutes.Announcements)({
        formData: {
          announcements: {
            banner: "updated text!",
          },
        },
        errors: [],
      });
    });

    await waitFor(() => {
      expect(result.current.checkHasUnsavedChanges()).toEqual(true);
    });
  });

  it("getChangedTabs", async () => {
    const { result } = renderHook(() => useAdminSettingsContext(), {
      wrapper: AdminSettingsProvider,
    });

    act(() => {
      result.current.setInitialData({
        [AdminSettingsTabRoutes.Announcements]: {
          announcements: {
            banner: "initial text",
            BannerTheme: BannerTheme.Announcement,
          },
        },
      } as Record<WritableAdminSettingsType, any>);
    });

    act(() => {
      result.current.updateForm(AdminSettingsTabRoutes.Announcements)({
        formData: {
          announcements: {
            banner: "updated text!",
          },
        },
        errors: [],
      });
    });

    await waitFor(() => {
      expect(result.current.getChangedTabs()).toEqual([
        AdminSettingsTabRoutes.Announcements,
      ]);
    });
  });
});
