import {
  getReauthenticationOpensAt,
  isExchangeBlocking,
  isIncompleteForRequiredSpawn,
  isNeedlesslyFresh,
  REAUTH_BUFFER_MS,
} from "./tokenExchange";

describe("isExchangeBlocking", () => {
  it("returns false when user is undefined", () => {
    expect(isExchangeBlocking(undefined)).toBe(false);
  });

  it("returns true when token exchange is in flight", () => {
    expect(
      isExchangeBlocking({
        __typename: "User",
        userId: "u",
        hasTokenExchangePending: true,
      }),
    ).toBe(true);
  });

  it("returns true when access token expiry is in the past", () => {
    const past = new Date("2020-01-01T00:00:00.000Z");
    expect(
      isExchangeBlocking({
        __typename: "User",
        userId: "u",
        hasTokenExchangePending: false,
        tokenAccessTokenExpiresAt: past,
      }),
    ).toBe(true);
  });

  it("returns false when expiry is in the future", () => {
    const future = new Date(Date.now() + 60_000);
    expect(
      isExchangeBlocking({
        __typename: "User",
        userId: "u",
        hasTokenExchangePending: false,
        tokenAccessTokenExpiresAt: future,
      }),
    ).toBe(false);
  });

  it("returns false when there is no expiry (token absent or non-expiring)", () => {
    expect(
      isExchangeBlocking({
        __typename: "User",
        userId: "u",
        hasTokenExchangePending: false,
        tokenAccessTokenExpiresAt: undefined,
      }),
    ).toBe(false);
  });
});

describe("isNeedlesslyFresh", () => {
  const now = new Date("2025-06-15T12:00:00.000Z").getTime();

  it("returns false when user is undefined", () => {
    expect(isNeedlesslyFresh(undefined, now)).toBe(false);
  });

  it("returns false when token is in-flight", () => {
    const future = new Date(now + REAUTH_BUFFER_MS + 60_000);
    expect(
      isNeedlesslyFresh(
        {
          __typename: "User",
          userId: "u",
          hasTokenExchangePending: true,
          tokenAccessTokenExpiresAt: future,
        },
        now,
      ),
    ).toBe(false);
  });

  it("returns false when token is expired", () => {
    const past = new Date(now - 60_000);
    expect(
      isNeedlesslyFresh(
        {
          __typename: "User",
          userId: "u",
          hasTokenExchangePending: false,
          tokenAccessTokenExpiresAt: past,
        },
        now,
      ),
    ).toBe(false);
  });

  it("returns false when expiry is within the buffer window", () => {
    const soon = new Date(now + 10 * 60 * 1000);
    expect(
      isNeedlesslyFresh(
        {
          __typename: "User",
          userId: "u",
          hasTokenExchangePending: false,
          tokenAccessTokenExpiresAt: soon,
        },
        now,
      ),
    ).toBe(false);
  });

  it("returns true when expiry is beyond the buffer window", () => {
    const later = new Date(now + REAUTH_BUFFER_MS + 60_000);
    expect(
      isNeedlesslyFresh(
        {
          __typename: "User",
          userId: "u",
          hasTokenExchangePending: false,
          tokenAccessTokenExpiresAt: later,
        },
        now,
      ),
    ).toBe(true);
  });
});

describe("isIncompleteForRequiredSpawn", () => {
  it("returns true when user is undefined", () => {
    expect(isIncompleteForRequiredSpawn(undefined)).toBe(true);
  });

  it("returns true when there is no stored expiry and exchange is not in flight", () => {
    expect(
      isIncompleteForRequiredSpawn({
        __typename: "User",
        userId: "u",
        hasTokenExchangePending: false,
      }),
    ).toBe(true);
  });

  it("returns true when exchange is in flight", () => {
    expect(
      isIncompleteForRequiredSpawn({
        __typename: "User",
        userId: "u",
        hasTokenExchangePending: true,
        tokenAccessTokenExpiresAt: new Date(Date.now() + 60_000),
      }),
    ).toBe(true);
  });

  it("returns true when token is expired", () => {
    expect(
      isIncompleteForRequiredSpawn({
        __typename: "User",
        userId: "u",
        hasTokenExchangePending: false,
        tokenAccessTokenExpiresAt: new Date(Date.now() - 60_000),
      }),
    ).toBe(true);
  });

  it("returns false when a non-expired token with expiry is present", () => {
    expect(
      isIncompleteForRequiredSpawn({
        __typename: "User",
        userId: "u",
        hasTokenExchangePending: false,
        tokenAccessTokenExpiresAt: new Date(Date.now() + 60_000),
      }),
    ).toBe(false);
  });

  it("returns false for a valid token that is only within the re-auth buffer window", () => {
    const soon = new Date(Date.now() + 10 * 60 * 1000);
    expect(
      isIncompleteForRequiredSpawn({
        __typename: "User",
        userId: "u",
        hasTokenExchangePending: false,
        tokenAccessTokenExpiresAt: soon,
      }),
    ).toBe(false);
  });
});

describe("getReauthenticationOpensAt", () => {
  it("subtracts the reauth buffer from expiry", () => {
    const expiry = new Date("2025-06-15T14:00:00.000Z");
    const opens = getReauthenticationOpensAt(expiry);
    expect(opens.getTime()).toBe(expiry.getTime() - REAUTH_BUFFER_MS);
  });
});
