import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { StyledTabs } from "./StyledTabs";

const tabs = [
  { key: "first", name: "First", content: "first panel" },
  { key: "second", name: "Second", content: "second panel" },
];

describe("StyledTabs", () => {
  it("shows the panel for the selected index without reporting a change", () => {
    const onValueChange = vi.fn();
    render(
      <StyledTabs
        aria-label="Tabs"
        onValueChange={onValueChange}
        tabs={tabs}
        value={1}
      />,
    );
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("second panel")).toBeVisible();
    expect(screen.queryByText("first panel")).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("reports the index of the clicked tab", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <StyledTabs
        aria-label="Tabs"
        onValueChange={onValueChange}
        tabs={tabs}
        value={1}
      />,
    );
    await user.click(screen.getByRole("tab", { name: "First" }));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(0);
  });
});
