import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  AdminEventsQuery,
  AdminEventsQueryVariables,
} from "gql/generated/types";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
import { ADMIN_EVENT_LOG } from "gql/queries";
import { EventLogsTab } from "./EventLogsTab";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[adminEventsMock, getUserSettingsMock]}>
    {children}
  </MockedProvider>
);

describe("admin event log page", async () => {
  it("shows skeleton loader when loading", async () => {
    const loadingWrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={[]}>{children}</MockedProvider>
    );

    const { Component } = RenderFakeToastContext(<EventLogsTab />);
    render(<Component />, { wrapper: loadingWrapper });

    expect(screen.getByDataCy("admin-events-skeleton")).toBeInTheDocument();
  });

  it("does not show a load more button when all events are shown", async () => {
    const { Component } = RenderFakeToastContext(<EventLogsTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("event-log-card")).toHaveLength(5);
    });

    expect(screen.queryByDataCy("load-more-button")).not.toBeInTheDocument();
    expect(screen.getByText("No more events to show.")).toBeInTheDocument();
  });

  it("shows proper timestamps", async () => {
    const { Component } = RenderFakeToastContext(<EventLogsTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("event-log-card")).toHaveLength(5);
    });

    const expectedTimestamps = [
      "08/07/2024, 17:57:00 EDT",
      "08/07/2023, 17:57:00 EDT",
      "08/07/2022, 17:57:00 EDT",
      "08/07/2021, 17:57:00 EDT",
      "08/07/2020, 17:57:00 EDT",
    ];

    await waitFor(() => {
      expect(screen.getByText(expectedTimestamps[0])).toBeInTheDocument();
    });

    expectedTimestamps.forEach((timestamp) => {
      expect(screen.getByText(timestamp)).toBeInTheDocument();
    });
  });

  it("shows proper admin event details", async () => {
    const { Component } = RenderFakeToastContext(<EventLogsTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("event-log-card")).toHaveLength(5);
    });

    const expectedUsers = [
      "admin.user1",
      "admin.user2",
      "admin.user3",
      "admin.user4",
      "admin.user5",
    ];

    const expectedSections = [
      "Section: Project Settings",
      "Section: User Management",
      "Section: System Configuration",
      "Section: Security Settings",
      "Section: Database Operations",
    ];

    expectedUsers.forEach((user) => {
      expect(screen.getByText(user)).toBeInTheDocument();
    });

    expectedSections.forEach((section) => {
      expect(screen.getByText(section)).toBeInTheDocument();
    });
  });
});

const adminEventsMock: ApolloMock<AdminEventsQuery, AdminEventsQueryVariables> =
  {
    request: {
      query: ADMIN_EVENT_LOG,
      variables: {
        opts: {
          limit: 15,
        },
      },
    },
    result: {
      data: {
        adminEvents: {
          __typename: "AdminEventsPayload",
          count: 5,
          eventLogEntries: [
            {
              __typename: "AdminEvent",
              after: { enabled: true },
              before: { enabled: false },
              section: "Project Settings",
              timestamp: new Date("2024-08-07T17:57:00-04:00"),
              user: "admin.user1",
            },
            {
              __typename: "AdminEvent",
              after: { max_users: 200 },
              before: { max_users: 100 },
              section: "User Management",
              timestamp: new Date("2023-08-07T17:57:00-04:00"),
              user: "admin.user2",
            },
            {
              __typename: "AdminEvent",
              after: { debug_mode: false },
              before: { debug_mode: true },
              section: "System Configuration",
              timestamp: new Date("2022-08-07T17:57:00-04:00"),
              user: "admin.user3",
            },
            {
              __typename: "AdminEvent",
              after: { auth_required: true },
              before: { auth_required: false },
              section: "Security Settings",
              timestamp: new Date("2021-08-07T17:57:00-04:00"),
              user: "admin.user4",
            },
            {
              __typename: "AdminEvent",
              after: { backup_frequency: "hourly" },
              before: { backup_frequency: "daily" },
              section: "Database Operations",
              timestamp: new Date("2020-08-07T17:57:00-04:00"),
              user: "admin.user5",
            },
          ],
        },
      },
    },
  };
