import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { getUserMock } from "gql/mocks/getUser";
import AnnotationTicketRow, { AnnotationTicketRowProps } from "./index";

const issueKey = "DEVPROD-123";

const renderRow = (props?: Partial<AnnotationTicketRowProps>) =>
  render(
    <MockedProvider mocks={[getUserMock]}>
      <AnnotationTicketRow issueKey={issueKey} {...props} />
    </MockedProvider>,
  );

describe("AnnotationTicketRow", () => {
  it("links the issue key when the annotation URL is HTTP(S)", () => {
    renderRow({ url: "https://jira.mongodb.org/browse/DEVPROD-123" });

    expect(screen.getByTestId(issueKey)).toHaveAttribute(
      "href",
      "https://jira.mongodb.org/browse/DEVPROD-123",
    );
  });

  it.each([
    "javascript:alert(document.domain)//DEVPROD-1",
    "data:text/html,<script>alert(document.domain)</script>",
    "vbscript:msgbox(document.domain)",
  ])("renders the issue key unlinked for unsafe URL: %s", (url) => {
    renderRow({ url });

    const summary = screen.getByTestId(issueKey);
    expect(summary).toBeVisible();
    expect(summary).not.toHaveAttribute("href");
    expect(summary.tagName).toBe("SPAN");
  });

  it("renders the issue key unlinked when the annotation has no URL", () => {
    renderRow();

    expect(screen.getByTestId(issueKey)).not.toHaveAttribute("href");
  });

  it("renders the confidence badge with the score as a percentage", () => {
    renderRow({ confidenceScore: 0.5 });

    expect(screen.getByText("50% Confident in suggestion")).toBeVisible();
  });

  it.each([null, undefined])(
    "does not render the confidence badge when the score is %s",
    (confidenceScore) => {
      renderRow({ confidenceScore });

      expect(
        screen.queryByTestId(`${issueKey}-confidence-badge`),
      ).not.toBeInTheDocument();
    },
  );
});
