import {
  USER_BETA_FEATURES,
  UserBetaFeaturesQuery,
  UserBetaFeaturesQueryVariables,
} from "@evg-ui/lib/hooks";
import {
  ApolloMock,
  MockedProvider,
  MockedResponse,
  RenderFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { LogContextProvider } from "context/LogContext";
import { ToggleChatbotButton } from "./ToggleChatbotButton";
import { ChatProvider, Chatbot } from ".";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const wrapper = (mocks: MockedResponse[] = []) => {
  const renderContent = ({ children }: React.PropsWithChildren) => (
    <MockedProvider mocks={mocks}>
      <LogContextProvider initialLogLines={[]}>
        <ChatProvider>
          <Chatbot>{children}</Chatbot>
        </ChatProvider>
      </LogContextProvider>
    </MockedProvider>
  );
  return renderContent;
};

describe("ToggleChatbotButton", () => {
  beforeEach(() => {
    HTMLDivElement.prototype.scrollTo = () => {};
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
    });
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  it("opens the Parsley chatbot", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <ToggleChatbotButton setSidePanelCollapsed={vi.fn()} />,
    );
    render(<Component />, { wrapper: wrapper([userBetaFeaturesEnabledMock]) });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Parsley AI" })).toBeVisible();
    });
    expect(screen.getByDataCy("chat-drawer")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Parsley AI" }));
    expect(screen.queryByDataCy("parsley-ai-modal")).not.toBeVisible();
    expect(screen.getByPlaceholderText("Type your message here")).toBeVisible();
    await waitFor(() => {
      expect(screen.getByDataCy("chat-drawer")).toHaveAttribute(
        "aria-hidden",
        "false",
      );
    });
  });
});

const userBetaFeaturesEnabledMock: ApolloMock<
  UserBetaFeaturesQuery,
  UserBetaFeaturesQueryVariables
> = {
  request: {
    query: USER_BETA_FEATURES,
    variables: {},
  },
  result: {
    data: {
      user: {
        __typename: "User",
        betaFeatures: {
          __typename: "BetaFeatures",
          parsleyAIEnabled: true,
        },
        userId: "me",
      },
    },
  },
};
