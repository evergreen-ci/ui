import { MemoryRouter, useNavigate } from "react-router-dom";
import { act, renderHook } from "@evg-ui/lib/test_utils";
import { useLegacyUIURL } from ".";

describe("useLegacyUIURL", () => {
  it("does not return a legacy URL on the project settings page", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/settings/evergreen/general"]}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => useLegacyUIURL(), { wrapper });
    expect(result.current).toBeNull();
  });

  it("clears the legacy URL when navigating from one with to one without", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/task/task_id"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(
      () => ({
        legacyURL: useLegacyUIURL(),
        navigate: useNavigate(),
      }),
      { wrapper },
    );
    expect(result.current.legacyURL).toBe("/task/task_id");

    act(() => {
      result.current.navigate("/settings/evergreen/general");
    });

    expect(result.current.legacyURL).toBeNull();
  });

  it("introduces a legacy URL when navigating from one without to one with", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/settings/logkeeper/general"]}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(
      () => ({
        legacyURL: useLegacyUIURL(),
        navigate: useNavigate(),
      }),
      { wrapper },
    );
    expect(result.current.legacyURL).toBeNull();

    act(() => {
      result.current.navigate("/spawn/host");
    });

    expect(result.current.legacyURL).toBe("/spawn#?resourcetype=hosts");
  });
});
