import { MockedProvider, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { UserQuery } from "gql/generated/types";
import { USER } from "gql/queries";
import { useGetUserPatchesPageTitleAndLink } from ".";

const mocks: ApolloMock<UserQuery>[] = [
  {
    request: {
      query: USER,
    },
    result: {
      data: {
        user: {
          userId: "admin",
          displayName: "Evergreen Admin",
          __typename: "User",
        },
      },
    },
  },
];

// @ts-expect-error: FIXME. This comment was added by an automated script.
const Provider = ({ children }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("useGetUserPatchesPageTitleAndLink", () => {
  it("returns correct title and link when the user passed into the hook parameter is the logged in user", async () => {
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

  it("returns correct title and link when the user passed into the hook parameter is not the logged in user", async () => {
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

  it("returns correct title and link when the display name ends with 's'", async () => {
    const { result } = renderHook(
      () =>
        useGetUserPatchesPageTitleAndLink({
          userId: "justin.mathews",
          displayName: "Justin Mathews",
        }),
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current?.title).toBe("Justin Mathews's Patches");
    });
    expect(result.current?.link).toBe("/user/justin.mathews/patches");
  });

  it("returns null when user is undefined", async () => {
    const { result } = renderHook(
      () => useGetUserPatchesPageTitleAndLink(undefined),
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it("uses userId when displayName is not provided", async () => {
    const { result } = renderHook(
      () =>
        useGetUserPatchesPageTitleAndLink({
          userId: "test.user",
          displayName: "",
        }),
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current?.title).toBe("test.user's Patches");
    });
    expect(result.current?.link).toBe("/user/test.user/patches");
  });
});
