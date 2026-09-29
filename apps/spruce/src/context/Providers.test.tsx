import { Link } from "@via-ds/components/typography";
import {
  MockedProvider,
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { useRestartSuccessToast } from "components/Notifications/RestartToastMessage/useRestartSuccessToast";
import ContextProviders from "context/Providers";

// GQLWrapper blocks rendering children on a network fetch that never resolves in jsdom.
vi.mock("gql/GQLWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

describe("ContextProviders", () => {
  it("applies the light color scheme to the Via provider root", () => {
    renderWithRouterMatch(
      <ContextProviders>
        <Link href="/hosts">Via link</Link>
      </ContextProviders>,
    );

    expect(document.querySelector("[data-via-provider]")).toHaveAttribute(
      "data-color-scheme",
      "light",
    );
  });

  it("routes Via links through react-router rather than reloading the page", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(
      <ContextProviders>
        <Link href="/hosts">Via link</Link>
      </ContextProviders>,
    );

    await user.click(screen.getByText("Via link"));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/hosts");
    });
  });

  it("renders the restart toast action in the Via toaster", async () => {
    const user = userEvent.setup();
    const RestartToastTrigger = () => {
      const showRestartToast = useRestartSuccessToast({
        resourceId: "task_id",
        sendEvent: vi.fn(),
        type: "task",
      });
      return (
        <button
          onClick={() => showRestartToast("Task scheduled to restart.")}
          type="button"
        >
          Show restart toast
        </button>
      );
    };

    renderWithRouterMatch(
      <MockedProvider>
        <ContextProviders>
          <RestartToastTrigger />
        </ContextProviders>
      </MockedProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: "Show restart toast" }),
    );

    expect(
      await screen.findByText("Task scheduled to restart."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Slack when finished" }),
    ).toBeInTheDocument();
  });
});
