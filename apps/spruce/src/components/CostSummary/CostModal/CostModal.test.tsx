import { fireEvent } from "@testing-library/react";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { CostModal } from ".";

describe("CostModal", () => {
  const defaultProps = {
    name: "my-task",
    open: true,
    setOpen: () => {},
    taskId: "some-task-id",
  };

  it("renders the modal title with task name", () => {
    render(<CostModal {...defaultProps} />);
    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Cost breakdown for my-task",
    );
  });

  it("renders the docs link", () => {
    render(<CostModal {...defaultProps} />);
    expect(
      screen.getByRole("link", { name: /evergreen cost documentation/i }),
    ).toBeInTheDocument();
  });

  it("renders cost rows with values when costs are provided", () => {
    render(
      <CostModal
        {...defaultProps}
        adjustedEBSStorageCost={0.01}
        adjustedEBSThroughputCost={0.02}
        adjustedEC2Cost={0.5}
        adjustedEngFlowCost={0.25}
        adjustedS3ArtifactPutCost={0.001}
        adjustedS3ArtifactStorageCost={0.0002}
        adjustedS3LogPutCost={0.003}
        adjustedS3LogStorageCost={0.0004}
        total={0.52}
      />,
    );
    expect(screen.getByText("$0.52")).toBeInTheDocument();
    expect(screen.getByText("$0.50")).toBeInTheDocument();
    expect(screen.getByText("$0.25")).toBeInTheDocument();
    expect(screen.getByText("$0.01")).toBeInTheDocument();
    expect(screen.getByText("$0.02")).toBeInTheDocument();
    expect(screen.getByText("$0.001")).toBeInTheDocument();
    expect(screen.getByText("$0.0002")).toBeInTheDocument();
    expect(screen.getByText("$0.003")).toBeInTheDocument();
    expect(screen.getByText("$0.0004")).toBeInTheDocument();
  });

  it("renders N/A for missing or zero cost fields", () => {
    render(
      <CostModal
        {...defaultProps}
        adjustedEBSStorageCost={0}
        adjustedEC2Cost={null}
      />,
    );
    const naCells = screen.getAllByText("N/A");
    expect(naCells.length).toBe(9);
  });

  it("renders an EngFlow row with a tooltip on hover", async () => {
    render(
      <CostModal {...defaultProps} adjustedEngFlowCost={0.25} total={0.25} />,
    );
    expect(screen.getByText("EngFlow")).toBeInTheDocument();
    const icon = screen.getByTestId("engflow-tooltip-trigger");
    fireEvent.mouseOver(icon);
    // jsdom can't lay out the tooltip's portal, so check presence not visibility.
    expect(
      await screen.findByText(
        /only included for tasks completed after November 24, 2026/,
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
  });

  it("calls onClickHoneycombLink when the version cost link is clicked", async () => {
    const user = userEvent.setup();
    const onClickHoneycombLink = vi.fn();
    render(
      <CostModal
        endTs={new Date("2023-07-07T20:00:00")}
        name="my-version"
        onClickHoneycombLink={onClickHoneycombLink}
        open
        setOpen={() => {}}
        startTs={new Date("2023-07-07T19:08:41")}
        versionId="version_12345"
      />,
    );
    await user.click(screen.getByTestId("version-cost-link"));
    expect(onClickHoneycombLink).toHaveBeenCalledTimes(1);
  });
});
