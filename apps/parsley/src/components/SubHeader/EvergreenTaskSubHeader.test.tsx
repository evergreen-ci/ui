import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@evg-ui/lib/test_utils";
import { LogTypes } from "constants/enums";
import { evergreenTaskMock } from "test_data/task";
import { EvergreenTaskSubHeader } from "./EvergreenTaskSubHeader";

describe("evergreen task subheader", () => {
  it("should only render task status for evergreen test log", async () => {
    render(
      <MockedProvider mocks={[evergreenTaskMock]}>
        <EvergreenTaskSubHeader
          execution={0}
          logType={LogTypes.EVERGREEN_TEST_LOGS}
          taskID="spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35"
          testID="JustAFakeTestInALonelyWorld"
        />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("spruce")).toBeInTheDocument();
    });
    // check_codegen task should be failing
    expect(screen.getByText("check_codegen")).toBeInTheDocument();
    expect(screen.getByDataCy("task-status-badge").textContent).toContain(
      "Failed",
    );
    // JustAFakeTestInALonelyWorld test should not be in the document
    expect(screen.queryByText("JustAFakeTestInALonelyWorld")).toBeNull();
    expect(screen.queryByText("test-status-badge")).toBeNull();
  });
});
