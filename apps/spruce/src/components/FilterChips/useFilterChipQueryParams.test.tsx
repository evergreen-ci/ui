import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import FilterChips from "components/FilterChips";
import useFilterChipQueryParams from "./useFilterChipQueryParams";

const TestFilterOptions = {
  Test: "tests",
  Task: "tasks",
  BuildVariant: "buildVariants",
};
const Content = () => {
  const { chips, handleClearAll, handleOnRemove } = useFilterChipQueryParams(
    new Set([
      TestFilterOptions.BuildVariant,
      TestFilterOptions.Test,
      TestFilterOptions.Task,
    ]),
    {
      [TestFilterOptions.BuildVariant]: "Variant",
      [TestFilterOptions.Test]: "Test",
      [TestFilterOptions.Task]: "Task",
    },
  );
  return (
    <FilterChips
      chips={chips}
      onClearAll={handleClearAll}
      onRemove={handleOnRemove}
    />
  );
};
describe("filterChips - queryParams", () => {
  it("should not render any chips if there are no query params", () => {
    render(<Content />, {
      route: "/project/evergreen/waterfall",
      path: "/project/:projectId/waterfall",
    });
    expect(screen.queryByDataCy("filter-chip")).not.toBeInTheDocument();
  });

  it("should render a singular filter chip if there is only one query param", () => {
    render(<Content />, {
      route: "/project/evergreen/waterfall?buildVariants=variant1",
      path: "/project/:projectId/waterfall",
    });
    expect(screen.queryAllByDataCy("filter-chip")).toHaveLength(1);
  });

  it("should render multiple filter chips with the same key but different values", () => {
    render(<Content />, {
      route: "/project/evergreen/waterfall?buildVariants=variant1,variant2",
      path: "/project/:projectId/waterfall",
    });
    const chips = screen.queryAllByDataCy("filter-chip");
    expect(chips).toHaveLength(2);
    expect(chips[0]).toHaveTextContent("Variant: variant1");
    expect(chips[1]).toHaveTextContent("Variant: variant2");
  });

  it("should render multiple filter chips with the different keys and different values", () => {
    render(<Content />, {
      route: "/project/evergreen/waterfall?buildVariants=variant1&tests=test1",
      path: "/project/:projectId/waterfall",
    });
    const chips = screen.queryAllByDataCy("filter-chip");
    expect(chips).toHaveLength(2);
    expect(chips[0]).toHaveTextContent("Variant: variant1");
    expect(chips[1]).toHaveTextContent("Test: test1");
  });

  it("closing out a chip should remove it from the url", async () => {
    const user = userEvent.setup();
    const { router } = render(<Content />, {
      route: "/project/evergreen/waterfall?buildVariants=variant1",
      path: "/project/:projectId/waterfall",
    });

    const chip = screen.queryByDataCy("filter-chip");
    expect(chip).toHaveTextContent("Variant: variant1");
    const closeChip = screen.getByDataTestid("chip-dismiss-button");
    expect(closeChip).toBeInTheDocument();
    await user.click(closeChip);

    expect(screen.queryByDataCy("filter-chip")).toBeNull();
    expect(router.state.location.search).toBe("");
  });

  it("should only remove one chip from the url if it is closed and more remain", async () => {
    const user = userEvent.setup();
    const { router } = render(<Content />, {
      route: "/project/evergreen/waterfall?buildVariants=variant1,variant2",
      path: "/project/:projectId/waterfall",
    });

    let chips = screen.queryAllByDataCy("filter-chip");
    expect(chips).toHaveLength(2);
    expect(screen.getByText("Variant: variant1")).toBeInTheDocument();
    const closeChip = screen.getAllByDataTestid("chip-dismiss-button")[0];
    await user.click(closeChip);
    chips = screen.queryAllByDataCy("filter-chip");
    expect(chips).toHaveLength(1);
    expect(screen.queryByText("Variant: variant1")).toBeNull();

    expect(screen.queryAllByDataCy("filter-chip")).toHaveLength(1);
    expect(router.state.location.search).toBe("?buildVariants=variant2");
  });

  it("should remove all chips when clicking on clear all button", async () => {
    const user = userEvent.setup();
    const { router } = render(<Content />, {
      route:
        "/project/evergreen/waterfall?buildVariants=variant1,variant2&tests=test1,test2",
      path: "/project/:projectId/waterfall",
    });

    let chips = screen.queryAllByDataCy("filter-chip");
    expect(chips).toHaveLength(4);

    await user.click(screen.getByDataCy("clear-filters"));
    chips = screen.queryAllByDataCy("filter-chip");
    expect(chips).toHaveLength(0);

    expect(router.state.location.search).toBe("");
  });

  it("should only remove query params for displayable chips when clear all is pressed", async () => {
    const user = userEvent.setup();
    const { router } = render(<Content />, {
      route:
        "/project/evergreen/waterfall?buildVariants=variant1,variant2&tests=test1,test2&notRelated=notRelated",
      path: "/project/:projectId/waterfall",
    });

    let chips = screen.queryAllByDataCy("filter-chip");
    expect(chips).toHaveLength(4);

    await user.click(screen.getByDataCy("clear-filters"));
    chips = screen.queryAllByDataCy("filter-chip");
    expect(chips).toHaveLength(0);

    expect(router.state.location.search).toBe("?notRelated=notRelated");
  });
});
