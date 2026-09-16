import {
  MockedProvider,
  render,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import { TaskStatsTooltip } from "./TaskStatsTooltip";
import { getTaskStatsMock } from "./testData";

describe("TaskStatsTooltip", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  it("loads task stats only after opening and renders the total", async () => {
    const user = userEvent.setup();
    const taskStatsMock = getTaskStatsMock("version-1");
    const taskStatsResult = taskStatsMock.result;
    if (!taskStatsResult || typeof taskStatsResult === "function") {
      throw new Error("Expected task stats fixture data");
    }
    const result = vi.fn(() => taskStatsResult);

    render(
      <MockedProvider mocks={[{ ...taskStatsMock, result }]}>
        <TaskStatsTooltip id="version-1" isFirstVersion={false} />
      </MockedProvider>,
    );

    expect(result).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Show task stats" }));

    const tooltip = await screen.findByTestId("task-stats-tooltip");
    await waitFor(() => {
      expect(result).toHaveBeenCalledOnce();
      expect(within(tooltip).getByText("2700")).toBeVisible();
      expect(within(tooltip).getByText("Total tasks")).toBeVisible();
    });

    await user.click(document.body);
    await waitFor(() => {
      expect(
        screen.queryByTestId("task-stats-tooltip"),
      ).not.toBeInTheDocument();
    });
  });

  it("shows a loading state while task stats are requested", async () => {
    const user = userEvent.setup();
    const taskStatsMock = {
      ...getTaskStatsMock("version-1"),
      delay: Infinity,
    };

    render(
      <MockedProvider mocks={[taskStatsMock]}>
        <TaskStatsTooltip id="version-1" isFirstVersion={false} />
      </MockedProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Show task stats" }));

    expect(await screen.findByText("Loading task stats")).toBeInTheDocument();
  });

  it("dismisses the open summary when focus moves to another summary", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        mocks={[getTaskStatsMock("version-1"), getTaskStatsMock("version-2")]}
      >
        <div>
          <TaskStatsTooltip id="version-1" isFirstVersion={false} />
          <TaskStatsTooltip id="version-2" isFirstVersion={false} />
        </div>
      </MockedProvider>,
    );

    const buttons = screen.getAllByRole("button", { name: "Show task stats" });
    await user.click(buttons[0]);
    await waitFor(() => {
      expect(screen.getByTestId("task-stats-tooltip")).toBeVisible();
      expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    });

    await user.click(buttons[1]);

    await waitFor(() => {
      expect(buttons[0]).toHaveAttribute("aria-expanded", "false");
      expect(buttons[1]).toHaveAttribute("aria-expanded", "true");
      expect(screen.getAllByTestId("task-stats-tooltip")).toHaveLength(1);
    });
  });

  it("retains the walkthrough anchor on the first version", () => {
    render(
      <MockedProvider mocks={[]}>
        <TaskStatsTooltip id="version-1" isFirstVersion />
      </MockedProvider>,
    );

    expect(
      screen.getByRole("button", { name: "Show task stats" }),
    ).toHaveAttribute("data-waterfall-guide-id", "summary-view");
  });
});
