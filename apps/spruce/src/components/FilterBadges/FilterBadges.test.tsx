import { render, screen, userEvent, within } from "@evg-ui/lib/test_utils";
import FilterBadges from ".";

describe("filterBadges", () => {
  const badges = [
    { key: "test1", value: "value1", title: "Test 1" },
    { key: "test2", value: "value2", title: "Test 2" },
    { key: "test3", value: "value3", title: "Test 3" },
    { key: "test4", value: "value4", title: "Test 4" },
    { key: "test5", value: "value5", title: "Test 5" },
    { key: "test6", value: "value6", title: "Test 6" },
    { key: "test7", value: "value7", title: "Test 7" },
    { key: "test8", value: "value8", title: "Test 8" },
    { key: "test9", value: "value9", title: "Test 9" },
    { key: "test10", value: "value10", title: "Test 10" },
  ];
  it("should not render any badges if there are none passed in", () => {
    const onRemove = vi.fn();
    const onClearAll = vi.fn();
    render(
      <FilterBadges badges={[]} onClearAll={onClearAll} onRemove={onRemove} />,
    );
    expect(screen.queryAllByDataCy("filter-badge")).toHaveLength(0);
  });

  it("should render badges if there are some passed in", () => {
    render(
      <FilterBadges
        badges={badges.slice(0, 1)}
        onClearAll={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.queryAllByDataCy("filter-badge")).toHaveLength(1);
    expect(screen.getByText("Test 1: value1")).toBeInTheDocument();
  });

  it("should render a badge for each key/value pair passed in", () => {
    render(
      <FilterBadges
        badges={badges.slice(0, 2)}
        onClearAll={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.queryAllByDataCy("filter-badge")).toHaveLength(2);
    expect(screen.getByText("Test 1: value1")).toBeInTheDocument();
    expect(screen.getByText("Test 2: value2")).toBeInTheDocument();
  });

  it("only renders badges up to the limit", () => {
    render(
      <FilterBadges badges={badges} onClearAll={vi.fn()} onRemove={vi.fn()} />,
    );
    expect(screen.queryAllByDataCy("filter-badge")).toHaveLength(8);
    expect(screen.getByText("Test 1: value1")).toBeInTheDocument();
    expect(screen.getByText("Test 8: value8")).toBeInTheDocument();
    expect(screen.getByText("see 2 more")).toBeInTheDocument();
  });

  it("clicking see more should display a modal with all of the badges", async () => {
    const user = userEvent.setup();
    render(
      <FilterBadges badges={badges} onClearAll={vi.fn()} onRemove={vi.fn()} />,
    );
    await user.click(screen.getByText("see 2 more"));
    expect(screen.getByDataCy("see-more-modal")).toBeInTheDocument();
    expect(
      within(screen.getByDataCy("see-more-modal")).queryAllByDataCy(
        "filter-badge",
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
      <FilterBadges
        badges={badges}
        onClearAll={onClearAll}
        onRemove={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it("clicking a badge should call the remove callback", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <FilterBadges badges={badges} onClearAll={vi.fn()} onRemove={onRemove} />,
    );
    const closeBadge = screen.queryAllByDataTestid("chip-dismiss-button")[0];
    expect(closeBadge).toBeInTheDocument();
    await user.click(closeBadge);
    expect(onRemove).toHaveBeenCalledWith({
      key: "test1",
      value: "value1",
      title: "Test 1",
    });
  });
});
