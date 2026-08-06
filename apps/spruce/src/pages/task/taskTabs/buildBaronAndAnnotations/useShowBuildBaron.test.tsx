import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { PROJECT_BUILD_BARON_SETTINGS_FRAGMENT } from "gql/fragments/projectBuildBaronSettings";
import {
  ProjectBuildBaronSettingsQuery,
  ProjectBuildBaronSettingsQueryVariables,
} from "gql/generated/types";
import { PROJECT_BUILD_BARON_SETTINGS } from "gql/queries";
import { useShowBuildBaron } from "./useShowBuildBaron";

const projectId = "project_id";
const projectIdentifier = "project_identifier";

const settingsMock = (
  ticketSearchProjects: string[] | null,
): ApolloMock<
  ProjectBuildBaronSettingsQuery,
  ProjectBuildBaronSettingsQueryVariables
> => ({
  request: {
    query: PROJECT_BUILD_BARON_SETTINGS,
    variables: { projectIdentifier },
  },
  result: {
    data: {
      project: {
        __typename: "Project",
        id: projectId,
        buildBaronSettings: {
          __typename: "BuildBaronSettings",
          ticketCreateProject: "EVG",
          ticketSearchProjects,
        },
      },
    },
  },
});

/**
 * setup builds a provider that counts how many operations reach the network, so tests can assert how
 * often the project's settings are fetched rather than only what the hook returns.
 * @param mocks - the mocked responses available to the client
 * @returns the wrapper to render hooks with, and a count of requests sent so far
 */
const setup = (mocks: MockLink.MockedResponse[]) => {
  const requests: string[] = [];
  const countingLink = new ApolloLink((operation, forward) => {
    requests.push(operation.operationName ?? "");
    return forward(operation);
  });
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    cache,
    link: countingLink.concat(new MockLink(mocks)),
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  );
  return { cache, requests, wrapper };
};

const failedTask = {
  status: TaskStatus.Failed,
  hasAnnotation: false,
  canModifyAnnotation: false,
  projectId,
  projectIdentifier,
};

describe("useShowBuildBaron", () => {
  it("shows the tab when the project has Build Baron search projects configured", async () => {
    const { wrapper } = setup([settingsMock(["EVG"])]);
    const { result } = renderHook(() => useShowBuildBaron(failedTask), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("hides the tab once settings show the project is unconfigured", async () => {
    const { requests, wrapper } = setup([settingsMock(null)]);
    const { result } = renderHook(() => useShowBuildBaron(failedTask), {
      wrapper,
    });

    await waitFor(() => {
      expect(requests).toEqual(["ProjectBuildBaronSettings"]);
    });
    expect(result.current).toBe(false);
  });

  it("fetches settings once for multiple tasks in the same project", async () => {
    const { requests, wrapper } = setup([settingsMock(["EVG"])]);

    const { result: firstResult } = renderHook(
      () => useShowBuildBaron(failedTask),
      { wrapper },
    );
    await waitFor(() => {
      expect(firstResult.current).toBe(true);
    });

    const { result: secondResult } = renderHook(
      () => useShowBuildBaron({ ...failedTask, hasAnnotation: true }),
      { wrapper },
    );
    await waitFor(() => {
      expect(secondResult.current).toBe(true);
    });

    expect(requests).toEqual(["ProjectBuildBaronSettings"]);
  });

  it("fetches nothing when another operation already cached the project's settings", async () => {
    const { cache, requests, wrapper } = setup([settingsMock(["EVG"])]);
    // The project settings page reads these fields on the Project entity without going through this
    // hook's query, so its data should satisfy the tab as well.
    cache.writeFragment({
      id: cache.identify({ __typename: "Project", id: projectId }),
      fragment: PROJECT_BUILD_BARON_SETTINGS_FRAGMENT,
      data: {
        __typename: "Project",
        id: projectId,
        buildBaronSettings: {
          __typename: "BuildBaronSettings",
          ticketCreateProject: "EVG",
          ticketSearchProjects: ["EVG"],
        },
      },
    });

    const { result } = renderHook(() => useShowBuildBaron(failedTask), {
      wrapper,
    });

    expect(result.current).toBe(true);
    await waitFor(() => {
      expect(requests).toEqual([]);
    });
  });

  it("fetches nothing for a task that has not failed", async () => {
    const { requests, wrapper } = setup([settingsMock(["EVG"])]);
    const { result } = renderHook(
      () => useShowBuildBaron({ ...failedTask, status: TaskStatus.Succeeded }),
      { wrapper },
    );

    expect(result.current).toBe(false);
    await waitFor(() => {
      expect(requests).toEqual([]);
    });
  });
});
