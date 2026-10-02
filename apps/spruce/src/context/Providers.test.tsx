import { toast } from "@via-ds/components/toast";
import { Link } from "@via-ds/components/typography";
import {
  MockedProvider,
  act,
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { useRestartSuccessToast } from "components/Notifications/RestartToastMessage/useRestartSuccessToast";
import ContextProviders from "context/Providers";
import {
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";

// GQLWrapper blocks rendering children on a network fetch that never resolves in jsdom.
vi.mock("gql/GQLWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

describe("ContextProviders", () => {
  afterEach(() => {
    act(() => toast.remove());
    vi.restoreAllMocks();
  });

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
    renderWithRouterMatch(
      <MockedProvider mocks={[getUserSettingsMock]}>
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
      await screen.findByRole("button", { name: "Slack when finished" }),
    ).toBeInTheDocument();
  });

  it("shows the default restart toast when the user has no Slack username", async () => {
    const user = userEvent.setup();
    const showToast = vi.spyOn(toast, "success");
    renderWithRouterMatch(
      <MockedProvider mocks={[noSlackUsernameMock]}>
        <ContextProviders>
          <RestartToastTrigger />
        </ContextProviders>
      </MockedProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: "Show restart toast" }),
    );

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith("Task scheduled to restart.", {
        duration: 30_000,
        isDismissible: true,
      });
    });
    expect(
      screen.queryByRole("button", { name: "Slack when finished" }),
    ).not.toBeInTheDocument();
  });
});

const RestartToastTrigger: React.FC = () => {
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

const noSlackUsernameMock: ApolloMock<
  UserSettingsQuery,
  UserSettingsQueryVariables
> = {
  request: getUserSettingsMock.request,
  result: {
    data: {
      user: {
        ...getUserSettingsMock.result!.data!.user,
        settings: {
          ...getUserSettingsMock.result!.data!.user.settings,
          slackUsername: "",
        },
      },
    },
  },
};
