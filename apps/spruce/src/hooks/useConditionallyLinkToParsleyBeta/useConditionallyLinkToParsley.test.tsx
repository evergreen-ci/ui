import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import {
  AdminBetaFeaturesQuery,
  AdminBetaFeaturesQueryVariables,
  UserBetaFeaturesQuery,
  UserBetaFeaturesQueryVariables,
} from "@evg-ui/lib/gql/generated/types";
import {
  ADMIN_BETA_FEATURES,
  USER_BETA_FEATURES,
} from "@evg-ui/lib/gql/queries";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { useConditionallyLinkToParsleyBeta, parsleyBetaURL } from ".";

const createWrapper = (mocks: MockedProviderProps["mocks"]) =>
  function CreateWrapper({ children }: { children: React.ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };

describe("useConditionallyLinkToParsleyBeta", () => {
  beforeEach(() => {
    vi.stubEnv("REACT_APP_PARSLEY_URL", "real_parsley_url");
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it("is production and beta feature is enabled", async () => {
    vi.stubEnv("REACT_APP_RELEASE_STAGE", "production");
    vi.stubEnv("NODE_ENV", "production");

    const { result } = renderHook(() => useConditionallyLinkToParsleyBeta(), {
      wrapper: createWrapper([adminBetaFeatureEnabled, userBetaFeatureEnabled]),
    });
    await waitFor(() => {
      expect(result.current.redirectToBeta).toBe(true);
    });
    expect(
      result.current.replaceUrl(
        "real_parsley_url/task_id?preserveQueryParams=true",
      ),
    ).toBe(`${parsleyBetaURL}/task_id?preserveQueryParams=true`);
  });

  it("is not production and beta feature is enabled", async () => {
    vi.stubEnv("REACT_APP_RELEASE_STAGE", "staging");

    const { result } = renderHook(() => useConditionallyLinkToParsleyBeta(), {
      wrapper: createWrapper([adminBetaFeatureEnabled, userBetaFeatureEnabled]),
    });
    await waitFor(() => {
      expect(result.current.redirectToBeta).toBe(false);
    });
    expect(
      result.current.replaceUrl(
        "real_parsley_url/task_id?preserveQueryParams=true",
      ),
    ).toBe("real_parsley_url/task_id?preserveQueryParams=true");
  });

  it("is production and admin feature not enabled", async () => {
    vi.stubEnv("REACT_APP_RELEASE_STAGE", "production");
    vi.stubEnv("NODE_ENV", "production");

    const { result } = renderHook(() => useConditionallyLinkToParsleyBeta(), {
      wrapper: createWrapper([
        adminBetaFeatureDisabled,
        userBetaFeatureEnabled,
      ]),
    });
    await waitFor(() => {
      expect(result.current.redirectToBeta).toBe(false);
    });
    expect(
      result.current.replaceUrl(
        "real_parsley_url/task_id?preserveQueryParams=true",
      ),
    ).toBe("real_parsley_url/task_id?preserveQueryParams=true");
  });

  it("is production and user feature not enabled", async () => {
    vi.stubEnv("REACT_APP_RELEASE_STAGE", "production");
    vi.stubEnv("NODE_ENV", "production");

    const { result } = renderHook(() => useConditionallyLinkToParsleyBeta(), {
      wrapper: createWrapper([
        adminBetaFeatureEnabled,
        userBetaFeatureDisabled,
      ]),
    });
    await waitFor(() => {
      expect(result.current.redirectToBeta).toBe(false);
    });
    expect(
      result.current.replaceUrl(
        "real_parsley_url/task_id?preserveQueryParams=true",
      ),
    ).toBe("real_parsley_url/task_id?preserveQueryParams=true");
  });
});

const adminBetaFeatureEnabled: ApolloMock<
  AdminBetaFeaturesQuery,
  AdminBetaFeaturesQueryVariables
> = {
  request: {
    query: ADMIN_BETA_FEATURES,
    variables: {},
  },
  result: {
    data: {
      spruceConfig: {
        __typename: "SpruceConfig",
        ui: {
          __typename: "UIConfig",
          betaFeatures: {
            __typename: "BetaFeatures",
            parsleyAIEnabled: true,
          },
        },
      },
    },
  },
};

const adminBetaFeatureDisabled: ApolloMock<
  AdminBetaFeaturesQuery,
  AdminBetaFeaturesQueryVariables
> = {
  request: {
    query: ADMIN_BETA_FEATURES,
    variables: {},
  },
  result: {
    data: {
      spruceConfig: {
        __typename: "SpruceConfig",
        ui: {
          __typename: "UIConfig",
          betaFeatures: {
            __typename: "BetaFeatures",
            parsleyAIEnabled: false,
          },
        },
      },
    },
  },
};

const userBetaFeatureEnabled: ApolloMock<
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
          parsleyAIEnabled: true,
        },
      },
    },
  },
};

const userBetaFeatureDisabled: ApolloMock<
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
          parsleyAIEnabled: false,
        },
      },
    },
  },
};
