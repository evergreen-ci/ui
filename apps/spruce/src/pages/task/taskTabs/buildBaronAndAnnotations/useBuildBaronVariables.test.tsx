import { InMemoryCache } from "@apollo/client";
import { MockedProvider, renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
import {
  ProjectBuildBaronSettingsQuery,
  ProjectBuildBaronSettingsQueryVariables,
} from "gql/generated/types";
import { PROJECT_BUILD_BARON_SETTINGS } from "gql/queries";
import useBuildBaronVariables from "./useBuildBaronVariables";

const projectId = "project_id";
const projectIdentifier = "project_identifier";

type SettingsMock = ApolloMock<
  ProjectBuildBaronSettingsQuery,
  ProjectBuildBaronSettingsQueryVariables
>;

const settingsMock = (
  ticketCreateProject: string,
  ticketSearchProjects: string[] | null,
): SettingsMock => ({
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
          ticketCreateProject,
          ticketSearchProjects,
        },
      },
    },
  },
});

const configuredSettingsMock = settingsMock("EVG", ["EVG"]);
const unconfiguredSettingsMock = settingsMock("", null);

const makeWrapper = (mocks: SettingsMock[], cache = new InMemoryCache()) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider cache={cache} mocks={mocks}>
      {children}
    </MockedProvider>
  );
  return Wrapper;
};

const failedTask = {
  status: TaskStatus.Failed,
  hasAnnotation: false,
  canModifyAnnotation: false,
  projectId,
  projectIdentifier,
};

describe("useBuildBaronVariables", () => {
  it("shows the tab for a failed task in a project configured for Build Baron", async () => {
    const { result } = renderHook(
      () => useBuildBaronVariables({ task: failedTask }),
      { wrapper: makeWrapper([configuredSettingsMock]) },
    );

    await waitFor(() => {
      expect(result.current.buildBaronConfigured).toBe(true);
    });
    expect(result.current.bbTicketCreationDefined).toBe(true);
    expect(result.current.showBuildBaron).toBe(true);
  });

  it("hides the tab for a failed task in an unconfigured project without annotation access", async () => {
    const { result } = renderHook(
      () => useBuildBaronVariables({ task: failedTask }),
      { wrapper: makeWrapper([unconfiguredSettingsMock]) },
    );

    await waitFor(() => {
      expect(result.current.bbTicketCreationDefined).toBe(false);
    });
    expect(result.current.buildBaronConfigured).toBe(false);
    expect(result.current.showBuildBaron).toBe(false);
  });

  it("shows the tab for an unconfigured project when the user can modify annotations", async () => {
    const { result } = renderHook(
      () =>
        useBuildBaronVariables({
          task: { ...failedTask, canModifyAnnotation: true },
        }),
      { wrapper: makeWrapper([unconfiguredSettingsMock]) },
    );

    await waitFor(() => {
      expect(result.current.showBuildBaron).toBe(true);
    });
  });

  it("does not query settings for a task that has not failed", () => {
    const { result } = renderHook(
      () =>
        useBuildBaronVariables({
          task: {
            ...failedTask,
            status: TaskStatus.Succeeded,
            canModifyAnnotation: true,
          },
        }),
      { wrapper: makeWrapper([]) },
    );

    expect(result.current.showBuildBaron).toBe(false);
    expect(result.current.buildBaronConfigured).toBe(false);
  });

  it("reads settings from the normalized project cache without issuing a second query", async () => {
    // The mock is consumable once, so a second hook resolving the same settings proves that viewing
    // another task in the same project does not query per task.
    const wrapper = makeWrapper([configuredSettingsMock]);

    const { result: firstResult } = renderHook(
      () => useBuildBaronVariables({ task: failedTask }),
      { wrapper },
    );
    await waitFor(() => {
      expect(firstResult.current.buildBaronConfigured).toBe(true);
    });

    const { result: secondResult } = renderHook(
      () => useBuildBaronVariables({ task: failedTask }),
      { wrapper },
    );
    await waitFor(() => {
      expect(secondResult.current.buildBaronConfigured).toBe(true);
    });
  });
});
