import {
  MockedProvider,
  renderHook,
  waitFor,
  ApolloMock,
} from "@evg-ui/lib/test_utils";
import { OtherUserQuery, OtherUserQueryVariables } from "gql/generated/types";
import { OTHER_USER } from "gql/queries";
import { useGetUserPatchesPageTitleAndLink } from ".";

const mocks: ApolloMock<OtherUserQuery, OtherUserQueryVariables>[] = [
  {
    request: {
      query: OTHER_USER,
      variables: {
        userId: "admin",
      },
    },
    result: {
      data: {
        otherUser: {
          userId: "admin",
          displayName: "Evergreen Admin",
          __typename: "User",
        },
        currentUser: { userId: "admin", __typename: "User" },
      },
    },
  },
  {
    request: {
      query: OTHER_USER,
      variables: {
        userId: "justin.mathew",
      },
    },
    result: {
      data: {
        otherUser: {
          userId: "justin.mathew",
          displayName: "Justin Mathew",
          __typename: "User",
        },
        currentUser: { userId: "admin", __typename: "User" },
      },
    },
  },
  {
    request: {
      query: OTHER_USER,
      variables: {
        userId: "justin.mathews",
      },
    },
    result: {
      data: {
        otherUser: {
          userId: "justin.mathews",
          displayName: "Justin Mathews",
          __typename: "User",
        },
        currentUser: { userId: "admin", __typename: "User" },
      },
    },
  },
];

// @ts-expect-error: FIXME. This comment was added by an automated script.
const Provider = ({ children }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("useGetUserPatchesPageTitleAndLink", () => {
  it("return correct title and link when the userId passed into the hook parameter is that of the logged in user", async () => {
    const { result } = renderHook(
      () => useGetUserPatchesPageTitleAndLink("admin"),
      { wrapper: Provider },
    );
    await waitFor(() => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      expect(result.current.title).toBe("My Patches");
    });
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    expect(result.current.link).toBe("/user/admin/patches");
  });

  it("return correct title and link when the userId passed into the hook parameter is not that of the logged in user", async () => {
    const { result } = renderHook(
      () => useGetUserPatchesPageTitleAndLink("justin.mathew"),
      { wrapper: Provider },
    );
    await waitFor(() => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      expect(result.current.title).toBe("Justin Mathew's Patches");
    });
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    expect(result.current.link).toBe("/user/justin.mathew/patches");
  });

  it("return correct title and link when the userId passed into the hook parameter is not that of the logged in user and the display name of the other user ends with the letter 's'", async () => {
    const { result } = renderHook(
      () => useGetUserPatchesPageTitleAndLink("justin.mathews"),
      { wrapper: Provider },
    );
    await waitFor(() => {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      expect(result.current.title).toBe("Justin Mathews' Patches");
    });
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    expect(result.current.link).toBe("/user/justin.mathews/patches");
  });
});
