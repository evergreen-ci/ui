import { act, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { SageProvider, useSageContext } from ".";

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

  it("sets isAuthenticated true when /login returns ok", async () => {
    mockGet.mockResolvedValue({ ok: true, data: {} });
    const { result } = renderHook(useSageContext, { wrapper });
    await waitFor(() => {
      expect(result.current.auth.isAuthenticated).toBe(true);
      expect(result.current.auth.hasCheckedAuth).toBe(true);
      expect(result.current.auth.error).toBeNull();
    });
  });

  it("sets isAuthenticated false and authError when /login returns not ok", async () => {
    const error = { ok: false, type: "unauthenticated" };
    mockGet.mockResolvedValue(error);
    const { result } = renderHook(useSageContext, { wrapper });
    await waitFor(() => {
      expect(result.current.auth.isAuthenticated).toBe(false);
      expect(result.current.auth.hasCheckedAuth).toBe(true);
      expect(result.current.auth.error).toStrictEqual(error);
    });
  });

  it("calling logout sets isAuthenticated to false", async () => {
    mockGet.mockResolvedValue({ ok: true, data: {} });
    const { result } = renderHook(useSageContext, { wrapper });
    await waitFor(() => {
      expect(result.current.auth.isAuthenticated).toBe(true);
    });
    act(() => {
      result.current.logout();
    });
    await waitFor(() => {
      expect(result.current.auth.isAuthenticated).toBe(false);
    });
  });

  it("provides a SageClient instance", async () => {
    mockGet.mockResolvedValue({ ok: true, data: {} });
    const { result } = renderHook(useSageContext, { wrapper });
    await waitFor(() => {
      expect(result.current.client).toBeDefined();
      expect(result.current.client.get).toBeDefined();
    });
  });

  it("throws when used outside SageProvider", () => {
    expect(() => renderHook(useSageContext)).toThrow(
      "useSageContext must be used within a SageProvider",
    );
  });
});
