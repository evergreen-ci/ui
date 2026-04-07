import {
  render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { CostModal, formatCost } from ".";

describe("formatCost", () => {
  it("ReturnsZeroStringForNull", () => {
    expect(formatCost(null)).toBe("0.00");
  });

  it("ReturnsZeroStringForUndefined", () => {
    expect(formatCost(undefined)).toBe("0.00");
  });

  it("UsesToPrecisionForSmallValues", () => {
    expect(formatCost(0.001234)).toBe("0.001234");
  });

  it("UsesToFixedForNormalValues", () => {
    expect(formatCost(1.5)).toBe("1.50");
  });

  it("UsesToFixedAtBoundary", () => {
    expect(formatCost(0.01)).toBe("0.01");
  });
});

describe("CostModal", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  it("RendersRowsWithCostValuesWhenProvided", async () => {
    const user = userEvent.setup();
    render(
      <CostModal
        adjustedEBSStorageCost={0.1}
        adjustedEBSThroughputCost={0.25}
        adjustedEC2Cost={1.5}
        name="my-task"
        onClose={() => {}}
        open={false}
        s3ArtifactPutCost={0.05}
        s3LogPutCost={0.02}
      />,
    );
    const trigger =
      screen.getByText("Cost Details") ?? screen.queryByRole("button");
    if (trigger) await user.click(trigger);
    expect(screen.getByDataCy("cost-modal")).toBeInTheDocument();
    expect(screen.getByText("$1.50")).toBeInTheDocument();
    expect(screen.getByText("$0.25")).toBeInTheDocument();
    expect(screen.getByText("$0.10")).toBeInTheDocument();
    expect(screen.getByText("$0.05")).toBeInTheDocument();
    expect(screen.getByText("$0.02")).toBeInTheDocument();
  });

  it("RendersNaForNullOrZeroCosts", () => {
    render(
      <CostModal
        adjustedEBSStorageCost={undefined}
        adjustedEBSThroughputCost={0}
        adjustedEC2Cost={null}
        name="my-task"
        onClose={() => {}}
        open
        s3ArtifactPutCost={null}
        s3LogPutCost={null}
      />,
    );
    expect(screen.getAllByText("N/A")).toHaveLength(5);
  });

  it("RendersCostDocsLink", () => {
    render(<CostModal name="my-task" onClose={() => {}} open />);
    expect(screen.getByDataCy("cost-docs-link")).toBeInTheDocument();
  });
});
