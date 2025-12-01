import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import { render, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import { DISABLE_QUERY_POLLING, DISABLE_TASK_REVIEW } from "constants/cookies";
import { PreferenceToggles } from "./PreferenceToggles";

const mockSendEvent = vi.fn();

vi.mock("js-cookie");
vi.mock("analytics", () => ({
  usePreferencesAnalytics: () => ({
    sendEvent: mockSendEvent,
  }),
}));

const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;
const mockedSet = vi.spyOn(Cookie, "set") as MockInstance;

describe("PreferenceToggles", () => {
  beforeEach(() => {
    mockedGet.mockImplementation((key: string) => {
      if (key === DISABLE_QUERY_POLLING) {
        return undefined;
      }
      if (key === DISABLE_TASK_REVIEW) {
        return undefined;
      }
      return undefined;
    });
    mockedSet.mockClear();
    mockSendEvent.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Background polling toggle", () => {
    it("renders with polling enabled by default when cookie is not set", () => {
      mockedGet.mockReturnValue(undefined);
      render(<PreferenceToggles />);

      const pollingToggle = screen.getByLabelText("Background polling");
      expect(pollingToggle).toHaveAttribute("aria-checked", "true");
      expect(
        screen.getByText(
          /allow background polling for active tabs in the current browser/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders with polling disabled when cookie is set to 'true'", () => {
      mockedGet.mockImplementation((key: string) => {
        if (key === DISABLE_QUERY_POLLING) {
          return "true";
        }
        return undefined;
      });
      render(<PreferenceToggles />);

      const pollingToggle = screen.getByLabelText("Background polling");
      expect(pollingToggle).toHaveAttribute("aria-checked", "false");
    });

    it("toggles polling from enabled to disabled", async () => {
      const user = userEvent.setup();
      mockedGet.mockReturnValue(undefined);
      render(<PreferenceToggles />);

      const pollingToggle = screen.getByLabelText("Background polling");
      expect(pollingToggle).toHaveAttribute("aria-checked", "true");

      await user.click(pollingToggle);

      await waitFor(() => {
        expect(pollingToggle).toHaveAttribute("aria-checked", "false");
      });

      expect(mockedSet).toHaveBeenCalledWith(DISABLE_QUERY_POLLING, "true");
    });

    it("toggles polling from disabled to enabled", async () => {
      const user = userEvent.setup();
      mockedGet.mockImplementation((key: string) => {
        if (key === DISABLE_QUERY_POLLING) {
          return "true";
        }
        return undefined;
      });
      render(<PreferenceToggles />);

      const pollingToggle = screen.getByLabelText("Background polling");
      expect(pollingToggle).toHaveAttribute("aria-checked", "false");

      await user.click(pollingToggle);

      await waitFor(() => {
        expect(pollingToggle).toHaveAttribute("aria-checked", "true");
      });

      expect(mockedSet).toHaveBeenCalledWith(DISABLE_QUERY_POLLING, "false");
    });

    it("sends analytics event when toggling polling to enabled", async () => {
      const user = userEvent.setup();
      mockedGet.mockImplementation((key: string) => {
        if (key === DISABLE_QUERY_POLLING) {
          return "true";
        }
        return undefined;
      });
      render(<PreferenceToggles />);

      const pollingToggle = screen.getByLabelText("Background polling");
      await user.click(pollingToggle);

      await waitFor(() => {
        expect(mockSendEvent).toHaveBeenCalledWith({
          name: "Toggled polling",
          enabled: true,
        });
      });
    });

    it("sends analytics event when toggling polling to disabled", async () => {
      const user = userEvent.setup();
      mockedGet.mockReturnValue(undefined);
      render(<PreferenceToggles />);

      const pollingToggle = screen.getByLabelText("Background polling");
      await user.click(pollingToggle);

      await waitFor(() => {
        expect(mockSendEvent).toHaveBeenCalledWith({
          name: "Toggled polling",
          enabled: false,
        });
      });
    });
  });

  describe("Task review toggle", () => {
    it("renders with task review enabled by default when cookie is not set", () => {
      mockedGet.mockReturnValue(undefined);
      render(<PreferenceToggles />);

      const taskReviewToggle = screen.getByLabelText("Task review");
      expect(taskReviewToggle).toHaveAttribute("aria-checked", "true");
      expect(
        screen.getByText(
          /enable individual task review tracking for unsuccessful tasks/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders with task review disabled when cookie is set to 'true'", () => {
      mockedGet.mockImplementation((key: string) => {
        if (key === DISABLE_TASK_REVIEW) {
          return "true";
        }
        return undefined;
      });
      render(<PreferenceToggles />);

      const taskReviewToggle = screen.getByLabelText("Task review");
      expect(taskReviewToggle).toHaveAttribute("aria-checked", "false");
    });

    it("toggles task review from enabled to disabled", async () => {
      const user = userEvent.setup();
      mockedGet.mockReturnValue(undefined);
      render(<PreferenceToggles />);

      const taskReviewToggle = screen.getByLabelText("Task review");
      expect(taskReviewToggle).toHaveAttribute("aria-checked", "true");

      await user.click(taskReviewToggle);

      await waitFor(() => {
        expect(taskReviewToggle).toHaveAttribute("aria-checked", "false");
      });

      expect(mockedSet).toHaveBeenCalledWith(DISABLE_TASK_REVIEW, "true");
    });

    it("toggles task review from disabled to enabled", async () => {
      const user = userEvent.setup();
      mockedGet.mockImplementation((key: string) => {
        if (key === DISABLE_TASK_REVIEW) {
          return "true";
        }
        return undefined;
      });
      render(<PreferenceToggles />);

      const taskReviewToggle = screen.getByLabelText("Task review");
      expect(taskReviewToggle).toHaveAttribute("aria-checked", "false");

      await user.click(taskReviewToggle);

      await waitFor(() => {
        expect(taskReviewToggle).toHaveAttribute("aria-checked", "true");
      });

      expect(mockedSet).toHaveBeenCalledWith(DISABLE_TASK_REVIEW, "false");
    });

    it("sends analytics event when toggling task review to enabled", async () => {
      const user = userEvent.setup();
      mockedGet.mockImplementation((key: string) => {
        if (key === DISABLE_TASK_REVIEW) {
          return "true";
        }
        return undefined;
      });
      render(<PreferenceToggles />);

      const taskReviewToggle = screen.getByLabelText("Task review");
      await user.click(taskReviewToggle);

      await waitFor(() => {
        expect(mockSendEvent).toHaveBeenCalledWith({
          name: "Toggled task review",
          enabled: true,
        });
      });
    });

    it("sends analytics event when toggling task review to disabled", async () => {
      const user = userEvent.setup();
      mockedGet.mockReturnValue(undefined);
      render(<PreferenceToggles />);

      const taskReviewToggle = screen.getByLabelText("Task review");
      await user.click(taskReviewToggle);

      await waitFor(() => {
        expect(mockSendEvent).toHaveBeenCalledWith({
          name: "Toggled task review",
          enabled: false,
        });
      });
    });
  });

  describe("Both toggles", () => {
    it("renders both toggles independently", () => {
      mockedGet.mockReturnValue(undefined);
      render(<PreferenceToggles />);

      expect(screen.getByLabelText("Background polling")).toBeInTheDocument();
      expect(screen.getByLabelText("Task review")).toBeInTheDocument();
    });

    it("can toggle both preferences independently", async () => {
      const user = userEvent.setup();
      mockedGet.mockReturnValue(undefined);
      render(<PreferenceToggles />);

      const pollingToggle = screen.getByLabelText("Background polling");
      const taskReviewToggle = screen.getByLabelText("Task review");

      // Toggle polling off
      await user.click(pollingToggle);
      await waitFor(() => {
        expect(pollingToggle).toHaveAttribute("aria-checked", "false");
      });
      expect(taskReviewToggle).toHaveAttribute("aria-checked", "true");

      // Toggle task review off
      await user.click(taskReviewToggle);
      await waitFor(() => {
        expect(taskReviewToggle).toHaveAttribute("aria-checked", "false");
      });
      expect(pollingToggle).toHaveAttribute("aria-checked", "false");

      // Toggle polling back on
      await user.click(pollingToggle);
      await waitFor(() => {
        expect(pollingToggle).toHaveAttribute("aria-checked", "true");
      });
      expect(taskReviewToggle).toHaveAttribute("aria-checked", "false");
    });
  });
});
