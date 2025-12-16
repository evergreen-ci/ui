import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { UserQuery, UserQueryVariables } from "gql/generated/types";
import { getUserMock } from "gql/mocks/getUser";
import { USER } from "gql/queries";
import { useBreadcrumbRoot } from ".";

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ["userId"],
    },
  },
});

const CurrentUserProvider = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider cache={cache} mocks={[getUserMock]}>
    {children}
  </MockedProvider>
);

const OtherUserProvider = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider cache={cache} mocks={[otherUserMock]}>
    {children}
  </MockedProvider>
);

describe("useBreadcrumbRoot", () => {
  it("returns the correct breadcrumb root when the version is a patch belonging to current user", async () => {
    const { result } = renderHook(
      () =>
        useBreadcrumbRoot(
          true,
          { userId: "admin", displayName: "Evergreen Admin" },
          "spruce",
        ),
      { wrapper: CurrentUserProvider },
    );
    await waitFor(() => {
      expect(result.current.to).toBe("/user/admin/patches");
    });
    expect(result.current.text).toBe("My Patches");
  });

  it("returns the correct breadcrumb root when the version is a patch belonging to other user", async () => {
    const { result } = renderHook(
      () =>
        useBreadcrumbRoot(
          true,
          { userId: "john.doe", displayName: "John Doe" },
          "spruce",
        ),
      { wrapper: OtherUserProvider },
    );
    await waitFor(() => {
      expect(result.current.to).toBe("/user/john.doe/patches");
    });
    expect(result.current.text).toBe("John Doe's Patches");
  });

  it("returns the correct breadcrumb root when the version is a patch belonging to a user with no display name", async () => {
    const { result } = renderHook(
      () =>
        useBreadcrumbRoot(
          true,
          { userId: "sys-perf-user", displayName: "" },
          "spruce",
        ),
      { wrapper: OtherUserProvider },
    );
    await waitFor(() => {
      expect(result.current.to).toBe("/user/sys-perf-user/patches");
    });
    expect(result.current.text).toBe("sys-perf-user's Patches");
  });

  it("returns the correct breadcrumb root when the version is a commit", () => {
    const { result } = renderHook(
      () =>
        useBreadcrumbRoot(
          false,
          { userId: "admin", displayName: "Evergreen Admin" },
          "spruce",
        ),
      { wrapper: CurrentUserProvider },
    );

    expect(result.current.to).toBe("/project/spruce/waterfall");
    expect(result.current.text).toBe("spruce");
  });
});

const otherUserMock: ApolloMock<UserQuery, UserQueryVariables> = {
  request: {
    query: USER,
    variables: {},
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "admin",
        displayName: "Evergreen Admin",
        emailAddress: "admin@evergreen.com",
        permissions: {
          canEditAdminSettings: true,
        },
      },
    },
  },
};
