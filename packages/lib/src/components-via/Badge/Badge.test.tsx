import { render, screen } from "test_utils";
import { Badge } from ".";

describe("via badge wrapper", () => {
  it("renders badge content", () => {
    render(<Badge variant="success">Succeeded</Badge>);
    expect(screen.getByText("Succeeded")).toBeInTheDocument();
  });
});
