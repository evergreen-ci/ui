import { MockedProvider, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { UserQuery, UserQueryVariables } from "gql/generated/types";
import { USER } from "gql/queries";
import { useGetUserPatchesPageTitleAndLink } from ".";

const getUserMock = (
  userId: string,
): ApolloMock<UserQuery, UserQueryVariables> => ({
  request: {
    query: USER,
  },
  result: {
    data: {
      user: {
        userId,
        displayName: "Evergreen Admin",
        emailAddress: "admin@example.com",
        permissions: {
          canEditAdminSettings: true,
          __typename: "Permissions",
        },
        __typename: "User",
      },
    },
  },
});

// @ts-expect-error: FIXME. This comment was added by an automated script.
const Provider = ({ children, currentUserId = "admin" }) => (
  <MockedProvider mocks={[getUserMock(currentUserId)]}>
    {children}
  </MockedProvider>
);

describe("useGetUserPatchesPageTitleAndLink", () => {
  it("returns correct title and link when the userId matches the logged in user", async () => {
    const { result } = renderHook(
      () =>
        useGetUserPatchesPageTitleAndLink({
          userId: "admin",
          displayName: "Evergreen Admin",
        }),
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current?.title).toBe("My Patches");
    });
    expect(result.current?.link).toBe("/user/admin/patches");
  });

  it("returns correct title and link when the userId does not match the logged in user", async () => {
    const { result } = renderHook(
      () =>
        useGetUserPatchesPageTitleAndLink({
          userId: "justin.mathew",
          displayName: "Justin Mathew",
        }),
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current?.title).toBe("Justin Mathew's Patches");
    });
    expect(result.current?.link).toBe("/user/justin.mathew/patches");
  });

  it("returns correct possessive form when display name ends with 's'", async () => {
    const { result } = renderHook(
      () =>
        useGetUserPatchesPageTitleAndLink({
          userId: "justin.mathews",
          displayName: "Justin Mathews",
        }),
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current?.title).toBe("Justin Mathews' Patches");
    });
    expect(result.current?.link).toBe("/user/justin.mathews/patches");
  });

  it("falls back to userId when displayName is not provided", async () => {
    const { result } = renderHook(
      () =>
        useGetUserPatchesPageTitleAndLink({
          userId: "other.user",
        }),
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current?.title).toBe("other.user's Patches");
    });
    expect(result.current?.link).toBe("/user/other.user/patches");
  });
});
