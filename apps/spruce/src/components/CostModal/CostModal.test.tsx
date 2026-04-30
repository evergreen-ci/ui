import {
  renderWithRouterMatch as render,
  screen,
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
    expect(screen.getByDataCy("modal-title")).toHaveTextContent(
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
        adjustedS3ArtifactPutCost={0.001}
        adjustedS3ArtifactStorageCost={0.0002}
        adjustedS3LogPutCost={0.003}
        adjustedS3LogStorageCost={0.0004}
        total={0.52}
      />,
    );
    expect(screen.getByText("$0.52")).toBeInTheDocument();
    expect(screen.getByText("$0.5")).toBeInTheDocument();
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
    expect(naCells.length).toBe(8);
  });
});
