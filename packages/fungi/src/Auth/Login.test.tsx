import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { ChatProvider } from "../Context";
import { AuthProvider } from "./AuthProvider";
import { Login } from "./Login";

const LOGIN_URL = "https://example.com/login";

const wrapper = ({ children }: React.PropsWithChildren) => (
  <ChatProvider appName="Parsley AI">
    <AuthProvider loginUrl={LOGIN_URL}>{children}</AuthProvider>
  </ChatProvider>
);

describe("Login", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(window, "open").mockImplementation(vi.fn());
  });

  it("calls beginPollingAuth when Log in is clicked", async () => {
    const user = userEvent.setup();
    render(<Login />, { wrapper });

    await user.click(screen.getByText("Log in"));

    expect(screen.getByText("Waiting for login...")).toBeInTheDocument();
  });

  it("opens auth URL in a new tab when user clicks Log in", async () => {
    const user = userEvent.setup();
    render(<Login />, { wrapper });

    await user.click(screen.getByText("Log in"));

    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      LOGIN_URL,
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("shows app name in the message", () => {
    render(<Login />, { wrapper });
    expect(
      screen.getByText(/Parsley AI requires separate authentication/),
    ).toBeInTheDocument();
  });
});
