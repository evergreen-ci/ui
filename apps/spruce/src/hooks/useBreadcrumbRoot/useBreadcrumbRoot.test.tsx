import { MockedProvider, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { getUserMock } from "gql/mocks/getUser";
import { useBreadcrumbRoot } from ".";

// @ts-expect-error: FIXME. This comment was added by an automated script.
const Provider = ({ children }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
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
      { wrapper: Provider },
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
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current.to).toBe("/user/john.doe/patches");
    });
    expect(result.current.text).toBe("John Doe's Patches");
  });

  it("returns the correct breadcrumb root when the version is a commit", () => {
    const { result } = renderHook(
      () =>
        useBreadcrumbRoot(
          false,
          { userId: "admin", displayName: "Evergreen Admin" },
          "spruce",
        ),
      { wrapper: Provider },
    );

    expect(result.current.to).toBe("/project/spruce/waterfall");
    expect(result.current.text).toBe("spruce");
  });

  it("falls back to userId when displayName is not provided", async () => {
    const { result } = renderHook(
      () => useBreadcrumbRoot(true, { userId: "other.user" }, "spruce"),
      { wrapper: Provider },
    );
    await waitFor(() => {
      expect(result.current.to).toBe("/user/other.user/patches");
    });
    expect(result.current.text).toBe("other.user's Patches");
  });
});
