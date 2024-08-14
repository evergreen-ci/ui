import { ReactNode } from "react";
import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  ImageEventsQuery,
  ImageEventsQueryVariables,
  ImageEventType,
  ImageEventEntryAction,
} from "gql/generated/types";
import { IMAGE_EVENTS } from "gql/queries";
import { renderWithRouterMatch as render, screen, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { EventLogTab } from "./EventLogTab";

type WrapperProps = {
  children: ReactNode;
  mocks?: ApolloMock<ImageEventsQuery, ImageEventsQueryVariables>[];
};

const Wrapper: React.FC<WrapperProps> = ({ children, mocks = [mock()] }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("loading image event log", async () => {
  it("does not show a load more button when all events are shown", async () => {
    const { Component } = RenderFakeToastContext(
      <Wrapper mocks={[mock()]}>
        <EventLogTab />
      </Wrapper>,
    );
    render(<Component />, {
      route: "/image/ubuntu2204/event-log",
      path: "/image/:imageId/event-log",
    });
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

  it("shows one entry in all the card tables", async () => {
    const { Component } = RenderFakeToastContext(
      <Wrapper mocks={[mock()]}>
        <EventLogTab />
      </Wrapper>,
    );
    render(<Component />, {
      route: "/image/ubuntu2204/event-log",
      path: "/image/:imageId/event-log",
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("image-event-log-card")).toHaveLength(5);
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("leafygreen-table-row")).toHaveLength(1);
    });
  });
});

const mock = (): ApolloMock<ImageEventsQuery, ImageEventsQueryVariables> => ({
  request: {
    query: IMAGE_EVENTS,
    variables: {
      imageId: "ubuntu2204",
      limit: 5,
      page: 0,
    },
  },
  result: {
    data: imageEvents,
  },
});

const imageEvents: ImageEventsQuery = {
  image: {
    id: "ubuntu2204",
    events: {
      count: 5,
      eventLogEntries: [
        {
          amiAfter: "ami-03bfb241d1718c8a2",
          amiBefore: "ami-03e245926032896f9",
          entries: [],
          timestamp: new Date("2024-08-07T17:57:00-04:00"),
        },
        {
          amiAfter: "ami-03e245926032896f9",
          amiBefore: "ami-03e24592603281234",
          entries: [
            {
              type: ImageEventType.Package,
              name: "apache2-bin",
              before: "2.4.52-1ubuntu4.8",
              after: "2.4.52-1ubuntu4.10",
              action: ImageEventEntryAction.Updated,
            },
          ],
          timestamp: new Date("2024-08-07T17:57:00-04:00"),
        },
        {
          amiAfter: "ami-03e24592603281234",
          amiBefore: "ami-03e24592603281235",
          entries: [],
          timestamp: new Date("2024-08-07T17:57:00-04:00"),
        },
        {
          amiAfter: "ami-03e24592603281235",
          amiBefore: "ami-03e24592603281236",
          entries: [],
          timestamp: new Date("2024-08-07T17:57:00-04:00"),
        },
        {
          amiAfter: "ami-03e24592603281236",
          amiBefore: "ami-03e24592603281237",
          entries: [],
          timestamp: new Date("2024-08-07T17:57:00-04:00"),
        },
      ],
    },
  },
};
