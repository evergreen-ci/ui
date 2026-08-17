import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { cache } from "gql/client/cache";
import { PROJECT_BUILD_BARON_SETTINGS_FRAGMENT } from "gql/fragments/projectBuildBaronSettings";
import {
  BuildBaronCreateTicketMutation,
  BuildBaronCreateTicketMutationVariables,
  BuildBaronQuery,
  BuildBaronQueryVariables,
  CreatedTicketsQuery,
  CreatedTicketsQueryVariables,
  CustomCreatedIssuesQuery,
  CustomCreatedIssuesQueryVariables,
  SuspectedIssuesQuery,
  SuspectedIssuesQueryVariables,
} from "gql/generated/types";
import {
  getSpruceConfigMock,
  getUserSettingsMock,
} from "gql/mocks/getSpruceConfig";
import { getUserMock } from "gql/mocks/getUser";
import { FILE_JIRA_TICKET } from "gql/mutations";
import {
  BUILD_BARON,
  CREATED_TICKETS,
  JIRA_CUSTOM_CREATED_ISSUES,
  JIRA_ISSUES,
  JIRA_SUSPECTED_ISSUES,
} from "gql/queries";
import { MockedProvider } from "test_utils/graphql";
import BuildBaronContent from "./BuildBaronContent";

const taskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";
const execution = 0;
const projectId = "spruce";

/**
 * seedProjectSettings writes the project's Build Baron settings to the cache, which is where the
 * Failure Details components read them from rather than receiving them as props.
 * @param options - the options object
 * @param options.ticketCreateProject - the Jira project used for filing tickets, empty when the
 * project has no ticket creation project configured
 */
const seedProjectSettings = ({
  ticketCreateProject,
}: {
  ticketCreateProject: string;
}) => {
  cache.writeFragment({
    id: cache.identify({ __typename: "Project", id: projectId }),
    fragment: PROJECT_BUILD_BARON_SETTINGS_FRAGMENT,
    data: {
      __typename: "Project",
      id: projectId,
      buildBaronSettings: {
        __typename: "BuildBaronSettings",
        ticketCreateProject,
        ticketSearchProjects: ["EVG"],
      },
    },
  });
};

describe("buildBaronContent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("the BuildBaron component renders without crashing.", () => {
    seedProjectSettings({ ticketCreateProject: "EVG" });
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={buildBaronMocks}>
        <BuildBaronContent
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          annotation={null}
          execution={execution}
          projectId={projectId}
          suggestions={buildBaronQuery.task?.buildBaronSuggestions}
          taskId={taskId}
          userCanModify
        />
      </MockedProvider>,
    );

    render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });
    expect(screen.getByTestId("build-baron-content")).toBeInTheDocument();
  });

  it("clicking on file a new ticket dispatches a toast", async () => {
    seedProjectSettings({ ticketCreateProject: "EVG" });
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={buildBaronMocks}>
        <BuildBaronContent
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          annotation={null}
          execution={execution}
          projectId={projectId}
          suggestions={buildBaronQuery.task?.buildBaronSuggestions}
          taskId={taskId}
          userCanModify
        />
      </MockedProvider>,
    );
    render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });
    await user.click(screen.getByTestId("file-ticket-button"));
    await waitFor(() => {
      expect(screen.getByTestId("file-ticket-popconfirm")).toBeVisible();
    });
    await user.click(screen.getByRole("button", { name: "Yes" }));
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "Successfully requested ticket",
      );
    });
  });

  it("the correct JiraTicket rows are rendered in the component", () => {
    seedProjectSettings({ ticketCreateProject: "EVG" });
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={buildBaronMocks}>
        <BuildBaronContent
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          annotation={null}
          execution={execution}
          projectId={projectId}
          suggestions={buildBaronQuery.task?.buildBaronSuggestions}
          taskId={taskId}
          userCanModify
        />
      </MockedProvider>,
    );
    render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });

    expect(screen.queryAllByTestId("jira-ticket-row")).toHaveLength(3);

    expect(screen.getByTestId("EVG-12345")).toBeInTheDocument();
    expect(screen.getByTestId("EVG-12346")).toBeInTheDocument();
    expect(screen.getByTestId("EVG-12347")).toBeInTheDocument();

    expect(screen.queryByTestId("EVG-12345-badge")).toHaveTextContent(
      "Resolved",
    );
    expect(screen.queryByTestId("EVG-12345-metadata")).toHaveTextContent(
      "Created: 09/23/2020Updated: 09/23/2020Unassigned",
    );

    expect(screen.queryByTestId("EVG-12346-badge")).toHaveTextContent("Closed");
    expect(screen.queryByTestId("EVG-12346-metadata")).toHaveTextContent(
      "Created: 09/18/2020Updated: 09/18/2020Assignee: Some Name",
    );

    expect(screen.queryByTestId("EVG-12347-badge")).toHaveTextContent("Open");
    expect(screen.queryByTestId("EVG-12347-metadata")).toHaveTextContent(
      "Created: 09/18/2020Updated: 09/18/2020Assignee: Backlog - Evergreen Team",
    );
  });

  it("renders tickets created by Build Baron when the project has no ticket creation project", async () => {
    seedProjectSettings({ ticketCreateProject: "" });
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={buildBaronMocks}>
        <BuildBaronContent
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          annotation={null}
          execution={execution}
          projectId={projectId}
          suggestions={null}
          taskId={taskId}
          userCanModify
        />
      </MockedProvider>,
    );
    render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });

    await waitFor(() => {
      expect(screen.getByDataCy("EVG-1000")).toBeInTheDocument();
    });
  });
});

