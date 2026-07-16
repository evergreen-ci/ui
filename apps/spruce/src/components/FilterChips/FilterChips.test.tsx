import { render, screen, userEvent, within } from "@evg-ui/lib/test_utils";
import FilterChips from ".";

describe("filterChips", () => {
  const chips = [
    { key: "test1", title: "Test 1", value: "value1" },
    { key: "test2", title: "Test 2", value: "value2" },
    { key: "test3", title: "Test 3", value: "value3" },
    { key: "test4", title: "Test 4", value: "value4" },
    { key: "test5", title: "Test 5", value: "value5" },
    { key: "test6", title: "Test 6", value: "value6" },
    { key: "test7", title: "Test 7", value: "value7" },
    { key: "test8", title: "Test 8", value: "value8" },
    { key: "test9", title: "Test 9", value: "value9" },
    { key: "test10", title: "Test 10", value: "value10" },
  ];
  it("should not render any chips if there are none passed in", () => {
    const onRemove = vi.fn();
    const onClearAll = vi.fn();
    render(
      <FilterChips chips={[]} onClearAll={onClearAll} onRemove={onRemove} />,
    );
    expect(screen.queryAllByDataCy("filter-chip")).toHaveLength(0);
  });

  it("should render chips if there are some passed in", () => {
    render(
      <FilterChips
        chips={chips.slice(0, 1)}
        onClearAll={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.queryAllByDataCy("filter-chip")).toHaveLength(1);
    expect(screen.getByText("Test 1: value1")).toBeInTheDocument();
  });

  it("should render a chip for each key/value pair passed in", () => {
    render(
      <FilterChips
        chips={chips.slice(0, 2)}
        onClearAll={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.queryAllByDataCy("filter-chip")).toHaveLength(2);
    expect(screen.getByText("Test 1: value1")).toBeInTheDocument();
    expect(screen.getByText("Test 2: value2")).toBeInTheDocument();
  });

  it("only renders chips up to the limit", () => {
    render(
      <FilterChips chips={chips} onClearAll={vi.fn()} onRemove={vi.fn()} />,
    );
    expect(screen.queryAllByDataCy("filter-chip")).toHaveLength(8);
    expect(screen.getByText("Test 1: value1")).toBeInTheDocument();
    expect(screen.getByText("Test 8: value8")).toBeInTheDocument();
    expect(screen.getByText("see 2 more")).toBeInTheDocument();
  });

  it("clicking see more should display a modal with all of the chips", async () => {
    const user = userEvent.setup();
    render(
      <FilterChips chips={chips} onClearAll={vi.fn()} onRemove={vi.fn()} />,
    );
    await user.click(screen.getByText("see 2 more"));
    expect(screen.getByDataCy("see-more-modal")).toBeInTheDocument();
    expect(
      within(screen.getByDataCy("see-more-modal")).queryAllByDataCy(
        "filter-chip",
      ),
    ).toHaveLength(10);
    for (let i = 0; i < 10; i++) {
      expect(
        within(screen.getByDataCy("see-more-modal")).getByText(
          `Test ${i + 1}: value${i + 1}`,
        ),
      ).toBeInTheDocument();
    }
  });

  it("clicking clear all should call the clear all callback", async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();
    render(
      <FilterChips chips={chips} onClearAll={onClearAll} onRemove={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it("clicking a chip should call the remove callback", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <FilterChips chips={chips} onClearAll={vi.fn()} onRemove={onRemove} />,
    );
    const closeChip = screen.getAllByDataTestid("chip-dismiss-button")[0];
    expect(closeChip).toBeInTheDocument();
    await user.click(closeChip);
    expect(onRemove).toHaveBeenCalledWith({
      key: "test1",
      title: "Test 1",
      value: "value1",
    });
  });
});
