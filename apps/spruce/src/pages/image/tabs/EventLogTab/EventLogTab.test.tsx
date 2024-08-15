import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  ImageEventsQuery,
  ImageEventsQueryVariables,
  ImageEventEntryAction,
} from "gql/generated/types";
import { IMAGE_EVENTS } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  waitFor,
  within,
  userEvent,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { EventLogTab } from "./EventLogTab";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[imageEventsMock]}>{children}</MockedProvider>
);

describe("image event log page", async () => {
  it("does not show a load more button when all events are shown", async () => {
    const { Component } = RenderFakeToastContext(<EventLogTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    await waitFor(() => {
      expect(screen.getByDataCy("load-more-button")).toBeInTheDocument();
    });
    expect(
      screen.queryByText("No more events to show."),
    ).not.toBeInTheDocument();
  });

  it("shows proper timestamps", async () => {
    const { Component } = RenderFakeToastContext(<EventLogTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });

    const timestampElements = screen.queryAllByDataCy("event-log-timestamp");
    expect(timestampElements).toHaveLength(5);
    const expectedTimestamps = [
      "Aug 7, 2024, 9:57:00 PM UTC",
      "Aug 7, 2023, 9:57:00 PM UTC",
      "Aug 7, 2022, 9:57:00 PM UTC",
      "Aug 7, 2021, 9:57:00 PM UTC",
      "Aug 7, 2020, 9:57:00 PM UTC",
    ];

    timestampElements.forEach((element, index) => {
      expect(element.textContent?.trim()).toBe(expectedTimestamps[index]);
    });
  });

  it("shows proper AMI changes", async () => {
    const { Component } = RenderFakeToastContext(<EventLogTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });

    const amiElements = screen.queryAllByDataCy("event-log-ami");
    expect(amiElements).toHaveLength(5);

    const expectedAmiTexts = [
      "AMI changed from ami-03e245926032896f9 to ami-03bfb241d1718c8a2",
      "AMI changed from ami-03e24592603281234 to ami-03e245926032896f9",
      "AMI changed from ami-03e24592603281235 to ami-03e24592603281234",
      "AMI changed from ami-03e24592603281236 to ami-03e24592603281235",
      "AMI changed from ami-03e24592603281237 to ami-03e24592603281236",
    ];

    amiElements.forEach((element, index) => {
      expect(element.textContent?.trim()).toBe(expectedAmiTexts[index]);
    });
  });

  it("shows proper text for cards with empty tables", async () => {
    const { Component } = RenderFakeToastContext(<EventLogTab />);
    render(<Component />, { wrapper });

    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });

    const expectedEmptyMessage =
      "No changes detected within the scope. The scope can be expanded upon request from the runtime environments team.";

    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    expect(
      within(card0).queryByDataCy("image-event-log-empty-message"),
    ).toBeNull();

    const card1 = screen.getAllByDataCy("image-event-log-card")[1];
    const emptyMessageElement1 = within(card1).getByDataCy(
      "image-event-log-empty-message",
    );
    expect(emptyMessageElement1).toHaveTextContent(expectedEmptyMessage);

    const card2 = screen.getAllByDataCy("image-event-log-card")[2];
    const emptyMessageElement2 = within(card2).getByDataCy(
      "image-event-log-empty-message",
    );
    expect(emptyMessageElement2).toHaveTextContent(expectedEmptyMessage);

    const card3 = screen.getAllByDataCy("image-event-log-card")[3];
    const emptyMessageElement3 = within(card3).getByDataCy(
      "image-event-log-empty-message",
    );
    expect(emptyMessageElement3).toHaveTextContent(expectedEmptyMessage);

    const card4 = screen.getAllByDataCy("image-event-log-card")[4];
    const emptyMessageElement4 = within(card4).getByDataCy(
      "image-event-log-empty-message",
    );
    expect(emptyMessageElement4).toHaveTextContent(expectedEmptyMessage);
  });

  it("shows proper name field table entries", async () => {
    const { Component } = RenderFakeToastContext(<EventLogTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    const row0 = within(card0).getAllByDataCy("image-event-log-table-row")[0];
    expect(within(row0).getAllByRole("cell")[0]).toHaveTextContent(
      "apache2-bin",
    );
    const row1 = within(card0).getAllByDataCy("image-event-log-table-row")[1];
    expect(within(row1).getAllByRole("cell")[0]).toHaveTextContent("golang");
    const row2 = within(card0).getAllByDataCy("image-event-log-table-row")[2];
    expect(within(row2).getAllByRole("cell")[0]).toHaveTextContent(
      "containerd.io",
    );
  });

  it("supports name field filter", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<EventLogTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    await user.click(within(card0).getByDataCy("image-event-log-name-filter"));
    await user.type(
      screen.getByPlaceholderText("Search name"),
      "golang{enter}",
    );
    await waitFor(() => {
      expect(
        within(card0).queryAllByDataCy("image-event-log-table-row"),
      ).toHaveLength(1);
    });
    await user.clear(screen.getByPlaceholderText("Search name"));
    await user.type(
      screen.getByPlaceholderText("Search name"),
      "blahblah{enter}",
    );
    await waitFor(() => {
      expect(
        within(card0).queryAllByDataCy("image-event-log-table-row"),
      ).toHaveLength(0);
    });
  });

  it("shows proper type field table entries", async () => {
    const { Component } = RenderFakeToastContext(<EventLogTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    const row0 = within(card0).getAllByDataCy("image-event-log-table-row")[0];
    expect(within(row0).getAllByRole("cell")[1]).toHaveTextContent("Package");
    const row1 = within(card0).getAllByDataCy("image-event-log-table-row")[1];
    expect(within(row1).getAllByRole("cell")[1]).toHaveTextContent("Toolchain");
    const row2 = within(card0).getAllByDataCy("image-event-log-table-row")[2];
    expect(within(row2).getAllByRole("cell")[1]).toHaveTextContent("Package");
  });

  it("supports type field filter", async () => {
    const { Component } = RenderFakeToastContext(<EventLogTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    within(card0).getByDataCy("image-event-log-type-filter").click();
    const treeSelectOptions = await screen.findByDataCy("tree-select-options");
    within(treeSelectOptions).getByText("Toolchain").click();
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(1);
    });
    within(treeSelectOptions).getByText("Toolchain").click();
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(3);
    });
    within(treeSelectOptions).getByText("Package").click();
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(2);
    });
    within(treeSelectOptions).getByText("Package").click();
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(3);
    });
  });

  it("shows proper before field table entries", async () => {
    const { Component } = RenderFakeToastContext(<EventLogTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    const row0 = within(card0).getAllByDataCy("image-event-log-table-row")[0];
    expect(within(row0).getAllByRole("cell")[2]).toHaveTextContent(
      "2.4.52-1ubuntu4.8",
    );
    const row1 = within(card0).getAllByDataCy("image-event-log-table-row")[1];
    expect(within(row1).getAllByRole("cell")[2]).toHaveTextContent("");
    const row2 = within(card0).getAllByDataCy("image-event-log-table-row")[2];
    expect(within(row2).getAllByRole("cell")[2]).toHaveTextContent("1.6.28-1");
  });

  it("shows proper after field table entries", async () => {
    const { Component } = RenderFakeToastContext(<EventLogTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    const row0 = within(card0).getAllByDataCy("image-event-log-table-row")[0];
    expect(within(row0).getAllByRole("cell")[3]).toHaveTextContent(
      "2.4.52-1ubuntu4.10",
    );
    const row1 = within(card0).getAllByDataCy("image-event-log-table-row")[1];
    expect(within(row1).getAllByRole("cell")[3]).toHaveTextContent("go1.21.13");
    const row2 = within(card0).getAllByDataCy("image-event-log-table-row")[2];
    expect(within(row2).getAllByRole("cell")[3]).toHaveTextContent("");
  });

  it("shows proper action field table entries", async () => {
    const { Component } = RenderFakeToastContext(<EventLogTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    const row0 = within(card0).getAllByDataCy("image-event-log-table-row")[0];
    expect(within(row0).getAllByRole("cell")[4]).toHaveTextContent(
      ImageEventEntryAction.Updated,
    );
    const row1 = within(card0).getAllByDataCy("image-event-log-table-row")[1];
    expect(within(row1).getAllByRole("cell")[4]).toHaveTextContent(
      ImageEventEntryAction.Added,
    );
    const row2 = within(card0).getAllByDataCy("image-event-log-table-row")[2];
    expect(within(row2).getAllByRole("cell")[4]).toHaveTextContent(
      ImageEventEntryAction.Deleted,
    );
  });

  it("supports filtering for action field", async () => {
    const { Component } = RenderFakeToastContext(<EventLogTab />);
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    within(card0).getByDataCy("image-event-log-action-filter").click();
    const treeSelectOptions = await screen.findByDataCy("tree-select-options");
    within(treeSelectOptions).getByText("UPDATED").click();
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(1);
    });
    within(treeSelectOptions).getByText("UPDATED").click();
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(3);
    });
    within(treeSelectOptions).getByText("ADDED").click();
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(1);
    });
    within(treeSelectOptions).getByText("ADDED").click();
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(3);
    });
    within(treeSelectOptions).getByText("DELETED").click();
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(1);
    });
    within(treeSelectOptions).getByText("DELETED").click();
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(3);
    });
  });
});

