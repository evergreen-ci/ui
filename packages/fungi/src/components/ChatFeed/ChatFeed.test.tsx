import { userEvent, render, screen } from "@evg-ui/lib/test_utils";
import { ChatFeed } from ".";

// Mock fetch to return successful authentication
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ChatFeed", () => {
  beforeEach(() => {
    // Mock successful authentication response
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
    });
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  it("displays user messages after sending", async () => {
    const user = userEvent.setup();

    // jsdom doesn't support layouting HTML, so mock this.
    HTMLDivElement.prototype.scrollTo = () => {};
    render(<ChatFeed apiUrl="/foo" appName="Test App" loginUrl="/login" />);

    const message = "Why did my log fail?";
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, message);
    await user.click(screen.getByRole("button"));

    // Verify the message is displayed
    const messageElement = screen.getByText(message, { selector: "p" });
    expect(messageElement).toBeInTheDocument();
  });
});
