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
} from "gql/generated/types";
import { TASK_QUARANTINED_TESTS_SAMPLE } from "gql/queries";
import { SkippedTestsDetails } from "./SkippedTestsDetails";
import {
  FULL_LIST_LIMIT,
  MODAL_DISPLAY_LIMIT,
  SkippedTestsSample,
} from "./utils";

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
  setOpen = vi.fn(),
}: {
  mocks?: ApolloMock<
    TaskQuarantinedTestsSampleQuery,
    TaskQuarantinedTestsSampleQueryVariables
  >[];
  setOpen?: (open: boolean) => void;
}) => (
  <MockedProvider mocks={mocks}>
    <SkippedTestsDetails
      count={3}
      execution={0}
      setOpen={setOpen}
      taskId="t1"
      versionId="v1"
    />
  </MockedProvider>
);

// Deliberately avoids the :taskId slug so that useTaskAnalytics' queries stay
// skipped, mirroring Metadata.test.tsx.
const routerOptions = {
  path: "/task/:id/:tab",
  route: "/task/t1/overview?execution=0",
};

describe("SkippedTestsDetails", () => {
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

  it("loads the skipped tests and closes through local state", async () => {
    const user = userEvent.setup();
    const setOpen = vi.fn();
    const { Component } = RenderFakeToastContext(<Wrapper setOpen={setOpen} />);
    render(<Component />, routerOptions);

    expect(await screen.findByText("Display One")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close modal" }));
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("warns when the sample is for a newer execution", async () => {
    const setOpen = vi.fn();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Wrapper
        mocks={[getSampleMock(MODAL_DISPLAY_LIMIT, { execution: 1 })]}
        setOpen={setOpen}
      />,
    );
    render(<Component />, routerOptions);

    await waitFor(() => {
      expect(dispatchToast.warning).toHaveBeenCalledWith(
        "Skipped test details are only available for the latest execution of this task.",
      );
    });
    expect(setOpen).toHaveBeenCalledWith(false);
    expect(screen.queryByDataTestId("skipped-tests-modal")).toBeNull();
  });

  it("warns when no sample is available", async () => {
    const setOpen = vi.fn();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Wrapper
        mocks={[getEmptySampleMock(MODAL_DISPLAY_LIMIT)]}
        setOpen={setOpen}
      />,
    );
    render(<Component />, routerOptions);

    await waitFor(() => {
      expect(dispatchToast.warning).toHaveBeenCalledWith(
        "Skipped test details are not available for this execution.",
      );
    });
    expect(setOpen).toHaveBeenCalledWith(false);
    expect(screen.queryByDataTestId("skipped-tests-modal")).toBeNull();
  });

  it("shows an error when the query fails", async () => {
    const setOpen = vi.fn();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Wrapper
        mocks={[getSampleErrorMock(MODAL_DISPLAY_LIMIT)]}
        setOpen={setOpen}
      />,
    );
    render(<Component />, routerOptions);

    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledWith(
        "There was an error loading the skipped test details.",
      );
    });
    expect(setOpen).toHaveBeenCalledWith(false);
    expect(screen.queryByDataTestId("skipped-tests-modal")).toBeNull();
  });

  it("downloads the full list as JSON", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <Wrapper
        mocks={[
          getSampleMock(MODAL_DISPLAY_LIMIT),
          getSampleMock(FULL_LIST_LIMIT),
        ]}
      />,
    );
    render(<Component />, routerOptions);

    expect(await screen.findByText("Display One")).toBeVisible();
    const downloadButton = screen.getByRole("button", {
      name: "Download JSON",
    });
    await user.click(downloadButton);
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
