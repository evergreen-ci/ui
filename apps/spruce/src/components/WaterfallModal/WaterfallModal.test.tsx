import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { GraphQLError } from "graphql";
import Cookie from "js-cookie";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import * as analytics from "analytics";
import {
  UserBetaFeaturesQuery,
  UserBetaFeaturesQueryVariables,
  UpdateUserBetaFeaturesMutation,
  UpdateUserBetaFeaturesMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_BETA_FEATURES } from "gql/mutations";
import { USER_BETA_FEATURES } from "gql/queries";
import { WaterfallModal } from ".";

vi.mock("js-cookie");
const mockedSet = vi.spyOn(Cookie, "set");

const wrapper = (additionalMocks?: MockedResponse[]) =>
  function ({ children }: { children: React.ReactNode }) {
    return additionalMocks ? (
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
  };

describe("waterfallModal", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal", () => {
    const { Component } = RenderFakeToastContext(
      <WaterfallModal projectIdentifier="spruce" />,
    );
    render(<Component />, { wrapper: wrapper() });
    expect(screen.queryByDataCy("waterfall-modal")).toBeVisible();
    expect(mockedSet).toHaveBeenCalledTimes(0);
  });

  it("enables beta", async () => {
    const user = userEvent.setup();

    const mockSendEvent = vi.fn();
    vi.spyOn(analytics, "useWaterfallAnalytics").mockImplementation(() => ({
      sendEvent: mockSendEvent,
    }));
    const updateBetaFeaturesMock: ApolloMock<
      UpdateUserBetaFeaturesMutation,
      UpdateUserBetaFeaturesMutationVariables
    > = {
      request: {
        query: UPDATE_USER_BETA_FEATURES,
        variables: {
          opts: {
            betaFeatures: {
              spruceWaterfallEnabled: true,
            },
          },
        },
      },
      result: {
        data: {
          updateBetaFeatures: {
            betaFeatures: {
              spruceWaterfallEnabled: true,
            },
          },
        },
      },
    };
    const { Component } = RenderFakeToastContext(
      <WaterfallModal projectIdentifier="spruce" />,
    );
    const { router } = render(<Component />, {
      wrapper: wrapper([updateBetaFeaturesMock]),
      route: "/commits/spruce",
      path: "/commits/:projectIdentifier",
    });

    await user.click(screen.getByRole("button", { name: "Enable Beta" }));
    expect(screen.queryByDataCy("waterfall-modal")).not.toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/project/spruce/waterfall");
    expect(mockSendEvent).toHaveBeenCalledTimes(1);
    expect(mockSendEvent).toHaveBeenCalledWith({
      name: "Viewed waterfall beta modal",
      "beta_features.spruce_waterfall_enabled": true,
    });
    expect(mockedSet).toHaveBeenCalledTimes(1);
  });

  it("handles error enabling beta", async () => {
    const user = userEvent.setup();
    const mockSendEvent = vi.fn();
    vi.spyOn(analytics, "useWaterfallAnalytics").mockImplementation(() => ({
      sendEvent: mockSendEvent,
    }));
    const updateBetaFeaturesMock: ApolloMock<
      UpdateUserBetaFeaturesMutation,
      UpdateUserBetaFeaturesMutationVariables
    > = {
      request: {
        query: UPDATE_USER_BETA_FEATURES,
        variables: {
          opts: {
            betaFeatures: {
              spruceWaterfallEnabled: true,
            },
          },
        },
      },
      result: {
        errors: [new GraphQLError("error!")],
      },
    };
    const { Component } = RenderFakeToastContext(
      <WaterfallModal projectIdentifier="spruce" />,
    );
    const { router } = render(<Component />, {
      wrapper: wrapper([updateBetaFeaturesMock]),
      route: "/commits/spruce",
      path: "/commits/:projectIdentifier",
    });

    await user.click(screen.getByRole("button", { name: "Enable Beta" }));
    expect(screen.queryByDataCy("waterfall-modal")).not.toBeVisible();
    expect(router.state.location.pathname).toBe("/commits/spruce");
    expect(mockSendEvent).toHaveBeenCalledTimes(1);
    expect(mockSendEvent).toHaveBeenCalledWith({
      name: "Viewed waterfall beta modal",
      "beta_features.spruce_waterfall_enabled": false,
    });
    expect(mockedSet).toHaveBeenCalledTimes(1);
  });

  it("dismisses modal when clicking text", async () => {
    const user = userEvent.setup();
    const mockSendEvent = vi.fn();
    vi.spyOn(analytics, "useWaterfallAnalytics").mockImplementation(() => ({
      sendEvent: mockSendEvent,
    }));
    const { Component } = RenderFakeToastContext(
      <WaterfallModal projectIdentifier="spruce" />,
    );
    const { router } = render(<Component />, {
      wrapper: wrapper(),
      route: "/commits/spruce",
      path: "/commits/:projectIdentifier",
    });

    await user.click(
      screen.getByText("Maybe later, continue to Project Health"),
    );
    expect(screen.queryByDataCy("waterfall-modal")).not.toBeVisible();
    expect(router.state.location.pathname).toBe("/commits/spruce");
    expect(mockSendEvent).toHaveBeenCalledTimes(1);
    expect(mockSendEvent).toHaveBeenCalledWith({
      name: "Viewed waterfall beta modal",
      "beta_features.spruce_waterfall_enabled": false,
    });
    expect(mockedSet).toHaveBeenCalledTimes(1);
  });
});

const userBetaFeaturesDisabled: ApolloMock<
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
        userId: "me",
        betaFeatures: {
          __typename: "BetaFeatures",
          spruceWaterfallEnabled: false,
        },
      },
    },
  },
};

const baseMocks: MockedResponse[] = [userBetaFeaturesDisabled];
