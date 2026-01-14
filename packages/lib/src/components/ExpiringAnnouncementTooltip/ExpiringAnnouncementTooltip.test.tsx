import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import {
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
} from "../../test_utils";
import { ExpiringAnnouncementTooltip } from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;
const mockedSet = vi.spyOn(Cookie, "set") as MockInstance;

describe("ExpiringAnnouncementTooltip", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  const fakeDate = new Date(2025, 1, 1);
  const oneDayLater = new Date(2025, 1, 2);
  const twoWeeksLater = new Date(2025, 1, 15);

  describe("upon first view of tooltip", () => {
    it("renders with guide cue open if user has never seen it", async () => {
      render(
        <ExpiringAnnouncementTooltip
          cookieName="TEST_COOKIE"
          title="New Release"
        >
          Try out this feature
        </ExpiringAnnouncementTooltip>,
      );
      await waitFor(() => {
        expect(screen.getByText("New Release")).toBeVisible();
      });
    });

    it("does not render if loading", async () => {
      render(
        <ExpiringAnnouncementTooltip
          cookieName="TEST_COOKIE"
          loading
          title="New Release"
        >
          Try out this feature
        </ExpiringAnnouncementTooltip>,
      );
      expect(screen.queryByText("New Release")).not.toBeInTheDocument();
    });

    it("closes the icon when the icon is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <ExpiringAnnouncementTooltip
          cookieName="TEST_COOKIE"
          title="New Release"
        >
          Try out this feature
        </ExpiringAnnouncementTooltip>,
      );

      await waitFor(() => {
        expect(screen.getByText("New Release")).toBeVisible();
      });
      await user.click(screen.getByDataCy("announcement-tooltip-trigger"));
      await waitFor(() => {
        expect(screen.queryByText("New Release")).not.toBeVisible();
      });
    });

    it("sets a cookie with the date and expiration upon close", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      vi.setSystemTime(fakeDate);

      render(
        <ExpiringAnnouncementTooltip
          cookieName="TEST_COOKIE"
          title="New Release"
        >
          Try out this feature
        </ExpiringAnnouncementTooltip>,
      );
      await waitFor(() => {
        expect(screen.getByText("New Release")).toBeVisible();
      });
      await user.click(screen.getByRole("button", { name: "Got it" }));

      await waitFor(() => {
        expect(screen.queryByText("New Release")).not.toBeVisible();
      });

      expect(mockedSet).toHaveBeenCalledExactlyOnceWith(
        "TEST_COOKIE",
        fakeDate.toString(),
        { expires: 365 },
      );
    });
  });

  describe("when user has already seen tooltip within one week", () => {
    it("doesn't open tooltip upon render", async () => {
      mockedGet.mockReturnValue(fakeDate.toString());
      vi.setSystemTime(oneDayLater);

      render(
        <ExpiringAnnouncementTooltip
          cookieName="TEST_COOKIE"
          title="New Release"
        >
          Try out this feature
        </ExpiringAnnouncementTooltip>,
      );
      expect(mockedGet).toHaveBeenCalledOnce();
      expect(screen.queryByText("New Release")).not.toBeInTheDocument();
    });

    it("opens the tooltip when the button is clicked and doesn't update the cookie date on close", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      mockedGet.mockReturnValue(fakeDate.toString());
      vi.setSystemTime(oneDayLater);

      render(
        <ExpiringAnnouncementTooltip
          cookieName="TEST_COOKIE"
          title="New Release"
        >
          Try out this feature
        </ExpiringAnnouncementTooltip>,
      );
      expect(mockedGet).toHaveBeenCalledOnce();
      expect(screen.queryByText("New Release")).not.toBeInTheDocument();

      await user.click(screen.getByDataCy("announcement-tooltip-trigger"));
      await waitFor(() => {
        expect(screen.getByText("New Release")).toBeVisible();
      });
      await user.click(screen.getByRole("button", { name: "Got it" }));
      await waitFor(() => {
        expect(screen.queryByText("New Release")).not.toBeInTheDocument();
      });
      expect(mockedSet).not.toHaveBeenCalled();
    });
  });

  describe("when user has seen tooltip two weeks ago", () => {
    it("does not show the popover icon", () => {
      mockedGet.mockReturnValue(fakeDate.toString());
      vi.setSystemTime(twoWeeksLater);

      render(
        <ExpiringAnnouncementTooltip
          cookieName="TEST_COOKIE"
          title="New Release"
        >
          Try out this feature
        </ExpiringAnnouncementTooltip>,
      );
      expect(
        screen.queryByLabelText("Info With Circle Icon"),
      ).not.toBeInTheDocument();
    });
  });
});
