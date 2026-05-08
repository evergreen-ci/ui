import { ApolloLink, execute, gql, ApolloClient } from "@apollo/client";
import { Observable } from "@apollo/client/utilities";
import { waitFor } from "@testing-library/react";
import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import { pausePollingLink } from ".";

const GET_WATERFALL = gql`
  query Waterfall {
    someData {
      id
      name
    }
  }
`;

describe("pausePollingLink", () => {
  let mockHttpLink: ApolloLink;
  let mockForward: ReturnType<typeof vi.fn>;
  let documentHiddenSpy: ReturnType<typeof vi.spyOn>;
  let navigatorOnlineSpy: ReturnType<typeof vi.spyOn>;
  let mockClient: ApolloClient;

  beforeEach(() => {
    vi.clearAllMocks();

    mockForward = vi.fn(
      () =>
        new Observable((observer) => {
          observer.next({ data: { someData: { id: 1, name: "Test" } } });
          observer.complete();
        }),
    );
    mockHttpLink = new ApolloLink(mockForward);

    documentHiddenSpy = vi.spyOn(document, "hidden", "get");

    navigatorOnlineSpy = vi.spyOn(navigator, "onLine", "get");

    mockClient = {} as ApolloClient;
  });

  afterEach(() => {
    documentHiddenSpy.mockRestore();
    navigatorOnlineSpy.mockRestore();
  });

  it("immediately allows request if tab is active and online", async () => {
    documentHiddenSpy.mockReturnValue(false);
    navigatorOnlineSpy.mockReturnValue(true);

    const observer = { next: vi.fn(), error: vi.fn(), complete: vi.fn() };

    execute(
      ApolloLink.from([pausePollingLink, mockHttpLink]),
      {
        query: GET_WATERFALL,
      },
      { client: mockClient },
    ).subscribe(observer);

    expect(mockForward).toHaveBeenCalled();
    await waitFor(() => expect(observer.next).toHaveBeenCalled());
  });

  it("delays request when tab is inactive", async () => {
    documentHiddenSpy.mockReturnValue(true);
    navigatorOnlineSpy.mockReturnValue(true);

    const observer = { next: vi.fn(), error: vi.fn(), complete: vi.fn() };

    execute(
      ApolloLink.from([pausePollingLink, mockHttpLink]),
      {
        query: GET_WATERFALL,
      },
      { client: mockClient },
    ).subscribe(observer);

    expect(mockForward).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(observer.next).not.toHaveBeenCalled();
    });
  });

  it("delays request when network is offline", async () => {
    documentHiddenSpy.mockReturnValue(false);
    navigatorOnlineSpy.mockReturnValue(false);

    const observer = { next: vi.fn(), error: vi.fn(), complete: vi.fn() };

    execute(
      ApolloLink.from([pausePollingLink, mockHttpLink]),
      {
        query: GET_WATERFALL,
      },
      { client: mockClient },
    ).subscribe(observer);

    expect(mockForward).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(observer.next).not.toHaveBeenCalled();
    });
  });

  it("resumes request when tab becomes active again", async () => {
    documentHiddenSpy.mockReturnValue(true);
    navigatorOnlineSpy.mockReturnValue(true);

    const observer = { next: vi.fn(), error: vi.fn(), complete: vi.fn() };

    execute(
      ApolloLink.from([pausePollingLink, mockHttpLink]),
      {
        query: GET_WATERFALL,
      },
      { client: mockClient },
    ).subscribe(observer);

    expect(mockForward).not.toHaveBeenCalled();

    documentHiddenSpy.mockReturnValue(false);
    document.dispatchEvent(new Event("visibilitychange"));

    expect(mockForward).toHaveBeenCalled();
    await waitFor(() => {
      expect(observer.next).toHaveBeenCalled();
    });
  });

  it("resumes request when network is back online", async () => {
    documentHiddenSpy.mockReturnValue(false);
    navigatorOnlineSpy.mockReturnValue(false);

    const observer = { next: vi.fn(), error: vi.fn(), complete: vi.fn() };

    execute(
      ApolloLink.from([pausePollingLink, mockHttpLink]),
      {
        query: GET_WATERFALL,
      },
      { client: mockClient },
    ).subscribe(observer);

    expect(mockForward).not.toHaveBeenCalled();

    navigatorOnlineSpy.mockReturnValue(true);
    window.dispatchEvent(new Event("online"));

    expect(mockForward).toHaveBeenCalled();
    await waitFor(() => {
      expect(observer.next).toHaveBeenCalled();
    });
  });

  it("ignores queries that are not in pauseableQueries", async () => {
    documentHiddenSpy.mockReturnValue(true);
    navigatorOnlineSpy.mockReturnValue(true);

    const observer = { next: vi.fn(), error: vi.fn(), complete: vi.fn() };

    execute(
      ApolloLink.from([pausePollingLink, mockHttpLink]),
      {
        query: gql`
          query OtherQuery {
            otherData {
              id
            }
          }
        `,
      },
      { client: mockClient },
    ).subscribe(observer);

    expect(mockForward).toHaveBeenCalled();
    await waitFor(() => {
      expect(observer.next).toHaveBeenCalled();
    });
  });
});
