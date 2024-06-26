import { RowType } from "types/logs";
import filterLogs from ".";

describe("filterLogs", () => {
  it("should return the log lines as is if matching lines is undefined", () => {
    expect(
      filterLogs({
        bookmarks: [],
        expandableRows: true,
        expandedLines: [],
        failingLine: undefined,
        logLines,
        matchingLines: undefined,
        sectionData: undefined,
        sectionState: undefined,
        sectioningEnabled: false,
        shareLine: undefined,
      }),
    ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("should hide skipped rows if expandableRows is turned off", () => {
    expect(
      filterLogs({
        bookmarks: [],
        expandableRows: false,
        expandedLines: [],
        failingLine: undefined,
        logLines,
        matchingLines: new Set([1, 2, 3]),
        sectionData: undefined,
        sectionState: undefined,
        sectioningEnabled: false,
        shareLine: undefined,
      }),
    ).toStrictEqual([1, 2, 3]);
  });

  it("should collapse all of the log lines if there are no matching lines", () => {
    expect(
      filterLogs({
        bookmarks: [],
        expandableRows: true,
        expandedLines: [],
        failingLine: undefined,
        logLines,
        matchingLines: new Set([]),
        sectionData: undefined,
        sectionState: undefined,
        sectioningEnabled: false,
        shareLine: undefined,
      }),
    ).toStrictEqual([
      { range: { end: 8, start: 0 }, rowType: RowType.SkippedLines },
    ]);
  });

  describe("with matching lines", () => {
    it("should not collapse bookmarks", () => {
      expect(
        filterLogs({
          bookmarks: [7],
          expandableRows: true,
          expandedLines: [],
          failingLine: undefined,
          logLines,
          matchingLines: new Set([1]),
          sectionData: undefined,
          sectionState: undefined,
          sectioningEnabled: false,
          shareLine: undefined,
        }),
      ).toStrictEqual([
        { range: { end: 1, start: 0 }, rowType: RowType.SkippedLines },
        1,
        { range: { end: 7, start: 2 }, rowType: RowType.SkippedLines },
        7,
      ]);
    });

    it("should not collapse the share line", () => {
      expect(
        filterLogs({
          bookmarks: [],
          expandableRows: true,
          expandedLines: [],
          failingLine: undefined,
          logLines,
          matchingLines: new Set([1]),
          sectionData: undefined,
          sectionState: undefined,
          sectioningEnabled: false,
          shareLine: 7,
        }),
      ).toStrictEqual([
        { range: { end: 1, start: 0 }, rowType: RowType.SkippedLines },
        1,
        { range: { end: 7, start: 2 }, rowType: RowType.SkippedLines },
        7,
      ]);
    });

    it("should not collapse the failing line", () => {
      expect(
        filterLogs({
          bookmarks: [],
          expandableRows: true,
          expandedLines: [],
          failingLine: 7,
          logLines,
          matchingLines: new Set([1]),
          sectionData: undefined,
          sectionState: undefined,
          sectioningEnabled: false,
          shareLine: undefined,
        }),
      ).toStrictEqual([
        { range: { end: 1, start: 0 }, rowType: RowType.SkippedLines },
        1,
        { range: { end: 7, start: 2 }, rowType: RowType.SkippedLines },
        7,
      ]);
    });

    it("should not collapse expanded lines", () => {
      expect(
        filterLogs({
          bookmarks: [],
          expandableRows: true,
          expandedLines: [[4, 6]],
          failingLine: undefined,
          logLines,
          matchingLines: new Set([1]),
          sectionData: undefined,
          sectionState: undefined,
          sectioningEnabled: false,
          shareLine: undefined,
        }),
      ).toStrictEqual([
        { range: { end: 1, start: 0 }, rowType: RowType.SkippedLines },
        1,
        { range: { end: 4, start: 2 }, rowType: RowType.SkippedLines },
        4,
        5,
        6,
        { range: { end: 8, start: 7 }, rowType: RowType.SkippedLines },
      ]);
    });
  });

  describe("should create sections if sections are enabled and no filters are applied", () => {
    it("all sections open", () => {
      expect(
        filterLogs({
          bookmarks: [],
          expandableRows: true,
          expandedLines: [],
          failingLine: undefined,
          logLines: logsWithSections,
          matchingLines: undefined,
          sectionData,
          sectionState: {
            "function-1": { commands: {}, isOpen: true },
            "function-6": { commands: {}, isOpen: true },
          },
          sectioningEnabled: true,
          shareLine: undefined,
        }),
      ).toStrictEqual(allSectionsOpen);
    });

    it("some sections open", () => {
      expect(
        filterLogs({
          bookmarks: [],
          expandableRows: true,
          expandedLines: [],
          failingLine: undefined,
          logLines: logsWithSections,
          matchingLines: undefined,
          sectionData,
          sectionState: {
            "function-1": { commands: {}, isOpen: false },
            "function-6": { commands: {}, isOpen: true },
          },
          sectioningEnabled: true,
          shareLine: undefined,
        }),
      ).toStrictEqual(someSectionsOpen);
    });

    it("all sections closed", () => {
      expect(
        filterLogs({
          bookmarks: [],
          expandableRows: true,
          expandedLines: [],
          failingLine: undefined,
          logLines: logsWithSections,
          matchingLines: undefined,
          sectionData,
          sectionState: {
            "f-1": { commands: {}, isOpen: false },
            "f-2": { commands: {}, isOpen: false },
          },
          sectioningEnabled: true,
          shareLine: undefined,
        }),
      ).toStrictEqual(allSectionsClosed);
    });
  });

  it("sections are ignored when filters are applied even when sectionData exists and sections are enabled", () => {
    expect(
      filterLogs({
        bookmarks: [],
        expandableRows: true,
        expandedLines: [[4, 6]],
        failingLine: undefined,
        logLines,
        matchingLines: new Set([1]),
        sectionData,
        sectionState: undefined,
        sectioningEnabled: true,
        shareLine: undefined,
      }),
    ).toStrictEqual([
      { range: { end: 1, start: 0 }, rowType: RowType.SkippedLines },
      1,
      { range: { end: 4, start: 2 }, rowType: RowType.SkippedLines },
      4,
      5,
      6,
      { range: { end: 8, start: 7 }, rowType: RowType.SkippedLines },
    ]);
  });
});

const logLines = [
  "[js_test:job0_fixture_setup_0] Starting the setup of ReplicaSetFixture (Job #0).",
  "[j0:prim] Starting mongod on port 20000...",
  `PATH=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src:/data/multiversion:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/venv/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/node/bin:/opt/node/bin:/data/multiversion INSTALL_DIR=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin mongod-6.0 --setParameter enableTestCommands=1 --setParameter backtraceLogFile=/data/db/job0/resmoke/node0/2c65edd254db4835911f796d7b260455.stacktrace --setParameter internalQueryFrameworkControl=forceClassicEngine --setParameter 'logComponentVerbosity={'"'"'replication'"'"': {'"'"'election'"'"': 4, '"'"'heartbeats'"'"': 2, '"'"'initialSync'"'"': 2, '"'"'rollback'"'"': 2}, '"'"'sharding'"'"': {'"'"'migration'"'"': 2}, '"'"'storage'"'"': {'"'"'recovery'"'"': 2}, '"'"'transaction'"'"': 4, '"'"'tenantMigration'"'"': 4}' --setParameter disableLogicalSessionCacheRefresh=true --setParameter coordinateCommitReturnImmediatelyAfterPersistingDecision=false --setParameter transactionLifetimeLimitSeconds=86400 --setParameter maxIndexBuildDrainBatchSize=10 --setParameter writePeriodicNoops=false --setParameter shutdownTimeoutMillisForSignaledShutdown=100 --setParameter testingDiagnosticsEnabled=true --oplogSize=511 --replSet=rs --dbpath=/data/db/job0/resmoke/node0 --port=20000 --enableMajorityReadConcern=True --storageEngine=wiredTiger --wiredTigerCacheSizeGB=1`,
  "[j0:prim] mongod started on port 20000 with pid 30678.",
  "[j0:sec0] Starting mongod on port 20001...",
  `PATH=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src:/data/multiversion:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/venv/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/node/bin:/opt/node/bin:/data/multiversion INSTALL_DIR=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin /data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin/mongod --setParameter enableTestCommands=1 --setParameter backtraceLogFile=/data/db/job0/resmoke/node1/a611b65dce484b7d81b294a7941a2dac.stacktrace --setParameter internalQueryFrameworkControl=forceClassicEngine --setParameter 'logComponentVerbosity={'"'"'replication'"'"': {'"'"'election'"'"': 4, '"'"'heartbeats'"'"': 2, '"'"'initialSync'"'"': 2, '"'"'rollback'"'"': 2}, '"'"'sharding'"'"': {'"'"'migration'"'"': 2}, '"'"'storage'"'"': {'"'"'recovery'"'"': 2}, '"'"'transaction'"'"': 4, '"'"'tenantMigration'"'"': 4}' --setParameter disableLogicalSessionCacheRefresh=true --setParameter coordinateCommitReturnImmediatelyAfterPersistingDecision=false --setParameter transactionLifetimeLimitSeconds=86400 --setParameter maxIndexBuildDrainBatchSize=10 --setParameter writePeriodicNoops=false --setParameter shutdownTimeoutMillisForSignaledShutdown=100 --setParameter testingDiagnosticsEnabled=true --oplogSize=511 --replSet=rs --dbpath=/data/db/job0/resmoke/node1 --port=20001 --enableMajorityReadConcern=True --storageEngine=wiredTiger --wiredTigerCacheSizeGB=1`,
  "[j0:sec0] mongod started on port 20001 with pid 30681.",
  "[j0:sec1] Starting mongod on port 20002...",
];

const logsWithSections = [
  "normal log line",
  "Running command 'c1' in function 'f-1'.",
  "Finished command 'c1' in function 'f-1'.",
  "Running command 'c2' in function 'f-1'.",
  "Finished command 'c2' in function 'f-1'.",
  "normal log line",
  "Running command 'c3' in function 'f-2'.",
  "normal log line",
  "Finished command 'c3' in function 'f-2'.",
  "Running command 'c4' in function 'f-2'.",
  "Finished command 'c4' in function 'f-2'.",
  "normal log line",
  "normal log line",
  "normal log line",
];

const sectionData = {
  commands: [],
  functions: [
    {
      functionID: "function-1",
      functionName: "f-1",
      range: { end: 5, start: 1 },
    },
    {
      functionID: "function-6",
      functionName: "f-2",
      range: { end: 11, start: 6 },
    },
  ],
};

const allSectionsOpen = [
  0,
  {
    functionID: "function-1",
    functionName: "f-1",
    isOpen: true,
    range: {
      end: 5,
      start: 1,
    },
    rowType: RowType.SectionHeader,
  },
  1,
  2,
  3,
  4,
  5,
  {
    functionID: "function-6",
    functionName: "f-2",
    isOpen: true,
    range: {
      end: 11,
      start: 6,
    },
    rowType: RowType.SectionHeader,
  },
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
];
const someSectionsOpen = [
  0,
  {
    functionID: "function-1",
    functionName: "f-1",
    isOpen: false,
    range: {
      end: 5,
      start: 1,
    },
    rowType: RowType.SectionHeader,
  },
  5,
  {
    functionID: "function-6",
    functionName: "f-2",
    isOpen: true,
    range: {
      end: 11,
      start: 6,
    },
    rowType: RowType.SectionHeader,
  },
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
];

const allSectionsClosed = [
  0,
  {
    functionID: "function-1",
    functionName: "f-1",
    isOpen: false,
    range: {
      end: 5,
      start: 1,
    },
    rowType: RowType.SectionHeader,
  },
  5,
  {
    functionID: "function-6",
    functionName: "f-2",
    isOpen: false,
    range: {
      end: 11,
      start: 6,
    },
    rowType: RowType.SectionHeader,
  },
  11,
  12,
  13,
];
