import { trimSeverity } from "./logs";

describe("trimSeverity", () => {
  it("should trim the severity prefix from a line", () => {
    expect(
      trimSeverity(
        "[P: 40] [2022/12/05 20:03:30.136] Running pre-task commands.",
      ),
    ).toBe("[2022/12/05 20:03:30.136] Running pre-task commands.");
    expect(
      trimSeverity(
        "[P: 70] [2022/12/05 20:03:30.138] + '[' amazon2-cloud-small = amazon2-cloud-large ']'",
      ),
    ).toBe(
      "[2022/12/05 20:03:30.138] + '[' amazon2-cloud-small = amazon2-cloud-large ']'",
    );
  });
  it("should not trim the string if the severity prefix is not present", () => {
    expect(
      trimSeverity("[2022/12/05 20:03:30.136] Running pre-task commands."),
    ).toBe("[2022/12/05 20:03:30.136] Running pre-task commands.");
    expect(
      trimSeverity(
        "[2022/12/05 20:03:30.138] + '[' amazon2-cloud-small = amazon2-cloud-large ']'",
      ),
    ).toBe(
      "[2022/12/05 20:03:30.138] + '[' amazon2-cloud-small = amazon2-cloud-large ']'",
    );
  });
});
