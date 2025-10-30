import { Mock, MockedFunction } from "vitest";
import {
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
  waitFor,
} from "test_utils";
import {
  fetchWithRetry,
  getUserStagingHeader,
  shouldLogoutAndRedirect,
} from "utils/request";
import { AuthProvider, useAuthProviderContext } from ".";

// Mocks
vi.mock("utils/request", () => ({
  fetchWithRetry: vi.fn() as MockedFunction<typeof fetchWithRetry>,
  getUserStagingHeader: vi.fn() as MockedFunction<typeof getUserStagingHeader>,
  shouldLogoutAndRedirect: vi.fn() as MockedFunction<
    typeof shouldLogoutAndRedirect
  >,
}));

const wrapper = ({
  authProviderProps,
}: {
  authProviderProps: React.ComponentProps<typeof AuthProvider>;
}) => <AuthProvider {...authProviderProps} />;

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      href: "test-url",
    } as Location);
    const mockData = { data: { spruceConfig: { userId: "mohamed" } } };
    (fetchWithRetry as Mock).mockResolvedValue(mockData);
  });

  afterEach(() => {
    // Restore original location after test
    vi.restoreAllMocks();
  });

  it("should render children", async () => {
    const { Component } = renderComponentWithHook(
      useAuthProviderContext,
      <div data-testid="child" />,
    );
    render(<Component />, {
      wrapper: ({ children }) =>
        wrapper({
          authProviderProps: {
            children,
            evergreenAppURL: "evergreen-server.com",
            remoteAuthURL: "some-identity-provider.com",
            localAuthRoute: "/login",
            shouldUseLocalAuth: false,
          },
        }),
    });
    await waitFor(() => {
      expect(fetchWithRetry).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByTestId("child")).toBeInTheDocument();
    });
  });
  it("should attempt to make a request to validate the user is properly authenticated", async () => {
    const { Component, hook } = renderComponentWithHook(
      useAuthProviderContext,
      <div data-testid="child" />,
    );
    render(<Component />, {
      wrapper: ({ children }) =>
        wrapper({
          authProviderProps: {
            children,
            evergreenAppURL: "evergreen-server.com",
            remoteAuthURL: "evergreen-server.com/login",
            localAuthRoute: "/login",
            shouldUseLocalAuth: false,
          },
        }),
    });
    expect(hook.current.hasCheckedAuth).toBe(false);
    await waitFor(() => {
      expect(fetchWithRetry).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(hook.current.hasCheckedAuth).toBe(true);
    });
    await waitFor(() => {
      expect(hook.current.isAuthenticated).toBe(true);
    });
  });
  it("should redirect to the local auth route if the user is not authenticated", async () => {
    const mockError = { cause: { statusCode: 401 } };
    (fetchWithRetry as Mock).mockRejectedValue(mockError);
    const { Component } = renderComponentWithHook(
      useAuthProviderContext,
      <div data-testid="child" />,
    );
    const { router } = render(<Component />, {
      wrapper: ({ children }) =>
        wrapper({
          authProviderProps: {
            children,
            evergreenAppURL: "evergreen-server.com",
            remoteAuthURL: "evergreen-server.com/login",
            localAuthRoute: "/login",
            shouldUseLocalAuth: true,
          },
        }),
    });
    await waitFor(() => {
      expect(fetchWithRetry).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/login");
    });
  });
  it("should redirect to the remote auth page if the user is not authenticated", async () => {
    const mockError = { cause: { statusCode: 401 } };
    (fetchWithRetry as Mock).mockRejectedValue(mockError);
    const { Component, hook } = renderComponentWithHook(
      useAuthProviderContext,
      <div data-testid="child" />,
    );
    render(<Component />, {
      wrapper: ({ children }) =>
        wrapper({
          authProviderProps: {
            children,
            evergreenAppURL: "evergreen-server.com",
            remoteAuthURL: "evergreen-server.com/login",
            localAuthRoute: "/login",
            shouldUseLocalAuth: false,
          },
        }),
    });
    await waitFor(() => {
      expect(fetchWithRetry).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(hook.current.isAuthenticated).toBe(false);
    });

    expect(window.location.href).toBe(
      "evergreen-server.com/login?redirect=test-url",
    );
  });
});
