import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { PROJECT_BUILD_BARON_SETTINGS_FRAGMENT } from "gql/fragments/projectBuildBaronSettings";
import {
  ProjectBuildBaronSettingsQuery,
  ProjectBuildBaronSettingsQueryVariables,
} from "gql/generated/types";
import { PROJECT_BUILD_BARON_SETTINGS } from "gql/queries";
import { useProjectBuildBaronSettings } from ".";

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

const options = { projectId, projectIdentifier };

describe("useProjectBuildBaronSettings", () => {
  it("returns the fetched project settings", async () => {
    const { wrapper } = setup([settingsMock(["EVG"])]);
    const { result } = renderHook(() => useProjectBuildBaronSettings(options), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current).toEqual({
        bbTicketCreationDefined: true,
        buildBaronConfigured: true,
      });
    });
  });

  it("reports when Build Baron search is unconfigured", async () => {
    const { requests, wrapper } = setup([settingsMock(null)]);
    const { result } = renderHook(() => useProjectBuildBaronSettings(options), {
      wrapper,
    });

    await waitFor(() => {
      expect(requests).toEqual(["ProjectBuildBaronSettings"]);
    });
    expect(result.current.buildBaronConfigured).toBe(false);
  });

  it("fetches settings once for multiple consumers in the same project", async () => {
    const { requests, wrapper } = setup([settingsMock(["EVG"])]);

    const { result: firstResult } = renderHook(
      () => useProjectBuildBaronSettings(options),
      { wrapper },
    );
    await waitFor(() => {
      expect(firstResult.current.buildBaronConfigured).toBe(true);
    });

    const { result: secondResult } = renderHook(
      () => useProjectBuildBaronSettings(options),
      { wrapper },
    );
    await waitFor(() => {
      expect(secondResult.current.buildBaronConfigured).toBe(true);
    });

    expect(requests).toEqual(["ProjectBuildBaronSettings"]);
  });

  it("uses settings populated by another operation", async () => {
    const { cache, requests, wrapper } = setup([]);
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

    const { result } = renderHook(
      () => useProjectBuildBaronSettings({ projectId }),
      { wrapper },
    );

    expect(result.current.buildBaronConfigured).toBe(true);
    await waitFor(() => {
      expect(requests).toEqual([]);
    });
  });

  it("does not fetch settings when fetching is disabled", async () => {
    const { requests, wrapper } = setup([]);
    const { result } = renderHook(
      () =>
        useProjectBuildBaronSettings({
          ...options,
          shouldFetch: false,
        }),
      { wrapper },
    );

    expect(result.current.buildBaronConfigured).toBe(false);
    await waitFor(() => {
      expect(requests).toEqual([]);
    });
  });
});
