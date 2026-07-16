import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
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
      path: "/project/:projectIdentifier/settings",
      route: "/project/spruce/settings",
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
      path: "/project/:projectIdentifier/settings",
      route: "/project/spruce/settings",
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
      limit,
      projectIdentifier: "spruce",
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
        after: {
          __typename: "ProjectEventSettings",
          aliases: [],
          githubWebhooksEnabled: true,
          projectRef: {
            __typename: "Project",
            admins: ["arstastr", "asrt", "ata", "oienrsat"],
            banner: null,
            batchTime: 30,
            branch: "main",
            buildBaronSettings: {
              __typename: "BuildBaronSettings",
              ticketCreateIssueType: "",
              ticketCreateProject: "EVG",
              ticketSearchProjects: ["EVG"],
            },
            commitQueue: {
              __typename: "CommitQueueParams",
              enabled: true,
            },
            deactivatePrevious: true,
            debugSpawnHostsDisabled: false,
            disabledStatsCache: false,
            dispatchingDisabled: false,
            displayName: "Spruce",
            enabled: true,
            externalLinks: [],
            githubChecksEnabled: false,
            githubDynamicTokenPermissionGroups: [],
            githubMQTriggerAliases: [],
            githubPRTriggerAliases: [],
            gitTagAuthorizedTeams: ["evergreen"],
            gitTagAuthorizedUsers: ["sartaie"],
            gitTagVersionsEnabled: true,
            hidden: false,
            id: "spruce",
            identifier: "spruce",
            manualPrTestingEnabled: false,
            notifyOnBuildFailure: false,
            oldestAllowedMergeBase: "",
            owner: "evergreen-ci",
            parsleyFilters: [],
            patchingDisabled: false,
            patchTriggerAliases: [],
            perfEnabled: false,
            periodicBuilds: [],
            prTestingEnabled: true,
            remotePath: ".srat.yml",
            repo: "spruce",
            repoRefId: "arst",
            repotrackerDisabled: false,
            restricted: false,
            spawnHostScriptPath: "",
            stepbackBisect: null,
            stepbackDisabled: null,
            taskAnnotationSettings: {
              __typename: "TaskAnnotationSettings",
              fileTicketWebhook: {
                __typename: "Webhook",
                endpoint: "",
                secret: "",
              },
            },
            triggers: [],
            versionControlEnabled: false,
            workstationConfig: {
              __typename: "WorkstationConfig",
              gitClone: false,
              setupCommands: null,
            },
          },
          subscriptions: [],
          vars: {
            __typename: "ProjectVars",
            adminOnlyVars: [],
            privateVars: [],
            vars: {},
          },
        },
        before: {
          __typename: "ProjectEventSettings",
          aliases: [],
          githubWebhooksEnabled: true,
          projectRef: {
            __typename: "Project",
            admins: ["rsatsrt"],
            banner: null,
            batchTime: 60,
            branch: "main",
            buildBaronSettings: {
              __typename: "BuildBaronSettings",
              ticketCreateIssueType: "",
              ticketCreateProject: "EVG",
              ticketSearchProjects: ["EVG"],
            },
            commitQueue: {
              __typename: "CommitQueueParams",
              enabled: true,
            },
            deactivatePrevious: true,
            debugSpawnHostsDisabled: false,
            disabledStatsCache: false,
            dispatchingDisabled: false,
            displayName: "Spruce",
            enabled: true,
            externalLinks: [],
            githubChecksEnabled: false,
            githubDynamicTokenPermissionGroups: [],
            githubMQTriggerAliases: [],
            githubPRTriggerAliases: [],
            gitTagAuthorizedTeams: ["arst"],
            gitTagAuthorizedUsers: ["tarst.arstarts"],
            gitTagVersionsEnabled: true,
            hidden: false,
            id: "spruce",
            identifier: "spruce",
            manualPrTestingEnabled: false,
            notifyOnBuildFailure: false,
            oldestAllowedMergeBase: "",
            owner: "evergreen-ci",
            parsleyFilters: [],
            patchingDisabled: false,
            patchTriggerAliases: [],
            perfEnabled: false,
            periodicBuilds: [],
            prTestingEnabled: true,
            remotePath: ".evergreen.yml",
            repo: "spruce",
            repoRefId: "6352b7f70ae6065419d5a499",
            repotrackerDisabled: false,
            restricted: false,
            spawnHostScriptPath: "",
            stepbackBisect: null,
            stepbackDisabled: null,
            taskAnnotationSettings: {
              __typename: "TaskAnnotationSettings",
              fileTicketWebhook: {
                __typename: "Webhook",
                endpoint: "",
                secret: "",
              },
            },
            triggers: [],
            versionControlEnabled: false,
            workstationConfig: {
              __typename: "WorkstationConfig",
              gitClone: false,
              setupCommands: null,
            },
          },
          subscriptions: [],
          vars: {
            __typename: "ProjectVars",
            adminOnlyVars: [],
            privateVars: [],
            vars: {
              node_path: "/opt/axstarst$PATH",
            },
          },
        },
        timestamp: new Date("2023-01-04T18:32:56.046Z"),
        user: "art.oeinf",
      },
    ],
  },
};
