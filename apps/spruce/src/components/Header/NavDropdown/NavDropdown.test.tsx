import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { NavDropdown } from ".";

const menuItems = [
  {
    "data-testid": "item-1",
    text: "Item 1",
    href: "/item1",
  },
  {
    "data-testid": "item-2",
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
    expect(screen.getByTestId("item-1")).toHaveAttribute("href", "/item1");
  });
  it("closes the menu after an item is selected", async () => {
    const user = userEvent.setup();
    render(
      <NavDropdown
        menuItems={[{ text: "Log out", onClick: vi.fn() }]}
        title="Dropdown"
      />,
    );
    await user.click(screen.getByText("Dropdown"));
    await user.click(screen.getByText("Log out"));
    await waitFor(() => {
      expect(screen.queryByText("Log out")).not.toBeInTheDocument();
    });
  });
  it("clicking on a link triggers a callback", async () => {
    const user = userEvent.setup();
    const mockCallback = vi.fn();
    render(
      <NavDropdown
        menuItems={[
          {
            "data-testid": "item-1",
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
