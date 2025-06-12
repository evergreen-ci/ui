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
    await user.click(screen.getByRole("menuitem", { name: "apple" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("apple");
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });

  it("should display group titles and suggestions with proper structure", async () => {
    const user = userEvent.setup();
    render(<SearchPopover searchSuggestions={mockSearchSuggestions} />);
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });

    // Check group titles are displayed
    expect(screen.getByText("Fruits")).toBeVisible();
    expect(screen.getByText("Vegetables")).toBeVisible();

    // Check suggestions are displayed as menuitems
    expect(screen.getByRole("menuitem", { name: "apple" })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "banana" })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "carrot" })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "lettuce" })).toBeVisible();

    // Check menu structure
    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("aria-label", "Search suggestions");
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
    expect(
      screen.getByText(/No suggestions available for this project/),
    ).toBeVisible();
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

    const menu = screen.getByRole("menu");
    menu.focus();

    // Navigate down to get to "banana" (second item)
    await user.keyboard("{ArrowDown}"); // apple (index 0)
    await user.keyboard("{ArrowDown}"); // banana (index 1)

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

    const menu = screen.getByRole("menu");
    menu.focus();

    // Navigate down to go through: apple -> banana -> carrot -> lettuce
    await user.keyboard("{ArrowDown}"); // apple
    await user.keyboard("{ArrowDown}"); // banana
    await user.keyboard("{ArrowDown}"); // carrot (first item in second group)

    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("carrot");
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });

  it("should wrap around when navigating with arrow keys", async () => {
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

    const menu = screen.getByRole("menu");
    menu.focus();

    // Navigate up from initial position should wrap to last item
    await user.keyboard("{ArrowUp}"); // should wrap to "lettuce" (last item)

    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("lettuce");
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });

  it("should maintain focus within the menu when using keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<SearchPopover searchSuggestions={mockSearchSuggestions} />);
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });

    const menu = screen.getByRole("menu");
    menu.focus();

    // Navigate through items
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");

    // Focus should remain within the menu
    expect(menu).toHaveFocus();
  });
});
