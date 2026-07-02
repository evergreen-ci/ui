import { act, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { SageClient } from "api/sageClient";
import { SageProvider, useAuthContext, useSageClient } from ".";

const mockGet = vi.fn();

vi.mock("api/sageClient", () => ({
  SageClient: vi.fn(function (logout?: () => void) {
    return { get: mockGet, logout };
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SageProvider>{children}</SageProvider>
);

describe("SageProvider", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("useAuthContext", () => {
    it("sets isAuthenticated true when /login returns ok", async () => {
      mockGet.mockResolvedValue({ ok: true, data: {} });
      const { result } = renderHook(useAuthContext, { wrapper });
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.hasCheckedAuth).toBe(true);
      });
    });

    it("sets isAuthenticated false when /login returns not ok", async () => {
      mockGet.mockResolvedValue({ ok: false, type: "unauthenticated" });
      const { result } = renderHook(useAuthContext, { wrapper });
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.hasCheckedAuth).toBe(true);
      });
    });

    it("calling logout sets isAuthenticated to false", async () => {
      mockGet.mockResolvedValue({ ok: true, data: {} });
      const { result } = renderHook(useAuthContext, { wrapper });
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });
      act(() => {
        result.current.logout();
      });
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });
    });
  });

  describe("useSageClient", () => {
    it("provides a SageClient instance", async () => {
      mockGet.mockResolvedValue({ ok: true, data: {} });
      const { result } = renderHook(useSageClient, { wrapper });
      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current.get).toBeDefined();
      });
    });

    it("constructs the client with logout so a 401 updates auth state", async () => {
      mockGet.mockResolvedValue({ ok: true, data: {} });
      renderHook(useSageClient, { wrapper });
      await waitFor(() => {
        expect(SageClient).toHaveBeenCalledWith(expect.any(Function));
      });
    });
  });
});
