import {
  userEvent,
  render,
  screen,
  createWrapper,
} from "@evg-ui/lib/test_utils";
import { ChatProvider } from "../Context";
import { ChatProviderProps } from "../Context/ChatProvider";
import { ContextChip } from "../Context/context";
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

  describe("transformMessage", () => {
    it("transforms the message using the given prop", async () => {
      const user = userEvent.setup();
      const mockTransformMessage = vi.fn(
        (message, { chips }) =>
          `Transformed: ${message} with ${chips.length} chips`,
      );
      render(
        <ChatFeed apiUrl="/foo" transformMessage={mockTransformMessage} />,
        {
          wrapper: createWrapper(ChatProvider, { appName: "Parsley AI Test" }),
        },
      );
      const message = "Why did my log fail?";
      const textarea = screen.getByRole("textbox");
      await user.type(textarea, message);
      await user.click(screen.getByRole("button", { name: "Send message" }));
      expect(mockTransformMessage).toHaveBeenCalledWith(message, { chips: [] });
      expect(screen.queryByDataCy("message-user")).toHaveTextContent(message);
    });
  });

  describe("context chips", () => {
    const chip1: ContextChip = {
      content: "console.log('test')",
      identifier: "test-1",
      label: "Line 1",
    };

    const chip2: ContextChip = {
      content: "const x = 42;",
      identifier: "test-2",
      label: "Lines 5-6",
    };

    const chipMap: Map<string, ContextChip> = new Map();
    chipMap.set(chip1.identifier, chip1);
    chipMap.set(chip2.identifier, chip2);

    it("renders no chips initially", () => {
      render(<ChatFeed apiUrl="/foo" />, {
        wrapper: createWrapper(ChatProvider, { appName: "Parsley AI Test" }),
      });
      expect(screen.queryByDataCy(chip1.identifier)).not.toBeInTheDocument();
      expect(screen.queryByDataCy(chip2.identifier)).not.toBeInTheDocument();
    });

    it("displays chips if they are present", () => {
      render(<ChatFeed apiUrl="/foo" />, {
        wrapper: createWrapper<ChatProviderProps>(ChatProvider, {
          appName: "Parsley AI Test",
          initialChips: chipMap,
        }),
      });
      expect(screen.getByDataCy(chip1.identifier)).toBeInTheDocument();
      expect(screen.getByDataCy(chip2.identifier)).toBeInTheDocument();
    });

    it("allows dismissing chips via dismiss button", async () => {
      const user = userEvent.setup();
      render(<ChatFeed apiUrl="/foo" />, {
        wrapper: createWrapper<ChatProviderProps>(ChatProvider, {
          appName: "Parsley AI Test",
          initialChips: chipMap,
        }),
      });
      const dismissButtons = screen.getAllByRole("button", {
        name: "Dismiss chip",
      });
      await user.click(dismissButtons[0]);
      expect(screen.queryByDataCy(chip1.identifier)).not.toBeInTheDocument();
      expect(screen.getByDataCy(chip2.identifier)).toBeInTheDocument();
    });

    it("clears chips after sending a message", async () => {
      const user = userEvent.setup();
      render(<ChatFeed apiUrl="/foo" />, {
        wrapper: createWrapper<ChatProviderProps>(ChatProvider, {
          appName: "Parsley AI Test",
          initialChips: chipMap,
        }),
      });

      expect(screen.getByDataCy(chip1.identifier)).toHaveAttribute(
        "data-dismissible",
        "true",
      );
      expect(screen.getByDataCy(chip2.identifier)).toHaveAttribute(
        "data-dismissible",
        "true",
      );

      const message = "Why did my log fail?";
      const textarea = screen.getByRole("textbox");
      await user.type(textarea, message);
      await user.click(screen.getByRole("button", { name: "Send message" }));

      // Note: the chips are still going to be present because they get rendered alongside the message.
      expect(screen.getByDataCy(chip1.identifier)).toHaveAttribute(
        "data-dismissible",
        "false",
      );
      expect(screen.getByDataCy(chip2.identifier)).toHaveAttribute(
        "data-dismissible",
        "false",
      );
    });
  });
});
