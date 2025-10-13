import { render, screen, userEvent, waitFor } from "test_utils";
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
    await waitFor(() => {
      expect(screen.queryByText("20 / page")).toBeVisible();
    });
    await user.click(screen.getByText("20 / page"));
    expect(onChange).toHaveBeenCalledWith(20);
  });
});
