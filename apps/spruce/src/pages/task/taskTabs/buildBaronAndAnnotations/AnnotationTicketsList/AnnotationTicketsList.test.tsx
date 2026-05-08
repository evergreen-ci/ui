import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  MoveAnnotationIssueMutation,
  MoveAnnotationIssueMutationVariables,
  RemoveAnnotationIssueMutation,
  RemoveAnnotationIssueMutationVariables,
} from "gql/generated/types";
import { getUserMock } from "gql/mocks/getUser";
import { MOVE_ANNOTATION, REMOVE_ANNOTATION } from "gql/mutations";
import AnnotationTicketsList from ".";

const taskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";
const execution = 1;

describe("annotationTicketsList", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should display the link and jiraIssue key while waiting for data to fetch", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={ticketsTableMocks}>
        <AnnotationTicketsList
          execution={execution}
          isIssue
          jiraIssues={[
            {
              issueKey: "EVG-1234567",
              url: "https://fake-url/EVG-1234567",
            },
          ]}
          loading
          selectedRowKey=""
          setSelectedRowKey={() => {}}
          taskId={taskId}
          userCanModify={false}
        />
      </MockedProvider>,
    );
    render(<Component />, {
      route: `/task/${taskId}`,
      path: "/task/:id",
    });

    await screen.findByDataCy("loading-annotation-ticket");
    expect(screen.getByText("EVG-1234567")).toBeInTheDocument();
  });
});

const apiIssue = {
  url: "https://fake-url/EVG-1234567",
  issueKey: "EVG-1234567",
};
const moveAnnotationMock: ApolloMock<
  MoveAnnotationIssueMutation,
  MoveAnnotationIssueMutationVariables
> = {
  request: {
    query: MOVE_ANNOTATION,
    variables: { taskId, execution, apiIssue, isIssue: true },
  },
  result: { data: { moveAnnotationIssue: true } },
};
const removeAnnotationMock: ApolloMock<
  RemoveAnnotationIssueMutation,
  RemoveAnnotationIssueMutationVariables
> = {
  request: {
    query: REMOVE_ANNOTATION,
    variables: { taskId, execution, apiIssue, isIssue: true },
  },
  result: { data: { removeAnnotationIssue: true } },
};

const ticketsTableMocks = [
  moveAnnotationMock,
  removeAnnotationMock,
  getUserMock,
];
