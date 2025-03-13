import { ApolloClient } from "@apollo/client";
import { Mock, MockedFunction } from "vitest";
import { useAuthProviderContext } from "@evg-ui/lib/context/AuthProvider";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import {
  fetchWithRetry,
  getUserStagingHeader,
  shouldLogoutAndRedirect,
} from "@evg-ui/lib/utils/request";
import {
  getCorpLoginURL,
  isProductionBuild,
  isRemoteEnv,
} from "utils/environmentVariables";
import { useCreateGQLClient } from ".";

// Mocks
vi.mock("@evg-ui/lib/utils/request", () => ({
  fetchWithRetry: vi.fn() as MockedFunction<typeof fetchWithRetry>,
  getUserStagingHeader: vi.fn() as MockedFunction<typeof getUserStagingHeader>,
  shouldLogoutAndRedirect: vi.fn() as MockedFunction<
    typeof shouldLogoutAndRedirect
  >,
}));
vi.mock("@evg-ui/lib/context/AuthProvider", () => ({
  useAuthProviderContext: vi.fn(() => ({
    logoutAndRedirect: vi.fn(),
  })),
}));
vi.mock("utils/environmentVariables", () => ({
  getCorpLoginURL: vi.fn() as MockedFunction<typeof getCorpLoginURL>,
  graphqlURL: "https://graphql-url.com",
  isProductionBuild: vi.fn() as MockedFunction<typeof isProductionBuild>,
  isRemoteEnv: vi.fn() as MockedFunction<typeof isRemoteEnv>,
}));

describe("useCreateGQLClient", () => {
  let mockLogoutAndRedirect: Mock;
  let originalLocation: Location;

  beforeEach(() => {
    mockLogoutAndRedirect = vi.fn();
    (useAuthProviderContext as Mock).mockReturnValue({
      logoutAndRedirect: mockLogoutAndRedirect,
    });

    vi.clearAllMocks();
    // Store original location to restore later
    originalLocation = window.location;

    // Mock window.location.assign
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...window.location,
        href: "",
      },
    });
  });

  afterEach(() => {
    // Restore original window.location after tests
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("should create gqlClient when data is returned", async () => {
    const mockData = { data: { spruceConfig: { secretFields: ["field1"] } } };
    (fetchWithRetry as Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useCreateGQLClient());

    await waitFor(() => {
      expect(result.current).toBeInstanceOf(ApolloClient);
    });
  });

  it("should call logoutAndRedirect when error occurs and the error satisfies the logout condition", async () => {
    const mockError = { cause: { statusCode: 401 } };
    (fetchWithRetry as Mock).mockRejectedValue(mockError);
    (isRemoteEnv as Mock).mockReturnValue(false);
    (shouldLogoutAndRedirect as unknown as Mock).mockImplementation(
      (statusCode: number) => statusCode === 401,
    );

    renderHook(() => useCreateGQLClient());

    expect(fetchWithRetry).toHaveBeenCalled();
    await new Promise(setImmediate);

    expect(mockLogoutAndRedirect).toHaveBeenCalled();
  });
});
