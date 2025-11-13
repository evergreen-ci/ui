import {
  userEvent,
  render,
  screen,
  createWrapper,
} from "@evg-ui/lib/test_utils";
import { ChatProvider } from "../Context";
import { ChatFeed } from ".";

describe("ChatFeed", () => {
  beforeEach(() => {
    // jsdom doesn't support layouting HTML, so mock this.
    HTMLDivElement.prototype.scrollTo = () => {};
  });

  it("sends user messages", async () => {
    const user = userEvent.setup();

    render(<ChatFeed apiUrl="/foo" />, {
      wrapper: createWrapper(ChatProvider, { appName: "Parsley AI Test" }),
    });

    const message = "Why did my log fail?";
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, message);
    await user.click(screen.getByRole("button"));
    expect(screen.queryByDataCy("message-user")).toHaveTextContent(message);
  });

  describe("prompt suggestions", () => {
    it("shows suggested prompts on initial render and hides after sending a custom message", async () => {
      const user = userEvent.setup();

      render(<ChatFeed apiUrl="/foo" chatSuggestions={["Foo", "Bar"]} />, {
        wrapper: createWrapper(ChatProvider, { appName: "Parsley AI Test" }),
      });

      const message = "Why did my log fail?";
      const textarea = screen.getByRole("textbox");

      expect(screen.getByText("Foo")).toBeVisible();
      await user.type(textarea, message);
      await user.click(screen.getByRole("button", { name: "Send message" }));
      expect(screen.queryByText("Foo")).not.toBeInTheDocument();
      expect(screen.queryByText("Suggested Prompts")).not.toBeInTheDocument();
    });

    it("sends a suggested prompt on click", async () => {
      const user = userEvent.setup();

      render(<ChatFeed apiUrl="/foo" chatSuggestions={["Foo", "Bar"]} />, {
        wrapper: createWrapper(ChatProvider, { appName: "Parsley AI Test" }),
      });

      expect(screen.getByText("Suggested Prompts")).toBeVisible();
      expect(screen.getByText("Bar")).toBeVisible();
      await user.click(screen.getByRole("button", { name: "Bar" }));
      expect(screen.queryByText("Suggested Prompts")).not.toBeInTheDocument();
      expect(screen.queryByDataCy("message-user")).toHaveTextContent("Bar");
    });
  });
});
