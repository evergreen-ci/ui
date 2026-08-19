import {
  MockedProvider,
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { getUserMock } from "gql/mocks/getUser";
import AnnotationTicketRow from ".";

const issueKey = "DEVPROD-123";

const renderRow = (url?: string) =>
  render(
    <MockedProvider mocks={[getUserMock]}>
      <AnnotationTicketRow issueKey={issueKey} url={url} />
    </MockedProvider>,
  );

describe("AnnotationTicketRow", () => {
  it("links the issue key when the annotation URL is HTTP(S)", () => {
    renderRow("https://jira.mongodb.org/browse/DEVPROD-123");

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
    renderRow(url);

    const summary = screen.getByTestId(issueKey);
    expect(summary).toBeVisible();
    expect(summary).not.toHaveAttribute("href");
    expect(summary.tagName).toBe("SPAN");
  });

  it("renders the issue key unlinked when the annotation has no URL", () => {
    renderRow();

    expect(screen.getByTestId(issueKey)).not.toHaveAttribute("href");
  });
});
