import { render, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import { CopyButton } from "./CopyButton";

describe("copy button", () => {
  it("should indicate when the user has successfully copied to clipboard", async () => {
    const user = userEvent.setup();
    render(<CopyButton textToCopy="hello world" tooltipLabel="Copy me!" />);

    const copyButton = screen.getByDataCy("copy-button");
    await user.hover(copyButton);

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Copy me!");
    });
    await user.click(copyButton);
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveTextContent("Copied!");
    });
  });

  it("should copy the correct text when clicked", async () => {
    const user = userEvent.setup();
    render(<CopyButton textToCopy="hello world" tooltipLabel="Copy me!" />);

    const copyButton = screen.getByDataCy("copy-button");
    await user.click(copyButton);

    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("hello world");
  });
});
