import { MemoryRouter, Routes, Route } from "react-router-dom";
import * as AuthProviderContext from "context/AuthProvider";
import { render, screen } from "test_utils";
import ProtectedRoute from ".";

describe("ProtectedRoute", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children when authenticated", () => {
    vi.spyOn(AuthProviderContext, "useAuthProviderContext").mockReturnValue({
      isAuthenticated: true,
      localLogin: vi.fn(),
      logoutAndRedirect: vi.fn(),
      dispatchAuthenticated: vi.fn(),
      hasCheckedAuth: true,
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            element={
              <ProtectedRoute loginPageRoute="/login">
                <div>Protected Content</div>
              </ProtectedRoute>
            }
            path="/protected"
          />
          <Route element={<div>Login Page</div>} path="/login" />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
  it("does not redirect when we have not checked auth yet", () => {
    vi.spyOn(AuthProviderContext, "useAuthProviderContext").mockReturnValue({
      isAuthenticated: false,
      localLogin: vi.fn(),
      logoutAndRedirect: vi.fn(),
      dispatchAuthenticated: vi.fn(),
      hasCheckedAuth: false,
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            element={
              <ProtectedRoute loginPageRoute="/login">
                <div>Protected Content</div>
              </ProtectedRoute>
            }
            path="/protected"
          />
          <Route element={<div>Login Page</div>} path="/login" />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to login when not authenticated and has checked auth is true", () => {
    vi.spyOn(AuthProviderContext, "useAuthProviderContext").mockReturnValue({
      isAuthenticated: false,
      localLogin: vi.fn(),
      logoutAndRedirect: vi.fn(),
      dispatchAuthenticated: vi.fn(),
      hasCheckedAuth: true,
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            element={
              <ProtectedRoute loginPageRoute="/login">
                <div>Protected Content</div>
              </ProtectedRoute>
            }
            path="/protected"
          />
          <Route element={<div>Login Page</div>} path="/login" />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