const imageEventsMock: ApolloMock<ImageEventsQuery, ImageEventsQueryVariables> =
  {
    request: {
      query: IMAGE_EVENTS,
      variables: {
        imageId: "ubuntu2204",
        limit: 5,
        page: 0,
      },
    },
    result: {
      data: {
        image: {
          __typename: "Image",
          id: "ubuntu2204",
          events: {
            count: 5,
            eventLogEntries: [
              {
                amiAfter: "ami-03bfb241d1718c8a2",
                amiBefore: "ami-03e245926032896f9",
                entries: [
                  {
                    // @ts-expect-error: Actual provided input from API does not match ImageEventType.Package type
                    type: "Packages",
                    name: "apache2-bin",
                    before: "2.4.52-1ubuntu4.8",
                    after: "2.4.52-1ubuntu4.10",
                    action: ImageEventEntryAction.Updated,
                  },
                  {
                    // @ts-expect-error: Actual provided input from API does not match ImageEventType.Toolchain type
                    type: "Toolchains",
                    name: "golang",
                    before: "",
                    after: "go1.21.13",
                    action: ImageEventEntryAction.Added,
                  },
                  {
                    // @ts-expect-error: Actual provided input from API does not match ImageEventType.Package type
                    type: "Packages",
                    name: "containerd.io",
                    before: "1.6.28-1",
                    after: "",
                    action: ImageEventEntryAction.Deleted,
                  },
                ],
                timestamp: new Date("2024-08-07T17:57:00-04:00"),
              },
              {
                amiAfter: "ami-03e245926032896f9",
                amiBefore: "ami-03e24592603281234",
                entries: [],
                timestamp: new Date("2023-08-07T17:57:00-04:00"),
              },
              {
                amiAfter: "ami-03e24592603281234",
                amiBefore: "ami-03e24592603281235",
                entries: [],
                timestamp: new Date("2022-08-07T17:57:00-04:00"),
              },
              {
                amiAfter: "ami-03e24592603281235",
                amiBefore: "ami-03e24592603281236",
                entries: [],
                timestamp: new Date("2021-08-07T17:57:00-04:00"),
              },
              {
                amiAfter: "ami-03e24592603281236",
                amiBefore: "ami-03e24592603281237",
                entries: [],
                timestamp: new Date("2020-08-07T17:57:00-04:00"),
              },
            ],
          },
        },
      },
    },
  };
