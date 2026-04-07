import {
  getHoneycombTraceUrl,
  getHoneycombSystemMetricsUrl,
  getHoneycombTaskCostUrl,
  getHoneycombPatchCostUrl,
} from "./honeycomb";

describe("getHoneycombTraceUrl", () => {
  it("generates the correct url", () => {
    expect(
      getHoneycombTraceUrl(
        "abcdef",
        new Date("2023-07-07T19:08:41"),
        new Date("2023-07-07T19:09:00"),
      ),
    ).toBe(
      "/datasets/evergreen-agent/trace?trace_id=abcdef&trace_start_ts=1688756921&trace_end_ts=1688756941",
    );
  });
});

describe("getHoneycombTaskCostUrl", () => {
  it("generates the correct url", () => {
    expect(getHoneycombTaskCostUrl("task_abc123")).toBe(
      `/datasets/evergreen?query={"calculations":[{"op":"MAX","column":"evergreen.task.on_demand_cost"},{"op":"MAX","column":"evergreen.task.adjusted_cost"},{"op":"MAX","column":"evergreen.task.cost.ebs.on_demand_throughput_cost"},{"op":"MAX","column":"evergreen.task.cost.ebs.adjusted_throughput_cost"},{"op":"MAX","column":"evergreen.task.s3_cost.artifact_put_cost"},{"op":"MAX","column":"evergreen.task.s3_cost.log_put_cost"}],"filters":[{"op":"=","column":"evergreen.task.id","value":"task_abc123"}]}&omitMissingValues`,
    );
  });
});

describe("getHoneycombPatchCostUrl", () => {
  it("generates the correct url", () => {
    expect(getHoneycombPatchCostUrl("version_xyz789")).toBe(
      `/datasets/evergreen?query={"calculations":[{"op":"SUM","column":"evergreen.task.on_demand_cost"},{"op":"SUM","column":"evergreen.task.adjusted_cost"},{"op":"SUM","column":"evergreen.task.cost.ebs.on_demand_throughput_cost"},{"op":"SUM","column":"evergreen.task.cost.ebs.adjusted_throughput_cost"},{"op":"SUM","column":"evergreen.task.s3_cost.artifact_put_cost"},{"op":"SUM","column":"evergreen.task.s3_cost.log_put_cost"}],"filters":[{"op":"=","column":"evergreen.version.id","value":"version_xyz789"}]}&omitMissingValues`,
    );
  });
});

describe("getHoneycombSystemMetricsUrl", () => {
  it("generates the correct url", () => {
    expect(
      getHoneycombSystemMetricsUrl(
        "task_12345",
        [],
        new Date("2023-07-07T19:08:41"),
        new Date("2023-07-07T20:00:00"),
      ),
    ).toBe(
      `/datasets/evergreen?query={"calculations":[{"op":"AVG","column":"system.memory.usage.used"},{"op":"AVG","column":"system.cpu.utilization"},{"op":"RATE_AVG","column":"system.network.io.transmit"},{"op":"RATE_AVG","column":"system.network.io.receive"}],"filters":[{"op":"=","column":"evergreen.task.id","value":"task_12345"}],"start_time":1688756921,"end_time":1688760000}&omitMissingValues`,
    );

    expect(
      getHoneycombSystemMetricsUrl(
        "task_12345",
        ["disk1", "disk2"],
        new Date("2023-07-07T19:08:41"),
        new Date("2023-07-07T20:00:00"),
      ),
    ).toBe(
      `/datasets/evergreen?query={"calculations":[{"op":"AVG","column":"system.memory.usage.used"},{"op":"AVG","column":"system.cpu.utilization"},{"op":"RATE_AVG","column":"system.network.io.transmit"},{"op":"RATE_AVG","column":"system.network.io.receive"},{"op":"RATE_AVG","column":"system.disk.io.disk1.read"},{"op":"RATE_AVG","column":"system.disk.io.disk1.write"},{"op":"RATE_AVG","column":"system.disk.operations.disk1.read"},{"op":"RATE_AVG","column":"system.disk.operations.disk1.write"},{"op":"RATE_AVG","column":"system.disk.io_time.disk1"},{"op":"RATE_AVG","column":"system.disk.io.disk2.read"},{"op":"RATE_AVG","column":"system.disk.io.disk2.write"},{"op":"RATE_AVG","column":"system.disk.operations.disk2.read"},{"op":"RATE_AVG","column":"system.disk.operations.disk2.write"},{"op":"RATE_AVG","column":"system.disk.io_time.disk2"}],"filters":[{"op":"=","column":"evergreen.task.id","value":"task_12345"}],"start_time":1688756921,"end_time":1688760000}&omitMissingValues`,
    );
  });
});
