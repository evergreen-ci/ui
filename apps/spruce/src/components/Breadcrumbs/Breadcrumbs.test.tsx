import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { trimStringFromMiddle } from "@evg-ui/lib/utils/string";
import Breadcrumbs from ".";

describe("breadcrumbs", () => {
  it("should render an individual breadcrumb as the current page", () => {
    render(<Breadcrumbs breadcrumbs={[{ text: "test" }]} />);
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page");
  });
  it("should render many breadcrumbs in order", () => {
    const breadcrumbs = [{ text: "test 1", to: "/" }, { text: "test 2" }];
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("test 1");
    expect(items[1]).toHaveTextContent("test 2");
  });
  it("should forward data-testid to each breadcrumb", () => {
    render(
      <Breadcrumbs
        breadcrumbs={[{ text: "test", to: "/", "data-testid": "bc-test" }]}
      />,
    );
    expect(screen.getByTestId("bc-test")).toHaveTextContent("test");
  });
  it("breadcrumbs with long text should be collapsed and viewable with a tooltip", async () => {
    const user = userEvent.setup();
    const longMessage = "some really long string that could be a patch title";
    const breadcrumbs = [{ text: longMessage }];
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    expect(screen.queryByText(longMessage)).not.toBeInTheDocument();

    expect(
      screen.getByText(trimStringFromMiddle(longMessage, 30)),
    ).toBeInTheDocument();
    await user.hover(document.body);
    await user.hover(screen.getByText(trimStringFromMiddle(longMessage, 30)));
    expect(await screen.findByTestId("breadcrumb-tooltip")).toHaveTextContent(
      longMessage,
    );
  });
  it("should not display a tooltip if the text is short", async () => {
    const user = userEvent.setup();
    const shortMessage = "short";
    const breadcrumbs = [{ text: shortMessage }];
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    expect(screen.getByText(shortMessage)).toBeInTheDocument();
    await user.hover(screen.getByText(shortMessage));
    expect(screen.queryByTestId("breadcrumb-tooltip")).not.toBeInTheDocument();
  });
  it("clicking on a breadcrumb with a link and event handler should call the event", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const breadcrumbs = [{ text: "test", onClick, to: "/" }, { text: "here" }];
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    const link = screen.getByRole("link", { name: "test" });
    expect(link).toHaveAttribute("href", "/");
    await user.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it("clicking on the current page breadcrumb should not call its event", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const breadcrumbs = [
      { text: "parent", to: "/" },
      { text: "here", onClick },
    ];
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);
    await user.click(screen.getByText("here"));
    expect(onClick).not.toHaveBeenCalled();
  });
});
