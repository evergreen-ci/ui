import {
  ApolloMock,
  MockedProvider,
  RenderFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import {
  ImageEventType,
  ImageEventsQuery,
  ImageEventsQueryVariables,
  ImageEventEntryAction,
} from "gql/generated/types";
import { IMAGE_EVENTS } from "gql/queries";
import { EventLogTab } from "./EventLogTab";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[imageEventsMock]}>{children}</MockedProvider>
);
enum Column {
  Name = 0,
  Type = 1,
  Before = 2,
  After = 3,
  Action = 4,
}

describe("image event log page", async () => {
  it("does not show a load more button when all events are shown", async () => {
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });

    // The load more button should not be present on the page because there are no more events.
    await waitFor(() => {
      expect(screen.getByDataCy("load-more-button")).toBeInTheDocument();
    });
    expect(
      screen.queryByText("No more events to show."),
    ).not.toBeInTheDocument();
  });

  it("shows proper timestamps", async () => {
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });

    // Expect correct timestamps on the page.
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
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });

    // Expect correct AMI text on the page.
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
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });

    const expectedEmptyMessage =
      "No changes detected within the scope. The scope can be expanded upon request to the Runtime Environments team.";

    const cards = screen.getAllByDataCy("image-event-log-card");
    expect(
      within(cards[0]).queryByDataCy("image-event-log-empty-message"),
    ).toBeNull();

    expect(
      within(cards[1]).queryByDataCy("image-event-log-empty-message"),
    ).toBeNull();

    // Expects cards to contain the empty message.
    for (let i = 2; i <= 4; i++) {
      const emptyMessageElement = within(cards[i]).getByDataCy(
        "image-event-log-empty-message",
      );
      expect(emptyMessageElement).toHaveTextContent(expectedEmptyMessage);
    }
  });

  it("shows proper name field table entries", async () => {
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    const rows = within(card0).getAllByDataCy("image-event-log-table-row");

    // Expect each row of the table to have the correct name.
    expect(within(rows[0]).getAllByRole("cell")[Column.Name]).toHaveTextContent(
      "apache2-bin",
    );
    expect(within(rows[1]).getAllByRole("cell")[Column.Name]).toHaveTextContent(
      "golang",
    );
    expect(within(rows[2]).getAllByRole("cell")[Column.Name]).toHaveTextContent(
      "containerd.io",
    );
  });

  it("supports name field filter for existing entries", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    await user.click(within(card0).getByDataCy("image-event-log-name-filter"));
    const searchBar = screen.getByPlaceholderText("Search name");

    // Filter for golang.
    await user.type(searchBar, "golang{enter}");
    expect(searchBar).toHaveValue("golang");
    await waitFor(() => {
      expect(
        within(card0).queryAllByDataCy("image-event-log-table-row"),
      ).toHaveLength(1);
    });
  });

  it("supports name field filter for non-existent entries", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    await user.click(within(card0).getByDataCy("image-event-log-name-filter"));
    const searchBar = screen.getByPlaceholderText("Search name");

    // Filter for nonexistent item.
    await user.type(searchBar, "blahblah{enter}");
    await waitFor(() => {
      expect(searchBar).toHaveValue("blahblah");
    });
    await waitFor(() => {
      expect(
        within(card0).queryAllByDataCy("image-event-log-table-row"),
      ).toHaveLength(0);
    });
  });

  it("shows proper type field table entries", async () => {
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    const rows = within(card0).getAllByDataCy("image-event-log-table-row");

    // Expect each row to display the correct type.
    expect(within(rows[0]).getAllByRole("cell")[Column.Type]).toHaveTextContent(
      "Package",
    );
    expect(within(rows[1]).getAllByRole("cell")[Column.Type]).toHaveTextContent(
      "Toolchain",
    );
    expect(within(rows[2]).getAllByRole("cell")[Column.Type]).toHaveTextContent(
      "Package",
    );
  });

  it("supports type field filter", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    await user.click(within(card0).getByDataCy("image-event-log-type-filter"));
    const treeSelectOptions = await screen.findByDataCy("tree-select-options");

    // Set filter to Toolchain.
    await user.click(within(treeSelectOptions).getByText("Toolchain"));
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(1);
    });

    // Clear filter.
    await user.click(within(treeSelectOptions).getByText("Toolchain"));
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(3);
    });

    // Set filter to Package.
    await user.click(within(treeSelectOptions).getByText("Package"));
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(2);
    });

    // Clear filter.
    await user.click(within(treeSelectOptions).getByText("Package"));
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(3);
    });
  });

  it("shows proper before field table entries", async () => {
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    const rows = within(card0).getAllByDataCy("image-event-log-table-row");

    // Expect each row to have the correct before version.
    expect(
      within(rows[0]).getAllByRole("cell")[Column.Before],
    ).toHaveTextContent("2.4.52-1ubuntu4.8");
    expect(
      within(rows[1]).getAllByRole("cell")[Column.Before],
    ).toHaveTextContent("");
    expect(
      within(rows[2]).getAllByRole("cell")[Column.Before],
    ).toHaveTextContent("1.6.28-1");
  });

  it("shows proper after field table entries", async () => {
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    const rows = within(card0).getAllByDataCy("image-event-log-table-row");

    // Expect each row to have the correct after version.
    expect(
      within(rows[0]).getAllByRole("cell")[Column.After],
    ).toHaveTextContent("2.4.52-1ubuntu4.10");
    expect(
      within(rows[1]).getAllByRole("cell")[Column.After],
    ).toHaveTextContent("go1.21.13");
    expect(
      within(rows[2]).getAllByRole("cell")[Column.After],
    ).toHaveTextContent("");
  });

  it("shows proper action field table entries", async () => {
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    const rows = within(card0).getAllByDataCy("image-event-log-table-row");

    // Expect each row to have the correct action.
    expect(
      within(rows[0]).getAllByRole("cell")[Column.Action],
    ).toHaveTextContent(ImageEventEntryAction.Updated);
    expect(
      within(rows[1]).getAllByRole("cell")[Column.Action],
    ).toHaveTextContent(ImageEventEntryAction.Added);
    expect(
      within(rows[2]).getAllByRole("cell")[Column.Action],
    ).toHaveTextContent(ImageEventEntryAction.Deleted);
  });

  it("supports filtering for action field", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    await user.click(
      within(card0).getByDataCy("image-event-log-action-filter"),
    );
    const treeSelectOptions = await screen.findByDataCy("tree-select-options");

    // Filter for UPDATED field.
    await user.click(within(treeSelectOptions).getByText("UPDATED"));
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(1);
    });

    // Clear filter.
    await user.click(within(treeSelectOptions).getByText("UPDATED"));
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(3);
    });

    // Filter for ADDED field.
    await user.click(within(treeSelectOptions).getByText("ADDED"));
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(1);
    });

    // Clear filter.
    await user.click(within(treeSelectOptions).getByText("ADDED"));
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(3);
    });

    // Filter for DELETED field.
    await user.click(within(treeSelectOptions).getByText("DELETED"));
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(1);
    });

    // Clear filter.
    await user.click(within(treeSelectOptions).getByText("DELETED"));
    await waitFor(() => {
      const rows = within(card0).getAllByDataCy("image-event-log-table-row");
      expect(rows).toHaveLength(3);
    });
  });

  it("supports global filter for existing entries", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const searchBar = screen.getByPlaceholderText("Global search by name");

    // Filter for golang.
    await user.type(searchBar, "golang{enter}");
    expect(searchBar).toHaveValue("golang");
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-table-row")).toHaveLength(
        2,
      );
    });
  });

  it("supports global filter for non-existent entries", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const searchBar = screen.getByPlaceholderText("Global search by name");

    // Filter for non-existent entry.
    await user.type(searchBar, "blahblah{enter}");
    expect(searchBar).toHaveValue("blahblah");
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-table-row")).toHaveLength(
        0,
      );
    });
  });

  it("global filter takes precedence over table filters", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <EventLogTab imageId="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    const card0 = screen.getAllByDataCy("image-event-log-card")[0];
    await user.click(within(card0).getByDataCy("image-event-log-name-filter"));
    const searchBar = screen.getByPlaceholderText("Search name");

    // Filter for golang.
    await user.type(searchBar, "golang{enter}");
    expect(searchBar).toHaveValue("golang");
    await waitFor(() => {
      expect(
        within(card0).queryAllByDataCy("image-event-log-table-row"),
      ).toHaveLength(1);
    });

    const globalSearchBar = screen.getByPlaceholderText(
      "Global search by name",
    );
    // Filter for non-existent entry.
    await user.type(globalSearchBar, "blahblah{enter}");
    expect(globalSearchBar).toHaveValue("blahblah");
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-table-row")).toHaveLength(
        0,
      );
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
            __typename: "ImageEventsPayload",
            count: 5,
            eventLogEntries: [
              {
                __typename: "ImageEvent",
                amiAfter: "ami-03bfb241d1718c8a2",
                amiBefore: "ami-03e245926032896f9",
                entries: [
                  {
                    __typename: "ImageEventEntry",
                    type: ImageEventType.Package,
                    name: "apache2-bin",
                    before: "2.4.52-1ubuntu4.8",
                    after: "2.4.52-1ubuntu4.10",
                    action: ImageEventEntryAction.Updated,
                  },
                  {
                    __typename: "ImageEventEntry",
                    type: ImageEventType.Toolchain,
                    name: "golang",
                    before: "",
                    after: "go1.21.13",
                    action: ImageEventEntryAction.Added,
                  },
                  {
                    __typename: "ImageEventEntry",
                    type: ImageEventType.Package,
                    name: "containerd.io",
                    before: "1.6.28-1",
                    after: "",
                    action: ImageEventEntryAction.Deleted,
                  },
                ],
                timestamp: new Date("2024-08-07T17:57:00-04:00"),
              },
              {
                __typename: "ImageEvent",
                amiAfter: "ami-03e245926032896f9",
                amiBefore: "ami-03e24592603281234",
                entries: [
                  {
                    __typename: "ImageEventEntry",
                    type: ImageEventType.Toolchain,
                    name: "golang",
                    before: "go1.20.14",
                    after: "",
                    action: ImageEventEntryAction.Deleted,
                  },
                ],
                timestamp: new Date("2023-08-07T17:57:00-04:00"),
              },
              {
                __typename: "ImageEvent",
                amiAfter: "ami-03e24592603281234",
                amiBefore: "ami-03e24592603281235",
                entries: [],
                timestamp: new Date("2022-08-07T17:57:00-04:00"),
              },
              {
                __typename: "ImageEvent",
                amiAfter: "ami-03e24592603281235",
                amiBefore: "ami-03e24592603281236",
                entries: [],
                timestamp: new Date("2021-08-07T17:57:00-04:00"),
              },
              {
                __typename: "ImageEvent",
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
