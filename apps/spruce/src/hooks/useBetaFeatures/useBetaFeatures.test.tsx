import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import { gql } from "@apollo/client";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  AdminBetaFeaturesQuery,
  AdminBetaFeaturesQueryVariables,
  UserBetaFeaturesQuery,
  UserBetaFeaturesQueryVariables,
} from "gql/generated/types";

const ADMIN_BETA_FEATURES = gql`
  query AdminBetaFeatures {
    spruceConfig {
      ui {
        betaFeatures {
          spruceWaterfallEnabled
        }
      }
    }
  }
`;

const USER_BETA_FEATURES = gql`
  query UserBetaFeatures {
    user {
      userId
      betaFeatures {
        spruceWaterfallEnabled
      }
    }
  }
`;
import {
  useAdminBetaFeatures,
  useUserBetaFeatures,
  useMergedBetaFeatures,
} from ".";

interface ProviderProps {
  mocks?: MockedProviderProps["mocks"];
  children: React.ReactNode;
}
const ProviderWrapper: React.FC<ProviderProps> = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("useAdminBetaFeatures", () => {
  it("correctly reads admin beta feature settings", async () => {
    const { result } = renderHook(() => useAdminBetaFeatures(), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          mocks: [adminBetaFeatures],
        }),
    });
    await waitFor(() => {
      expect(result?.current?.adminBetaSettings?.spruceWaterfallEnabled).toBe(
        false,
      );
    });
  });
});

describe("useUserBetaFeatures", () => {
  it("correctly reads user beta feature settings", async () => {
    const { result } = renderHook(() => useUserBetaFeatures(), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          mocks: [userBetaFeatures],
        }),
    });
    await waitFor(() => {
      expect(result?.current?.userBetaSettings?.spruceWaterfallEnabled).toBe(
        true,
      );
    });
  });
});

describe("useMergedBetaFeatures", () => {
  it("correctly merges beta feature settings", async () => {
    const { result } = renderHook(() => useMergedBetaFeatures(), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          mocks: [adminBetaFeatures, userBetaFeatures],
        }),
    });
    await waitFor(() => {
      expect(result?.current?.betaFeatures).toBeDefined();
    });
    expect(result?.current?.betaFeatures?.spruceWaterfallEnabled).toBe(false);
  });
});

const adminBetaFeatures: ApolloMock<
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
            spruceWaterfallEnabled: false,
          },
        },
      },
    },
  },
};

const userBetaFeatures: ApolloMock<
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
          spruceWaterfallEnabled: true,
        },
      },
    },
  },
};