const buildBaronQuery: BuildBaronQuery = {
  task: {
    __typename: "Task",
    id: taskId,
    execution,
    buildBaronSuggestions: {
      __typename: "SearchReturnInfo",
      search: "test search string",
      issues: [
        {
          __typename: "JiraTicket",
          key: "EVG-12345",
          fields: {
            __typename: "TicketFields",
            summary: "This is a random Jira ticket title 1",
            assigneeDisplayName: null,
            resolutionName: "Declined",
            created: "2020-09-23T15:31:33.000+0000",
            updated: "2020-09-23T15:33:02.000+0000",
            status: {
              __typename: "JiraStatus",
              id: "5",
              name: "Resolved",
            },
          },
        },
        {
          __typename: "JiraTicket",
          key: "EVG-12346",
          fields: {
            __typename: "TicketFields",
            summary: "This is a random Jira ticket title 2",
            assigneeDisplayName: "Some Name",
            resolutionName: "Declined",
            created: "2020-09-18T16:58:32.000+0000",
            updated: "2020-09-18T19:56:42.000+0000",
            status: {
              __typename: "JiraStatus",
              id: "6",
              name: "Closed",
            },
          },
        },
        {
          __typename: "JiraTicket",
          key: "EVG-12347",
          fields: {
            __typename: "TicketFields",
            summary: "This is a random Jira ticket title 3",
            assigneeDisplayName: "Backlog - Evergreen Team",
            resolutionName: "Declined",
            created: "2020-09-18T17:04:06.000+0000",
            updated: "2020-09-18T19:56:29.000+0000",
            status: {
              __typename: "JiraStatus",
              id: "1",
              name: "Open",
            },
          },
        },
      ],
    },
  },
};

const getBuildBaronMock: ApolloMock<BuildBaronQuery, BuildBaronQueryVariables> =
  {
    request: {
      query: BUILD_BARON,
      variables: {
        taskId,
        execution,
      },
    },
    result: {
      data: buildBaronQuery,
    },
  };

const fileJiraTicketMock: ApolloMock<
  BuildBaronCreateTicketMutation,
  BuildBaronCreateTicketMutationVariables
> = {
  request: {
    query: FILE_JIRA_TICKET,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      bbCreateTicket: true,
    },
  },
};
const getJiraTicketsMock: ApolloMock<
  CreatedTicketsQuery,
  CreatedTicketsQueryVariables
> = {
  request: {
    query: CREATED_TICKETS,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskId,
        execution,
        buildBaronCreatedTickets: [
          {
            __typename: "JiraTicket",
            key: "EVG-1000",
            fields: {
              __typename: "TicketFields",
              summary: "This ticket was created from this task",
              assigneeDisplayName: null,
              resolutionName: null,
              created: "2020-09-23T15:31:33.000+0000",
              updated: "2020-09-23T15:33:02.000+0000",
              status: {
                __typename: "JiraStatus",
                id: "1",
                name: "Open",
              },
            },
          },
        ],
      },
    },
  },
};

const customCreatedIssuesMock: ApolloMock<
  CustomCreatedIssuesQuery,
  CustomCreatedIssuesQueryVariables
> = {
  request: {
    query: JIRA_CUSTOM_CREATED_ISSUES,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      task: {
        id: taskId,
        execution,
        annotation: null,
      },
    },
  },
};

const suspectedIssueMock: ApolloMock<
  SuspectedIssuesQuery,
  SuspectedIssuesQueryVariables
> = {
  request: {
    query: JIRA_SUSPECTED_ISSUES,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      task: {
        id: taskId,
        execution,
        annotation: null,
      },
    },
  },
};

const jiraIssuesMock: ApolloMock<
  SuspectedIssuesQuery,
  SuspectedIssuesQueryVariables
> = {
  request: {
    query: JIRA_ISSUES,
    variables: {
      taskId,
      execution,
    },
  },
  result: {
    data: {
      task: {
        id: taskId,
        execution,
        annotation: null,
      },
    },
  },
};

const buildBaronMocks = [
  customCreatedIssuesMock,
  fileJiraTicketMock,
  getBuildBaronMock,
  getJiraTicketsMock,
  getSpruceConfigMock,
  getUserSettingsMock,
  getUserMock,
  jiraIssuesMock,
  suspectedIssueMock,
];
