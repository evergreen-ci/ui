import { InMemoryCache } from "@apollo/client";
import { MockedProvider, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { UserQuery } from "gql/generated/types";
import { USER } from "gql/queries";
import { useGetUserPatchesPageTitleAndLink } from ".";

const createCacheWithUser = (currentUserId: string = "admin") => {
  const cache = new InMemoryCache();
  cache.writeQuery<UserQuery>({
    data: {
      user: {
        __typename: "UserLite",
        displayName: "Evergreen Admin",
        emailAddress: "admin@example.com",
        permissions: {
          __typename: "Permissions",
          canEditAdminSettings: true,
        },
        userId: currentUserId,
      },
    },
    query: USER,
  });
  return cache;
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
const Provider = ({ children, currentUserId = "admin" }) => (
  <MockedProvider cache={createCacheWithUser(currentUserId)} mocks={[]}>
    {children}
  </MockedProvider>
);

describe("useGetUserPatchesPageTitleAndLink", () => {
  it("returns correct title and link when the userId matches the logged in user", async () => {
    const { result } = renderHook(
      () =>
        useGetUserPatchesPageTitleAndLink({
          displayName: "Evergreen Admin",
          userId: "admin",
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
          displayName: "Justin Mathew",
          userId: "justin.mathew",
        }),
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current?.title).toBe("Justin Mathew's Patches");
    });
    expect(result.current?.link).toBe("/user/justin.mathew/patches");
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
