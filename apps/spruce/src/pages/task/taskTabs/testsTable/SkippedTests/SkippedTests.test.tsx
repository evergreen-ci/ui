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
  SkippedTestsSample,
} from "./utils";
import { SkippedTests } from ".";

const taskWithSkippedTests: NonNullable<TaskQuery["task"]> = {
  ...taskQuery.task,
  id: "t1",
  execution: 0,
  quarantinedTestsSkippedCount: 3,
  versionMetadata: {
    ...taskQuery.task.versionMetadata,
    id: "v1",
  },
};

const sample: SkippedTestsSample = {
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
  sampleOverrides: Partial<SkippedTestsSample> = {},
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

const getEmptySampleMock = (
  limit: number,
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
        taskQuarantinedTestsSample: [],
      },
    },
  },
});

const getSampleErrorMock = (
  limit: number,
): ApolloMock<
  TaskQuarantinedTestsSampleQuery,
  TaskQuarantinedTestsSampleQueryVariables
> => ({
  request: {
    query: TASK_QUARANTINED_TESTS_SAMPLE,
    variables: { versionId: "v1", taskIds: ["t1"], limit },
  },
  error: new Error("Failed to load skipped test details"),
});

const Wrapper = ({
  mocks = [getSampleMock(MODAL_DISPLAY_LIMIT)],
  task = taskWithSkippedTests,
}: {
  mocks?: ApolloMock<
    TaskQuarantinedTestsSampleQuery,
    TaskQuarantinedTestsSampleQueryVariables
  >[];
  task?: NonNullable<TaskQuery["task"]>;
}) => (
  <MockedProvider mocks={mocks}>
    <SkippedTests task={task} />
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
  route: "/task/t1/tests?execution=0&skippedTests=true",
};

describe("SkippedTests", () => {
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
        task={{ ...taskWithSkippedTests, quarantinedTestsSkippedCount: 0 }}
      />,
    );
    render(<Component />, deepLinkOptions);
    expect(screen.queryByDataCy("skipped-tests-modal")).toBeNull();
  });

  it("auto-opens the modal from the deep-link param and clears the param on close", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<Wrapper />);
    const { router } = render(<Component />, deepLinkOptions);
    expect(await screen.findByDataCy("skipped-tests-modal")).toBeVisible();
    expect(screen.getByText("Display One")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close modal" }));
    await waitFor(() => {
      expect(screen.getByDataCy("skipped-tests-modal")).not.toBeVisible();
    });
    expect(router.state.location.search).not.toContain("skippedTests");
  });

  it("warns when the sample is for a newer execution", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Wrapper
        mocks={[getSampleMock(MODAL_DISPLAY_LIMIT, { execution: 1 })]}
      />,
    );
    render(<Component />, deepLinkOptions);
    await waitFor(() => {
      expect(dispatchToast.warning).toHaveBeenCalledWith(
        "Skipped test details are only available for the latest execution of this task.",
      );
    });
    expect(screen.queryByDataCy("skipped-tests-modal")).toBeNull();
  });

  it("warns and clears the deep link when no sample is available", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Wrapper mocks={[getEmptySampleMock(MODAL_DISPLAY_LIMIT)]} />,
    );
    const { router } = render(<Component />, deepLinkOptions);
    await waitFor(() => {
      expect(dispatchToast.warning).toHaveBeenCalledWith(
        "Skipped test details are not available for this execution.",
      );
    });
    expect(router.state.location.search).not.toContain("skippedTests");
    expect(screen.queryByDataCy("skipped-tests-modal")).toBeNull();
  });

  it("shows an error and clears the deep link when the query fails", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Wrapper mocks={[getSampleErrorMock(MODAL_DISPLAY_LIMIT)]} />,
    );
    const { router } = render(<Component />, deepLinkOptions);
    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledWith(
        "There was an error loading the skipped test details.",
      );
    });
    expect(router.state.location.search).not.toContain("skippedTests");
    expect(screen.queryByDataCy("skipped-tests-modal")).toBeNull();
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
    expect(await screen.findByDataCy("skipped-tests-modal")).toBeVisible();
    await user.click(screen.getByDataCy("skipped-tests-download"));
    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    });
    const blob = vi.mocked(URL.createObjectURL).mock.calls[0][0] as Blob;
    expect(JSON.parse(await blob.text())).toStrictEqual({
      taskId: "t1",
      execution: 0,
      skippedTestCount: 3,
      truncated: false,
      skippedTests: [
        { testName: "test_one", displayTestName: "Display One" },
        { testName: "test_two" },
        { testName: "test_three" },
      ],
    });
  });
});
