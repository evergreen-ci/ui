import { render, screen, userEvent } from "test_utils";
import PageSizeSelector from ".";

describe("pageSizeSelector", () => {
  it("selecting page size should call onChange prop", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <PageSizeSelector
        data-cy="page-size-selector"
        onChange={onChange}
        value={10}
      />,
    );
    await user.click(screen.getByRole("button", { name: "10 / page" }));
    expect(screen.queryByText("20 / page")).toBeVisible();
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(screen.queryByText("20 / page"));
    expect(onChange).toHaveBeenCalledWith(20);
  });
});
