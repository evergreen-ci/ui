import { ApolloClient } from "@apollo/client";
import { Mock, MockedFunction } from "vitest";
import { useAuthProviderContext } from "@evg-ui/lib/context";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import {
  fetchWithRetry,
  getUserStagingHeader,
  shouldLogoutAndRedirect,
} from "@evg-ui/lib/utils";
import { isProductionBuild } from "utils/environmentVariables";
import { useCreateGQLClient } from ".";

// Mocks
vi.mock("@evg-ui/lib/utils", () => ({
  fetchWithRetry: vi.fn() as MockedFunction<typeof fetchWithRetry>,
  getUserStagingHeader: vi.fn() as MockedFunction<typeof getUserStagingHeader>,
  shouldLogoutAndRedirect: vi.fn() as MockedFunction<
    typeof shouldLogoutAndRedirect
  >,
}));
vi.mock("@evg-ui/lib/context", () => ({
  useAuthProviderContext: vi.fn(() => ({
    logoutAndRedirect: vi.fn(),
  })),
}));
vi.mock("utils/environmentVariables", () => ({
  graphqlURL: "https://graphql-url.com/graphql/query",
  isProductionBuild: vi.fn() as MockedFunction<typeof isProductionBuild>,
}));

describe("useCreateGQLClient", () => {
  let mockLogoutAndRedirect: Mock;

  beforeEach(() => {
    mockLogoutAndRedirect = vi.fn();
    (useAuthProviderContext as Mock).mockReturnValue({
      logoutAndRedirect: mockLogoutAndRedirect,
    });

    vi.clearAllMocks();
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
    (shouldLogoutAndRedirect as unknown as Mock).mockImplementation(
      (statusCode: number) => statusCode === 401,
    );

    renderHook(() => useCreateGQLClient());

    expect(fetchWithRetry).toHaveBeenCalled();
    await new Promise(setImmediate);

    expect(mockLogoutAndRedirect).toHaveBeenCalled();
  });
});
