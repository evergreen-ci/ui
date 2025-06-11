import { render, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import { SearchSuggestionGroup } from "./types";
import SearchPopover from ".";

const mockSearchSuggestions: SearchSuggestionGroup[] = [
  {
    suggestions: ["apple", "banana"],
    title: "Fruits",
  },
  {
    suggestions: ["carrot", "lettuce"],
    title: "Vegetables",
  },
];

const singleGroupSuggestions: SearchSuggestionGroup[] = [
  {
    suggestions: ["apple", "banana", "cherry"],
    title: "Test Group",
  },
];

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
        searchSuggestions={mockSearchSuggestions}
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

  it("should display group titles and suggestions", async () => {
    const user = userEvent.setup();
    render(<SearchPopover searchSuggestions={mockSearchSuggestions} />);
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });

    // Check group titles are displayed
    expect(screen.getByText("Fruits")).toBeVisible();
    expect(screen.getByText("Vegetables")).toBeVisible();

    // Check suggestions are displayed
    expect(screen.getByText("apple")).toBeVisible();
    expect(screen.getByText("banana")).toBeVisible();
    expect(screen.getByText("carrot")).toBeVisible();
    expect(screen.getByText("lettuce")).toBeVisible();
  });

  it("should be able to submit an option with enter", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SearchPopover
        onClick={onClick}
        searchSuggestions={singleGroupSuggestions}
      />,
    );
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    const menuItem = screen.getByRole("menuitem", { name: "apple" });
    menuItem.focus();
    expect(menuItem).toHaveFocus();
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
        searchSuggestions={singleGroupSuggestions}
      />,
    );
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    const menuItem = screen.getByRole("menuitem", { name: "apple" });
    menuItem.focus();
    expect(menuItem).toHaveFocus();
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

  it("should navigate options with arrow keys and select with enter across groups", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SearchPopover
        onClick={onClick}
        searchSuggestions={singleGroupSuggestions}
      />,
    );
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });

    const popoverContainer = screen
      .getByDataCy("search-suggestion-popover")
      .querySelector("div");
    popoverContainer?.focus();

    // Navigate down twice to get to "cherry" (third item)
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");

    // Navigate up twice to get to "apple" (first item)
    await user.keyboard("{ArrowUp}");
    await user.keyboard("{ArrowUp}");

    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("banana");
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });

  it("should navigate across multiple groups with arrow keys", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SearchPopover
        onClick={onClick}
        searchSuggestions={mockSearchSuggestions}
      />,
    );
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });

    const popoverContainer = screen
      .getByDataCy("search-suggestion-popover")
      .querySelector("div");
    popoverContainer?.focus();

    // Navigate down to go through: apple -> banana -> carrot -> lettuce
    await user.keyboard("{ArrowDown}"); // apple
    await user.keyboard("{ArrowDown}"); // banana
    await user.keyboard("{ArrowDown}"); // carrot (first item in second group)

    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("carrot");
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });
});
