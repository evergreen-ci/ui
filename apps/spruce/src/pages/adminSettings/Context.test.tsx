import { act, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BannerTheme } from "gql/generated/types";
import { AdminSettingsProvider, useAdminSettingsContext } from "./Context";
import { AnnouncementsFormState } from "./tabs/GeneralTab/AnnouncementsTab/types";
import { WritableAdminSettingsType } from "./tabs/types";

describe("adminSettingsContext", () => {
  it("ensure that tabs are initially saved", () => {
    const { result } = renderHook(() => useAdminSettingsContext(), {
      wrapper: AdminSettingsProvider,
    });
    expect(
      result.current.getTab(AdminSettingsGeneralSection.Announcements)
        .hasChanges,
    ).toBe(false);
  });

  it("checkHasUnsavedChanges", async () => {
    const { result } = renderHook(() => useAdminSettingsContext(), {
      wrapper: AdminSettingsProvider,
    });

    act(() => {
      result.current.setInitialData({
        [AdminSettingsGeneralSection.Announcements]: {
          announcements: {
            banner: "initial text",
            bannerTheme: BannerTheme.Announcement,
          },
        },
      } as Record<WritableAdminSettingsType, AnnouncementsFormState>);
    });

    act(() => {
      result.current.updateForm(AdminSettingsGeneralSection.Announcements)({
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
        [AdminSettingsGeneralSection.Announcements]: {
          announcements: {
            banner: "initial text",
            bannerTheme: BannerTheme.Announcement,
          },
        },
      } as Record<WritableAdminSettingsType, AnnouncementsFormState>);
    });

    act(() => {
      result.current.updateForm(AdminSettingsGeneralSection.Announcements)({
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
        AdminSettingsGeneralSection.Announcements,
      ]);
    });
  });
});
