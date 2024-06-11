import { initializeErrorHandling } from "components/ErrorHandling";
import * as auth from "context/auth";
import { renderHook } from "test_utils";
import { useInitializeErrorHandling } from ".";

vi.mock("components/ErrorHandling", () => ({
  initializeErrorHandling: vi.fn(),
}));

describe("useInitializeErrorHandling", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call initializeErrorHandling when the user is authenticated", () => {
    vi.spyOn(auth, "useAuthContext").mockReturnValue({
      devLogin: () => {},
      isAuthenticated: true,
      logoutAndRedirect: () => {},
    });
    renderHook(() => useInitializeErrorHandling());
    expect(initializeErrorHandling).toHaveBeenCalledOnce();
  });

  it("should not call initializeErrorHandling when the user is not authenticated", () => {
    vi.spyOn(auth, "useAuthContext").mockReturnValue({
      devLogin: () => {},
      isAuthenticated: false,
      logoutAndRedirect: () => {},
    });
    renderHook(() => useInitializeErrorHandling());
    expect(initializeErrorHandling).not.toHaveBeenCalled();
  });
});
