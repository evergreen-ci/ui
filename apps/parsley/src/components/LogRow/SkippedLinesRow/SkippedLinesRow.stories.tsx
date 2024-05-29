import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import LogPane from "components/LogPane";
import { ParsleyRow } from "components/LogRow/RowRenderer";
import { LogRenderingTypes, LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import WithToastContext from "test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { ExpandedLines, ProcessedLogLines } from "types/logs";
import SkippedLinesRow from ".";

export default {
  component: SkippedLinesRow,
  decorators: [WithToastContext],
} satisfies CustomMeta<typeof SkippedLinesRow>;

const SkippedLinesRowStory = (
  args: React.ComponentProps<typeof SkippedLinesRow>,
) => {
  const [range, setRange] = useState(args.range);
  const expandLines = (a: ExpandedLines) => {
    const nextLineStart = a[0][1] + 1;
    const nextLineEnd = a?.[1]?.[0] ?? nextLineStart;
    setRange({ lineEnd: nextLineEnd, lineStart: nextLineStart });
  };

  return (
    <Container>
      <SkippedLinesRow
        expandLines={expandLines}
        lineIndex={args.lineIndex}
        range={range}
      />
    </Container>
  );
};

export const SkippedLinesRowSingle: CustomStoryObj<typeof SkippedLinesRow> = {
  argTypes: {
    expandLines: { action: "expandLines" },
  },
  args: {
    // Initialize an array with 100 skipped lines.
    range: { lineEnd: 101, lineStart: 1 },
  },
  render: (args) => <SkippedLinesRowStory {...args} />,
};

// SkippedLinesRow with AnsiRows.
const SkippedAnsiRowStory = (
  args: React.ComponentProps<typeof SkippedLinesRow> & {
    wrap: boolean;
  },
) => {
  const { ingestLines, preferences, processedLogLines, setLogMetadata } =
    useLogContext();
  const { setWrap } = preferences;

  useEffect(() => {
    setLogMetadata({ logType: LogTypes.EVERGREEN_TASK_LOGS });
    ingestLines(ansiLogLines, LogRenderingTypes.Default);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setWrap(args.wrap);
  }, [args.wrap, setWrap]);

  return (
    <Container>
      <LogPane
        rowCount={processedLogLines.length}
        rowRenderer={ParsleyRow({
          processedLogLines: skippedLogLines,
        })}
      />
    </Container>
  );
};

export const SkippedAnsiRow: CustomStoryObj<
  React.ComponentProps<typeof SkippedLinesRow> & {
    wrap: boolean;
  }
> = {
  args: {
    wrap: false,
  },
  render: (args) => <SkippedAnsiRowStory {...args} />,
};

// SkippedLinesRow withs ResmokeRows.
const SkippedResmokeRowStory = (
  args: React.ComponentProps<typeof SkippedLinesRow> & {
    wrap: boolean;
  },
) => {
  const { ingestLines, preferences, processedLogLines, setLogMetadata } =
    useLogContext();
  const { setWrap } = preferences;

  useEffect(() => {
    setLogMetadata({ logType: LogTypes.LOGKEEPER_LOGS });
    ingestLines(resmokeLogLines, LogRenderingTypes.Resmoke);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setWrap(args.wrap);
  }, [args.wrap, setWrap]);

  return (
    <Container>
      <LogPane
        rowCount={processedLogLines.length}
        rowRenderer={ParsleyRow({
          processedLogLines: skippedLogLines,
        })}
      />
    </Container>
  );
};

export const SkippedResmokeRow: CustomStoryObj<
  React.ComponentProps<typeof SkippedLinesRow> & {
    wrap: boolean;
  }
> = {
  args: {
    wrap: false,
  },
  render: (args) => <SkippedResmokeRowStory {...args} />,
};

const ansiLogLines = [
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=info]: [hash='536cdcab21b907c87cd14751ad523ad1d8f23d07' message='successfully created version' project='mci' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "Some line with a url https://www.google.com",
  "┌\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m┐\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mTests:\u001b[39m        \u001b[32m4\u001b[39m                                                                                \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mPassing:\u001b[39m      \u001b[32m4\u001b[39m                                                                                \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mFailing:\u001b[39m      \u001b[32m0\u001b[39m                                                                                \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mPending:\u001b[39m      \u001b[32m0\u001b[39m                                                                                \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mSkipped:\u001b[39m      \u001b[32m0\u001b[39m                                                                                \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mScreenshots:\u001b[39m  \u001b[32m0\u001b[39m                                                                                \u001b[90m│\u001b[39m",
];

const resmokeLogLines = [
  "[js_test:job0_fixture_setup_0] Starting the setup of ReplicaSetFixture (Job #0).",
  "[j0:prim] Starting mongod on port 20000...",
  `PATH=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src:/data/multiversion:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/venv/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/node/bin:/opt/node/bin:/data/multiversion INSTALL_DIR=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin mongod-6.0 --setParameter enableTestCommands=1 --setParameter backtraceLogFile=/data/db/job0/resmoke/node0/2c65edd254db4835911f796d7b260455.stacktrace --setParameter internalQueryFrameworkControl=forceClassicEngine --setParameter 'logComponentVerbosity={'"'"'replication'"'"': {'"'"'election'"'"': 4, '"'"'heartbeats'"'"': 2, '"'"'initialSync'"'"': 2, '"'"'rollback'"'"': 2}, '"'"'sharding'"'"': {'"'"'migration'"'"': 2}, '"'"'storage'"'"': {'"'"'recovery'"'"': 2}, '"'"'transaction'"'"': 4, '"'"'tenantMigration'"'"': 4}' --setParameter disableLogicalSessionCacheRefresh=true --setParameter coordinateCommitReturnImmediatelyAfterPersistingDecision=false --setParameter transactionLifetimeLimitSeconds=86400 --setParameter maxIndexBuildDrainBatchSize=10 --setParameter writePeriodicNoops=false --setParameter shutdownTimeoutMillisForSignaledShutdown=100 --setParameter testingDiagnosticsEnabled=true --oplogSize=511 --replSet=rs --dbpath=/data/db/job0/resmoke/node0 --port=20000 --enableMajorityReadConcern=True --storageEngine=wiredTiger --wiredTigerCacheSizeGB=1`,
  "[j0:prim] mongod started on port 20000 with pid 30678.",
  "[j0:sec0] Starting mongod on port 20001...",
  `PATH=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src:/data/multiversion:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/venv/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/node/bin:/opt/node/bin:/data/multiversion INSTALL_DIR=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin /data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin/mongod --setParameter enableTestCommands=1 --setParameter backtraceLogFile=/data/db/job0/resmoke/node1/a611b65dce484b7d81b294a7941a2dac.stacktrace --setParameter internalQueryFrameworkControl=forceClassicEngine --setParameter 'logComponentVerbosity={'"'"'replication'"'"': {'"'"'election'"'"': 4, '"'"'heartbeats'"'"': 2, '"'"'initialSync'"'"': 2, '"'"'rollback'"'"': 2}, '"'"'sharding'"'"': {'"'"'migration'"'"': 2}, '"'"'storage'"'"': {'"'"'recovery'"'"': 2}, '"'"'transaction'"'"': 4, '"'"'tenantMigration'"'"': 4}' --setParameter disableLogicalSessionCacheRefresh=true --setParameter coordinateCommitReturnImmediatelyAfterPersistingDecision=false --setParameter transactionLifetimeLimitSeconds=86400 --setParameter maxIndexBuildDrainBatchSize=10 --setParameter writePeriodicNoops=false --setParameter shutdownTimeoutMillisForSignaledShutdown=100 --setParameter testingDiagnosticsEnabled=true --oplogSize=511 --replSet=rs --dbpath=/data/db/job0/resmoke/node1 --port=20001 --enableMajorityReadConcern=True --storageEngine=wiredTiger --wiredTigerCacheSizeGB=1`,
  "[j0:sec0] mongod started on port 20001 with pid 30681.",
  "[j0:sec1] Starting mongod on port 20002...",
];

const skippedLogLines: ProcessedLogLines = [
  0,
  1,
  2,
  { range: { lineEnd: 6, lineStart: 3 }, rowType: "SkippedLines" },
  6,
  7,
];

const Container = styled.div`
  height: 400px;
  width: 800px;
`;
