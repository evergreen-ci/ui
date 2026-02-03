import { GraphQLError } from "graphql";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  MockedProvider,
  renderHook,
  waitFor,
  ApolloMock,
} from "@evg-ui/lib/test_utils";
import { ProjectQuery, ProjectQueryVariables } from "gql/generated/types";
import { PROJECT } from "gql/queries";
import { useProjectRedirect } from ".";

const useJointHook = (props: Parameters<typeof useProjectRedirect>[0]) => {
  const { attemptedRedirect, isRedirecting } = useProjectRedirect({ ...props });
  const { pathname, search } = useLocation();
  return { isRedirecting, pathname, search, attemptedRedirect };
};

const ProviderWrapper: React.FC<{
  children: React.ReactNode;
  location: string;
  mocks?: ApolloMock<ProjectQuery, ProjectQueryVariables>[];
}> = ({ children, location, mocks = [repoMock, projectMock] }) => (
  <MockedProvider mocks={mocks}>
    <MemoryRouter initialEntries={[location]}>
      <Routes>
        <Route element={children} path="/project/:projectIdentifier/settings" />
      </Routes>
    </MemoryRouter>
  </MockedProvider>
);

describe("useProjectRedirect", () => {
  it("should not redirect if URL has project identifier", async () => {
    const sendAnalyticsEvent = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(
      () => useJointHook({ sendAnalyticsEvent, onError, shouldRedirect: true }),
      {
        wrapper: ({ children }) =>
          ProviderWrapper({
            children,
            location: "/project/my-project/settings",
          }),
      },
    );
    expect(result.current).toMatchObject({
      isRedirecting: false,
      attemptedRedirect: false,
      pathname: "/project/my-project/settings",
      search: "",
    });
    expect(sendAnalyticsEvent).toHaveBeenCalledTimes(0);
  });

  it("should redirect if URL has project ID", async () => {
    const sendAnalyticsEvent = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useJointHook({ sendAnalyticsEvent, onError, shouldRedirect: true }),
      {
        wrapper: ({ children }) =>
          ProviderWrapper({
            children,
            location: `/project/${projectId}/settings`,
            mocks: [projectMock],
          }),
      },
    );
    expect(result.current).toMatchObject({
      isRedirecting: true,
      attemptedRedirect: false,
      pathname: "/project/5f74d99ab2373627c047c5e5/settings",
      search: "",
    });
    await waitFor(() => {
      expect(result.current.pathname).toBe("/project/my-project/settings");
    });
    expect(result.current.isRedirecting).toBe(false);
    expect(sendAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendAnalyticsEvent).toHaveBeenCalledWith(
      "5f74d99ab2373627c047c5e5",
      "my-project",
    );
  });

  it("should not redirect if shouldRedirect is disabled", async () => {
    const sendAnalyticsEvent = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () =>
        useJointHook({ sendAnalyticsEvent, onError, shouldRedirect: false }),
      {
        wrapper: ({ children }) =>
          ProviderWrapper({
            children,
            location: `/project/${projectId}/settings`,
          }),
      },
    );
    expect(result.current).toMatchObject({
      isRedirecting: false,
      attemptedRedirect: false,
      pathname: "/project/5f74d99ab2373627c047c5e5/settings",
      search: "",
    });
    await waitFor(() => {
      expect(result.current).toMatchObject({
        isRedirecting: false,
        attemptedRedirect: false,
        pathname: "/project/5f74d99ab2373627c047c5e5/settings",
        search: "",
      });
    });
    expect(sendAnalyticsEvent).toHaveBeenCalledTimes(0);
  });

  it("should preserve query params when redirecting", async () => {
    const sendAnalyticsEvent = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useJointHook({ sendAnalyticsEvent, onError, shouldRedirect: true }),
      {
        wrapper: ({ children }) =>
          ProviderWrapper({
            children,
            location: `/project/${projectId}/settings?taskName=thirdparty`,
            mocks: [projectMock],
          }),
      },
    );
    expect(result.current).toMatchObject({
      isRedirecting: true,
      attemptedRedirect: false,
      pathname: "/project/5f74d99ab2373627c047c5e5/settings",
      search: "?taskName=thirdparty",
    });
    await waitFor(() => {
      expect(result.current.pathname).toBe("/project/my-project/settings");
      expect(result.current.search).toBe("?taskName=thirdparty");
    });
    expect(result.current.isRedirecting).toBe(false);
    expect(sendAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendAnalyticsEvent).toHaveBeenCalledWith(
      "5f74d99ab2373627c047c5e5",
      "my-project",
    );
  });

  it("should attempt redirect if URL has repo ID but stop attempting after query", async () => {
    const sendAnalyticsEvent = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useJointHook({ sendAnalyticsEvent, onError, shouldRedirect: true }),
      {
        wrapper: ({ children }) =>
          ProviderWrapper({
            children,
            location: `/project/${repoId}/settings`,
            mocks: [repoMock],
          }),
      },
    );
    expect(result.current).toMatchObject({
      isRedirecting: true,
      attemptedRedirect: false,
      pathname: "/project/5e6bb9e23066155a993e0f1a/settings",
      search: "",
    });
    await waitFor(() => {
      expect(result.current.isRedirecting).toBe(false);
    });
    await waitFor(() => {
      expect(result.current.attemptedRedirect).toBe(true);
    });
    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1);
    });
    expect(onError).toHaveBeenCalledWith(repoId);
    expect(sendAnalyticsEvent).toHaveBeenCalledTimes(0);
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
