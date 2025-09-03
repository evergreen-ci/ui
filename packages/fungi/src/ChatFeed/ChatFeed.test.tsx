import {
  userEvent,
  render,
  screen,
  createWrapper,
} from "@evg-ui/lib/test_utils";
import { ChatProvider } from "../Context";
import { ChatFeed } from ".";

describe("ChatFeed", () => {
  it("aligns user messages to the right", async () => {
    const user = userEvent.setup();

    // jsdom doesn't support layouting HTML, so mock this.
    HTMLDivElement.prototype.scrollTo = () => {};
    render(<ChatFeed apiUrl="/foo" />, {
      wrapper: createWrapper(ChatProvider, { appName: "Parsley AI Test" }),
    });

    const message = "Why did my log fail?";
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, message);
    await user.click(screen.getByRole("button"));
    expect(screen.getByText(message)?.parentElement?.parentElement).toHaveStyle(
      "align-items: flex-end",
    );
  });
});
