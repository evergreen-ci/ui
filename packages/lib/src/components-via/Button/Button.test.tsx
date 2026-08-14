import { vi } from "vitest";
import { render, screen, userEvent } from "test_utils";
import { Button, LinkButton } from ".";

describe("via button wrapper", () => {
  it("renders a pressable button", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Button onPress={onPress} variant="primary">
        Save
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders a link button with an href", () => {
    render(<LinkButton href="/hosts">Hosts</LinkButton>);
    expect(screen.getByRole("link", { name: "Hosts" })).toHaveAttribute(
      "href",
      "/hosts",
    );
  });
});
