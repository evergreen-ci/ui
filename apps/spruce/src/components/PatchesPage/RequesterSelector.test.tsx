import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@evg-ui/lib/test_utils";
import { RequesterSelector } from "./RequesterSelector";

describe("RequesterSelector", () => {
  it("does not render a chip summary below the filter", () => {
    render(
      <MemoryRouter>
        <RequesterSelector />
      </MemoryRouter>,
    );

    expect(screen.queryByText("No items selected")).not.toBeInTheDocument();
  });
});
