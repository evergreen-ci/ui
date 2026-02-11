import { ApolloClient } from "@apollo/client";
import { MockedFunction, Mock } from "vitest";
import { useAuthProviderContext } from "@evg-ui/lib/context/AuthProvider";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import {
  fetchWithRetry,
  getUserStagingHeader,
  shouldLogoutAndRedirect,
} from "@evg-ui/lib/utils/request";
import {
  getGQLUrl,
  getEvergreenUrl,
  isProductionBuild,
} from "utils/environmentVariables";
import { useCreateGQLClient } from ".";

// Mocks
vi.mock("@evg-ui/lib/utils/request", () => ({
  fetchWithRetry: vi.fn() as MockedFunction<typeof fetchWithRetry>,
  shouldLogoutAndRedirect: vi.fn() as MockedFunction<
    typeof shouldLogoutAndRedirect
  >,
  getUserStagingHeader: vi.fn() as MockedFunction<typeof getUserStagingHeader>,
}));
vi.mock("@evg-ui/lib/context/AuthProvider", () => ({
  useAuthProviderContext: vi.fn(() => ({
    logoutAndRedirect: vi.fn(),
  })),
}));
vi.mock("utils/environmentVariables", () => ({
  getEvergreenUrl: vi.fn() as MockedFunction<typeof getEvergreenUrl>,
  getGQLUrl: vi.fn() as MockedFunction<typeof getGQLUrl>,
  isProductionBuild: vi.fn() as MockedFunction<typeof isProductionBuild>,
}));

const apolloClientSpy = vi.spyOn(
  ApolloClient.prototype,
  "constructor" as never,
);

describe("useCreateGQLClient", () => {
  let mockLogoutAndRedirect: Mock;
  let mockDispatchAuthenticated: Mock;

  beforeEach(() => {
    mockLogoutAndRedirect = vi.fn();
    mockDispatchAuthenticated = vi.fn();
    (useAuthProviderContext as Mock).mockReturnValue({
      logoutAndRedirect: mockLogoutAndRedirect,
      dispatchAuthenticated: mockDispatchAuthenticated,
    });

    apolloClientSpy.mockClear();
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

  it("should not recreate the client when auth context references change", async () => {
    const mockData = { data: { spruceConfig: { secretFields: ["field1"] } } };
    (fetchWithRetry as Mock).mockResolvedValue(mockData);

    const { rerender, result } = renderHook(() => useCreateGQLClient());

    await waitFor(() => {
      expect(result.current).toBeInstanceOf(ApolloClient);
    });

    const firstClient = result.current;

    // Simulate auth context providing new function references, as happens
    // when AuthProvider's isAuthenticated state changes.
    (useAuthProviderContext as Mock).mockReturnValue({
      logoutAndRedirect: vi.fn(),
      dispatchAuthenticated: vi.fn(),
    });

    rerender();

    expect(result.current).toBe(firstClient);
  });

  it("should use the latest logoutAndRedirect callback via ref", async () => {
    const mockError = { cause: { statusCode: 401 } };
    (fetchWithRetry as Mock).mockRejectedValue(mockError);
    (shouldLogoutAndRedirect as unknown as Mock).mockImplementation(
      (statusCode: number) => statusCode === 401,
    );

    const initialLogout = vi.fn();
    (useAuthProviderContext as Mock).mockReturnValue({
      logoutAndRedirect: initialLogout,
      dispatchAuthenticated: vi.fn(),
    });

    const { rerender } = renderHook(() => useCreateGQLClient());

    // Update the auth context with a new logoutAndRedirect before the
    // fetch error resolves.
    const updatedLogout = vi.fn();
    (useAuthProviderContext as Mock).mockReturnValue({
      logoutAndRedirect: updatedLogout,
      dispatchAuthenticated: vi.fn(),
    });
    rerender();

    await new Promise(setImmediate);

    // The updated callback should be called, not the initial one.
    expect(updatedLogout).toHaveBeenCalled();
    expect(initialLogout).not.toHaveBeenCalled();
  });
});
