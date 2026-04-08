import { createElement, type PropsWithChildren } from "react";
import {
  fireEvent,
  MockedProvider,
  renderHook,
  waitFor,
  type MockedResponse,
} from "@evg-ui/lib/test_utils";
import { TokenExchangeState } from "components/Spawn/spawnHostModal/constants";
import { UserTokenExchangeQuery } from "gql/generated/types";
import { USER_TOKEN_EXCHANGE } from "gql/queries";
import {
  SPAWN_HOST_ACCESS_TOKEN_BUFFER_MS,
  getSpawnHostTokenExchangeState,
  isTokenValid,
  useUserTokenExchange,
} from "./tokenAuthentication";

const apolloMocksWrapper = (mocks: MockedResponse[]) =>
  function ApolloMocksProvider({ children }: PropsWithChildren) {
    return createElement(MockedProvider, { mocks }, children);
  };

const userTokenExchangeMock = (
  overrides: Partial<UserTokenExchangeQuery["user"]> = {},
) => ({
  request: {
    query: USER_TOKEN_EXCHANGE,
    variables: {},
  },
  result: {
    data: {
      user: {
        __typename: "User" as const,
        hasTokenExchangePending: false,
        tokenAccessTokenExpiresAt: null,
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

describe("getSpawnHostTokenExchangeState", () => {
  const now = new Date("2026-03-01T12:00:00.000Z").getTime();

  it("returns ExchangePending when pending is true, even if token would be valid", () => {
    const farFuture = new Date(
      now + SPAWN_HOST_ACCESS_TOKEN_BUFFER_MS + 60_000,
    );
    expect(getSpawnHostTokenExchangeState(farFuture, true, now)).toBe(
      TokenExchangeState.ExchangePending,
    );
  });

  it("returns TokenValid when not pending and token is valid", () => {
    const farFuture = new Date(
      now + SPAWN_HOST_ACCESS_TOKEN_BUFFER_MS + 60_000,
    );
    expect(getSpawnHostTokenExchangeState(farFuture, false, now)).toBe(
      TokenExchangeState.TokenValid,
    );
  });

  it("returns NeedsAuthentication when not pending and token is invalid", () => {
    expect(getSpawnHostTokenExchangeState(null, false, now)).toBe(
      TokenExchangeState.NeedsAuthentication,
    );
  });
});

describe("useUserTokenExchange", () => {
  it("returns NeedsAuthentication when the query is skipped", async () => {
    const wrapper = apolloMocksWrapper([userTokenExchangeMock()]);
    const { result } = renderHook(() => useUserTokenExchange(true), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(TokenExchangeState.NeedsAuthentication);
    });
  });

  it("returns TokenValid when token expiry is beyond the buffer and not pending", async () => {
    const farFuture = new Date(Date.now() + 60 * 60 * 1000);
    const wrapper = apolloMocksWrapper([
      userTokenExchangeMock({
        tokenAccessTokenExpiresAt: farFuture,
        hasTokenExchangePending: false,
      }),
    ]);
    const { result } = renderHook(() => useUserTokenExchange(false), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(TokenExchangeState.TokenValid);
    });
  });

  it("returns NeedsAuthentication when token is missing", async () => {
    const wrapper = apolloMocksWrapper([
      userTokenExchangeMock({ tokenAccessTokenExpiresAt: null }),
    ]);
    const { result } = renderHook(() => useUserTokenExchange(false), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(TokenExchangeState.NeedsAuthentication);
    });
  });

  it("returns ExchangePending when hasTokenExchangePending is true", async () => {
    const wrapper = apolloMocksWrapper([
      userTokenExchangeMock({
        hasTokenExchangePending: true,
        tokenAccessTokenExpiresAt: null,
      }),
    ]);
    const { result } = renderHook(() => useUserTokenExchange(false), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(TokenExchangeState.ExchangePending);
    });
  });

  it("refetches on window focus when not skipped, updating token state", async () => {
    const farFuture = new Date(Date.now() + 60 * 60 * 1000);
    const wrapper = apolloMocksWrapper([
      userTokenExchangeMock({ tokenAccessTokenExpiresAt: farFuture }),
      userTokenExchangeMock({ tokenAccessTokenExpiresAt: null }),
    ]);
    const { result } = renderHook(() => useUserTokenExchange(false), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current).toBe(TokenExchangeState.TokenValid);
    });
    fireEvent.focus(window);
    await waitFor(() => {
      expect(result.current).toBe(TokenExchangeState.NeedsAuthentication);
    });
  });
});
