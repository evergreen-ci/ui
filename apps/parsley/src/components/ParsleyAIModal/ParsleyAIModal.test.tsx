import { GraphQLError } from "graphql";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  UpdateUserBetaFeaturesMutation,
  UpdateUserBetaFeaturesMutationVariables,
} from "@evg-ui/lib/gql/generated/types";
import { UPDATE_USER_BETA_FEATURES } from "@evg-ui/lib/gql/mutations";
import {
  MockedProvider,
  MockedResponse,
  render,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import * as analytics from "analytics";
import { ParsleyAIModal } from ".";

const wrapper = (mocks: MockedResponse[] = []) => {
  const renderContent = ({ children }: React.PropsWithChildren) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
  return renderContent;
};

describe("parsley AI modal", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal", () => {
    const { Component } = RenderFakeToastContext(
      <ParsleyAIModal open setOpen={vi.fn()} />,
    );
    render(<Component />, { wrapper: wrapper() });
    expect(screen.queryByDataCy("parsley-ai-modal")).toBeVisible();
  });

  it("enables beta", async () => {
    const user = userEvent.setup();
    const mockSendEvent = vi.fn();
    vi.spyOn(analytics, "useAIAgentAnalytics").mockImplementation(() => ({
      sendEvent: mockSendEvent,
    }));
    const mockSetOpen = vi.fn();
    const { Component } = RenderFakeToastContext(
      <ParsleyAIModal open setOpen={mockSetOpen} />,
    );
    render(<Component />, { wrapper: wrapper([updateBetaFeaturesMock]) });

    await user.click(screen.getByRole("button", { name: "Enable it!" }));
    await waitFor(() => {
      expect(mockSetOpen).toHaveBeenCalledTimes(1);
    });
    expect(mockSetOpen).toHaveBeenCalledWith(false);
    expect(mockSendEvent).toHaveBeenCalledTimes(1);
    expect(mockSendEvent).toHaveBeenCalledWith({
      "beta_features.parsley_ai_enabled": true,
      name: "Viewed Parsley AI beta modal",
    });
  });

  it("handles error enabling beta", async () => {
    const user = userEvent.setup();
    const mockSendEvent = vi.fn();
    vi.spyOn(analytics, "useAIAgentAnalytics").mockImplementation(() => ({
      sendEvent: mockSendEvent,
    }));
    const mockSetOpen = vi.fn();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <ParsleyAIModal open setOpen={mockSetOpen} />,
    );
    render(<Component />, { wrapper: wrapper([updateBetaFeaturesErrorMock]) });

    await user.click(screen.getByRole("button", { name: "Enable it!" }));
    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledTimes(1);
    });
    expect(mockSetOpen).toHaveBeenCalledTimes(1);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
    expect(mockSendEvent).toHaveBeenCalledTimes(1);
    expect(mockSendEvent).toHaveBeenCalledWith({
      "beta_features.parsley_ai_enabled": false,
      name: "Viewed Parsley AI beta modal",
    });
  });

  it("dismisses modal when clicking text", async () => {
    const user = userEvent.setup();
    const mockSendEvent = vi.fn();
    vi.spyOn(analytics, "useAIAgentAnalytics").mockImplementation(() => ({
      sendEvent: mockSendEvent,
    }));
    const mockSetOpen = vi.fn();
    const { Component } = RenderFakeToastContext(
      <ParsleyAIModal open setOpen={mockSetOpen} />,
    );
    render(<Component />, { wrapper: wrapper() });

    await user.click(
      screen.getByText("Maybe later, continue without Parsley AI"),
    );
    expect(mockSetOpen).toHaveBeenCalledTimes(1);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
    expect(mockSendEvent).toHaveBeenCalledTimes(1);
    expect(mockSendEvent).toHaveBeenCalledWith({
      "beta_features.parsley_ai_enabled": false,
      name: "Viewed Parsley AI beta modal",
    });
  });
});

const updateBetaFeaturesMock: ApolloMock<
  UpdateUserBetaFeaturesMutation,
  UpdateUserBetaFeaturesMutationVariables
> = {
  request: {
    query: UPDATE_USER_BETA_FEATURES,
    variables: {
      opts: {
        betaFeatures: {
          parsleyAIEnabled: true,
        },
      },
    },
  },
  result: {
    data: {
      updateBetaFeatures: {
        betaFeatures: {
          parsleyAIEnabled: true,
        },
      },
    },
  },
};

const updateBetaFeaturesErrorMock: ApolloMock<
  UpdateUserBetaFeaturesMutation,
  UpdateUserBetaFeaturesMutationVariables
> = {
  request: {
    query: UPDATE_USER_BETA_FEATURES,
    variables: {
      opts: {
        betaFeatures: {
          parsleyAIEnabled: true,
        },
      },
    },
  },
  result: {
    errors: [new GraphQLError("error!")],
  },
};
