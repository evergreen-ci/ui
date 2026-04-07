import { createElement, type PropsWithChildren } from "react";
import {
  fireEvent,
  MockedProvider,
  renderHook,
  waitFor,
  type MockedResponse,
} from "@evg-ui/lib/test_utils";
import { UserQuery } from "gql/generated/types";
import { USER } from "gql/queries";
import {
  SPAWN_HOST_ACCESS_TOKEN_BUFFER_MS,
  isTokenValid,
  useUserHasValidToken,
  useUserIsUndergoingAuthentication,
} from "./tokenAuthentication";

const apolloMocksWrapper = (mocks: MockedResponse[]) =>
  function ApolloMocksProvider({ children }: PropsWithChildren) {
    return createElement(MockedProvider, { mocks }, children);
  };

const userMock = (
  overrides: Partial<
    NonNullable<UserQuery["user"]> & {
      tokenAccessTokenExpiresAt?: Date | null;
    }
  > = {},
) => ({
  request: {
    query: USER,
    variables: {},
  },
  result: {
    data: {
      user: {
        __typename: "User" as const,
        userId: "u1",
        displayName: "Test User",
        emailAddress: "t@example.com",
        hasTokenExchangePending: false,
        tokenAccessTokenExpiresAt: null,
        permissions: {
          __typename: "Permissions" as const,
          canEditAdminSettings: false,
        },
        ...overrides,
      },
    },
  },
});

describe("isTokenValid", () => {
  const now = new Date("2026-01-15T12:00:00.000Z").getTime();

  it("returns false for null or undefined", () => {
    expect(isTokenValid(null, now)).toBe(false);
    expect(isTokenValid(undefined, now)).toBe(false);
  });

  it("returns false for invalid date strings", () => {
    expect(isTokenValid("not-a-date", now)).toBe(false);
  });

  it("returns false when expiry is at or before the buffer window", () => {
    const expiry = new Date(now + SPAWN_HOST_ACCESS_TOKEN_BUFFER_MS);
    expect(isTokenValid(expiry, now)).toBe(false);
  });

  it("returns true when expiry is after the buffer window", () => {
    const expiry = new Date(now + SPAWN_HOST_ACCESS_TOKEN_BUFFER_MS + 1000);
    expect(isTokenValid(expiry, now)).toBe(true);
  });

  it("accepts ISO date strings", () => {
    const expiry = new Date(now + SPAWN_HOST_ACCESS_TOKEN_BUFFER_MS + 60_000);
    expect(isTokenValid(expiry.toISOString(), now)).toBe(true);
  });
});

describe("useUserHasValidToken", () => {
  it("returns false when the query is skipped", async () => {
    const wrapper = apolloMocksWrapper([userMock()]);
    const { result } = renderHook(() => useUserHasValidToken(true), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("returns true when token expiry is beyond the buffer", async () => {
    const farFuture = new Date(Date.now() + 60 * 60 * 1000);
    const wrapper = apolloMocksWrapper([
      userMock({ tokenAccessTokenExpiresAt: farFuture }),
    ]);
    const { result } = renderHook(() => useUserHasValidToken(false), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("returns false when token is missing", async () => {
    const wrapper = apolloMocksWrapper([
      userMock({ tokenAccessTokenExpiresAt: null }),
    ]);
    const { result } = renderHook(() => useUserHasValidToken(false), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("refetches on window focus when not skipped, updating token validity", async () => {
    const farFuture = new Date(Date.now() + 60 * 60 * 1000);
    const wrapper = apolloMocksWrapper([
      userMock({ tokenAccessTokenExpiresAt: farFuture }),
      userMock({ tokenAccessTokenExpiresAt: null }),
    ]);
    const { result } = renderHook(() => useUserHasValidToken(false), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(true);
    });
    fireEvent.focus(window);
    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });
});

describe("useUserIsUndergoingAuthentication", () => {
  it("returns false when hasTokenExchangePending is false", async () => {
    const wrapper = apolloMocksWrapper([
      userMock({
        hasTokenExchangePending: false,
      }),
    ]);
    const { result } = renderHook(
      () => useUserIsUndergoingAuthentication(false),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it("returns true when hasTokenExchangePending is true", async () => {
    const wrapper = apolloMocksWrapper([
      userMock({
        hasTokenExchangePending: true,
      }),
    ]);
    const { result } = renderHook(
      () => useUserIsUndergoingAuthentication(false),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
