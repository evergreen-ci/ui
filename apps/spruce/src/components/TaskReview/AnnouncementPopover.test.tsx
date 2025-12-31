import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import {
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { AnnouncementPopover } from "./AnnouncementPopover";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;
const mockedSet = vi.spyOn(Cookie, "set") as MockInstance;

describe("AnnouncementPopover", () => {
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
      render(<AnnouncementPopover />);
      await waitFor(() => {
        expect(screen.getByText("New feature: Task Review")).toBeVisible();
      });
    });

    it("sets a cookie with the date and expiration upon close", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      vi.setSystemTime(fakeDate);

      render(<AnnouncementPopover />);
      await waitFor(() => {
        expect(screen.getByText("New feature: Task Review")).toBeVisible();
      });
      await user.click(screen.getByRole("button", { name: "Got it" }));

      await waitFor(() => {
        expect(
          screen.queryByText("New feature: Task Review"),
        ).not.toBeVisible();
      });

      expect(mockedSet).toHaveBeenCalledExactlyOnceWith(
        "seen-task-review-tooltip",
        fakeDate.toString(),
        { expires: 365 },
      );
    });
  });

  describe("when user has already seen tooltip within one week", () => {
    it("doesn't open tooltip upon render", async () => {
      mockedGet.mockReturnValue(fakeDate.toString());
      vi.setSystemTime(oneDayLater);

      render(<AnnouncementPopover />);
      expect(mockedGet).toHaveBeenCalledOnce();
      expect(
        screen.queryByText("New feature: Task Review"),
      ).not.toBeInTheDocument();
    });

    it("opens the tooltip when the button is clicked and doesn't update the cookie date on close", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      mockedGet.mockReturnValue(fakeDate.toString());
      vi.setSystemTime(oneDayLater);

      render(<AnnouncementPopover />);
      expect(mockedGet).toHaveBeenCalledOnce();
      expect(
        screen.queryByText("New feature: Task Review"),
      ).not.toBeInTheDocument();

      await user.click(screen.getByDataCy("announcement-tooltip-trigger"));
      await waitFor(() => {
        expect(screen.getByText("New feature: Task Review")).toBeVisible();
      });
      await user.click(screen.getByRole("button", { name: "Got it" }));
      await waitFor(() => {
        expect(
          screen.queryByText("New feature: Task Review"),
        ).not.toBeInTheDocument();
      });
      expect(mockedSet).not.toHaveBeenCalled();
    });
  });

  describe("when user has seen tooltip two weeks ago", () => {
    it("does not show the popover icon", () => {
      mockedGet.mockReturnValue(fakeDate.toString());
      vi.setSystemTime(twoWeeksLater);

      render(<AnnouncementPopover />);
      expect(
        screen.queryByLabelText("Info With Circle Icon"),
      ).not.toBeInTheDocument();
    });
  });
});
