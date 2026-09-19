import { render, screen } from "@evg-ui/lib/test_utils";
import { PatchStatus } from "types/patch";
import { PatchStatusBadge } from "./PatchStatusBadge";

describe("PatchStatusBadge", () => {
  it.each([
    [PatchStatus.Unconfigured, "Unconfigured"],
    [PatchStatus.Created, "Created"],
    [PatchStatus.Failed, "Failed"],
    [PatchStatus.Started, "Running"],
    [PatchStatus.Success, "Succeeded"],
    [PatchStatus.Aborted, "Aborted"],
  ])("renders %s with capitalized copy", (status, copy) => {
    render(<PatchStatusBadge status={status} />);

    expect(screen.getByText(copy)).toBeVisible();
  });
});
