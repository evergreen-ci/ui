import {
  ApolloMock,
  MockedProvider,
  RenderFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  waitFor,
} from "@evg-ui/lib/test_utils";
import {
  ProjectEventLogsQuery,
  ProjectEventLogsQueryVariables,
} from "gql/generated/types";
import { PROJECT_EVENT_LOGS } from "gql/queries";
import { ProjectType } from "../utils";
import { EventLogTab } from "./EventLogTab";

// @ts-expect-error: FIXME. This comment was added by an automated script.
const Wrapper = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("loading events", () => {
  it("does not show a load more button when the event count is less than the limit", async () => {
    const { Component } = RenderFakeToastContext(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      <Wrapper mocks={[mock()]}>
        <EventLogTab projectType={ProjectType.AttachedProject} />
      </Wrapper>,
    );
    render(<Component />, {
      route: "/project/spruce/settings",
      path: "/project/:projectIdentifier/settings",
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("event-log-card")).toHaveLength(1);
    });
    await waitFor(() => {
      expect(screen.queryByDataCy("load-more-button")).not.toBeInTheDocument();
    });
    expect(screen.getByText("No more events to show.")).toBeInTheDocument();
  });

  it("shows a 'Load more' button when the number of events loaded meets the limit", async () => {
    const limit = 1;
    const { Component } = RenderFakeToastContext(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      <Wrapper mocks={[mock(limit)]}>
        <EventLogTab limit={limit} projectType={ProjectType.AttachedProject} />
      </Wrapper>,
    );
    render(<Component />, {
      route: "/project/spruce/settings",
      path: "/project/:projectIdentifier/settings",
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("event-log-card")).toHaveLength(1);
    });
    expect(screen.getByDataCy("load-more-button")).toBeInTheDocument();
    expect(
      screen.queryByText("No more events to show."),
    ).not.toBeInTheDocument();
  });
});

const mock = (
  limit: number = 15,
): ApolloMock<ProjectEventLogsQuery, ProjectEventLogsQueryVariables> => ({
  request: {
    query: PROJECT_EVENT_LOGS,
    variables: {
      projectIdentifier: "spruce",
      limit,
    },
  },
  result: {
    data: projectEventsQuery,
  },
});

const projectEventsQuery: ProjectEventLogsQuery = {
  projectEvents: {
    __typename: "ProjectEvents",
    count: 1,
    eventLogEntries: [
      {
        __typename: "ProjectEventLogEntry",
        timestamp: new Date("2023-01-04T18:32:56.046Z"),
        user: "art.oeinf",
        before: {
          __typename: "ProjectEventSettings",
          projectRef: {
            __typename: "Project",
            banner: null,
            externalLinks: [],
            identifier: "spruce",
            id: "spruce",
            repoRefId: "6352b7f70ae6065419d5a499",
            enabled: true,
            owner: "evergreen-ci",
            repo: "spruce",
            branch: "main",
            displayName: "Spruce",
            batchTime: 60,
            remotePath: ".evergreen.yml",
            oldestAllowedMergeBase: "",
            spawnHostScriptPath: "",
            dispatchingDisabled: false,
            versionControlEnabled: false,
            deactivatePrevious: true,
            repotrackerDisabled: false,
            stepbackDisabled: null,
            stepbackBisect: null,
            patchingDisabled: false,
            disabledStatsCache: false,
            debugSpawnHostsDisabled: false,
            restricted: false,
            admins: ["rsatsrt"],
            buildBaronSettings: {
              ticketCreateProject: "EVG",
              ticketSearchProjects: ["EVG"],
              __typename: "BuildBaronSettings",
              ticketCreateIssueType: "",
            },
            taskAnnotationSettings: {
              fileTicketWebhook: {
                endpoint: "",
                secret: "",
                __typename: "Webhook",
              },
              __typename: "TaskAnnotationSettings",
            },
            perfEnabled: false,
            notifyOnBuildFailure: false,
            patchTriggerAliases: [],
            githubPRTriggerAliases: [],
            githubMQTriggerAliases: [],
            workstationConfig: {
              gitClone: false,
              setupCommands: null,
              __typename: "WorkstationConfig",
            },
            triggers: [],
            periodicBuilds: [],
            tracksPushEvents: true,
            hidden: false,
            prTestingEnabled: true,
            manualPrTestingEnabled: false,
            githubChecksEnabled: false,
            gitTagVersionsEnabled: true,
            gitTagAuthorizedUsers: ["tarst.arstarts"],
            gitTagAuthorizedTeams: ["arst"],
            commitQueue: {
              enabled: true,
              __typename: "CommitQueueParams",
            },
            parsleyFilters: [],
            githubDynamicTokenPermissionGroups: [],
          },
          subscriptions: [],
          vars: {
            vars: {
              node_path: "/opt/axstarst$PATH",
            },
            privateVars: [],
            adminOnlyVars: [],
            __typename: "ProjectVars",
          },
          githubWebhooksEnabled: true,
          aliases: [],
        },
        after: {
          __typename: "ProjectEventSettings",
          projectRef: {
            __typename: "Project",
            banner: null,
            externalLinks: [],
            identifier: "spruce",
            id: "spruce",
            repoRefId: "arst",
            enabled: true,
            owner: "evergreen-ci",
            repo: "spruce",
            branch: "main",
            displayName: "Spruce",
            batchTime: 30,
            remotePath: ".srat.yml",
            spawnHostScriptPath: "",
            oldestAllowedMergeBase: "",
            dispatchingDisabled: false,
            versionControlEnabled: false,
            deactivatePrevious: true,
            repotrackerDisabled: false,
            debugSpawnHostsDisabled: false,
            stepbackDisabled: null,
            stepbackBisect: null,
            patchingDisabled: false,
            disabledStatsCache: false,
            restricted: false,
            admins: ["arstastr", "asrt", "ata", "oienrsat"],
            buildBaronSettings: {
              ticketCreateProject: "EVG",
              ticketSearchProjects: ["EVG"],
              __typename: "BuildBaronSettings",
              ticketCreateIssueType: "",
            },
            taskAnnotationSettings: {
              fileTicketWebhook: {
                endpoint: "",
                secret: "",
                __typename: "Webhook",
              },
              __typename: "TaskAnnotationSettings",
            },
            perfEnabled: false,
            notifyOnBuildFailure: false,
            patchTriggerAliases: [],
            githubPRTriggerAliases: [],
            githubMQTriggerAliases: [],
            workstationConfig: {
              gitClone: false,
              setupCommands: null,
              __typename: "WorkstationConfig",
            },
            triggers: [],
            periodicBuilds: [],
            tracksPushEvents: true,
            hidden: false,
            prTestingEnabled: true,
            manualPrTestingEnabled: false,
            githubChecksEnabled: false,
            gitTagVersionsEnabled: true,
            gitTagAuthorizedUsers: ["sartaie"],
            gitTagAuthorizedTeams: ["evergreen"],
            commitQueue: {
              enabled: true,
              __typename: "CommitQueueParams",
            },
            parsleyFilters: [],
            githubDynamicTokenPermissionGroups: [],
          },
          subscriptions: [],
          vars: {
            vars: {},
            privateVars: [],
            adminOnlyVars: [],
            __typename: "ProjectVars",
          },
          githubWebhooksEnabled: true,
          aliases: [],
        },
      },
    ],
  },
};
