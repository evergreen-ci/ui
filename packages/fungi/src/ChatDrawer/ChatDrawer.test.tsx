import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { ChatProvider, useChatContext } from "#Context";
import { ChatDrawer } from ".";

const Button = () => {
  const { setDrawerOpen } = useChatContext();
  return (
    <button
      onClick={() => {
        setDrawerOpen((o) => !o);
      }}
      type="button"
    >
      Toggle drawer
    </button>
  );
};

const wrapper = ({ children }: React.PropsWithChildren) => (
  <ChatProvider appName="Chat name">
    <Button />
    {children}
  </ChatProvider>
);

describe("ChatDrawer", () => {
  it("opens and closes when the context value is updated", async () => {
    const user = userEvent.setup();
    render(<ChatDrawer chatContent="Chat content">Page content</ChatDrawer>, {
      wrapper,
    });

    expect(screen.getByText("Chat content")).not.toBeVisible();
    expect(screen.getByText("Chat name")).not.toBeVisible();

    await user.click(screen.getByRole("button", { name: "Toggle drawer" }));
    expect(screen.getByText("Chat content")).toBeVisible();
    expect(screen.getByText("Chat name")).toBeVisible();
  });
});
