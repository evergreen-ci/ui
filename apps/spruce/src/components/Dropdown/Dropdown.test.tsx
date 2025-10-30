import { render, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import Dropdown from ".";

const children = () => <div>Some Children</div>;

describe("dropdown", () => {
  const originalResizeObserver = window.ResizeObserver;

  beforeEach(() => {
    const mockResizeObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    window.ResizeObserver = mockResizeObserver;
  });

  afterAll(() => {
    window.ResizeObserver = originalResizeObserver;
  });

  it("renders a button by default with no dropdown", () => {
    render(<Dropdown buttonText="Some Button"> {children()} </Dropdown>);
    expect(screen.getByText("Some Button")).toBeInTheDocument();
    expect(screen.queryByText("Some Children")).not.toBeInTheDocument();
  });

  it("clicking on the button opens and closes the dropdown", async () => {
    const user = userEvent.setup();
    render(<Dropdown buttonText="Some Button"> {children()} </Dropdown>);
    const button = screen.getByRole("button", { name: "Some Button" });
    expect(button).toBeInTheDocument();
    expect(screen.queryByText("Some Children")).not.toBeInTheDocument();
    await user.click(button);
    expect(screen.getByText("Some Children")).toBeInTheDocument();
    await user.click(button);
    await waitFor(() => {
      expect(screen.queryByText("Some Children")).not.toBeInTheDocument();
    });
  });

  it("clicking on the dropdown contents should not close the dropdown", async () => {
    const user = userEvent.setup();
    render(<Dropdown buttonText="Some Button"> {children()} </Dropdown>);
    const button = screen.getByRole("button", { name: "Some Button" });
    expect(button).toBeInTheDocument();
    expect(screen.queryByText("Some Children")).not.toBeInTheDocument();
    await user.click(button);
    expect(screen.getByText("Some Children")).toBeInTheDocument();
    await user.click(screen.getByText("Some Children"));
    expect(screen.getByText("Some Children")).toBeInTheDocument();
  });

  it("clicking outside the button and dropdown closes the dropdown", async () => {
    const user = userEvent.setup();
    render(<Dropdown buttonText="Some Button"> {children()} </Dropdown>);
    const button = screen.getByRole("button", { name: "Some Button" });
    expect(button).toBeInTheDocument();
    expect(screen.queryByText("Some Children")).not.toBeInTheDocument();
    await user.click(button);
    expect(screen.getByText("Some Children")).toBeInTheDocument();
    await user.click(document.body);
    await waitFor(() => {
      expect(screen.queryByText("Some Children")).not.toBeInTheDocument();
    });
  });

  it("renders a custom button contents when custom buttonRenderer is passed in", () => {
    const customButtonRenderer = () => <div>Custom Button</div>;
    render(
      <Dropdown buttonRenderer={customButtonRenderer} buttonText="Some Button">
        {children()}
      </Dropdown>,
    );
    expect(screen.queryByText("Some Button")).not.toBeInTheDocument();
    expect(screen.getByText("Custom Button")).toBeInTheDocument();
  });
});
