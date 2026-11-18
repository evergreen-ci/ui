import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@evg-ui/lib/test_utils";
import { RequesterSelector } from "./RequesterSelector";

describe("RequesterSelector", () => {
  it("shows the placeholder when no requesters are selected", () => {
    render(
      <MemoryRouter>
        <RequesterSelector />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("requester-selector")).toHaveTextContent(
      "Patch submission",
    );
  });

  it("shows the selected requesters in the trigger", () => {
    render(
      <MemoryRouter
        initialEntries={["/?requesters=github_pull_request,patch_request"]}
      >
        <RequesterSelector />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button")).toHaveTextContent(
      "Pull Request and Patch",
    );
  });
});
