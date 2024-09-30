import {
  screen,
  renderWithRouterMatch as render,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { NavDropdown } from ".";

const menuItems = [
  {
    "data-cy": "item-1",
    text: "Item 1",
    href: "/item1",
  },
  {
    "data-cy": "item-2",
    text: "Item 2",
    to: "/item2",
  },
];
describe("navDropdown", () => {
  it("renders the dropdown", () => {
    render(<NavDropdown menuItems={menuItems} title="Dropdown" />);

    expect(screen.getByText("Dropdown")).toBeInTheDocument();
  });
  it("opening the dropdown renders all of the buttons", async () => {
    const user = userEvent.setup();
    render(<NavDropdown menuItems={menuItems} title="Dropdown" />);
    await user.click(screen.getByText("Dropdown"));
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
  it("should link to both router and non-router links", async () => {
    const user = userEvent.setup();
    render(<NavDropdown menuItems={menuItems} title="Dropdown" />);
    await user.click(screen.getByText("Dropdown"));
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 1").closest("a")).toHaveAttribute(
      "href",
      "/item1",
    );
    expect(screen.getByText("Item 2").closest("a")).toHaveAttribute(
      "href",
      "/item2",
    );
  });
  it("clicking on a link triggers a callback", async () => {
    const user = userEvent.setup();
    const mockCallback = vi.fn();
    render(
      <NavDropdown
        menuItems={[
          {
            "data-cy": "item-1",
            text: "Item 1",
            href: "/item1",
            onClick: mockCallback,
          },
        ]}
        title="Dropdown"
      />,
    );
    await user.click(screen.getByText("Dropdown"));
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    await user.click(screen.getByText("Item 1"));
    expect(mockCallback).toHaveBeenCalledWith();
  });
});
