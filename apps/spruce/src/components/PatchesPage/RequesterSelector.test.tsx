import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@evg-ui/lib/test_utils";
import { RequesterSelector } from "./RequesterSelector";

describe("RequesterSelector", () => {
  it("does not render an empty chip summary", () => {
    render(
      <MemoryRouter>
        <RequesterSelector />
      </MemoryRouter>,
    );

    expect(screen.queryByText("No items selected")).not.toBeInTheDocument();
  });

  it("renders selected requesters as chips", () => {
    render(
      <MemoryRouter initialEntries={["/?requesters=github_pull_request"]}>
        <RequesterSelector />
      </MemoryRouter>,
    );

    expect(screen.getByText("Pull Request")).toBeVisible();
  });
});
