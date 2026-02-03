import { InMemoryCache } from "@apollo/client";
import {
  MockedProvider,
  renderHook,
  waitFor,
  ApolloMock,
} from "@evg-ui/lib/test_utils";
import { OtherUserQuery, OtherUserQueryVariables } from "gql/generated/types";
import { getUserMock } from "gql/mocks/getUser";
import { OTHER_USER } from "gql/queries";
import { useBreadcrumbRoot } from ".";

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ["userId"],
    },
  },
});

// @ts-expect-error: FIXME. This comment was added by an automated script.
const SameUserProvider = ({ children }) => (
  <MockedProvider cache={cache} mocks={[getUserMock, sameUserMock]}>
    {children}
  </MockedProvider>
);

// @ts-expect-error: FIXME. This comment was added by an automated script.
const OtherUserProvider = ({ children }) => (
  <MockedProvider cache={cache} mocks={[getUserMock, otherUserMock]}>
    {children}
  </MockedProvider>
);

describe("useBreadcrumbRoot", () => {
  it("returns the correct breadcrumb root when the version is a patch belonging to current user", async () => {
    const { result } = renderHook(
      () => useBreadcrumbRoot(true, "admin", "spruce"),
      { wrapper: SameUserProvider },
    );
    await waitFor(() => {
      expect(result.current.to).toBe("/user/admin/patches");
    });
    expect(result.current.text).toBe("My Patches");
  });

  it("returns the correct breadcrumb root when the version is a patch belonging to other user", async () => {
    const { result } = renderHook(
      () => useBreadcrumbRoot(true, "john.doe", "spruce"),
      { wrapper: OtherUserProvider },
    );
    await waitFor(() => {
      expect(result.current.to).toBe("/user/john.doe/patches");
    });
    expect(result.current.text).toBe("John Doe's Patches");
  });

  it("returns the correct breadcrumb root when the version is a commit", () => {
    const { result } = renderHook(
      () => useBreadcrumbRoot(false, "admin", "spruce"),
      { wrapper: SameUserProvider },
    );

    expect(result.current.to).toBe("/project/spruce/waterfall");
    expect(result.current.text).toBe("spruce");
  });
});

const sameUserMock: ApolloMock<OtherUserQuery, OtherUserQueryVariables> = {
  request: {
    query: OTHER_USER,
    variables: {
      userId: "admin",
    },
  },
  result: {
    data: {
      otherUser: {
        __typename: "User",
        userId: "admin",
        displayName: "Evergreen Admin",
      },
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      currentUser: getUserMock.result.data.user,
    },
  },
};

const otherUserMock: ApolloMock<OtherUserQuery, OtherUserQueryVariables> = {
  request: {
    query: OTHER_USER,
    variables: {
      userId: "john.doe",
    },
  },
  result: {
    data: {
      otherUser: {
        __typename: "User",
        userId: "john.doe",
        displayName: "John Doe",
      },
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      currentUser: getUserMock.result.data.user,
    },
  },
};
