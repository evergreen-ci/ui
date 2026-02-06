import { GraphQLError } from "graphql";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import { MockedProvider, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { ProjectQuery, ProjectQueryVariables } from "gql/generated/types";
import { PROJECT } from "gql/queries";
import { useProjectRedirect } from ".";

const ProviderWrapper: React.FC<{
  children: React.ReactNode;
  location: string;
  mocks?: ApolloMock<ProjectQuery, ProjectQueryVariables>[];
}> = ({ children, location, mocks = [projectMock] }) => {
  const { Component } = RenderFakeToastContext(<div>{children}</div>);
  return (
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={[location]}>
        <Routes>
          <Route
            element={<Component />}
            path="/project/:projectIdentifier/settings"
          />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe("useProjectRedirect", () => {
  it("should not need redirect if URL has project identifier", () => {
    const { result } = renderHook(() => useProjectRedirect(), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          location: "/project/my-project/settings",
        }),
    });
    expect(result.current.needsRedirect).toBe(false);
    expect(result.current.redirectIdentifier).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });

  it("should need redirect and fetch data if URL has project ID", async () => {
    const { result } = renderHook(() => useProjectRedirect(), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          location: `/project/${projectId}/settings`,
          mocks: [projectMock],
        }),
    });
    expect(result.current.needsRedirect).toBe(true);
    expect(result.current.loading).toBe(true);
    expect(result.current.redirectIdentifier).toBeUndefined();

    // Check values again after query finishes.
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.redirectIdentifier).toBe("my-project");
    expect(result.current.error).toBeUndefined();
  });

  it("should handle query errors gracefully", async () => {
    const { result } = renderHook(() => useProjectRedirect(), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          location: `/project/${repoId}/settings`,
          mocks: [repoMock],
        }),
    });
    expect(result.current.needsRedirect).toBe(true);
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBeDefined();
    expect(result.current.redirectIdentifier).toBeUndefined();
  });
});

const projectId = "5f74d99ab2373627c047c5e5";
const projectMock: ApolloMock<ProjectQuery, ProjectQueryVariables> = {
  request: {
    query: PROJECT,
    variables: {
      idOrIdentifier: projectId,
    },
  },
  result: {
    data: {
      project: {
        __typename: "Project",
        id: projectId,
        identifier: "my-project",
      },
    },
  },
};

const repoId = "5e6bb9e23066155a993e0f1a";
const repoMock: ApolloMock<ProjectQuery, ProjectQueryVariables> = {
  request: {
    query: PROJECT,
    variables: {
      idOrIdentifier: repoId,
    },
  },
  result: {
    errors: [
      new GraphQLError(
        `Error finding project by id ${repoId}: 404 (Not Found): project '${repoId}' not found`,
      ),
    ],
  },
};
