import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { logContextWrapper } from "context/LogContext/test_utils";
import { ToggleChatbotButton } from "./ToggleChatbotButton";
import { Chatbot } from ".";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const wrapper = ({ children }: React.PropsWithChildren) => {
  const MockLogContext = logContextWrapper();
  return (
    <MockLogContext>
      <Chatbot>{children}</Chatbot>
    </MockLogContext>
  );
};

describe("ToggleChatbotButton", () => {
  beforeEach(() => {
    HTMLDivElement.prototype.scrollTo = () => {};
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
    });
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  it("opens the Parsley chatbot", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <ToggleChatbotButton setSidePanelCollapsed={() => {}} />,
    );
    render(<Component />, { wrapper });
    expect(
      screen.getByPlaceholderText("Type your message here"),
    ).not.toBeVisible();
    await user.click(screen.getByRole("button", { name: "Parsley AI" }));
    expect(screen.getByPlaceholderText("Type your message here")).toBeVisible();
  });
});
