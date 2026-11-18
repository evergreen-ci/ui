import { palette } from "@leafygreen-ui/palette";
import { render, screen } from "@evg-ui/lib/test_utils";
import { TaskDurationDifference } from "./TaskDurationDifference";

const { gray, green, red } = palette;
const baseTask = {
  id: "base_task",
  displayStatus: "success",
  execution: 0,
  finishTime: new Date("2022-04-04T12:00:00Z"),
  timeTaken: 100000,
};
const props: React.ComponentProps<typeof TaskDurationDifference> = {
  comparisonLabel: "Base",
  finishTime: new Date("2022-04-04T13:30:00Z"),
  timeTaken: 120000,
  baseTask,
};

describe("TaskDurationDifference", () => {
  it.each([
    { current: 120000, base: 100000, label: "+20s", color: red.dark2 },
    { current: 80000, base: 100000, label: "−20s", color: green.dark2 },
    { current: 100000, base: 100000, label: "0s", color: gray.dark1 },
    { current: 109000, base: 100000, label: "+9s", color: gray.dark1 },
    { current: 91000, base: 100000, label: "−9s", color: gray.dark1 },
    { current: 110000, base: 100000, label: "+10s", color: gray.dark1 },
    { current: 90000, base: 100000, label: "−10s", color: gray.dark1 },
    { current: 110001, base: 100000, label: "+10s", color: red.dark2 },
    { current: 89999, base: 100000, label: "−10s", color: green.dark2 },
    { current: 15000, base: 10000, label: "+5s", color: gray.dark1 },
    { current: 5000, base: 10000, label: "−5s", color: gray.dark1 },
    { current: 15001, base: 10000, label: "+5s", color: red.dark2 },
    { current: 4999, base: 10000, label: "−5s", color: green.dark2 },
    { current: 2000, base: 1000, label: "+1s", color: gray.dark1 },
    { current: 0, base: 0, label: "0s", color: gray.dark1 },
    { current: 1000, base: 0, label: "+1s", color: gray.dark1 },
    { current: 6000, base: 0, label: "+6s", color: red.dark2 },
    { current: 0, base: 6000, label: "−6s", color: green.dark2 },
  ])(
    "renders $label with the appropriate color for $current ms against $base ms",
    ({ base, color, current, label }) => {
      render(
        <TaskDurationDifference
          {...props}
          baseTask={{ ...baseTask, timeTaken: base }}
          timeTaken={current}
        />,
      );
      expect(screen.getByText(label)).toHaveStyle({ color });
    },
  );

  it.each([null, undefined])(
    "hides the difference for an unfinished task or a missing current duration (%s)",
    (missing) => {
      const { rerender } = render(
        <TaskDurationDifference {...props} finishTime={missing} />,
      );
      expect(screen.queryByText("+20s")).not.toBeInTheDocument();
      rerender(<TaskDurationDifference {...props} timeTaken={missing} />);
      expect(screen.queryByText("+20s")).not.toBeInTheDocument();
    },
  );

  it.each([null, undefined])(
    "hides the difference for a missing, unfinished, or unrecorded comparison (%s)",
    (missing) => {
      const { rerender } = render(
        <TaskDurationDifference {...props} baseTask={missing} />,
      );
      expect(screen.queryByText("+20s")).not.toBeInTheDocument();
      rerender(
        <TaskDurationDifference
          {...props}
          baseTask={{ ...baseTask, finishTime: missing }}
        />,
      );
      expect(screen.queryByText("+20s")).not.toBeInTheDocument();
      rerender(
        <TaskDurationDifference
          {...props}
          baseTask={{ ...baseTask, timeTaken: missing }}
        />,
      );
      expect(screen.queryByText("+20s")).not.toBeInTheDocument();
    },
  );

  it("describes longer, shorter, and equal durations with the comparison label", () => {
    const { rerender } = render(<TaskDurationDifference {...props} />);
    expect(
      screen.getByLabelText("20s longer than the base task"),
    ).toHaveAttribute("title", "20s longer than the base task");
    rerender(
      <TaskDurationDifference
        {...props}
        comparisonLabel="Previous"
        timeTaken={80000}
      />,
    );
    expect(
      screen.getByLabelText("20s shorter than the previous task"),
    ).toBeVisible();
    rerender(<TaskDurationDifference {...props} timeTaken={100000} />);
    expect(
      screen.getByLabelText("Same duration as the base task"),
    ).toBeVisible();
  });
});
