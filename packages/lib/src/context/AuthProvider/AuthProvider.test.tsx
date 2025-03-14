import { Mock, MockedFunction } from "vitest";
import {
  renderWithRouterMatch as render,
  renderComponentWithHook,
  screen,
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
  let originalLocation: Location;

  beforeEach(() => {
    // Save original location
    originalLocation = window.location;
    // Mock window.location
    delete (window as any).location;
    window.location = { ...originalLocation, href: "test-url" } as Location;
    const mockData = { data: { spruceConfig: { userId: "mohamed" } } };
    (fetchWithRetry as Mock).mockResolvedValue(mockData);
  });
  afterEach(() => {
    // Restore original location after test
    window.location = originalLocation;
    vi.clearAllMocks();
  });
  it("should render children", () => {
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
    expect(screen.getByTestId("child")).toBeInTheDocument();
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
    await vi.waitFor(() => {
      expect(fetchWithRetry).toHaveBeenCalled();
    });
    await vi.waitFor(() => {
      expect(hook.current.isAuthenticated).toBe(true);
    });
  });
  it("should redirect to the local auth route if the user is not authenticated", async () => {
    const mockError = { cause: { statusCode: 401 } };
    (fetchWithRetry as Mock).mockRejectedValue(mockError);
    const { Component, hook } = renderComponentWithHook(
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
    await vi.waitFor(() => {
      expect(fetchWithRetry).toHaveBeenCalled();
    });
    await vi.waitFor(() => {
      expect(hook.current.isAuthenticated).toBe(false);
    });
    await vi.waitFor(() => {
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
    await vi.waitFor(() => {
      expect(fetchWithRetry).toHaveBeenCalled();
    });
    await vi.waitFor(() => {
      expect(hook.current.isAuthenticated).toBe(false);
    });

    expect(window.location.href).toBe(
      "evergreen-server.com/login?redirect=test-url",
    );
  });
});
