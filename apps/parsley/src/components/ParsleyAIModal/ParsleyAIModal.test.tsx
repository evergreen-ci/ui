import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { GraphQLError } from "graphql";
import Cookie from "js-cookie";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  UpdateUserBetaFeaturesMutation,
  UpdateUserBetaFeaturesMutationVariables,
} from "@evg-ui/lib/gql/generated/types";
import { UPDATE_USER_BETA_FEATURES } from "@evg-ui/lib/gql/mutations";
import {
  render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import * as analytics from "analytics";
import { ParsleyAIModal } from ".";

vi.mock("js-cookie");
const mockedSet = vi.spyOn(Cookie, "set");

export const wrapper = (additionalMocks: MockedResponse[] = []) => {
  const renderContent = ({ children }: React.PropsWithChildren) =>
    additionalMocks ? (
      <MockedProvider
        addTypename={false}
        mocks={[...baseMocks, ...additionalMocks]}
      >
        {children}
      </MockedProvider>
    ) : (
      <MockedProvider addTypename={false} mocks={baseMocks}>
        {children}
      </MockedProvider>
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
    expect(mockedSet).toHaveBeenCalledTimes(0);
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
    expect(mockedSet).toHaveBeenCalledTimes(1);
    expect(mockSetOpen).toHaveBeenCalledTimes(1);
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
    expect(dispatchToast.error).toHaveBeenCalledTimes(1);
    expect(mockedSet).toHaveBeenCalledTimes(1);
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
    expect(mockedSet).toHaveBeenCalledTimes(1);
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

const baseMocks: MockedResponse[] = [];
