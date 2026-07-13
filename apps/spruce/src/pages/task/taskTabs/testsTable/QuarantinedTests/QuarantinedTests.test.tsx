import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  TaskQuarantinedTestsSampleQuery,
  TaskQuarantinedTestsSampleQueryVariables,
  TaskQuery,
} from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { TASK_QUARANTINED_TESTS_SAMPLE } from "gql/queries";
import {
  FULL_LIST_LIMIT,
  MODAL_DISPLAY_LIMIT,
  QuarantinedTestsSample,
} from "./utils";
import { QuarantinedTests } from ".";

const quarantinedTask: NonNullable<TaskQuery["task"]> = {
  ...taskQuery.task,
  id: "t1",
  execution: 0,
  quarantinedTestsSkippedCount: 3,
  versionMetadata: {
    ...taskQuery.task.versionMetadata,
    id: "v1",
  },
};

const sample: QuarantinedTestsSample = {
  __typename: "TaskQuarantinedTestsSample",
  execution: 0,
  quarantinedTests: [
    {
      __typename: "QuarantinedTest",
      displayTestName: "Display One",
      testName: "test_one",
    },
    {
      __typename: "QuarantinedTest",
      displayTestName: null,
      testName: "test_two",
    },
    {
      __typename: "QuarantinedTest",
      displayTestName: null,
      testName: "test_three",
    },
  ],
  quarantinedTestsSkippedCount: 3,
  taskId: "t1",
};

const getSampleMock = (
  limit: number,
  sampleOverrides: Partial<QuarantinedTestsSample> = {},
): ApolloMock<
  TaskQuarantinedTestsSampleQuery,
  TaskQuarantinedTestsSampleQueryVariables
> => ({
  request: {
    query: TASK_QUARANTINED_TESTS_SAMPLE,
    variables: { versionId: "v1", taskIds: ["t1"], limit },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: "v1",
        taskQuarantinedTestsSample: [{ ...sample, ...sampleOverrides }],
      },
    },
  },
});

const Wrapper = ({
  mocks = [getSampleMock(MODAL_DISPLAY_LIMIT)],
  task = quarantinedTask,
}: {
  mocks?: ApolloMock<
    TaskQuarantinedTestsSampleQuery,
    TaskQuarantinedTestsSampleQueryVariables
  >[];
  task?: NonNullable<TaskQuery["task"]>;
}) => (
  <MockedProvider mocks={mocks}>
    <QuarantinedTests task={task} />
  </MockedProvider>
);

// Deliberately avoids the :taskId slug so that useTaskAnalytics' queries stay
// skipped, mirroring Metadata.test.tsx.
const routerOptions = {
  path: "/task/:id/:tab",
  route: "/task/t1/tests?execution=0",
};
const deepLinkOptions = {
  ...routerOptions,
  route: "/task/t1/tests?execution=0&quarantinedTests=true",
};

describe("QuarantinedTests", () => {
  beforeAll(() => {
    stubGetClientRects();
    Object.defineProperty(URL, "createObjectURL", {
      value: vi.fn(() => "blob:mock"),
      writable: true,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: vi.fn(),
      writable: true,
    });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when no tests were skipped", () => {
    const { Component } = RenderFakeToastContext(
      <Wrapper
        mocks={[]}
        task={{ ...quarantinedTask, quarantinedTestsSkippedCount: 0 }}
      />,
    );
    render(<Component />, deepLinkOptions);
    expect(screen.queryByDataCy("quarantined-tests-modal")).toBeNull();
  });

  it("auto-opens the modal from the deep-link param and clears the param on close", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<Wrapper />);
    const { router } = render(<Component />, deepLinkOptions);
    expect(await screen.findByDataCy("quarantined-tests-modal")).toBeVisible();
    expect(screen.getByText("Display One")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close modal" }));
    await waitFor(() => {
      expect(screen.getByDataCy("quarantined-tests-modal")).not.toBeVisible();
    });
    expect(router.state.location.search).not.toContain("quarantinedTests");
  });

  it("does not open when the sample is for a newer execution", async () => {
    const { Component } = RenderFakeToastContext(
      <Wrapper
        mocks={[getSampleMock(MODAL_DISPLAY_LIMIT, { execution: 1 })]}
      />,
    );
    render(<Component />, deepLinkOptions);
    await expect(
      screen.findByDataCy("quarantined-tests-modal", undefined, {
        timeout: 250,
      }),
    ).rejects.toThrow();
  });

  it("downloads the full list as JSON from the modal", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <Wrapper
        mocks={[
          getSampleMock(MODAL_DISPLAY_LIMIT),
          getSampleMock(FULL_LIST_LIMIT),
        ]}
      />,
    );
    render(<Component />, deepLinkOptions);
    expect(await screen.findByDataCy("quarantined-tests-modal")).toBeVisible();
    await user.click(screen.getByDataCy("quarantined-tests-download"));
    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    });
    const blob = vi.mocked(URL.createObjectURL).mock.calls[0][0] as Blob;
    expect(JSON.parse(await blob.text())).toStrictEqual({
      taskId: "t1",
      execution: 0,
      quarantinedTestsSkippedCount: 3,
      truncated: false,
      quarantinedTests: [
        { testName: "test_one", displayTestName: "Display One" },
        { testName: "test_two" },
        { testName: "test_three" },
      ],
    });
  });
});
