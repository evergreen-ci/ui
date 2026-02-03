import {
  RenderFakeToastContext as InitializeFakeToastContext,
  renderWithRouterMatch,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { logContextWrapper } from "context/LogContext/test_utils";
import SkippedLinesRow from ".";

describe("skippedLinesRow", () => {
  beforeEach(() => {
    InitializeFakeToastContext();
  });
  it("renders a skipped log line", () => {
    renderWithRouterMatch(
      <SkippedLinesRow
        {...skippedLinesProps}
        lineIndex={0}
        range={{ end: 11, start: 0 }}
      />,
      {
        wrapper: logContextWrapper(logLines),
      },
    );
    expect(screen.getByText("11 Lines Skipped")).toBeInTheDocument();
  });

  it.each([
    { buttonText: "5 Above", expected: [0, 4] },
    { buttonText: "5 Below", expected: [6, 10] },
  ])(
    "should call expandLines function with the correct arguments when expanding 5 lines in either direction",
    async ({ buttonText, expected }) => {
      const user = userEvent.setup();
      const expandLines = vi.fn();
      renderWithRouterMatch(
        <SkippedLinesRow
          {...skippedLinesProps}
          expandLines={expandLines}
          lineIndex={0}
          range={{ end: 11, start: 0 }}
        />,
        {
          wrapper: logContextWrapper(logLines),
        },
      );
      const expandFiveButton = screen.getByRole("button", {
        name: buttonText,
      });
      expect(expandFiveButton).toBeEnabled();
      await user.click(expandFiveButton);
      expect(expandLines).toHaveBeenCalledTimes(1);
      expect(expandLines).toHaveBeenCalledWith([expected]);
    },
  );

  it("should call expandLines function with the correct arguments when expanding all lines", async () => {
    const user = userEvent.setup();
    const expandLines = vi.fn();
    renderWithRouterMatch(
      <SkippedLinesRow
        {...skippedLinesProps}
        expandLines={expandLines}
        lineIndex={0}
        range={{ end: 11, start: 0 }}
      />,
      {
        wrapper: logContextWrapper(logLines),
      },
    );
    const expandFiveButton = screen.getByRole("button", {
      name: "All",
    });
    await user.click(expandFiveButton);
    expect(expandLines).toHaveBeenCalledTimes(1);
    expect(expandLines).toHaveBeenCalledWith([[0, 10]]);
  });

  it("should not disable `Expand 5 Above and Below` button if there are less than 10 log lines in the skipped row", async () => {
    renderWithRouterMatch(
      <SkippedLinesRow
        {...skippedLinesProps}
        lineIndex={0}
        range={{ end: 3, start: 0 }}
      />,
      {
        wrapper: logContextWrapper(logLines),
      },
    );
    const expandAboveButton = screen.getByRole("button", {
      name: "5 Above",
    });
    const expandBelowButton = screen.getByRole("button", {
      name: "5 Below",
    });
    expect(expandAboveButton).not.toHaveAttribute("aria-disabled", "true");
    expect(expandBelowButton).not.toHaveAttribute("aria-disabled", "true");
  });
});

const logLines = [
  "[js_test:job0_fixture_setup_0] Starting the setup of ReplicaSetFixture (Job #0).",
  "[j0:prim] Starting mongod on port 20000...",
  "filler",
  `PATH=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src:/data/multiversion:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/venv/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/node/bin:/opt/node/bin:/data/multiversion INSTALL_DIR=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin mongod-6.0 --setParameter enableTestCommands=1 --setParameter backtraceLogFile=/data/db/job0/resmoke/node0/2c65edd254db4835911f796d7b260455.stacktrace --setParameter internalQueryFrameworkControl=forceClassicEngine --setParameter 'logComponentVerbosity={'"'"'replication'"'"': {'"'"'election'"'"': 4, '"'"'heartbeats'"'"': 2, '"'"'initialSync'"'"': 2, '"'"'rollback'"'"': 2}, '"'"'sharding'"'"': {'"'"'migration'"'"': 2}, '"'"'storage'"'"': {'"'"'recovery'"'"': 2}, '"'"'transaction'"'"': 4, '"'"'tenantMigration'"'"': 4}' --setParameter disableLogicalSessionCacheRefresh=true --setParameter coordinateCommitReturnImmediatelyAfterPersistingDecision=false --setParameter transactionLifetimeLimitSeconds=86400 --setParameter maxIndexBuildDrainBatchSize=10 --setParameter writePeriodicNoops=false --setParameter shutdownTimeoutMillisForSignaledShutdown=100 --setParameter testingDiagnosticsEnabled=true --oplogSize=511 --replSet=rs --dbpath=/data/db/job0/resmoke/node0 --port=20000 --enableMajorityReadConcern=True --storageEngine=wiredTiger --wiredTigerCacheSizeGB=1`,
  "[j0:prim] mongod started on port 20000 with pid 30678.",
  "[j0:sec0] Starting mongod on port 20001...",
  "filler",
  `PATH=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src:/data/multiversion:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/venv/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/node/bin:/opt/node/bin:/data/multiversion INSTALL_DIR=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin /data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin/mongod --setParameter enableTestCommands=1 --setParameter backtraceLogFile=/data/db/job0/resmoke/node1/a611b65dce484b7d81b294a7941a2dac.stacktrace --setParameter internalQueryFrameworkControl=forceClassicEngine --setParameter 'logComponentVerbosity={'"'"'replication'"'"': {'"'"'election'"'"': 4, '"'"'heartbeats'"'"': 2, '"'"'initialSync'"'"': 2, '"'"'rollback'"'"': 2}, '"'"'sharding'"'"': {'"'"'migration'"'"': 2}, '"'"'storage'"'"': {'"'"'recovery'"'"': 2}, '"'"'transaction'"'"': 4, '"'"'tenantMigration'"'"': 4}' --setParameter disableLogicalSessionCacheRefresh=true --setParameter coordinateCommitReturnImmediatelyAfterPersistingDecision=false --setParameter transactionLifetimeLimitSeconds=86400 --setParameter maxIndexBuildDrainBatchSize=10 --setParameter writePeriodicNoops=false --setParameter shutdownTimeoutMillisForSignaledShutdown=100 --setParameter testingDiagnosticsEnabled=true --oplogSize=511 --replSet=rs --dbpath=/data/db/job0/resmoke/node1 --port=20001 --enableMajorityReadConcern=True --storageEngine=wiredTiger --wiredTigerCacheSizeGB=1`,
  "[j0:sec0] mongod started on port 20001 with pid 30681.",
  "[j0:sec1] Starting mongod on port 20002...",
  "filler",
];

const skippedLinesProps = {
  expandLines: vi.fn(),
  lineIndex: 0,
};
