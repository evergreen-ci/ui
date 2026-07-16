import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
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

describe("buildBaronContent", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("the BuildBaron component renders without crashing.", () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={buildBaronMocks}>
        <BuildBaronContent
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          annotation={null}
          bbData={buildBaronQuery.buildBaron}
          execution={execution}
          loading={false}
          taskId={taskId}
          userCanModify
        />
      </MockedProvider>,
    );

    render(<Component />, {
      path: "/task/:id",
      route: `/task/${taskId}`,
    });
    expect(screen.getByDataCy("build-baron-content")).toBeInTheDocument();
  });

  it("clicking on file a new ticket dispatches a toast", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={buildBaronMocks}>
        <BuildBaronContent
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          annotation={null}
          bbData={buildBaronQuery.buildBaron}
          execution={execution}
          loading={false}
          taskId={taskId}
          userCanModify
        />
      </MockedProvider>,
    );
    render(<Component />, {
      path: "/task/:id",
      route: `/task/${taskId}`,
    });
    await user.click(screen.getByDataCy("file-ticket-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("file-ticket-popconfirm")).toBeVisible();
    });
    await user.click(screen.getByRole("button", { name: "Yes" }));
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "Successfully requested ticket",
      );
    });
  });

  it("the correct JiraTicket rows are rendered in the component", () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={buildBaronMocks}>
        <BuildBaronContent
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          annotation={null}
          bbData={buildBaronQuery.buildBaron}
          execution={execution}
          loading={false}
          taskId={taskId}
          userCanModify
        />
      </MockedProvider>,
    );
    render(<Component />, {
      path: "/task/:id",
      route: `/task/${taskId}`,
    });

    expect(screen.queryAllByDataCy("jira-ticket-row")).toHaveLength(3);

    expect(screen.getByDataCy("EVG-12345")).toBeInTheDocument();
    expect(screen.getByDataCy("EVG-12346")).toBeInTheDocument();
    expect(screen.getByDataCy("EVG-12347")).toBeInTheDocument();

    expect(screen.queryByDataCy("EVG-12345-badge")).toHaveTextContent(
      "Resolved",
    );
    expect(screen.queryByDataCy("EVG-12345-metadata")).toHaveTextContent(
      "Created: 09/23/2020Updated: 09/23/2020Unassigned",
    );

    expect(screen.queryByDataCy("EVG-12346-badge")).toHaveTextContent("Closed");
    expect(screen.queryByDataCy("EVG-12346-metadata")).toHaveTextContent(
      "Created: 09/18/2020Updated: 09/18/2020Assignee: Some Name",
    );

    expect(screen.queryByDataCy("EVG-12347-badge")).toHaveTextContent("Open");
    expect(screen.queryByDataCy("EVG-12347-metadata")).toHaveTextContent(
      "Created: 09/18/2020Updated: 09/18/2020Assignee: Backlog - Evergreen Team",
    );
  });
});

const buildBaronQuery: BuildBaronQuery = {
  buildBaron: {
    __typename: "BuildBaron",
    bbTicketCreationDefined: true,
    buildBaronConfigured: true,
    searchReturnInfo: {
      __typename: "SearchReturnInfo",
      issues: [
        {
          __typename: "JiraTicket",
          fields: {
            __typename: "TicketFields",
            assigneeDisplayName: null,
            created: "2020-09-23T15:31:33.000+0000",
            resolutionName: "Declined",
            status: {
              __typename: "JiraStatus",
              id: "5",
              name: "Resolved",
            },
            summary: "This is a random Jira ticket title 1",
            updated: "2020-09-23T15:33:02.000+0000",
          },
          key: "EVG-12345",
        },
        {
          __typename: "JiraTicket",
          fields: {
            __typename: "TicketFields",
            assigneeDisplayName: "Some Name",
            created: "2020-09-18T16:58:32.000+0000",
            resolutionName: "Declined",
            status: {
              __typename: "JiraStatus",
              id: "6",
              name: "Closed",
            },
            summary: "This is a random Jira ticket title 2",
            updated: "2020-09-18T19:56:42.000+0000",
          },
          key: "EVG-12346",
        },
        {
          __typename: "JiraTicket",
          fields: {
            __typename: "TicketFields",
            assigneeDisplayName: "Backlog - Evergreen Team",
            created: "2020-09-18T17:04:06.000+0000",
            resolutionName: "Declined",
            status: {
              __typename: "JiraStatus",
              id: "1",
              name: "Open",
            },
            summary: "This is a random Jira ticket title 3",
            updated: "2020-09-18T19:56:29.000+0000",
          },
          key: "EVG-12347",
        },
      ],
      search: "test search string",
    },
  },
};

const getBuildBaronMock: ApolloMock<BuildBaronQuery, BuildBaronQueryVariables> =
  {
    request: {
      query: BUILD_BARON,
      variables: {
        execution,
        taskId,
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
      execution,
      taskId,
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
    },
  },
  result: {
    data: {
      bbGetCreatedTickets: [],
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
      execution,
      taskId,
    },
  },
  result: {
    data: {
      task: {
        annotation: null,
        execution,
        id: taskId,
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
      execution,
      taskId,
    },
  },
  result: {
    data: {
      task: {
        annotation: null,
        execution,
        id: taskId,
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
      execution,
      taskId,
    },
  },
  result: {
    data: {
      task: {
        annotation: null,
        execution,
        id: taskId,
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
