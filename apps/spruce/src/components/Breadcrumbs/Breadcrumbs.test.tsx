import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
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
