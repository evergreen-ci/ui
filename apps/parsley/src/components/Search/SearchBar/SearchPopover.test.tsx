import { render, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import SearchPopover from "./SearchPopover";

describe("search popover", () => {
  it("disables properly", () => {
    render(<SearchPopover disabled searchSuggestions={[]} />);
    expect(screen.getByDataCy("search-suggestion-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("should call onClick when option is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SearchPopover
        onClick={onClick}
        searchSuggestions={["apple", "banana"]}
      />,
    );
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    await user.click(screen.getByText("apple"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("apple");
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });

  it("should be able to submit an option with enter", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SearchPopover
        onClick={onClick}
        searchSuggestions={["apple", "banana"]}
      />,
    );
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    const button = screen.getByRole("button", { name: "apple" });
    button.focus();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("apple");
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });

  it("should be able to submit an option with spacebar", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SearchPopover
        onClick={onClick}
        searchSuggestions={["apple", "banana"]}
      />,
    );
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    const button = screen.getByRole("button", { name: "apple" });
    button.focus();
    expect(button).toHaveFocus();
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("apple");
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });

  it("should indicate if there are no search suggestions", async () => {
    const user = userEvent.setup();
    render(<SearchPopover searchSuggestions={[]} />);
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    expect(screen.getByText(/No suggestions/)).toBeVisible();
  });

  it("should close when user clicks outside of popover", async () => {
    const user = userEvent.setup();
    render(<SearchPopover searchSuggestions={[]} />);
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    await user.click(document.body as HTMLElement);
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });

  it("should navigate through suggestions with arrow keys", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const searchSuggestions = ["apple", "banana", "cherry"];

    render(
      <SearchPopover
        _testSelectedIndex={0}
        _testSetSelectedIndex={vi.fn()}
        onClick={onClick}
        searchSuggestions={searchSuggestions}
      />
    );

    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });

    await user.keyboard("{ArrowDown}");

    expect(screen.getByText("apple")).toHaveAttribute("data-selected", "true");

    await user.keyboard("{ArrowDown}");
    expect(screen.getByText("banana")).toHaveAttribute("data-selected", "true");

    await user.keyboard("{ArrowDown}");
    expect(screen.getByText("cherry")).toHaveAttribute("data-selected", "true");

    await user.keyboard("{ArrowDown}");
    expect(screen.getByText("apple")).toHaveAttribute("data-selected", "true");

    await user.keyboard("{ArrowUp}");
    expect(screen.getByText("cherry")).toHaveAttribute("data-selected", "true");

    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledWith("cherry");
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });
});
