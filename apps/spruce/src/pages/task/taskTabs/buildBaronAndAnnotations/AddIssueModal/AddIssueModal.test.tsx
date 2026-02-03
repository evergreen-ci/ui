import {
  ApolloMock,
  MockedProvider,
  RenderFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import {
  AddAnnotationIssueMutation,
  AddAnnotationIssueMutationVariables,
} from "gql/generated/types";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { ADD_ANNOTATION } from "gql/mutations";
import { AddIssueModal as AddIssueModalToTest } from ".";

const AddIssueModal = (
  props: Omit<
    React.ComponentProps<typeof AddIssueModalToTest>,
    "execution" | "taskId" | "visible"
  >,
) => (
  <MockedProvider mocks={[getSpruceConfigMock, addAnnotationMock]}>
    <AddIssueModalToTest
      data-cy="add-issue-modal"
      execution={0}
      taskId="1"
      visible
      {...props}
    />
  </MockedProvider>
);
describe("addIssueModal", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  it("should have submit disabled by default when all the fields are empty", async () => {
    const { Component } = RenderFakeToastContext(
      <AddIssueModal
        closeModal={vi.fn()}
        isIssue
        setSelectedRowKey={vi.fn()}
      />,
    );
    render(<Component />);

    await waitFor(() => {
      checkModalVisibility();
    });

    expect(screen.queryByDataCy("issue-url")).toHaveValue("");
    expect(
      screen.getByRole("button", {
        name: "Add issue",
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("entering values should enable the submit button", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <AddIssueModal
        closeModal={vi.fn()}
        isIssue
        setSelectedRowKey={vi.fn()}
      />,
    );
    render(<Component />);

    await waitFor(() => {
      checkModalVisibility();
    });

    expect(screen.queryByDataCy("issue-url")).toHaveValue("");
    await user.type(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      screen.queryByDataCy("issue-url"),
      "https://jira.mongodb.org/browse/EVG-123",
    );
    expect(
      screen.getByRole("button", {
        name: "Add issue",
      }),
    ).not.toHaveAttribute("aria-disabled", "true");
  });

  it("entering an invalid confidence score should disable the submit button", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <AddIssueModal
        closeModal={vi.fn()}
        isIssue
        setSelectedRowKey={vi.fn()}
      />,
    );
    render(<Component />);

    await waitFor(() => {
      checkModalVisibility();
    });

    expect(screen.queryByDataCy("issue-url")).toHaveValue("");
    await user.type(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      screen.queryByDataCy("issue-url"),
      "https://jira.mongodb.org/browse/EVG-123",
    );

    const confirmButton = screen.getByRole("button", {
      name: "Add issue",
    });

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(screen.queryByDataCy("confidence-level"), "not a number");
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.clear(screen.queryByDataCy("confidence-level"));
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(screen.queryByDataCy("confidence-level"), "110");
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.clear(screen.queryByDataCy("confidence-level"));
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(screen.queryByDataCy("confidence-level"), "80");
    expect(confirmButton).not.toHaveAttribute("aria-disabled", "true");
  }, 15000);

  it("should be able to successfully add annotation", async () => {
    const user = userEvent.setup();
    const setSelectedRowKey = vi.fn();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <AddIssueModal
        closeModal={vi.fn()}
        isIssue
        setSelectedRowKey={setSelectedRowKey}
      />,
    );
    render(<Component />);

    await waitFor(() => {
      checkModalVisibility();
    });

    await user.type(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      screen.queryByDataCy("issue-url"),
      "https://jira.mongodb.org/browse/EVG-123",
    );
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(screen.queryByDataCy("confidence-level"), "12");

    const confirmButton = screen.getByRole("button", {
      name: "Add issue",
    });
    await waitFor(() => {
      expect(confirmButton).not.toHaveAttribute("aria-disabled", "true");
    });
    await user.click(confirmButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    expect(setSelectedRowKey).toHaveBeenCalledWith("EVG-123");
  }, 15000);
});

const checkModalVisibility = () => {
  expect(screen.getByDataCy("add-issue-modal")).toBeVisible();
  expect(screen.getByDataCy("issue-url")).toBeVisible();
  expect(screen.getByDataCy("confidence-level")).toBeVisible();
};

const addAnnotationMock: ApolloMock<
  AddAnnotationIssueMutation,
  AddAnnotationIssueMutationVariables
> = {
  request: {
    query: ADD_ANNOTATION,
    variables: {
      taskId: "1",
      execution: 0,
      apiIssue: {
        url: "https://jira.mongodb.org/browse/EVG-123",
        issueKey: "EVG-123",
        confidenceScore: 0.12,
      },
      isIssue: true,
    },
  },
  result: {
    data: {
      addAnnotationIssue: true,
    },
  },
};
