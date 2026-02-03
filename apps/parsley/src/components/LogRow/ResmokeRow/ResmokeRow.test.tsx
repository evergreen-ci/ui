import {
  RenderFakeToastContext as InitializeFakeToastContext,
  MockedProvider,
  RenderWithRouterMatchOptions,
  renderWithRouterMatch,
  screen,
} from "@evg-ui/lib/test_utils";
import { WordWrapFormat } from "constants/enums";
import { LogContextProvider } from "context/LogContext";
import { MultiLineSelectContextProvider } from "context/MultiLineSelectContext";
import { parsleySettingsMock } from "test_data/parsleySettings";
import ResmokeRow from ".";

const renderRow = (
  props: React.ComponentProps<typeof ResmokeRow>,
  options: RenderWithRouterMatchOptions,
) =>
  renderWithRouterMatch(<ResmokeRow {...props} />, {
    ...options,
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={[parsleySettingsMock]}>
        <LogContextProvider initialLogLines={logLines}>
          <MultiLineSelectContextProvider>
            {children}
          </MultiLineSelectContextProvider>
        </LogContextProvider>
      </MockedProvider>
    ),
  });

describe("resmokeRow", () => {
  beforeEach(() => {
    InitializeFakeToastContext();
  });
  it("does not render a resmoke row if getLine returns undefined", () => {
    renderRow({ ...resmokeProps, lineIndex: 99, lineNumber: 99 }, {});
    expect(screen.queryByDataCy("resmoke-row")).toBeNull();
  });
  it("renders a resmoke row if getLine returns an empty string", () => {
    renderRow({ ...resmokeProps, lineIndex: 9, lineNumber: 9 }, {});

    expect(screen.getByDataCy("resmoke-row")).toBeInTheDocument();
  });
  it("displays a log line and its text for a given index", () => {
    renderRow({ ...resmokeProps, lineIndex: 0, lineNumber: 0 }, {});

    expect(screen.getByText(logLines[0])).toBeInTheDocument();
    renderRow({ ...resmokeProps, lineIndex: 1, lineNumber: 1 }, {});

    expect(screen.getByText(logLines[1])).toBeInTheDocument();
  });
  it("should apply syntax highlighting to resmoke lines if they have a color", () => {
    const getResmokeLineColor = vi.fn().mockReturnValue("#ff0000");
    renderRow(
      { ...resmokeProps, getResmokeLineColor, lineIndex: 7, lineNumber: 7 },
      {},
    );

    expect(getResmokeLineColor).toHaveBeenCalledWith(7);
    expect(screen.getByDataCy("resmoke-row")).toHaveStyle("color: #ff0000");
  });
  it("should highlight text that match a search term", () => {
    renderRow(
      { ...resmokeProps, lineIndex: 7, lineNumber: 7, searchTerm: /mongod/ },
      {},
    );

    expect(screen.queryByDataCy("highlight")).toHaveTextContent("mongod");
  });
  it("should highlight text that have a matching highlight term", () => {
    renderRow(
      {
        ...resmokeProps,
        highlightRegex: /mongod/,
        lineIndex: 7,
        lineNumber: 7,
      },
      {},
    );

    expect(screen.queryByDataCy("highlight")).toHaveTextContent("mongod");
  });

  it("should pretty print logs", () => {
    renderRow(
      {
        ...resmokeProps,
        lineIndex: 8,
        lineNumber: 8,
        prettyPrint: true,
      },
      {
        route: "/?bookmarks=8",
      },
    );
    expect(
      screen.getByText("j0:s0:n0", {
        exact: false,
      }).textContent,
    )
      .toBe(`[j0:s0:n0] | 2022-09-21T12:50:19.899+00:00 D2 REPL_HB  4615618 [ReplCoord-0] "Scheduling heartbeat","attr":
{
    target: "localhost:20004",
    when: {
        $date: "2022-09-21T12:50:21.899Z"
    }
}
`);
  });

  describe("ANSI formatting", () => {
    it("should apply a color to lines with ANSI formatting", () => {
      const rgbRed = "rgb(187, 0, 0)";
      renderRow(
        {
          ...resmokeProps,
          lineIndex: 9,
          lineNumber: 9,
        },
        {},
      );

      expect(
        screen.getByText(logLines[9].substring(44, logLines[9].length - 3)),
      ).toHaveStyle(`color: ${rgbRed}`);
    });

    it("should pretty print logs that contain ANSI formatting", () => {
      renderRow(
        {
          ...resmokeProps,
          lineIndex: 9,
          lineNumber: 9,
          prettyPrint: true,
        },
        {
          route: "/?bookmarks=9",
        },
      );
      expect(
        screen.getByText("reboot Awesome", {
          exact: false,
        }).textContent,
      ).toBe(
        `-
{
    _id: 109,
    array: [
        null,
        19006,
        57916,
        64722,
        70773,
        "Managed",
        "reboot Awesome",
        {
            _id: 110,
            any: false,
            date: {
                $date: "2019-04-21T12:38:55.127Z"
            },
            num: 16865,
            obj: {},
            str: "Savings Account Syrian Arab Republic"
        },
        {
            $date: "2019-01-30T08:45:49.630Z"
        }
    ],
    date: {
        $date: "2019-11-24T17:33:31.177Z"
    },
    num: 46216,
    obj: {
        num: {
            $numberDouble: "NaN"
        },
        obj: {
            obj: {
                obj: {
                    array: [
                        {
                            $numberDecimal: "9.999999999999999999999999999999999E+6144"
                        },
                        {
                            obj: {
                                date: {
                                    $date: "2019-05-22T18:08:11.881Z"
                                },
                                num: 1
                            }
                        },
                        [
                            {
                                $regularExpression: {
                                    pattern: "Bedfordshire|Executive|Designer|National|Towels",
                                    options: ""
                                }
                            }
                        ],
                        {
                            $date: "2019-08-27T23:11:45.451Z"
                        },
                        {
                            $date: "2019-12-12T22:46:51.181Z"
                        }
                    ]
                }
            }
        }
    },
    str: "Hawaii"
}
,`,
      );
    });
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
  `[j0:s0:n0] | 2022-09-21T12:50:19.899+00:00 D2 REPL_HB  4615618 [ReplCoord-0] "Scheduling heartbeat","attr":{"target":"localhost:20004","when":{"$date":"2022-09-21T12:50:21.899Z"}}`,
  `[query_tester_server_test:20071126022] [31m-{"_id":109,"array":[null,19006,57916,64722,70773,"Managed","reboot Awesome",{"_id":110,"any":false,"date":{"$date":"2019-04-21T12:38:55.127Z"},"num":16865,"obj":{},"str":"Savings Account Syrian Arab Republic"},{"$date":"2019-01-30T08:45:49.630Z"}],"date":{"$date":"2019-11-24T17:33:31.177Z"},"num":46216,"obj":{"num":{"$numberDouble":"NaN"},"obj":{"obj":{"obj":{"array":[{"$numberDecimal":"9.999999999999999999999999999999999E+6144"},{"obj":{"date":{"$date":"2019-05-22T18:08:11.881Z"},"num":1}},[{"$regularExpression":{"pattern":"Bedfordshire|Executive|Designer|National|Towels","options":""}}],{"$date":"2019-08-27T23:11:45.451Z"},{"$date":"2019-12-12T22:46:51.181Z"}]}}}},"str":"Hawaii"},[m`,
  "",
];

const resmokeProps = {
  getLine: (index: number) => logLines[index],
  getResmokeLineColor: vi.fn(),
  scrollToLine: vi.fn(),

  prettyPrint: false,
  range: { lowerRange: 0 },
  wordWrapFormat: WordWrapFormat.Standard,
  wrap: false,
};
