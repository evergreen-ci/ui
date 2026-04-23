import {
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { CostModal, formatCost } from ".";

describe("formatCost", () => {
  it("formats costs >= $0.01 to two decimal places", () => {
    expect(formatCost(1.5)).toBe("1.50");
    expect(formatCost(321.45)).toBe("321.45");
    expect(formatCost(0.01)).toBe("0.01");
  });

  it("formats costs < $0.01 to 4 significant figures", () => {
    expect(formatCost(0.001234)).toBe("0.001234");
    expect(formatCost(0.000056789)).toBe("0.00005679");
  });
});

describe("CostModal", () => {
  const defaultProps = {
    name: "my-task",
    open: true,
    onClose: () => {},
  };

  it("renders the modal title with task name", () => {
    render(<CostModal {...defaultProps} />);
    expect(screen.getByDataCy("modal-title")).toHaveTextContent(
      "Cost breakdown for my-task",
    );
  });

  it("renders the docs link", () => {
    render(<CostModal {...defaultProps} />);
    expect(screen.getByDataCy("cost-docs-link")).toBeInTheDocument();
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
    expect(screen.getByText("$0.50")).toBeInTheDocument();
    expect(screen.getByText("$0.01")).toBeInTheDocument();
    expect(screen.getByText("$0.02")).toBeInTheDocument();
    expect(screen.getByText("$0.001000")).toBeInTheDocument();
    expect(screen.getByText("$0.0002000")).toBeInTheDocument();
    expect(screen.getByText("$0.003000")).toBeInTheDocument();
    expect(screen.getByText("$0.0004000")).toBeInTheDocument();
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
