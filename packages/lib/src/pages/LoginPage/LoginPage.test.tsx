import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Mock } from "vitest";
import { useAuthProviderContext } from "../../context/Auth";
import { render, screen, fireEvent } from "../../test_utils";
import LoginPage from ".";

vi.mock("../../context/Auth", () => ({
  useAuthProviderContext: vi.fn(),
}));

describe("LoginPage", () => {
  it("calls localLogin with username and password on login", () => {
    const localLoginMock = vi.fn();
    (useAuthProviderContext as Mock).mockReturnValue({
      isAuthenticated: false,
      localLogin: localLoginMock,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    expect(localLoginMock).toHaveBeenCalledWith({
      username: "testuser",
      password: "password123",
    });
  });

  it("redirects to the referrer page when authenticated", () => {
    (useAuthProviderContext as Mock).mockReturnValue({
      isAuthenticated: true,
      localLogin: vi.fn(),
    });

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/login", state: { referrer: "/dashboard" } },
        ]}
      >
        <Routes>
          <Route element={<LoginPage />} path="/login" />
          <Route
            element={<div data-testid="dashboard">Dashboard</div>}
            path="/dashboard"
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });
});
